import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login.page";
import { SiteDraftsPage } from "../../src/pages/site-drafts.page";
import { ENV } from "../../src/config/env";

// Test Case: TCD_FT_04_FR-4
// Name: Access control for draft registration forms
// Objective: Ensure that access to saved registration forms is restricted to Site Administrators only.

test.describe("TCD_FT_04_FR-4: Site Admin can only see their own drafts in the drafts section", () => {
  let loginPage: LoginPage;
  let siteDraftsPage: SiteDraftsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    siteDraftsPage = new SiteDraftsPage(page);
  });

  test("Site Admin sees only their own drafts in the drafts section", async ({ page }) => {
    const adminUsername = ENV.siteAdmin.username;
    const adminPassword = ENV.siteAdmin.password;

    await test.step("Login as Site Administrator", async () => {
      await loginPage.goto(ENV.baseUrl);
      await loginPage.login(adminUsername, adminPassword);
    });

    await test.step("Navigate to Drafts section", async () => {
      await siteDraftsPage.gotoDraftsSection();
      await siteDraftsPage.waitForDraftsToLoad();
    });

    await test.step("Retrieve and assert all displayed drafts belong to logged-in admin", async () => {
      const draftOwners = await siteDraftsPage.getDisplayedDraftOwners();
      expect(Array.isArray(draftOwners)).toBeTruthy();
      expect(draftOwners.length).toBeGreaterThan(0);
      for (const owner of draftOwners) {
        expect(owner).toBe(adminUsername);
      }
    });
  });
});
