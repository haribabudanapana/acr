
import { Page, expect, test } from '@playwright/test';
import { BasePage } from './base.page';

let casesCount: number;
export class ExploreDataPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  async openAgeRangeFilter() {
    // Implement logic to open the age range filter dropdown/panel
    await this.page.click('[data-testid="age-range-filter"]');
  }
  async setAgeRange(min: number, max: number) {
    await test.step('Set Age Range Filter', async () => {
      // Wait for the age selector to be visible
      const ageSelector = this.page.locator('.age-selector');
      await ageSelector.waitFor({ state: 'visible' });

      // Check if "Age Range" toggle is enabled (checkbox should be checked)
      const toggleCheckbox = ageSelector.locator('.toggle-row input[type="checkbox"]');
      const isChecked = await toggleCheckbox.isChecked();

      // If toggle is off, click it to enable "Age Range" mode
      if (isChecked) {
        await toggleCheckbox.click({ force: true });
        await this.page.waitForTimeout(500); // Wait for slider to render
      }

      // Locate the slider handles
      const minHandle = ageSelector.locator('[role="slider"][aria-label="ngx-slider"]');
      const maxHandle = ageSelector.locator('[role="slider"][aria-label="ngx-slider-max"]');
      await minHandle.waitFor({ state: 'visible' });
      await maxHandle.waitFor({ state: 'visible' });

      // Get current values
      const currentMin = Number(await minHandle.getAttribute('aria-valuenow'));
      const currentMax = Number(await maxHandle.getAttribute('aria-valuenow'));

      // Move min handle
      await minHandle.focus();
      const minDiff = min - currentMin;
      if (minDiff > 0) {
        for (let i = 0; i < minDiff; i++) {
          await this.page.keyboard.press('ArrowRight');
        }
      } else {
        for (let i = 0; i < -minDiff; i++) {
          await this.page.keyboard.press('ArrowLeft');
        }
      }

      // Move max handle
      await maxHandle.focus();
      const maxDiff = max - currentMax;
      if (maxDiff > 0) {
        for (let i = 0; i < maxDiff; i++) {
          await this.page.keyboard.press('ArrowRight');
        }
      } else {
        for (let i = 0; i < -maxDiff; i++) {
          await this.page.keyboard.press('ArrowLeft');
        }
      }
    });
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
    await test.step('Navigate to Explore Data Page', async () => {
      await this.page.click('//div[contains(@class,"nav-buttons")]/descendant::button[contains(text(),"Explore Data")]', { timeout: 90000 });
      await this.page.waitForLoadState('networkidle');
    });

  }

  async toBeVisible() {
    // Implement a check for a unique element on the Explore Data page
    //await this.page.waitForSelector('[data-testid="explore-data-title"]', { state: 'visible' });
    await this.page.getByRole('button', { name: 'Explore Data' }).first().waitFor({ state: 'visible' });
  }

  async applySexAtBirthFilter(sex: string) {
    await test.step('Apply Sex at Birth Filter', async () => {
      // Click the custom dropdown to open options
      const customSelectBox = this.page.locator('.custom-select-box').first().filter({ hasText: 'Select Options' });
      await customSelectBox.waitFor({ state: 'visible' });
      await customSelectBox.click();

      // Wait for the dropdown options to appear and click the sex option
      const option = this.page.getByText(sex, { exact: true })
      await option.waitFor({ state: 'visible' });
      await option.click();
    });
  }

  async applyAgeRangeFilter(minAge: number) {
    await test.step('Apply Age Range Filter', async () => {
      // Locate the minimum age slider handle
      const minHandle = this.page.getByRole('slider', { name: 'ngx-slider', exact: true });
      await minHandle.waitFor({ state: 'visible' });

      // Get the slider bar to calculate positions
      const sliderBar = this.page.locator('.ngx-slider-full-bar');
      await sliderBar.waitFor({ state: 'visible' });
      const sliderBoundingBox = await sliderBar.boundingBox();

      if (sliderBoundingBox) {
        // Calculate the target x position
        // The slider's value range is assumed to be 1-100.
        const targetX = sliderBoundingBox.x + (sliderBoundingBox.width * (minAge - 1)) / 99;

        // Move the mouse to the slider handle
        await minHandle.hover();
        // Press the mouse button
        await this.page.mouse.down();
        // Move the mouse to the target position
        await this.page.mouse.move(targetX, sliderBoundingBox.y + sliderBoundingBox.height / 2);
        // Release the mouse button
        await this.page.mouse.up();
      }
    });
  }

  async applyRaceFilter(race: string) {
    await test.step('Apply Race Filter', async () => {
      // Click the custom dropdown to open options
      const customSelectBox = this.page.locator('.col-md-3.demographics_gap > .bottom-border-select-wrapper > .custom-select-box');
      await customSelectBox.waitFor({ state: 'visible' });
      await customSelectBox.click();
      // Wait for the dropdown options to appear and click the race option
      const option = this.page.locator('text=' + race);
      await option.waitFor({ state: 'visible' });
      await option.click();
    });
  }

  async waitForFiltersToApply() {
    // Wait for the demographic data or results section to be visible indicating filters have been applied
    // First, wait a brief moment for any loading to start
    await this.page.waitForTimeout(500);


    // Then wait for the results to be visible (demographic data or results table)
    const demographicResults = this.page.locator('[data-testid="demographic-row"], [data-testid="search-results"], table.table tbody tr');
    await test.step('Wait for demographic results to be visible', async () => {
      await demographicResults.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
        // If no specific results found, just wait for page to stabilize
        return this.page.waitForLoadState('networkidle');
      });
    });
  }

  async getFilteredDemographicResults() {

    // Fetch filtered demographic data from the results table
    // Get the first row of data from the table
    const firstRow = this.page.locator('table.table tbody tr').first();
    await firstRow.waitFor({ state: 'visible' });

    // Extract Race from column 6 (Participant Race)
    const raceCell = firstRow.locator('td:nth-child(6)');
    const race = (await raceCell.textContent())?.trim() || '';

    return { race };

  }

  async areOnlyExpectedResultsDisplayed(filters: { sexAtBirth: string, minAge: number, race: string }) {
    await test.step('Verify Only Expected Results Are Displayed', async () => {
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
    });
  }

  async areFiltersPersisted(filters: { sexAtBirth: string, minAge: number, race: string }) {

    await test.step('Verify Filters Are Persisted', async () => {
      const sexValue = await this.page.inputValue('[data-testid="filter-sex-dropdown"]');
      const ageValue = await this.page.inputValue('[data-testid="filter-age-min"]');
      const raceValue = await this.page.inputValue('[data-testid="filter-race-dropdown"]');
      return (
        sexValue === filters.sexAtBirth &&
        Number(ageValue) === filters.minAge &&
        raceValue === filters.race
      );
    });
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
    // Click the "Case ID" filter button to open the dropdown
    const caseIdButton = this.page.getByRole('button', { name: 'Case ID' });
    await caseIdButton.waitFor({ state: 'visible' });
    await caseIdButton.click();

    // Wait for and fill the Case ID input field
    const caseIdInput = this.page.locator('input[formcontrolname="caseId"]');
    await caseIdInput.waitFor({ state: 'visible' });
    await caseIdInput.fill(caseId);
    await this.page.locator('polygon').click(); // Click outside to close the dropdown
    await this.page.waitForLoadState('networkidle');
  }

  async clickSearch() {
    await test.step('Click Search Button', async () => {
      await this.page.waitForLoadState('networkidle');
      const leftArrow = this.page.locator('.ci.ci-sidepanel-arrow-left');
      // Check if the arrow exists in the DOM at all
      if (await leftArrow.count() > 0) {
        // Check if it's visible before interacting
        if (await leftArrow.isVisible()) {
          await leftArrow.click({ force: true });
        }
      }
      await this.page.waitForLoadState('networkidle');
      const searchButton = this.page.getByRole('button', { name: 'Search' });

      // Verify the element is visible
      await expect(searchButton).toBeVisible();

      // Click the Search button
      await searchButton.click();
    });

  }

  async waitForResults() {
    // Locate the span element
    await this.page.waitForLoadState('networkidle');
    await this.page.getByRole('status').waitFor({ state: 'hidden' });
    const element = this.page.locator("//span[contains(@class,'TotalCountValue')]");
    await element.waitFor({ state: 'visible', timeout: 10000 });
    // Get the text content (e.g. "2 cases found")
    const text = await element.textContent();

    // Extract only the number using regex
    const numberMatch = text?.match(/\d+/);
    casesCount = numberMatch ? parseInt(numberMatch[0], 10) : 0;

    console.log('Extracted number:', casesCount);

    // Example assertion
    expect(casesCount).toBeGreaterThan(0);

  }
  async isResultsListDisplayed(): Promise<boolean> {
    return this.page.locator('[data-testid="explore-data-results-list"]').isVisible();

  }

  async enterSiteId(siteId: string) {
    await test.step('Enter Site ID', async () => {

      // Open the dropdown
      const dropdownButton = this.page.getByRole('button', { name: 'Site ID' });
      await dropdownButton.waitFor({ state: 'visible' });
      await dropdownButton.click();

      // Wait for dropdown options container to appear
      const optionsContainer = this.page.locator('.custom-select-box');
      await optionsContainer.waitFor({ state: 'visible' });
      optionsContainer.click();


      // Select the option matching the siteId
      const option = this.page.getByText(siteId, { exact: true });
      await option.waitFor({ state: 'visible' });
      await option.click();
      await this.page.waitForLoadState('networkidle');
    });
  }

  async clickSearchButton() {
    await test.step('Click Search Button', async () => {
      await this.page.waitForLoadState('networkidle');
      // Click the search button
      const option = this.page.getByRole('button', { name: /Search/i })
      await option.waitFor({ state: 'visible', timeout: 50000 });
      await option.hover();
      await option.click();
      await this.page.waitForLoadState('networkidle');
    });
  }

  async getSearchResults(): Promise<Array<{ siteId: string }>> {

    // Extracts Site IDs from the first column of the results table
    await this.page.waitForLoadState('networkidle');
    await this.page.getByRole('status').waitFor({ state: 'hidden' });
    const siteIdCells = this.page.locator('table.table tbody tr td:nth-child(1)');
    await siteIdCells.first().waitFor({ state: 'visible' });
    const texts = await siteIdCells.allTextContents();
    const results = texts
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(siteId => ({ siteId }));
    return results;
  }

  /**
   * Return an array of Case IDs currently displayed in the results table.
   * Case IDs are in the second column (index 1) of each table row.
   */
  async getResultsCaseIds(): Promise<string[]> {

    // Select the second <td> in each row (Case ID column)
    const caseIdCells = this.page.locator('table.table tbody tr td:nth-child(2)');
    await caseIdCells.first().waitFor({ state: 'visible' });
    const texts = await caseIdCells.allTextContents();
    const caseIds = texts.map(t => t.trim()).filter(t => t.length > 0);
    return caseIds;
  }

  /**
   * Helper that checks whether a specific Case ID exists in the current results.
   * Returns true/false so the test can assert as needed.
   */
  async hasCaseId(targetCaseId: string): Promise<boolean> {
    await this.page.waitForLoadState('networkidle');
    const caseIds = await this.getResultsCaseIds();
    return caseIds.includes(targetCaseId);
  }

  async clickOnFilters(Locator: string) {
    //const caseIdButton = this.page.locator(`button:has-text("${Locator}")`).filter({ has: this.page.locator('[class*="filter-button"]') });
    const subMenu = this.page.getByRole('button', { name: Locator }).first();
    await subMenu.waitFor({ state: 'visible' });
    await subMenu.click();

  }

}
