// src/pages/registration-form.page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class RegistrationFormPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async fillSiteName(siteName: string) {
    await this.page.fill('[data-testid="site-name-input"]', siteName);
  }

  async fillSiteAddress(address: string) {
    await this.page.fill('[data-testid="site-address-input"]', address);
  }

  async selectSiteType(siteType: string) {
    await this.page.selectOption('[data-testid="site-type-select"]', siteType);
  }

  async fillContactEmail(email: string) {
    await this.page.fill('[data-testid="contact-email-input"]', email);
  }

  async fillContactPhone(phone: string) {
    await this.page.fill('[data-testid="contact-phone-input"]', phone);
  }

  async fillAdditionalField(fieldTestId: string, value: string) {
    await this.page.fill(`[data-testid="${fieldTestId}"]`, value);
  }

  async submitForm() {
    await this.page.click('[data-testid="registration-submit-btn"]');
  }

  async getSubmissionSuccessMessage() {
    return this.page.textContent('[data-testid="registration-success-message"]');
  }

  async getAssignedSiteId() {
    return this.page.textContent('[data-testid="assigned-site-id"]');
  }
}
