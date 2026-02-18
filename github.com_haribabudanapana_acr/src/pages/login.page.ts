import { Page, Locator, test } from "@playwright/test";
import { BasePage } from "./base.page";
import { ActionUtils } from "../utils/action-utils";
import { ENV } from "../config/env";
import { TestDataUtils } from "../utils/test-data-utils";

/**
 * Page Object for the Login Page.
 * Encapsulates all login-related actions and element locators.
 */
export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    // Locators follow the repo's naming and locator patterns
    this.usernameInput = page.locator('input[name="username"], input[type="text"][formcontrolname="username"], input[placeholder*="User" i]');
    this.passwordInput = page.locator('input[name="password"], input[type="password"][formcontrolname="password"], input[placeholder*="Password" i]');
    this.loginButton = page.getByRole('button', { name: /^Login$/i });
  }

  /**
   * Navigates to the login page using the provided URL or ENV base URL.
   * @param url Optional URL to navigate to. If not provided, uses ENV.BASE_URL or ENV.LOGIN_URL.
   */
  async goto(url?: string): Promise<void> {
    await test.step('Navigate to the Login Page', async () => {
      const targetUrl = url || ENV.LOGIN_URL || ENV.BASE_URL;
      if (!targetUrl) {
        throw new Error('No login URL or base URL defined in ENV or parameter.');
      }
      await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
      // Wait for username input to be visible as page-ready indicator
      await this.usernameInput.waitFor({ state: 'visible', timeout: 15000 });
    });
  }

  /**
   * Performs login with the given username and password.
   * Uses ActionUtils for robust interaction and explicit waits.
   * @param username The username to login with
   * @param password The password to login with
   */
  async login(username: string, password: string): Promise<void> {
    await test.step('Login to Application', async () => {
      // Wait for username and password fields to be visible
      await this.usernameInput.waitFor({ state: 'visible', timeout: 10000 });
      await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
      // Fill in credentials
      await ActionUtils.fill(this.usernameInput, username);
      await ActionUtils.fill(this.passwordInput, password);
      // Click the login button
      await ActionUtils.click(this.loginButton);
      // Optionally, wait for navigation or dashboard element
      await this.page.waitForLoadState('networkidle', { timeout: 20000 });
    });
  }

  /**
   * Convenience method to login with a username, retrieving the password from test data or ENV.
   * @param username The username to login with
   */
  async loginWithUserName(username: string): Promise<void> {
    await test.step(`Login with username: ${username}`, async () => {
      let password: string | undefined = undefined;
      // Try ENV first
      if (ENV && ENV.TEST_USERS && ENV.TEST_USERS[username]) {
        password = ENV.TEST_USERS[username].password;
      }
      // Try test data utils if ENV did not provide
      if (!password) {
        try {
          const testData = await TestDataUtils.getTestDataByEnvironment(ENV.ENVIRONMENT || 'Staging', 'access-site-feasibility-and-registration-form-data.json');
          // Find matching test case for the username
          const userCase = Array.isArray(testData)
            ? testData.find((tc: any) => tc.preconditions && tc.preconditions.userName === username)
            : undefined;
          password = userCase?.preconditions?.password;
        } catch (err) {
          // Ignore and fallback
        }
      }
      // Fallback to ENV.LOGIN_PASSWORD if still not found
      if (!password && ENV.LOGIN_PASSWORD) {
        password = ENV.LOGIN_PASSWORD;
      }
      if (!password) {
        throw new Error(`Password for username '${username}' not found in ENV or test data.`);
      }
      await this.login(username, password);
    });
  }
}
