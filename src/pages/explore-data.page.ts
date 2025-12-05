// src/pages/explore-data.page.ts
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

  async applyAgeRangeFilter() {
    // Implement logic to apply the age range filter
    await this.page.click('[data-testid="apply-age-range-filter"]');
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
}
