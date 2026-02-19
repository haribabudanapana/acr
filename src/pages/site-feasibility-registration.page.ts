import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { SiteFeasibilityRegistrationFormPage } from './site-feasibility-registration-form.page';

export class SiteFeasibilityRegistrationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigates to the Site Feasibility & Registration Form from the public-facing website.
   * Returns the SiteFeasibilityRegistrationFormPage for end-to-end flow.
   */
  async navigateToSiteRegisterForm(): Promise<SiteFeasibilityRegistrationFormPage> {
    await this.page.waitForLoadState('domcontentloaded');

    // Wait for the new page to open after clicking the REGISTER MY SITE button
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.page.getByRole('button', { name: /register my site/i }).click()
    ]);

    await newPage.waitForLoadState('domcontentloaded');
    return new SiteFeasibilityRegistrationFormPage(newPage);
  }

  /**
   * Verifies that the Site Feasibility & Registration Form is visible using robust selectors.
   * Accepts a Page instance (can be the new tab).
   */
  async isFormDisplayed(page: Page): Promise<boolean> {
    await page.waitForLoadState('domcontentloaded');
    await this.waitForPageLoad(30000);
    // Look for a unique form field label as a robust selector
    const formLabel = page.locator('label', { hasText: '1. Name of Site:' });
    await formLabel.waitFor({ state: 'visible', timeout: 30000 });
    return true;
  }
}
