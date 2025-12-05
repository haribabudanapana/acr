import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { ActionUtils } from '../utils/action-utils';

export class ExploreDataPage extends BasePage {
  // Placeholder locators - TODO: Replace with actual locators
  private readonly siteIdSearchInput: Locator;
  private readonly searchButton: Locator;
  private readonly searchResultsTable: Locator;
  private readonly noResultsMessage: Locator;
  private readonly analyzeDataButton: Locator;

  constructor(page: Page) {
    super(page);
    // TODO: Replace with actual selectors
    this.siteIdSearchInput = page.locator('locator("<PLACEHOLDER_site_id_search_input>")'); // Site ID input field
    this.searchButton = page.locator('locator("<PLACEHOLDER_search_button>")'); // Search button
    this.searchResultsTable = page.locator('locator("<PLACEHOLDER_search_results_table>")'); // Search results table
    this.noResultsMessage = page.locator('locator("<PLACEHOLDER_no_results_message>")'); // No results message
    this.analyzeDataButton = page.locator('locator("<PLACEHOLDER_analyze_data_button>")'); // Analyze Data button
  }

  /**
   * Enters a Site ID into the search input field.
   * @param siteId The Site ID to search for.
   */
  async enterSiteId(siteId: string): Promise<void> {
    await ActionUtils.fill(this.siteIdSearchInput, siteId);
  }

  /**
   * Clicks the Search button to perform the search action.
   */
  async clickSearchButton(): Promise<void> {
    await ActionUtils.click(this.searchButton);
  }

  /**
   * Waits for the search results table to be visible.
   */
  async waitForSearchResults(): Promise<void> {
    await ActionUtils.waitForVisible(this.searchResultsTable);
  }

  /**
   * Verifies that the search results table is displayed.
   */
  async verifySearchResultsDisplayed(): Promise<void> {
    await ActionUtils.waitForVisible(this.searchResultsTable);
    if (!(await this.searchResultsTable.isVisible())) {
      throw new Error('Search results table is not visible.');
    }
  }

  /**
   * Verifies that the 'No Results' message is displayed (if expected).
   */
  async verifyNoResultsMessageDisplayed(): Promise<void> {
    await ActionUtils.waitForVisible(this.noResultsMessage);
    if (!(await this.noResultsMessage.isVisible())) {
      throw new Error('No results message is not visible.');
    }
  }

  /**
   * Clicks the Analyze Data button to analyze the search results.
   */
  async clickAnalyzeData(): Promise<void> {
    await ActionUtils.click(this.analyzeDataButton);
  }

  /**
   * Verifies that the Analyze Data button is enabled and visible.
   */
  async verifyAnalyzeDataButtonEnabled(): Promise<void> {
    await ActionUtils.waitForVisible(this.analyzeDataButton);
    if (!(await this.analyzeDataButton.isEnabled())) {
      throw new Error('Analyze Data button is not enabled.');
    }
  }
}
