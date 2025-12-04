import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ExploreDataPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    // Implement navigation to Explore Data page, e.g., via menu or direct URL
    await this.page.goto('/explore-data');
  }

  async isLoaded(): Promise<boolean> {
    // Implement a check that the Explore Data page is loaded (e.g., check for a unique element)
    return this.page.locator('[data-testid="explore-data-search-field"]').isVisible();
  }

  async enterCaseId(caseId: string) {
    await this.page.locator('[data-testid="explore-data-search-field"]').fill(caseId);
  }

  async clickSearch() {
    await this.page.locator('[data-testid="explore-data-search-button"]').click();
  }

  async waitForResults() {
    await this.page.waitForSelector('[data-testid="explore-data-results-list"]');
  }

  async getResultsCaseIds(): Promise<string[]> {
    // Returns an array of Case IDs from the results list
    const caseIdElements = await this.page.locator('[data-testid="case-id-cell"]').allTextContents();
    return caseIdElements.map(text => text.trim());
  }

  async isResultsListDisplayed(): Promise<boolean> {
    return this.page.locator('[data-testid="explore-data-results-list"]').isVisible();
  }
}
