import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login.page";
import { SiteFeasibilityRegistrationPage } from "../../src/pages/site-feasibility-registration.page";
import { SiteFeasibilityRegistrationFormPage } from "../../src/pages/site-feasibility-registration-form.page";
import testDataArray from "../../test-data/Staging/access-site-feasibility-and-registration-form-data.json";
import { ENV } from "../../src/config/env";

// Find the test case for TCD_FT_01_FR-1
const testCase = testDataArray.find((tc: any) => tc.testCaseId === "TCD_FT_01_FR-1");

test.describe("TCD_FT_01_FR-1: Access Site Feasibility & Registration Form", () => {
  test(`Site Administrator can access the Site Feasibility & Registration Form`, async ({ page }) => {
    test.skip(!testCase, "Test data for TCD_FT_01_FR-1 not found");
    
    // Extract credentials from test data preconditions or ENV
    const username = testCase?.preconditions?.username || ENV.SITE_ADMIN_USERNAME;
    const password = testCase?.preconditions?.password || ENV.SITE_ADMIN_PASSWORD;
    const baseUrl = ENV.BASE_URL || testCase?.formAccess?.url;

    const loginPage = new LoginPage(page);
    const siteFeasibilityRegistrationPage = new SiteFeasibilityRegistrationPage(page);
    const siteFeasibilityRegistrationFormPage = new SiteFeasibilityRegistrationFormPage(page);

    await test.step('Navigate to the public-facing site URL', async () => {
      await loginPage.goto(baseUrl);
      await page.waitForLoadState('domcontentloaded');
    });

    await test.step('Login with valid Site Administrator credentials', async () => {
      await loginPage.login(username, password);
      await page.waitForLoadState('networkidle');
    });

    await test.step('Navigate to the registration module', async () => {
      await siteFeasibilityRegistrationPage.navigateToSiteRegisterForm();
      await page.waitForLoadState('networkidle');
    });

    await test.step('Access the Site Feasibility & Registration Form', async () => {
      await siteFeasibilityRegistrationFormPage.navigateToSiteFeasibilityRegistrationForm();
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verify that the Site Feasibility & Registration Form is displayed', async () => {
      const isDisplayed = await siteFeasibilityRegistrationFormPage.isRegistrationFormDisplayed();
      expect(isDisplayed).toBeTruthy();
    });

    await test.step('Log post-condition: Form access attempt is logged', async () => {
      // Optionally check if form access is logged (if method exists)
      if (typeof siteFeasibilityRegistrationFormPage.isFormAccessLogged === 'function') {
        const isLogged = await siteFeasibilityRegistrationFormPage.isFormAccessLogged();
        // Not asserting here, just logging for traceability
        // eslint-disable-next-line no-console
        console.info('Form access log status:', isLogged);
      }
    });
  });
});
