# SauceDemo Comprehensive Test Plan

## Application Overview

SauceDemo is an e-commerce testing application that simulates online shopping. It includes user authentication, product browsing, shopping cart management, and checkout functionality. The application has different user types with varying behaviors (standard, locked out, problem, performance glitch, error, and visual users). This comprehensive test plan covers login scenarios, end-to-end shopping flows, and validates the complete user journey from login to order completion.

## Test Scenarios

### 1. Authentication Tests

**Seed:** `tests/seed.spec.ts`

#### 1.1. Valid User Login

**File:** `tests/auth/valid-user-login.spec.ts`

**Steps:**
  1. Navigate to SauceDemo and login with standard_user credentials
    - expect: User should be redirected to inventory page
    - expect: Products page should display correctly with all product cards
  2. Verify successful login redirect
    - expect: URL should be https://www.saucedemo.com/inventory.html
    - expect: Page title should be 'Swag Labs'
    - expect: Products header should be visible

#### 1.2. Invalid User Login

**File:** `tests/auth/invalid-user-login.spec.ts`

**Steps:**
  1. Navigate to SauceDemo and attempt login with invalid credentials
    - expect: Error message should be displayed
    - expect: User should remain on login page
  2. Verify error message for invalid credentials
    - expect: Error message should contain 'Username and password do not match any user in this service'

#### 1.3. Locked Out User Login

**File:** `tests/auth/locked-out-user-login.spec.ts`

**Steps:**
  1. Navigate to SauceDemo and attempt login with locked_out_user credentials
    - expect: Error message should be displayed
    - expect: User should remain on login page
  2. Verify locked out error message
    - expect: Error message should contain 'Sorry, this user has been locked out'

#### 1.4. User Logout

**File:** `tests/auth/user-logout.spec.ts`

**Steps:**
  1. Login with standard_user credentials
    - expect: User should be successfully logged in
  2. Click on hamburger menu
    - expect: Menu should open showing navigation options
  3. Click logout link
    - expect: User should be redirected to login page
    - expect: Login form should be visible
  4. Verify successful logout
    - expect: Login page should be displayed
    - expect: User should not be able to access protected pages

### 2. End-to-End Shopping Tests

**Seed:** `tests/seed.spec.ts`

#### 2.1. Complete Purchase Flow

**File:** `tests/e2e/complete-purchase-flow.spec.ts`

**Steps:**
  1. Login with standard_user credentials
    - expect: User should be logged in successfully
  2. Add multiple items to cart (Backpack and Bike Light)
    - expect: Items should be added to cart
    - expect: Cart badge should show item count
  3. Navigate to cart page
    - expect: Cart page should display selected items
    - expect: Item details should be correct
  4. Proceed to checkout
    - expect: Checkout form should be displayed
  5. Fill in checkout information (First Name, Last Name, Postal Code)
    - expect: Form should accept user information
  6. Continue to checkout overview
    - expect: Order overview should display items and pricing
  7. Complete the purchase
    - expect: Order should be completed successfully
    - expect: Thank you message should be displayed
    - expect: Order confirmation should be visible
  8. Click Back Home button
    - expect: User should return to products page

#### 2.2. Shopping Cart Management

**File:** `tests/e2e/shopping-cart-management.spec.ts`

**Steps:**
  1. Login with standard_user credentials
    - expect: User should be logged in successfully
  2. Add multiple items to cart
    - expect: Items should be added to cart
    - expect: Add to cart buttons should change to Remove
  3. Verify cart counter updates
    - expect: Cart badge should show correct item count
  4. Remove items from cart using Remove buttons
    - expect: Items should be removed from cart
    - expect: Cart counter should decrease
  5. Verify cart is empty after removing all items
    - expect: Cart should be empty
    - expect: Cart counter should not be visible
  6. Continue shopping from cart page
    - expect: User should return to products page

#### 2.3. Product Browsing and Sorting

**File:** `tests/e2e/product-browsing-sorting.spec.ts`

**Steps:**
  1. Login with standard_user credentials
    - expect: User should be logged in successfully
  2. Verify all products are displayed on inventory page
    - expect: All 6 products should be displayed
    - expect: Each product should have image, name, description, price, and add to cart button
  3. Change sort order to Name (Z to A)
    - expect: Products should be sorted by name Z to A
  4. Change sort order to Price (low to high)
    - expect: Products should be sorted by price low to high
  5. Change sort order to Price (high to low)
    - expect: Products should be sorted by price high to low
  6. Click on individual product names/images
    - expect: Product detail page should display (if implemented)
    - expect: Product information should match inventory page
  7. Navigate back to products listing
    - expect: User should return to inventory page
