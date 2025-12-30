// tests/specs/AccessSiteFeasibilityRegistrationForm_TCD_FT_01_FR-1.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { SiteFeasibilityRegistrationPage } from '../../src/pages/site-feasibility-registration.page';
import testDataArray from '../../test-data/Staging/access-site-feasibility-and-registration-form-data.json';
import { ENV } from '../../src/config/env';

// Test Case: TCD_FT_01_FR-1 - Access Site Feasibility & Registration Form

test.describe('Access Site Feasibility & Registration Form [TCD_FT_01_FR-1]', () => {
  let loginPage: LoginPage;
  let siteFeasibilityPage: SiteFeasibilityRegistrationPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    siteFeasibilityPage = new SiteFeasibilityRegistrationPage(page);
    // Login as Site Administrator with RMS role
    const testData = testDataArray[0];
    const appUrl = testData.url;
    await loginPage.goto(appUrl);
    await loginPage.login(ENV.APPUSERNAME, ENV.APPPASSWORD);
    await expect(page).toHaveURL(/landing/);
  });

  test('Site Administrator can access the Site Feasibility & Registration Form', async ({ page }) => {
    const newPage = await siteFeasibilityPage.navigateToSiteRegisterForm();
    const isDisplayed = await siteFeasibilityPage.isFormDisplayed(newPage);
    expect(isDisplayed).toBeTruthy();

  });
});
