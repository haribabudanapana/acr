import { Page, Locator, test } from "@playwright/test";
import { BasePage } from "./base.page";
import { ActionUtils } from "../utils/action-utils";

/**
 * Page Object for the Site Drafts listing section (Site Feasibility registrations).
 * Encapsulates navigation, filtering, and verification of draft access control.
 */
export class SiteDraftsPage extends BasePage {
  private readonly draftsSection: Locator;
  private readonly draftsListContainer: Locator;
  private readonly draftItem: Locator;
  private readonly draftOwnerName: Locator;
  private readonly ownerFilterInput: Locator;
  private readonly loadingIcon: Locator;

  constructor(page: Page) {
    super(page);
    // Main section containing all drafts
    this.draftsSection = page.locator('[data-testid="site-drafts-section"]');
    // Container for the list of drafts
    this.draftsListContainer = page.locator('[data-testid="site-drafts-list-container"]');
    // Each draft entry (row/card)
    this.draftItem = page.locator('[data-testid="site-draft-item"]');
    // Owner/creator name within each draft item
    this.draftOwnerName = page.locator('[data-testid="site-draft-owner"]');
    // Optional: Owner filter input (if present)
    this.ownerFilterInput = page.locator('[data-testid="draft-owner-filter-input"]');
    // Loading indicator for drafts list
    this.loadingIcon = page.locator('[data-testid="drafts-loading-icon"]');
  }

  /**
   * Navigates to the Drafts section, handling multi-page navigation if needed.
   */
  async navigateToDraftsSection(): Promise<void> {
    await test.step('Navigate to the Drafts section', async () => {
      // Wait for the main section to be visible (robust wait)
      await this.draftsSection.waitFor({ state: 'visible', timeout: 20000 });
      // Optionally, handle navigation if this is a separate page or tab
      // (Assume navigation is already performed by test or previous page)
      await this.waitForDraftsLoad();
    });
  }

  /**
   * Waits for the drafts list to finish loading and be visible.
   */
  async waitForDraftsLoad(): Promise<void> {
    await test.step('Wait for drafts list to load', async () => {
      // Wait for loading icon to disappear if present
      if (await this.loadingIcon.isVisible({ timeout: 5000 }).catch(() => false)) {
        await this.loadingIcon.waitFor({ state: 'hidden', timeout: 15000 });
      }
      // Wait for the container to be visible
      await this.draftsListContainer.waitFor({ state: 'visible', timeout: 10000 });
    });
  }

  /**
   * Checks if the drafts list container is currently displayed.
   */
  async isDraftsListDisplayed(): Promise<boolean> {
    await test.step('Verify drafts list container is visible', async () => {
      await this.draftsListContainer.waitFor({ state: 'visible', timeout: 10000 });
    });
    return await this.draftsListContainer.isVisible();
  }

  /**
   * Returns an array of owner/creator names for all visible draft items.
   */
  async getDisplayedDraftOwners(): Promise<string[]> {
    await test.step('Get owner names from all visible draft items', async () => {
      await this.waitForDraftsLoad();
    });
    const count = await this.draftItem.count();
    const owners: string[] = [];
    for (let i = 0; i < count; i++) {
      const ownerLocator = this.draftItem.nth(i).locator('[data-testid="site-draft-owner"]');
      await ownerLocator.waitFor({ state: 'visible', timeout: 5000 });
      const ownerName = await ownerLocator.textContent();
      if (ownerName) {
        owners.push(ownerName.trim());
      }
    }
    return owners;
  }

  /**
   * Filters drafts by owner name, if filter input is present.
   * @param owner The owner/creator name to filter by
   */
  async filterDraftsByOwner(owner: string): Promise<void> {
    await test.step(`Filter drafts by owner: ${owner}`, async () => {
      if (await this.ownerFilterInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await ActionUtils.clear(this.ownerFilterInput);
        await ActionUtils.fill(this.ownerFilterInput, owner);
        // Wait for filter to apply and drafts to reload
        await this.waitForDraftsLoad();
      }
    });
  }

  /**
   * Verifies that all visible drafts belong to the provided owner.
   * @param owner The expected owner/creator name
   * @returns true if all visible drafts belong to the owner
   */
  async verifyDraftsBelongTo(owner: string): Promise<boolean> {
    await test.step(`Verify all visible drafts belong to owner: ${owner}`, async () => {
      await this.waitForDraftsLoad();
    });
    const owners = await this.getDisplayedDraftOwners();
    return owners.length > 0 && owners.every(o => o === owner);
  }
}
