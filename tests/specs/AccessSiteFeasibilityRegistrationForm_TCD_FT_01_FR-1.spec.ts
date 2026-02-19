import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { SiteFeasibilityRegistrationPage } from '../../src/pages/site-feasibility-registration.page';
import { SiteFeasibilityRegistrationFormPage } from '../../src/pages/site-feasibility-registration-form.page';
import testDataArray from '../../test-data/Staging/access-site-feasibility-and-registration-form-data.json';
import { ENV } from '../../src/config/env';

// Test Case: TCD_FT_01_FR-1 - Access Site Feasibility & Registration Form

test.describe('Access Site Feasibility & Registration Form [TCD_FT_01_FR-1]', () => {
  let loginPage: LoginPage;
  let siteFeasibilityPage: SiteFeasibilityRegistrationPage;
  let siteFeasibilityRegistrationFormPage: SiteFeasibilityRegistrationFormPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    siteFeasibilityPage = new SiteFeasibilityRegistrationPage(page);
    siteFeasibilityRegistrationFormPage = new SiteFeasibilityRegistrationFormPage(page);
    // Login as Site Administrator with RMS role
    const testData = testDataArray[0];
    const appUrl = testData.url;
    const acrUsername = testData.acrUsername || ENV.APPUSERNAME;
    const acrPassword = testData.acrPassword || ENV.APPPASSWORD;
    await loginPage.goto(appUrl);
    await loginPage.login(acrUsername, acrPassword);
    await expect(page).toHaveURL(/landing/);
  });

  test('Site Administrator can access the Site Feasibility & Registration Form', async ({ page }) => {
    const newPage = await siteFeasibilityPage.navigateToSiteRegisterForm();
    const isDisplayed = await siteFeasibilityPage.isFormDisplayed(newPage);
    expect(isDisplayed).toBeTruthy();
  });

  test('Imaging Facility Administrator can access the Imaging Facility Registration Form [TCD_FT_01_FR-1]', async ({ page }) => {
    // Use test data for Imaging Facility Admin credentials
    const testData = testDataArray.find(td => td.role === 'ImagingFacilityAdmin') || testDataArray[0];
    const appUrl = testData.url;
    const acrUsername = testData.acrUsername || ENV.APPUSERNAME;
    const acrPassword = testData.acrPassword || ENV.APPPASSWORD;

    // Login using ACR credentials from test data
    await loginPage.goto(appUrl);
    await loginPage.login(acrUsername, acrPassword);
    await expect(page).toHaveURL(/landing/);

    // Navigate to the registration section (Imaging Facility Registration Form)
    await siteFeasibilityRegistrationFormPage.navigateToSiteFeasibilityRegistrationForm();

    // Assert that the Imaging Facility Registration Form is displayed
    const isFormVisible = await siteFeasibilityRegistrationFormPage.isRegistrationFormDisplayed();
    expect(isFormVisible).toBeTruthy();
  });
});
