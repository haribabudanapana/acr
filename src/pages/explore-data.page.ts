import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ExploreDataPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openAgeRangeFilter() {
    // Implement logic to open the age range filter dropdown/panel
    await this.page.click('[data-testid="age-range-filter"]');
  }

  async setAgeRange(min: number, max: number) {
    // Implement logic to set the minimum and maximum age in the filter
    await this.page.fill('[data-testid="age-range-min"]', min.toString());
    await this.page.fill('[data-testid="age-range-max"]', max.toString());
  }

  async getDisplayedAges(): Promise<number[]> {
    // Implement logic to extract all displayed ages from the demographic data table/list
    const ageElements = await this.page.$$('[data-testid="demographic-age-value"]');
    const ages = [];
    for (const el of ageElements) {
      const text = await el.textContent();
      if (text) {
        const age = parseInt(text, 10);
        if (!isNaN(age)) {
          ages.push(age);
        }
      }
    }
    return ages;
  }

  async isAgeRangeFilterSticky(min: number, max: number): Promise<boolean> {
    // Implement logic to verify the age range filter remains set
    const minValue = await this.page.inputValue('[data-testid="age-range-min"]');
    const maxValue = await this.page.inputValue('[data-testid="age-range-max"]');
    return minValue === min.toString() && maxValue === max.toString();
  }

  async goto() {
    await this.page.goto('/explore-data');
  }

  async toBeVisible() {
    // Implement a check for a unique element on the Explore Data page
    await this.page.waitForSelector('[data-testid="explore-data-title"]', { state: 'visible' });
  }

  async applySexAtBirthFilter(sex: string) {
    // Interact with the Sex at Birth filter dropdown or buttons
    // Example: await this.page.click(`[data-testid="filter-sex-${sex.toLowerCase()}"]`);
    // Replace with actual implementation
    await this.page.selectOption('[data-testid="filter-sex-dropdown"]', { label: sex });
  }

  async applyAgeRangeFilter(minAge: number) {
    // Interact with the Age Range filter (e.g., slider or input)
    // Example: await this.page.fill('[data-testid="filter-age-min"]', String(minAge));
    await this.page.fill('[data-testid="filter-age-min"]', String(minAge));
    // Optionally, trigger filter apply
    await this.page.click('[data-testid="filter-age-apply"]');
  }

  async applyRaceFilter(race: string) {
    // Interact with the Race filter (e.g., multi-select or dropdown)
    await this.page.selectOption('[data-testid="filter-race-dropdown"]', { label: race });
  }

  async waitForFiltersToApply() {
    // Wait for loading indicator to disappear or results to update
    await this.page.waitForSelector('[data-testid="loading-indicator"]', { state: 'detached' });
  }

  async getFilteredDemographicResults() {
    // Fetch filtered demographic data from the UI
    // Example: read values from summary cards or results table
    const sexAtBirth = await this.page.textContent('[data-testid="result-sex"]');
    const minAge = Number(await this.page.textContent('[data-testid="result-min-age"]'));
    const race = await this.page.textContent('[data-testid="result-race"]');
    return { sexAtBirth, minAge, race };
  }

  async areOnlyExpectedResultsDisplayed(filters: { sexAtBirth: string, minAge: number, race: string }) {
    // Implement logic to verify that only expected results are shown
    // This is a placeholder; actual implementation depends on UI
    const rows = this.page.locator('[data-testid="demographic-row"]');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const sex = await row.locator('[data-testid="row-sex"]').textContent();
      const age = Number(await row.locator('[data-testid="row-age"]').textContent());
      const race = await row.locator('[data-testid="row-race"]').textContent();
      if (sex !== filters.sexAtBirth || age < filters.minAge || race !== filters.race) {
        return false;
      }
    }
    return true;
  }

  async areFiltersPersisted(filters: { sexAtBirth: string, minAge: number, race: string }) {
    // Check that filters remain applied (e.g., filter UI shows correct values)
    const sexValue = await this.page.inputValue('[data-testid="filter-sex-dropdown"]');
    const ageValue = await this.page.inputValue('[data-testid="filter-age-min"]');
    const raceValue = await this.page.inputValue('[data-testid="filter-race-dropdown"]');
    return (
      sexValue === filters.sexAtBirth &&
      Number(ageValue) === filters.minAge &&
      raceValue === filters.race
    );
  }

  async waitForLoad() {
    // Wait for the Explore Data page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    // Optionally, wait for a specific element unique to the Explore Data page
    // await this.page.waitForSelector('data-test-id=explore-data-title');
  }

  async openSexAtBirthFilter() {
    // Open the Sex at Birth filter dropdown
    await this.page.click('[data-test-id="sex-at-birth-filter-dropdown"]');
  }

  async selectSexAtBirthOption(option: string) {
    // Select a given Sex at Birth option (e.g., 'Male', 'Female')
    await this.page.click(`[data-test-id="sex-at-birth-option-${option.toLowerCase()}"]`);
  }

  async waitForDemographicDataUpdate() {
    // Wait for demographic data to update (could be a spinner or data grid update)
    await this.page.waitForSelector('[data-test-id="demographic-data-updated"]', { state: 'visible' });
  }

  async getDemographicData() {
    // Returns the demographic data currently displayed
    // This is a stub; actual implementation will depend on the app's DOM
    const sexAtBirthValues = await this.page.$$eval('[data-test-id="demographic-sex-at-birth-value"]', els => els.map(e => e.textContent?.trim() || ''));
    return {
      sexAtBirth: sexAtBirthValues
    };
  }
  async getAppliedSexAtBirthFilters() {
    // Returns the currently applied Sex at Birth filters
    const appliedFilters = await this.page.$$eval('[data-test-id="applied-sex-at-birth-filter"]', els => els.map(e => e.textContent?.trim() || ''));
    return appliedFilters;
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
