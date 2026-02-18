import { Page, Locator, test } from "@playwright/test";
import { BasePage } from "./base.page";
import { ActionUtils } from "../utils/action-utils";

/**
 * Page Object for Site Feasibility & Registration navigation and visibility checks.
 *
 * Provides navigation from the landing/registration module to the Site Feasibility & Registration Form,
 * and checks for form visibility. Follows repository locator and method patterns.
 */
export class SiteFeasibilityRegistrationPage extends BasePage {
  private readonly siteFeasibilityMenu: Locator;
  private readonly registrationFormTitle: Locator;
  private readonly formContainer: Locator;

  constructor(page: Page) {
    super(page);
    // Locator for the menu or navigation link to Site Feasibility & Registration Form
    this.siteFeasibilityMenu = page.getByRole('link', { name: /Site Feasibility.*Registration Form/i });
    // Locator for a unique heading or title on the form page
    this.registrationFormTitle = page.getByRole('heading', { name: /Site Feasibility.*Registration Form/i });
    // Locator for a unique form container (could be a section, form, or div)
    this.formContainer = page.locator('#site-feasibility-registration-form, form[formcontrolname], .site-feasibility-form-container');
  }

  /**
   * Navigates from the landing/registration module to the Site Feasibility & Registration Form.
   * Waits for the page and form to be ready for interaction.
   */
  async navigateToSiteRegisterForm(): Promise<void> {
    await test.step('Navigate to Site Feasibility & Registration Form', async () => {
      await this.siteFeasibilityMenu.waitFor({ state: 'visible', timeout: 20000 });
      await ActionUtils.click(this.siteFeasibilityMenu);
      await this.page.waitForLoadState('networkidle');
      // Wait for the form container or title to be visible
      await Promise.race([
        this.registrationFormTitle.waitFor({ state: 'visible', timeout: 10000 }),
        this.formContainer.waitFor({ state: 'visible', timeout: 10000 })
      ]);
    });
  }

  /**
   * Checks if the Site Feasibility & Registration Form is displayed by verifying unique heading or container.
   * @returns {Promise<boolean>} True if the form is displayed, false otherwise.
   */
  async isFormDisplayed(): Promise<boolean> {
    return await test.step('Check if Site Feasibility & Registration Form is displayed', async () => {
      const titleVisible = await this.registrationFormTitle.isVisible().catch(() => false);
      const containerVisible = await this.formContainer.isVisible().catch(() => false);
      return titleVisible || containerVisible;
    });
  }
}
