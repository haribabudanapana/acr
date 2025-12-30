// tests/specs/CompleteAndSubmitRegistrationForm_TCD_FT_02_FR-2.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { RegistrationFormPage } from '../../src/pages/registration-form.page';
import registrationFormData from '../../test-data/Staging/registration-form-data.json';

// Assumes Site Administrator login credentials are managed in environment or fixtures

test.describe('TCD_FT_02_FR-2: Complete and Submit the Registration Form', () => {
  test('Site Administrator can complete and submit the Site Feasibility & Registration Form', async ({ page }) => {
    // Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsSiteAdministrator(); // Assumes this method exists and uses env credentials

    // Navigate to Registration Form
    // This step assumes a method or navigation exists; replace with actual navigation if needed
    await page.goto('/site-feasibility-registration');
    const registrationFormPage = new RegistrationFormPage(page);

    // Fill out the registration form
    await registrationFormPage.fillSiteName(registrationFormData.siteName);
    await registrationFormPage.fillSiteAddress(registrationFormData.siteAddress);
    await registrationFormPage.selectSiteType(registrationFormData.siteType);
    await registrationFormPage.fillContactEmail(registrationFormData.contactEmail);
    await registrationFormPage.fillContactPhone(registrationFormData.contactPhone);

    // Fill additional fields
    for (const [fieldTestId, value] of Object.entries(registrationFormData.additionalFields)) {
      await registrationFormPage.fillAdditionalField(fieldTestId, value as string);
    }

    // Submit the form
    await registrationFormPage.submitForm();

    // Assert submission success
    const successMessage = await registrationFormPage.getSubmissionSuccessMessage();
    expect(successMessage).toContain('successfully submitted');

    // Assert unique site ID is assigned
    const assignedSiteId = await registrationFormPage.getAssignedSiteId();
    expect(assignedSiteId).toMatch(/^SITE-\d{5,}$/); // Example: SITE-00001
    expect(assignedSiteId).not.toBeNull();
  });
});
