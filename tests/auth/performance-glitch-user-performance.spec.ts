import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { getRandomProductsFromPage } from '../../src/utils/productSelector';

test.describe('Performance Glitch User - Performance Testing', { tag: ['@auth', '@regression'] }, () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test('Measure performance glitch user login and navigation', async ({ page }) => {
    // Initialize page objects
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    
    const performanceMetrics: any[] = [];
    
    // Get credentials from environment variables
    const username = process.env.PERFORMANCE_GLITCH_USERNAME || 'performance_glitch_user';
    const password = process.env.PASSWORD || 'secret_sauce';
    
    // Measure login performance
    const loginStart = Date.now();
    await loginPage.navigate();
    await loginPage.login(username, password);
    await expect(inventoryPage.productsHeader).toBeVisible();
    const loginTime = Date.now() - loginStart;
    performanceMetrics.push({ action: 'Login to Inventory', time: loginTime });
    
    console.log(`📊 Login to inventory: ${loginTime}ms`);

    // Measure add to cart performance
    const addToCartStart = Date.now();
    const randomProducts = await getRandomProductsFromPage(page, 1); // Get first random available product
    if (randomProducts.length > 0) {
      await inventoryPage.addToCart(randomProducts[0]);
    }
    const addToCartTime = Date.now() - addToCartStart;
    performanceMetrics.push({ action: 'Add to Cart', time: addToCartTime });
    
    console.log(`📊 Add to cart: ${addToCartTime}ms`);

    // Measure cart navigation performance
    const cartNavStart = Date.now();
    await inventoryPage.goToCart();
    await expect(cartPage.cartHeader).toBeVisible();
    const cartNavTime = Date.now() - cartNavStart;
    performanceMetrics.push({ action: 'Navigate to Cart', time: cartNavTime });
    
    console.log(`📊 Navigate to cart: ${cartNavTime}ms`);

    // Performance summary
    console.log('\n📈 Performance Summary:');
    let totalTime = 0;
    performanceMetrics.forEach((metric, index) => {
      console.log(`  ${index + 1}. ${metric.action}: ${metric.time}ms`);
      totalTime += metric.time;
    });
    console.log(`\n⏱️  Total time: ${totalTime}ms`);

    // Performance analysis
    console.log('\n⚡ Performance Analysis:');
    if (loginTime > 10000) {
      console.log(`⚠️  Login is very slow (${loginTime}ms)`);
    } else if (loginTime > 5000) {
      console.log(`⚠️  Login is slow (${loginTime}ms)`);
    } else {
      console.log(`✅ Login performance is acceptable (${loginTime}ms)`);
    }

    // Expect test to complete
    expect(performanceMetrics.length).toBe(3);
    expect(totalTime).toBeGreaterThan(0);
  });
});