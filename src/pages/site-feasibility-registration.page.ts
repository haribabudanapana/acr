// src/pages/site-feasibility-registration.page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class SiteFeasibilityRegistrationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigates to the Site Feasibility & Registration Form from the public-facing website.
   */
  async navigateToSiteRegisterForm(): Promise<Page> {
    await this.page.waitForLoadState('domcontentloaded');

    // Wait for the new page to open
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.page.getByRole('button', { name: 'REGISTER MY SITE' }).click()
    ]);

    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }

  /**
   * Verifies that the Site Feasibility & Registration Form is visible.
   */
  async isFormDisplayed(page: Page): Promise<boolean> {
    await page.waitForLoadState('domcontentloaded');
    await this.waitForPageLoad(30000);
    const siteRegisterButton = page.getByText('Site Feasibility &');
    await siteRegisterButton.waitFor({ state: 'visible', timeout: 30000 });
    return true;
  }

}
