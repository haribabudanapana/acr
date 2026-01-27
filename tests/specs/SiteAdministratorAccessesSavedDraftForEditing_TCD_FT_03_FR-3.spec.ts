// tests/specs/SiteAdministratorAccessesSavedDraftForEditing_TCD_FT_03_FR-3.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { SiteFeasibilityRegistrationFormPage } from '../../src/pages/site-feasibility-registration-form.page';
import { TestDataUtils } from '../../src/utils/test-data-utils';

// Test data file path and environment
const TEST_DATA_PATH = 'test-data/Staging/site-administrator-accesses-saved-draft-for-editing-data.json';
const ENV = process.env.TEST_ENV || 'Staging';

test.describe('TCD_FT_03_FR-3: Site Administrator accesses saved draft for editing', () => {
  let loginPage: LoginPage;
  let siteFeasibilityRegistrationFormPage: SiteFeasibilityRegistrationFormPage;
  let testData: any;

  test.beforeAll(async ({ browser }) => {
    // Load test data using TestDataUtils
    testData = await TestDataUtils.loadJSONData(TEST_DATA_PATH);
  });

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    siteFeasibilityRegistrationFormPage = new SiteFeasibilityRegistrationFormPage(page);
    // Go to login page and perform login using Page Object
    await loginPage.goto();
    await loginPage.login(
      testData.preconditions.login.username,
      testData.preconditions.login.password
    );
    // Optionally, verify RMS role
    const isRMSRole = await siteFeasibilityRegistrationFormPage.isRMSRoleAssigned();
    expect(isRMSRole).toBeTruthy();
  });

  test('Site Administrator can access and edit a saved draft registration form', async ({ page }) => {
    const draftId = testData.draftData.draftId;
    const fieldsToUpdate = testData.editData.fieldsToUpdate;
    // Access and edit the saved draft using Page Object method
    await siteFeasibilityRegistrationFormPage.accessAndEditSavedDraft(draftId, fieldsToUpdate);
    // Validate that the draft is updated with new information
    const isUpdated = await siteFeasibilityRegistrationFormPage.validateDraftUpdated(draftId, fieldsToUpdate);
    expect(isUpdated).toBeTruthy();
  });

  test.describe('Edge Cases: Enrollment Target and Notes', () => {
    for (const edgeCase of testData.editData.edgeCases) {
      const edgeCaseName = Object.entries(edgeCase).map(([k, v]) => `${k}: ${v}`).join(', ');
      test(`Edit draft with edge case - ${edgeCaseName}`, async ({ page }) => {
        const draftId = testData.draftData.draftId;
        // Access and edit the saved draft with edge case data
        await siteFeasibilityRegistrationFormPage.accessAndEditSavedDraft(draftId, edgeCase);
        // Validate that the draft is updated with edge case data
        const isUpdated = await siteFeasibilityRegistrationFormPage.validateDraftUpdated(draftId, edgeCase);
        expect(isUpdated).toBeTruthy();
      });
    }
  });
});
