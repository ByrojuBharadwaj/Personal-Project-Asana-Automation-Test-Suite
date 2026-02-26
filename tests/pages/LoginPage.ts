import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Login Page.
 * Encapsulates all login-related interactions and locators.
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    // Using robust locators based on actual DOM structure
    // The login form has labeled textboxes "Username" and "Password"
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Sign in' });
    this.pageTitle = page.getByRole('heading', { name: 'Project Board Login', level: 1 });
    this.errorMessage = page.locator('.error-message');
  }

  /**
   * Navigate to the login page
   */
  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Perform login with provided credentials
   * @param username - The username/email to login with
   * @param password - The password to login with
   */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    // Wait for navigation to complete after login
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify that the login page is displayed
   */
  async verifyLoginPageDisplayed(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Verify login error is displayed
   */
  async verifyLoginError(): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
  }
}
