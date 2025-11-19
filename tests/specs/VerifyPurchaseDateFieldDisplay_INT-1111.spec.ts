import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { EntitlementsPage } from '../../src/pages/entitlements.page';
import { TestDataUtils } from '../../src/utils/test-data-utils';
import { ENV } from '../../src/config/env';

test.describe('Verify Purchase Date Field Display', () => {
  test('TCD_FT_01_FR-1: The "Purchase Date" field is visible on the Entitlements details page.', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const entitlementsPage = new EntitlementsPage(page);
    const testData = TestDataUtils.getInstance().getTestDataByEnvironment(ENV.TEST_ENV, 'entitlements-test-data.json');

    // Act
    await page.goto(ENV.BASE_URL);
    await loginPage.login(testData.username, testData.password);
    
    await ActionUtils.click(page.locator('text="Entitlements"'));
    await ActionUtils.click(page.locator('text="Details"'));

    // Assert
    await expect(entitlementsPage.purchaseDateField).toBeVisible();
  });
});