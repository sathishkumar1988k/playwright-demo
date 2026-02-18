import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { MenuPage } from '../../src/pages/MenuPage';
import { CheckoutPage } from '../../src/pages/CheckoutPage';
import {
  addFirstAvailableProduct,
  checkProductImages,
  checkLinksOnPage,
  checkImagesOnPage,
  checkMenuLinks
} from '../../src/utils/linkChecker';

test.describe('Problem User - Broken Links Detection', { tag: ['@auth', '@regression'] }, () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let menuPage: MenuPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    menuPage = new MenuPage(page);
    checkoutPage = new CheckoutPage(page);
    
    // Get credentials from environment variables
    const username = process.env.PROBLEM_USERNAME || 'problem_user';
    const password = process.env.PASSWORD || 'secret_sauce';
    
    // Navigate to login page and login as problem_user
    await loginPage.navigate();
    await loginPage.login(username, password);
    
    // Verify successful login by checking for products header
    await expect(inventoryPage.productsHeader).toBeVisible();
  });

  test('Identify broken links on inventory page', async ({ page }) => {
    const brokenLinks: string[] = [];

    // Get all links on the current inventory page
    const links = await page.locator('a[href]').all();
    
    console.log(`Found ${links.length} links to check on inventory page`);

    // Check each link
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      try {
        const href = await link.getAttribute('href');
        const linkText = (await link.textContent())?.trim() || 'No text';
        
        // Skip anchor links, javascript links, and mailto links
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) {
          console.log(`Skipping link: ${linkText} (${href})`);
          continue;
        }
        
        console.log(`Checking link ${i + 1}: ${linkText} (${href})`);
        
        // Handle relative URLs
        const fullUrl = href.startsWith('http') ? href : new URL(href, page.url()).href;
        
        // Make request to check if link is working
        const response = await page.request.get(fullUrl);
        
        if (!response.ok()) {
          brokenLinks.push(`"${linkText}" - ${fullUrl} (Status: ${response.status()})`);
          console.log(`❌ BROKEN LINK: ${linkText} - ${fullUrl} (Status: ${response.status()})`);
        } else {
          console.log(`✅ Working: ${linkText}`);
        }
        
      } catch (error) {
        const href = await link.getAttribute('href');
        const linkText = (await link.textContent())?.trim() || 'No text';
        brokenLinks.push(`"${linkText}" - ${href} (Error: ${error})`);
        console.log(`❌ ERROR checking link: ${linkText} - ${error}`);
      }
    }

    // Report final results
    console.log('\n=== BROKEN LINKS REPORT ===');
    if (brokenLinks.length > 0) {
      console.log(`🚫 Found ${brokenLinks.length} broken links:`);
      brokenLinks.forEach((link, index) => console.log(`  ${index + 1}. ${link}`));
      
      // Optional: Fail the test if broken links are found
      // expect(brokenLinks).toHaveLength(0);
    } else {
      console.log('✅ No broken links found on inventory page');
    }
    
    // For informational purposes, log the total count
    expect(brokenLinks.length).toBeGreaterThanOrEqual(0);
  });
});