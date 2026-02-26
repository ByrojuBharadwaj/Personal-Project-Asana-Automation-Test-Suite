<<<<<<< HEAD
# QA-Automation-Engineer-Loop-Software-Testing-Services
Loop Technical Evaluation
=======
# Asana Automation Test Suite

A data-driven Playwright test suite in TypeScript for testing an Asana-like demo application.

## Project Structure

```
asana-automation-test/
├── tests/
│   ├── data/
│   │   └── testData.json      # Test data (credentials & test cases)
│   ├── pages/
│   │   ├── LoginPage.ts       # Login Page Object Model
│   │   └── DashboardPage.ts   # Dashboard Page Object Model
│   └── asana.spec.ts          # Main test specification file
├── playwright.config.ts        # Playwright configuration
├── package.json               # Project dependencies
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## Key Features

- **Data-Driven Testing**: All test cases are defined in a JSON file. Adding new tests requires only data changes.
- **Page Object Model (POM)**: Separates page interactions from test logic for better maintainability.
- **Robust Locators**: Uses `getByRole`, `getByText`, and filtered locators to ensure reliability.
- **Efficient Login**: Uses `beforeEach` hook to handle authentication once per test.

## Test Cases

| ID | Project | Task | Column | Tags |
|----|---------|------|--------|------|
| 1 | Web Application | Implement user authentication | To Do | Feature, High Priority |
| 2 | Web Application | Fix navigation bug | To Do | Bug |
| 3 | Web Application | Design system updates | In Progress | Design |
| 4 | Mobile Application | Push notification system | To Do | Feature |
| 5 | Mobile Application | Offline mode | In Progress | Feature, High Priority |
| 6 | Mobile Application | App icon design | Done | Design |

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd asana-automation-test
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Run all tests (headless)
```bash
npm test
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests in Chromium only
```bash
npm run test:chromium
```

### Run tests in Chromium with browser visible
```bash
npm run test:chromium:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### View test report
```bash
npm run report
```

## Adding New Test Cases

To add a new test case, simply add an entry to `tests/data/testData.json`:

```json
{
  "id": 7,
  "project": "New Project",
  "task": "New Task Name",
  "column": "To Do",
  "tags": ["Tag1", "Tag2"]
}
```

No code changes required! The test will be automatically generated.

## Design Decisions

### Why Data-Driven?
- **Scalability**: Adding new tests requires zero code changes
- **Maintainability**: Test logic is centralized in one place
- **Readability**: Non-technical team members can add test cases

### Why Page Object Model?
- **Separation of Concerns**: Page interactions are separate from test assertions
- **Reusability**: Page objects can be used across multiple test files
- **Maintainability**: UI changes require updates in only one place

### Why beforeEach for Login?
- **DRY Principle**: Login logic is written once
- **Test Isolation**: Each test starts with a fresh authenticated session
- **Performance**: Avoids redundant navigation and form filling code

## Locator Strategy

The suite uses a hierarchical locator strategy:

1. **Column Identification**: Find the column section by its heading
2. **Task Card Filtering**: Filter task cards within the specific column
3. **Tag Verification**: Locate tags within the filtered task card

This approach prevents false positives by ensuring tasks are found in the correct context.

## Troubleshooting

### Tests failing due to timeouts?
- Increase timeout in `playwright.config.ts`
- Check if the application is accessible

### Locators not finding elements?
- Run in debug mode: `npm run test:debug`
- Use Playwright's codegen: `npx playwright codegen <url>`

## License

ISC
>>>>>>> 9a1a010 (Initial commit:Loop Technical Evaluation Submission)
