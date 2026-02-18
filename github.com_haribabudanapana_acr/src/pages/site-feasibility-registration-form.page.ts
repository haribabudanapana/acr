import { Page, Locator, test, expect } from "@playwright/test";
import { BasePage } from "./base.page";
import { ActionUtils } from "../utils/action-utils";

/**
 * Page Object for the Site Feasibility & Registration Form page.
 * Supports data-driven form interaction and validation.
 */
export class SiteFeasibilityRegistrationFormPage extends BasePage {
  // --- Locators ---
  private readonly formContainer: Locator;
  private readonly formTitle: Locator;
  private readonly submitButton: Locator;
  private readonly loadingIcon: Locator;
  // Add more static locators as needed for validation, help, etc.

  /**
   * Field-to-locator mapping for dynamic form filling.
   * Extend this map as new fields are added to the form.
   */
  private readonly fieldLocators: Record<string, Locator>;

  constructor(page: Page) {
    super(page);
    this.formContainer = page.locator("form#site-feasibility-registration-form, form[data-testid='site-feasibility-registration-form']");
    this.formTitle = page.getByRole('heading', { name: /Site Feasibility.*Registration Form/i });
    this.submitButton = page.getByRole('button', { name: /Submit|Create|Update/i });
    this.loadingIcon = page.locator("overlay-loader").getByText("Loading Data Dashboard");

    // Map form fields to their locators for data-driven filling
    this.fieldLocators = {
      // Example mappings (extend as needed):
      siteName: page.locator('#site-name-input, input[name="siteName"], input[formcontrolname="Site_Name"]'),
      siteAddress: page.locator('#site-address-input, input[name="siteAddress"], input[formcontrolname="Site_Street"]'),
      principalInvestigator: page.locator('#principal-investigator-input, input[name="principalInvestigator"]'),
      contactEmail: page.locator('#contact-email-input, input[name="contactEmail"]'),
      contactPhone: page.locator('#contact-phone-input, input[name="contactPhone"]'),
      irbApprovalDate: page.locator('#irb-approval-date-input, input[name="irbApprovalDate"]'),
      // Example for radio group (siteType):
      siteType: page.locator('input[type="radio"][name="siteType"]'),
      // Add more mappings for checkboxes, dropdowns, etc.
    };
  }

  /**
   * Navigates to the Site Feasibility & Registration Form page.
   * @param url The URL to navigate to.
   */
  async navigateToSiteFeasibilityRegistrationForm(url: string): Promise<void> {
    await test.step('Navigate to Site Feasibility & Registration Form', async () => {
      await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await this.page.waitForLoadState('networkidle');
      await this.waitForPageLoad(30000);
      await this.loadingIcon.waitFor({ state: 'hidden', timeout: 20000 });
    });
  }

  /**
   * Checks if the registration form is displayed and actionable.
   * @returns Promise<boolean> true if displayed, false otherwise
   */
  async isRegistrationFormDisplayed(): Promise<boolean> {
    return await test.step('Verify Site Feasibility & Registration Form is displayed', async () => {
      await this.formContainer.waitFor({ state: 'visible', timeout: 10000 });
      await expect(this.formTitle).toBeVisible({ timeout: 5000 });
      await expect(this.submitButton).toBeVisible({ timeout: 5000 });
      return await this.formContainer.isVisible();
    });
  }

  /**
   * Fills out the registration form using the provided data object.
   * Supports text fields, radio buttons, and checkboxes.
   * @param formData Record<string, string> - field/value pairs for the form
   */
  async fillRegistrationForm(formData: Record<string, string>): Promise<void> {
    await test.step('Fill Site Feasibility & Registration Form fields', async () => {
      for (const [field, value] of Object.entries(formData)) {
        // Handle known field mappings
        if (this.fieldLocators[field]) {
          const locator = this.fieldLocators[field];
          // Handle radio buttons (siteType, etc.)
          if (await locator.count() > 1 && (await locator.first().getAttribute('type')) === 'radio') {
            // Find the radio with the matching value
            const radioToSelect = locator.filter({ has: this.page.locator(`[value="${value}"]`) });
            await radioToSelect.first().waitFor({ state: 'visible', timeout: 5000 });
            await ActionUtils.click(radioToSelect.first());
          } else {
            // Default: fill text input
            await locator.waitFor({ state: 'visible', timeout: 5000 });
            await ActionUtils.fill(locator, value);
          }
        } else {
          // Attempt to locate by a generic pattern if not mapped
          const dynamicLocator = this.page.locator(`[name="${field}"]`);
          if (await dynamicLocator.count() > 0) {
            await dynamicLocator.first().waitFor({ state: 'visible', timeout: 5000 });
            await ActionUtils.fill(dynamicLocator.first(), value);
          } else {
            // Optionally, log or throw for unmapped fields
            // console.warn(`No locator mapped for field: ${field}`);
          }
        }
      }
    });
  }

  /**
   * Submits the registration form.
   */
  async submitRegistrationForm(): Promise<void> {
    await test.step('Submit Site Feasibility & Registration Form', async () => {
      await this.submitButton.waitFor({ state: 'visible', timeout: 10000 });
      await ActionUtils.click(this.submitButton);
      await this.loadingIcon.waitFor({ state: 'hidden', timeout: 20000 });
    });
  }

  /**
   * Checks if the RMS role badge is visible (for access validation).
   * @returns Promise<boolean>
   */
  async isRMSRoleAssigned(): Promise<boolean> {
    const rmsRoleBadge = this.page.locator('[data-testid="rms-role-badge"], .badge-rms-role');
    return await rmsRoleBadge.isVisible();
  }

  /**
   * Checks if the form access attempt is logged (post-condition).
   * @returns Promise<boolean>
   */
  async isFormAccessLogged(): Promise<boolean> {
    // Example: look for a toast, log entry, or audit trail indicator
    const accessLogIndicator = this.page.locator('[data-testid="form-access-log"]');
    return await accessLogIndicator.isVisible();
  }
}
