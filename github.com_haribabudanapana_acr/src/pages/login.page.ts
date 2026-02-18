import { Page, Locator, test } from "@playwright/test";
import { BasePage } from "./base.page";
import { ActionUtils } from "../utils/action-utils";
import { ENV } from "../config/env";

/**
 * Page Object for the Login Page.
 * Provides reusable login helpers for Site Administrator authentication.
 */
export class LoginPage extends BasePage {
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameField = page.locator('input[name="username"], input[formcontrolname="username"]');
    this.passwordField = page.locator('input[name="password"], input[formcontrolname="password"]');
    this.loginButton = page.getByRole('button', { name: /login/i });
  }

  /**
   * Navigates to the login page.
   * @param url The URL to navigate to (optional, defaults to ENV.LOGIN_URL)
   */
  async goto(url?: string): Promise<void> {
    await test.step('Navigate to Login Page', async () => {
      await this.page.goto(url || ENV.LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await this.waitForPageLoad(30000);
      await this.usernameField.waitFor({ state: 'visible', timeout: 10000 });
    });
  }

  /**
   * Logs in with the specified username and password.
   * @param username The username to use
   * @param password The password to use
   */
  async login(username: string, password: string): Promise<void> {
    await test.step('Login as user', async () => {
      await this.usernameField.waitFor({ state: 'visible', timeout: 10000 });
      await ActionUtils.fill(this.usernameField, username);
      await this.passwordField.waitFor({ state: 'visible', timeout: 10000 });
      await ActionUtils.fill(this.passwordField, password);
      await this.loginButton.waitFor({ state: 'visible', timeout: 10000 });
      await ActionUtils.click(this.loginButton);
      await this.page.waitForLoadState('networkidle');
    });
  }

  /**
   * Logs in as Site Administrator (with RMS role) using credentials from test data or ENV.
   * This helper is reusable and supports data-driven tests.
   * @param credentials Optional credentials object { username, password }.
   *                    If not provided, uses ENV.SITE_ADMIN_USERNAME and ENV.SITE_ADMIN_PASSWORD.
   */
  async loginAsSiteAdministrator(credentials?: { username: string; password: string }): Promise<void> {
    await test.step('Login as Site Administrator', async () => {
      const username = credentials?.username || ENV.SITE_ADMIN_USERNAME;
      const password = credentials?.password || ENV.SITE_ADMIN_PASSWORD;
      if (!username || !password) {
        throw new Error('Site Administrator credentials are missing.');
      }
      await this.goto();
      await this.login(username, password);
      // Optionally, wait for a post-login element to confirm successful login (e.g., dashboard, profile menu)
      // await this.page.locator('selector-for-dashboard-or-profile').waitFor({ state: 'visible', timeout: 20000 });
    });
  }
}
