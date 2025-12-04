import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { ActionUtils } from '../utils/action-utils';

/**
 * Page Object for the 'Explore Data' page, supporting search by Case ID and result verification.
 * Follows existing repository patterns and uses inline placeholder locators where specifics are unavailable.
 */
export class ExploreDataPage extends BasePage {
  // Placeholder locators for search input, button, and results
  private readonly caseIdSearchInput: Locator;
  private readonly searchButton: Locator;
  private readonly searchResultsTable: Locator;
  private readonly searchResultRows: Locator;
  private readonly noResultsMessage: Locator;

  constructor(page: Page) {
    super(page);
    // TODO: Replace with actual locator for the Case ID search input field
    this.caseIdSearchInput = page.locator('locator("<PLACEHOLDER_case_id_search_input>")'); // Placeholder locator
    // TODO: Replace with actual locator for the Search button
    this.searchButton = page.locator('locator("<PLACEHOLDER_search_button>")'); // Placeholder locator
    // TODO: Replace with actual locator for the search results table
    this.searchResultsTable = page.locator('locator("<PLACEHOLDER_search_results_table>")'); // Placeholder locator
    // TODO: Replace with actual locator for the search result rows
    this.searchResultRows = page.locator('locator("<PLACEHOLDER_search_result_rows>")'); // Placeholder locator
    // TODO: Replace with actual locator for the 'No results' message or empty state
    this.noResultsMessage = page.locator('locator("<PLACEHOLDER_no_results_message>")'); // Placeholder locator
  }

  /**
   * Enters the given Case ID into the search input field.
   * @param caseId The Case ID to search for (e.g., 'C123').
   */
  async enterCaseId(caseId: string): Promise<void> {
    await ActionUtils.waitForVisible(this.caseIdSearchInput);
    await ActionUtils.clearAndType(this.caseIdSearchInput, caseId);
  }

  /**
   * Clicks the Search button to perform the search.
   */
  async clickSearchButton(): Promise<void> {
    await ActionUtils.waitForEnabled(this.searchButton);
    await ActionUtils.click(this.searchButton);
  }

  /**
   * Waits for the search results to be displayed (either results or a 'no results' message).
   */
  async waitForSearchResults(): Promise<void> {
    // Wait for either results table or no results message to be visible
    await Promise.race([
      ActionUtils.waitForVisible(this.searchResultsTable),
      ActionUtils.waitForVisible(this.noResultsMessage)
    ]);
  }

  /**
   * Verifies that the search results contain at least one row with the specified Case ID.
   * @param caseId The Case ID expected in the results.
   */
  async verifySearchResultsContainCaseId(caseId: string): Promise<void> {
    await this.waitForSearchResults();
    const rows = await this.searchResultRows.all();
    let found = false;
    for (const row of rows) {
      const text = await row.textContent();
      if (text && text.includes(caseId)) {
        found = true;
        break;
      }
    }
    if (!found) {
      throw new Error(`Expected to find Case ID '${caseId}' in search results, but it was not found.`);
    }
  }

  /**
   * Verifies that the search results are empty (no matching subjects found).
   */
  async verifyNoSearchResults(): Promise<void> {
    await this.waitForSearchResults();
    const isVisible = await this.noResultsMessage.isVisible();
    if (!isVisible) {
      throw new Error('Expected "No results" message to be visible, but it was not.');
    }
  }

  /**
   * Performs a full search flow for a given Case ID and verifies that results are displayed.
   * @param caseId The Case ID to search for.
   */
  async searchByCaseIdAndVerifyResults(caseId: string): Promise<void> {
    await this.enterCaseId(caseId);
    await this.clickSearchButton();
    await this.verifySearchResultsContainCaseId(caseId);
  }
}
