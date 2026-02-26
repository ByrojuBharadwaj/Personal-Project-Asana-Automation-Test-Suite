import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage, TestCase } from './pages/DashboardPage';
import testData from './data/testData.json';

/**
 * Data-Driven Playwright Test Suite for Asana-like Demo Application
 * 
 * This test suite uses a JSON-based data-driven approach where all test scenarios
 * are defined in a single data structure. Adding new test cases only requires
 * adding a new entry to the testCases array - no new code needed!
 * 
 * Test Cases are dynamically generated using test.describe.forEach pattern
 */

// Extract test cases from JSON data
const testCases: TestCase[] = testData.testCases;
const credentials = testData.credentials;

test.describe('Asana Demo App - Task Verification Suite', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  /**
   * beforeEach Hook - Handles login before every test
   * 
   * This approach ensures:
   * 1. Each test starts with a fresh session
   * 2. Login logic is not duplicated in every test
   * 3. Tests remain independent and isolated
   */
  test.beforeEach(async ({ page }) => {
    // Initialize Page Objects
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    // Navigate to the application
    await loginPage.goto();

    // Perform login with credentials from test data
    await loginPage.login(credentials.email, credentials.password);

    // Verify successful login by checking dashboard is displayed
    await dashboardPage.verifyDashboardDisplayed();
  });

  /**
   * Data-Driven Test Generation
   * 
   * Using for...of loop to dynamically generate tests from the testCases array.
   * Each test case from the JSON data becomes a separate test.
   * 
   * Benefits:
   * - Scalable: Adding Test Case 7 only requires adding data, not code
   * - Maintainable: Test logic is centralized
   * - Readable: Test names clearly indicate what's being tested
   */
  for (const testCase of testCases) {
    test(`TC${testCase.id}: Verify "${testCase.task}" in "${testCase.project}" - Column: ${testCase.column}`, async ({ page }) => {
      // Re-initialize dashboard page for the current test context
      dashboardPage = new DashboardPage(page);

      // Step 1: Navigate to the specified project
      await test.step(`Navigate to project: ${testCase.project}`, async () => {
        await dashboardPage.navigateToProject(testCase.project);
      });

      // Step 2: Verify task is in the correct column
      await test.step(`Verify task "${testCase.task}" is in "${testCase.column}" column`, async () => {
        await dashboardPage.verifyTaskInColumn(testCase.task, testCase.column);
      });

      // Step 3: Verify task has the correct tags
      await test.step(`Verify task has tags: ${testCase.tags.join(', ')}`, async () => {
        await dashboardPage.verifyTaskTags(testCase.task, testCase.column, testCase.tags);
      });
    });
  }
});

/**
 * Additional test to verify login functionality works correctly
 */
test.describe('Login Functionality', () => {
  test('Should successfully login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);
    await dashboardPage.verifyDashboardDisplayed();
  });
});
