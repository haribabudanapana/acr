// tests/specs/AccessSiteFeasibilityRegistrationForm_TCD_FT_01_FR-1.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { SiteFeasibilityRegistrationPage } from '../../src/pages/site-feasibility-registration.page';
import { testData } from '../../test-data/Staging/testData.json';

// Test Case: TCD_FT_01_FR-1 - Access Site Feasibility & Registration Form

test.describe('Access Site Feasibility & Registration Form [TCD_FT_01_FR-1]', () => {
  let loginPage: LoginPage;
  let siteFeasibilityPage: SiteFeasibilityRegistrationPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    siteFeasibilityPage = new SiteFeasibilityRegistrationPage(page);
    // Login as Site Administrator with RMS role
    const adminUser = testData.siteAdministratorWithRMS;
    await loginPage.goto();
    await loginPage.login(adminUser.username, adminUser.password);
    // Optionally, verify login success
    await expect(page).toHaveURL(/dashboard|home/);
  });

  test('Site Administrator can access the Site Feasibility & Registration Form', async ({ page }) => {
    // Navigate to the form
    await siteFeasibilityPage.navigateToForm();
    // Assert the form is displayed
    const isDisplayed = await siteFeasibilityPage.isFormDisplayed();
    expect(isDisplayed).toBeTruthy();
    // Optionally, verify access is logged (stub)
    // const isLogged = await siteFeasibilityPage.isAccessLogged();
    // expect(isLogged).toBeTruthy();
  });
});
