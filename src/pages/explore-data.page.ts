import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ExploreDataPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    // Implement navigation to the Explore Data page
    await this.page.goto('/explore-data');
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

  async applySexAtBirthFilter() {
    // Click the apply button for the Sex at Birth filter
    await this.page.click('[data-test-id="sex-at-birth-apply-button"]');
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
}
