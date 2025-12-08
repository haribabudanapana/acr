
import { Page,expect } from '@playwright/test';
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
    // Wait for the age selector to be visible
    const ageSelector = this.page.locator('.age-selector');
    await ageSelector.waitFor({ state: 'visible' });
    
    // Check if "Age Range" toggle is enabled (checkbox should be checked)
    const toggleCheckbox = ageSelector.locator('.toggle-row input[type="checkbox"]');
    const isChecked = await toggleCheckbox.isChecked();
    
    // If toggle is off, click it to enable "Age Range" mode
    if (!isChecked) {
      await toggleCheckbox.click();
      await this.page.waitForTimeout(500); // Wait for slider to render
    }
    
    // Locate the slider handles using aria attributes for better stability
    const minHandle = ageSelector.locator('[role="slider"][aria-label="ngx-slider"]');
    const maxHandle = ageSelector.locator('[role="slider"][aria-label="ngx-slider-max"]');
    await minHandle.waitFor({ state: 'visible' });
    await maxHandle.waitFor({ state: 'visible' });
    
    // Get the slider bar dimensions to calculate proportional positions
    const sliderBar = ageSelector.locator('.ngx-slider-full-bar');
    await sliderBar.waitFor({ state: 'visible' });
    const box = await sliderBar.boundingBox();
    
    if (box) {
      const sliderWidth = box.width;
      const sliderLeft = box.x;
      
      // Calculate positions for min and max (range is 1-100)
      const minPosition = sliderLeft + (sliderWidth * (min - 1) / 99);
      const maxPosition = sliderLeft + (sliderWidth * (max - 1) / 99);
      
      // Drag min handle to set minimum age
      await minHandle.dragTo(sliderBar, { 
        targetPosition: { x: Math.round(minPosition) - sliderLeft, y: 0 } 
      });
      
      // Drag max handle to set maximum age
      await maxHandle.dragTo(sliderBar, { 
        targetPosition: { x: Math.round(maxPosition) - sliderLeft, y: 0 } 
      });
    }
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
    await this.page.click('//div[contains(@class,"nav-buttons")]/descendant::button[contains(text(),"Explore Data")]');
    await this.page.waitForLoadState('networkidle');

  }

  async toBeVisible() {
    // Implement a check for a unique element on the Explore Data page
    await this.page.waitForSelector('[data-testid="explore-data-title"]', { state: 'visible' });
  }

  async applySexAtBirthFilter(sex: string) {
    // Click the custom dropdown to open options
    const customSelectBox = this.page.locator('.custom-select-box').filter({ hasText: 'Select Options' });
    await customSelectBox.waitFor({ state: 'visible' });
    await customSelectBox.click();
    
    // Wait for the dropdown options to appear and click the sex option
    const option = this.page.locator('text=' + sex);
    await option.waitFor({ state: 'visible' });
    await option.click();
  }

  async applyAgeRangeFilter(minAge: number) {
    // Locate the minimum age slider handle
    const minHandle = this.page.locator('.ngx-slider-pointer-min');
    await minHandle.waitFor({ state: 'visible' });
    
    // Drag the slider to set the minimum age value
    // The slider ranges from 1-100, so we calculate the position proportionally
    const sliderBar = this.page.locator('.ngx-slider-selection-bar');
    await sliderBar.waitFor({ state: 'visible' });
    
    // Get slider dimensions to calculate the target position
    const box = await sliderBar.boundingBox();
    if (box) {
      const sliderWidth = box.width;
      const minPosition = box.x + (sliderWidth * (minAge - 1) / 99); // Normalize to 0-99 range
      await minHandle.dragTo(this.page.locator('.ngx-slider-bar'), { targetPosition: { x: Math.round(minPosition), y: 0 } });
    }
  }

  async applyRaceFilter(race: string) {
    // Click the custom dropdown to open options
    const customSelectBox = this.page.locator('.custom-select-box').filter({ hasText: 'Select Options' });
    await customSelectBox.waitFor({ state: 'visible' });
    await customSelectBox.click();
    
    // Wait for the dropdown options to appear and click the race option
    const option = this.page.locator('text=' + race);
    await option.waitFor({ state: 'visible' });
    await option.click();
  }

  async waitForFiltersToApply() {
    // Wait for the demographic data or results section to be visible indicating filters have been applied
    // First, wait a brief moment for any loading to start
    await this.page.waitForTimeout(500);

    
    // Then wait for the results to be visible (demographic data or results table)
    const demographicResults = this.page.locator('[data-testid="demographic-row"], [data-testid="search-results"], table.table tbody tr');
    await demographicResults.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
      // If no specific results found, just wait for page to stabilize
      return this.page.waitForLoadState('networkidle');
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
    // Click the "Case ID" filter button to open the dropdown
    const caseIdButton = this.page.locator('button:has-text("Case ID")').filter({ has: this.page.locator('[class*="filter-button"]') });
    await caseIdButton.waitFor({ state: 'visible' });
    await caseIdButton.click();
    
    // Wait for and fill the Case ID input field
    const caseIdInput = this.page.locator('input[formcontrolname="caseId"]');
    await caseIdInput.waitFor({ state: 'visible' });
    await caseIdInput.fill(caseId);
  }

  async clickSearch() {
    await this.page.locator('//*[contains(@class,"ci-add-plus")]').click();
    // Locate the Search button using XPath
  const searchButton = this.page.locator("//button[contains(text(),'Search')]");

  // Verify the element is visible
  await expect(searchButton).toBeVisible();

  // Click the Search button
  await searchButton.click();

  }

  async waitForResults() {
    // Locate the span element
  const element = this.page.locator("//span[contains(@class,'TotalCountValue')]");

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
    // Click the custom dropdown to open options
    const customSelectBox = this.page.locator('.custom-select-box');
    await customSelectBox.waitFor({ state: 'visible' });
    await customSelectBox.click();
    
    // Wait for the dropdown options to appear and click the siteId option
    const option = this.page.locator('text=' + siteId);
    await option.waitFor({ state: 'visible' });
    await option.click();
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
    // Extracts Site IDs from the first column of the results table
    const siteIdCells = this.page.locator('table.table tbody tr td:nth-child(1)');
    const texts = await siteIdCells.allTextContents();
    const results = texts
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(siteId => ({ siteId }));
    return results;
  }

  async isDataAnalysisSectionVisible(): Promise<boolean> {
    // Checks if the data analysis section is visible
    return await this.page.getByTestId('data-analysis-section').isVisible();
  }
  /**
   * Return an array of Case IDs currently displayed in the results table.
   * Case IDs are in the second column (index 1) of each table row.
   */
  async getResultsCaseIds(): Promise<string[]> {
    // Select the second <td> in each row (Case ID column)
    const caseIdCells = this.page.locator('table.table tbody tr td:nth-child(2)');
    const texts = await caseIdCells.allTextContents();
    const caseIds = texts.map(t => t.trim()).filter(t => t.length > 0);
    return caseIds;
  }

  /**
   * Helper that checks whether a specific Case ID exists in the current results.
   * Returns true/false so the test can assert as needed.
   */
  async hasCaseId(targetCaseId: string): Promise<boolean> {
    const caseIds = await this.getResultsCaseIds();
    return caseIds.includes(targetCaseId);
  }

  async clickOnFilters(Locator:string) {
    const caseIdButton = this.page.locator(`button:has-text("${Locator}")`).filter({ has: this.page.locator('[class*="filter-button"]') });
    await caseIdButton.waitFor({ state: 'visible' });
    await caseIdButton.click();
    
  }
}
