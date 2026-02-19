import { Page, Locator, test, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { ActionUtils } from '../utils/action-utils';
import { ENV } from '../config/env';

export class LoginPage extends BasePage {
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;
  private readonly loginBtn: Locator;
  private readonly loadingIcon: Locator;
  private readonly acrLoginBtn: Locator;
  private readonly acrUsernameField: Locator;
  private readonly acrPasswordField: Locator;
  private readonly acrSubmitBtn: Locator;
  private readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    // Main login page selectors
    this.usernameField = page.locator('input[name="username"]');
    this.passwordField = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.loginBtn = page.getByRole('button', { name: 'Log In' });
    this.loadingIcon = page.locator('overlay-loader').getByText('Loading Data Dashboard');
    // ACR login selectors (for SSO/ACR login flow)
    this.acrLoginBtn = page.getByRole('button', { name: /ACR Login|Log In with ACR|Sign in with ACR/i });
    this.acrUsernameField = page.locator('input[name="UserName"], input#UserName, input[type="text"][id*="UserName"]');
    this.acrPasswordField = page.locator('input[name="Password"], input#Password, input[type="password"][id*="Password"]');
    this.acrSubmitBtn = page.getByRole('button', { name: /Sign In|Log In|Login|Submit/i });
    // A generic logout button for login success check
    this.logoutButton = page.getByRole('button', { name: /Logout|Sign Out/i });
  }

  async goto(urlOrBasePath: string): Promise<void> {
    await test.step('Launch the application', async () => {
      const url = urlOrBasePath || ENV.BASE_URL;
      await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    });
  }

  /**
   * Robust login method that handles both standard and ACR SSO login flows.
   * @param urlOrBasePath Optional URL or base path to navigate to before login.
   * @param username Username for login
   * @param password Password for login
   */
  async login(urlOrBasePath: string | undefined, username: string, password: string): Promise<void> {
    await test.step('Login to Application (robust, ACR-aware)', async () => {
      if (urlOrBasePath) {
        await this.goto(urlOrBasePath);
      }
      // Wait for login page to be ready
      await Promise.race([
        this.loginButton.waitFor({ state: 'visible', timeout: 15000 }),
        this.acrLoginBtn.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {})
      ]);
      // If ACR login button is present, use ACR flow
      if (await this.acrLoginBtn.isVisible().catch(() => false)) {
        await ActionUtils.click(this.acrLoginBtn);
        await this.acrUsernameField.waitFor({ state: 'visible', timeout: 15000 });
        await ActionUtils.fill(this.acrUsernameField, username);
        await ActionUtils.fill(this.acrPasswordField, password);
        await ActionUtils.click(this.acrSubmitBtn);
      } else {
        // Standard login flow
        await ActionUtils.click(this.loginButton);
        await this.usernameField.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.usernameField, username);
        await ActionUtils.click(this.loginBtn);
        await this.passwordField.waitFor({ state: 'visible' });
        await ActionUtils.fill(this.passwordField, password);
        await ActionUtils.click(this.loginBtn);
      }
      // Wait for loading to finish or dashboard to appear
      await this.page.waitForLoadState('networkidle', { timeout: 60000 });
      await this.loadingIcon.waitFor({ state: 'hidden', timeout: 60000 }).catch(() => {});
    });
  }

  /**
   * Login with only username (for flows that require username only, e.g., ACR SSO step 1)
   * @param username Username for login
   */
  async loginWithUserName(username: string): Promise<void> {
    await test.step('Login to Application (username only)', async () => {
      await this.loginButton.waitFor({ state: 'visible' });
      await ActionUtils.click(this.loginButton);
      await this.usernameField.waitFor({ state: 'visible' });
      await ActionUtils.fill(this.usernameField, username);
      await ActionUtils.click(this.loginBtn);
      await this.loadingIcon.waitFor({ state: 'hidden' }).catch(() => {});
    });
  }

  /**
   * Check if login was successful by verifying logout button or dashboard is visible.
   * @returns true if login successful, false otherwise
   */
  async isLoginSuccessful(): Promise<boolean> {
    // Wait for either logout button or dashboard main element
    try {
      await Promise.race([
        this.logoutButton.waitFor({ state: 'visible', timeout: 15000 }),
        this.page.locator('text=Dashboard').waitFor({ state: 'visible', timeout: 15000 }),
        this.page.locator('text=Registration Form').waitFor({ state: 'visible', timeout: 15000 })
      ]);
      return true;
    } catch {
      return false;
    }
  }
}
