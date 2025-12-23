import { Page, Locator, test } from '@playwright/test';
import { BasePage } from './base.page';
import { ActionUtils } from '../utils/action-utils';
import { ENV } from '../config/env';

export class LoginPage extends BasePage {
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;
  private readonly loginBtn: Locator;
  private readonly loadingIcon: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameField = page.locator('input[name="username"]');
    this.passwordField = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.loginBtn = page.getByRole('button', { name: 'Log In' })
    this.loadingIcon = page.locator('overlay-loader').getByText('Loading Data Dashboard');

  }

  async goto(url: string): Promise<void> {
    await test.step('Launch the application', async () => {
      await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    });
  }

  async login(username: string, password: string): Promise<void> {
    await test.step('Login to Application', async () => {
      await ActionUtils.click(this.loginButton);
      await this.usernameField.waitFor({ state: 'visible' });;
      await ActionUtils.fill(this.usernameField, username);
      await ActionUtils.click(this.loginBtn);
      await this.passwordField.waitFor({ state: 'visible' });
      await ActionUtils.fill(this.passwordField, password);
      await ActionUtils.click(this.loginBtn);

      await this.loadingIcon.waitFor({ state: 'hidden' });
    });
  }

  
}