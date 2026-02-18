import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login.page";
import { SiteFeasibilityRegistrationPage } from "../../src/pages/site-feasibility-registration.page";
import { SiteFeasibilityRegistrationFormPage } from "../../src/pages/site-feasibility-registration-form.page";
import testDataArray from "../../test-data/Staging/access-site-feasibility-and-registration-form-data.json";
import { ENV } from "../../src/config/env";

// Select the first test case for TCD_FT_01_FR-1
const testCase = testDataArray.find((tc: any) => tc.testCaseId === "TCD_FT_01_FR-1");

test.describe("TCD_FT_01_FR-1: Access Site Feasibility & Registration Form", () => {
  test("Site Administrator can access the Site Feasibility & Registration Form and access is logged", async ({ page }, testInfo) => {
    test.skip(!testCase, "Test data for TCD_FT_01_FR-1 not found");

    // Extract credentials and URLs from test data
    const { url: loginUrl, preconditions, formAccess, expectedResult, postConditions } = testCase;
    const { username, password } = preconditions;
    const publicSiteUrl = formAccess.url || ENV.PUBLIC_SITE_URL;

    // Page Object Instantiations
    const loginPage = new LoginPage(page);
    const siteFeasibilityRegistrationPage = new SiteFeasibilityRegistrationPage(page);
    const siteFeasibilityRegistrationFormPage = new SiteFeasibilityRegistrationFormPage(page);

    await test.step("Navigate to the public-facing website", async () => {
      await page.goto(publicSiteUrl, { waitUntil: "domcontentloaded", timeout: 90000 });
      // Optionally, verify the public landing page loaded
      await expect(page).toHaveURL(publicSiteUrl);
    });

    await test.step("Login as Site Administrator", async () => {
      // If login is required on the public site, perform login
      if (username && password) {
        await loginPage.login(username, password);
      }
    });

    await test.step("Navigate to the Site Feasibility & Registration Form", async () => {
      await siteFeasibilityRegistrationPage.navigateToSiteRegisterForm();
      // Wait for form to be displayed
      const isFormDisplayed = await siteFeasibilityRegistrationFormPage.isRegistrationFormDisplayed();
      expect(isFormDisplayed).toBe(true);
    });

    await test.step("Verify the form is displayed", async () => {
      // Optionally, check for form title or specific elements
      if (formAccess.expectedTitle) {
        await expect(page.locator(`text=${formAccess.expectedTitle}`)).toBeVisible({ timeout: 10000 });
      }
      if (Array.isArray(formAccess.expectedElements)) {
        for (const selector of formAccess.expectedElements) {
          await expect(page.locator(selector)).toBeVisible({ timeout: 10000 });
        }
      }
    });

    await test.step("Validate that access to the form is logged (post-condition)", async () => {
      if (postConditions && postConditions.formAccessLogged) {
        const isLogged = await siteFeasibilityRegistrationFormPage.isFormAccessLogged();
        expect(isLogged).toBe(true);
      }
    });
  });
});
