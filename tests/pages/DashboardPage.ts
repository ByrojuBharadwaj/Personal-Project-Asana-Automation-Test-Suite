import { Page, Locator, expect } from '@playwright/test';

/**
 * Interface for test case data structure
 */
export interface TestCase {
  id: number;
  project: string;
  task: string;
  column: string;
  tags: string[];
}

/**
 * Page Object Model for the Dashboard Page.
 * Encapsulates all dashboard-related interactions and locators.
 * 
 * DOM Structure:
 * - Sidebar: navigation element with project buttons (heading level 2)
 * - Main area: contains columns with headings like "To Do (2)"
 * - Task cards: contain heading (level 3) for task name, paragraph for description
 * - Tags: generic elements containing tag text (Feature, Bug, Design, High Priority)
 */
export class DashboardPage {
  readonly page: Page;
  readonly projectSidebar: Locator;
  readonly mainContent: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Navigation sidebar contains project buttons
    this.projectSidebar = page.getByRole('navigation');
    // Main content area contains the task board
    this.mainContent = page.getByRole('main');
    // Logout button in the header
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  /**
   * Verify user is logged in and dashboard is displayed
   */
  async verifyDashboardDisplayed(): Promise<void> {
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
    // Verify the Projects heading is visible (indicates we're on dashboard)
    await expect(this.page.getByRole('heading', { name: 'Projects', level: 1 })).toBeVisible();
  }

  /**
   * Navigate to a specific project by clicking on it in the sidebar
   * @param projectName - The name of the project to navigate to
   */
  async navigateToProject(projectName: string): Promise<void> {
    // Project buttons in sidebar contain a heading with the project name
    // Using filter to find the button that contains the project name heading
    const projectButton = this.projectSidebar
      .getByRole('button')
      .filter({ has: this.page.getByRole('heading', { name: projectName, level: 2 }) });
    
    await projectButton.click();
    // Wait for the content to update
    await this.page.waitForLoadState('networkidle');
    // Verify the project heading is now shown in the main area
    await expect(this.page.getByRole('heading', { name: projectName, level: 1 })).toBeVisible();
  }

  /**
   * Get a specific column by its name
   * The column headings are formatted as "Column Name (count)" e.g., "To Do (2)"
   * @param columnName - The name of the column (e.g., "To Do", "In Progress", "Done")
   */
  getColumn(columnName: string): Locator {
    // Find the column container (generic element) that contains a heading with the column name
    // Using a regex to match "To Do (X)" format
    return this.mainContent
      .locator('> div > div')
      .filter({ 
        has: this.page.getByRole('heading', { name: new RegExp(`^${columnName}`, 'i'), level: 2 }) 
      });
  }

  /**
   * Get a task card by its name within a specific column
   * Task cards have a specific structure: bg-white card with h3 heading for task name
   * @param columnName - The name of the column
   * @param taskName - The name of the task
   */
  getTaskInColumn(columnName: string, taskName: string): Locator {
    const column = this.getColumn(columnName);
    // Target the specific task card element using its distinctive classes
    // Task cards use: bg-white p-4 rounded-lg shadow-sm border classes
    return column.locator('.bg-white.rounded-lg, [class*="bg-white"][class*="rounded"]').filter({ 
      has: this.page.getByRole('heading', { name: taskName, level: 3 }) 
    });
  }

  /**
   * Verify that a task exists in the specified column
   * @param taskName - The name of the task
   * @param columnName - The name of the column
   */
  async verifyTaskInColumn(taskName: string, columnName: string): Promise<void> {
    // First verify the column exists
    const column = this.getColumn(columnName);
    await expect(column).toBeVisible({ timeout: 10000 });
    
    // Then verify the task heading exists within that column
    const taskHeading = column.getByRole('heading', { name: taskName, level: 3 });
    await expect(taskHeading).toBeVisible({ timeout: 10000 });
  }

  /**
   * Verify that a task has specific tags
   * Tags appear as text within generic elements inside the task card
   * @param taskName - The name of the task
   * @param columnName - The column where the task is located
   * @param tags - Array of tag names to verify
   */
  async verifyTaskTags(taskName: string, columnName: string, tags: string[]): Promise<void> {
    const taskCard = this.getTaskInColumn(columnName, taskName);
    await expect(taskCard).toBeVisible({ timeout: 10000 });
    
    // Verify each tag is present on the task card
    for (const tag of tags) {
      // Tags are displayed as text within the task card
      // Using getByText with exact match to find the tag
      const tagElement = taskCard.getByText(tag, { exact: true });
      await expect(tagElement).toBeVisible({ timeout: 10000 });
    }
  }

  /**
   * Complete verification for a test case - checks project, task location, and tags
   * @param testCase - The test case data to verify
   */
  async verifyTestCase(testCase: TestCase): Promise<void> {
    // Navigate to the project
    await this.navigateToProject(testCase.project);
    
    // Verify task is in the correct column
    await this.verifyTaskInColumn(testCase.task, testCase.column);
    
    // Verify task has the correct tags
    await this.verifyTaskTags(testCase.task, testCase.column, testCase.tags);
  }
}
