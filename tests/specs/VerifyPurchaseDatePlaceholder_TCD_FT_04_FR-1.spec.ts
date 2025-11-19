import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { EntitlementsPage } from '../../src/pages/entitlements.page';
import { testData } from '../../test-data/Staging/testData.json';

// Test Case: TCD_FT_04_FR-1 - Verify placeholder message when 'Purchase Date' is not available

test.describe('Entitlements - Purchase Date Placeholder', () => {
  let loginPage: LoginPage;
  let entitlementsPage: EntitlementsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    entitlementsPage = new EntitlementsPage(page);
    // Login with valid user from test data
    await loginPage.goto();
    await loginPage.login(testData.validUser.username, testData.validUser.password);
    // Ensure user is on the entitlements page
    await entitlementsPage.goto();
  });

  test('TCD_FT_04_FR-1: should display placeholder when Purchase Date is not available', async ({ page }) => {
    // Arrange: Get entitlement with missing purchase date from test data
    const entitlementWithoutPurchaseDate = testData.entitlements.find((e: any) => !e.purchaseDate);
    expect(entitlementWithoutPurchaseDate, 'Test data must include entitlement without purchase date').toBeTruthy();

    // Act: Search/navigate to the entitlement
    await entitlementsPage.searchEntitlement(entitlementWithoutPurchaseDate.id);
    await entitlementsPage.selectEntitlementById(entitlementWithoutPurchaseDate.id);

    // Assert: The purchase date field shows the placeholder or 'Not Available' message
    const placeholderText = await entitlementsPage.getPurchaseDateFieldText();
    expect(placeholderText).toMatch(/not available|n\/a|--|placeholder/i);
  });
});
