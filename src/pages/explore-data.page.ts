// Page Object for Explore Data Page - add only if not already present
import { Page } from '@playwright/test';

export class ExploreDataPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
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
    const rows = await this.page.$$('[data-testid="demographic-row"]');
    for (const row of rows) {
      const sex = await row.textContent('[data-testid="row-sex"]');
      const age = Number(await row.textContent('[data-testid="row-age"]'));
      const race = await row.textContent('[data-testid="row-race"]');
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
}
