import { Page } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { MenuPage } from '../pages/MenuPage';

/**
 * Utility functions for checking broken links and images
 */

// Helper function to add first available product to cart
export async function addFirstAvailableProduct(inventoryPage: InventoryPage): Promise<void> {
  const addToCartButtons = await inventoryPage.page.locator('[data-test*="add-to-cart-"]').all();
  if (addToCartButtons.length > 0) {
    const firstButtonDataTest = await addToCartButtons[0].getAttribute('data-test');
    if (firstButtonDataTest) {
      await inventoryPage.addToCart(firstButtonDataTest);
    }
  }
}

// Helper function to check product images for issues
export async function checkProductImages(inventoryPage: InventoryPage, issues: string[]): Promise<void> {
  const productImages = inventoryPage.page.locator('.inventory_item_img img');
  const imageCount = await productImages.count();
  
  for (let i = 0; i < imageCount; i++) {
    const img = productImages.nth(i);
    const src = await img.getAttribute('src');
    const alt = await img.getAttribute('alt');
    
    // Check for common broken image patterns
    if (src) {
      // Check for 404 error images
      if (src.includes('404') || src.includes('error') || src.includes('broken')) {
        issues.push(`Potentially broken product image: ${alt || 'No alt text'} (src: ${src})`);
      }
      
      // Check if image actually loads
      try {
        const response = await inventoryPage.page.request.get(src);
        if (!response.ok()) {
          issues.push(`Failed to load product image: ${alt || 'No alt text'} (${response.status()} - ${src})`);
        }
      } catch (error) {
        issues.push(`Error loading product image: ${alt || 'No alt text'} (${error} - ${src})`);
      }
    }
  }
}

// Helper function to check all links on current page
export async function checkLinksOnPage(page: Page, pageName: string, brokenLinks: string[]): Promise<void> {
  const links = await page.locator('a[href]').all();
  
  for (const link of links) {
    try {
      const href = await link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) {
        continue;
      }
      
      // Handle relative URLs
      const fullUrl = href.startsWith('http') ? href : new URL(href, page.url()).href;
      const response = await page.request.get(fullUrl);
      
      if (!response.ok()) {
        const linkText = (await link.textContent())?.trim() || 'No text';
        brokenLinks.push(`${pageName}: "${linkText}" - ${fullUrl} (Status: ${response.status()})`);
      }
    } catch (error) {
      const href = await link.getAttribute('href');
      const linkText = (await link.textContent())?.trim() || 'No text';
      brokenLinks.push(`${pageName}: "${linkText}" - ${href} (Error: ${error})`);
    }
  }
}

// Helper function to check all images on current page
export async function checkImagesOnPage(page: Page, pageName: string, brokenImages: string[]): Promise<void> {
  const images = await page.locator('img[src]').all();
  
  for (const img of images) {
    try {
      const src = await img.getAttribute('src');
      if (!src) continue;
      
      // Handle relative URLs
      const imageUrl = src.startsWith('http') ? src : new URL(src, page.url()).href;
      const response = await page.request.get(imageUrl);
      
      if (!response.ok()) {
        const alt = (await img.getAttribute('alt'))?.trim() || 'No alt text';
        brokenImages.push(`${pageName}: "${alt}" - ${imageUrl} (Status: ${response.status()})`);
      }
    } catch (error) {
      const src = await img.getAttribute('src');
      const alt = (await img.getAttribute('alt'))?.trim() || 'No alt text';
      brokenImages.push(`${pageName}: "${alt}" - ${src} (Error: ${error})`);
    }
  }
}

// Helper function to check menu links specifically
export async function checkMenuLinks(menuPage: MenuPage, brokenLinks: string[]): Promise<void> {
  const menuItems = [
    { name: 'All Items', locator: menuPage.allItemsLink },
    { name: 'About', locator: menuPage.aboutLink },
    { name: 'Reset App State', locator: menuPage.resetAppStateLink }
  ];

  for (const { name, locator } of menuItems) {
    try {
      const href = await locator.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        const fullUrl = href.startsWith('http') ? href : new URL(href, menuPage.page.url()).href;
        const response = await menuPage.page.request.get(fullUrl);
        if (!response.ok()) {
          brokenLinks.push(`Menu: "${name}" - ${fullUrl} (Status: ${response.status()})`);
        }
      }
    } catch (error) {
      brokenLinks.push(`Menu: "${name}" (Error: ${error})`);
    }
  }
}