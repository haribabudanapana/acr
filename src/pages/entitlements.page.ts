import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { ActionUtils } from '../utils/action-utils';

export class EntitlementsPage extends BasePage {
  private readonly purchaseDateField: Locator;

  constructor(page: Page) {
    super(page);
    this.purchaseDateField = page.locator('text="Purchase Date"');
  }

  async verifyPurchaseDateFieldVisible(): Promise<void> {
    await ActionUtils.click(this.purchaseDateField);
  }
}