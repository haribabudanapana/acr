// Page Object for Explore Data Page
import { Page } from '@playwright/test';

export class ExploreDataPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    // Navigates to the Explore Data page
    await this.page.goto('/explore-data');
  }

  async enterSiteId(siteId: string) {
    // Fill the Site ID input field
    await this.page.getByTestId('site-id-input').fill(siteId);
  }

  async clickSearchButton() {
    // Click the search button
    await this.page.getByTestId('search-button').click();
  }

  async waitForSearchResults() {
    // Wait for the results table or section to appear
    await this.page.getByTestId('search-results').waitFor({ state: 'visible' });
  }

  async getSearchResults(): Promise<Array<{ siteId: string }>> {
    // Extracts search results from the table
    // (Assume each row has data-site-id attribute or similar)
    const rows = await this.page.locator('[data-testid="search-result-row"]').elementHandles();
    const results = [];
    for (const row of rows) {
      const siteId = await row.getAttribute('data-site-id');
      results.push({ siteId });
    }
    return results;
  }

  async isDataAnalysisSectionVisible(): Promise<boolean> {
    // Checks if the data analysis section is visible
    return await this.page.getByTestId('data-analysis-section').isVisible();
  }
}
