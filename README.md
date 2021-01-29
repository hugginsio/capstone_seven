# Introduction

This project was bootstrapped with [@maximegris/angular-electron](https://github.com/maximegris/angular-electron).

## Getting Started

Clone this repository:
``` text
git clone https://github.com/kjhx/capstone_seven.git
```

Ensure that you have Node v14.15.1 installed:
```text
node --version
```

Install dependencies with `npm` (there's an issue with `yarn`, use `npm` instead):
``` text
npm install
```

If you want to generate Angular components with Angular-cli , you must install `@angular/cli` globally:
``` text
npm install -g @angular/cli
```

Run the application to ensure your system is properly configured:
``` text
npm run desktop
```

# Development

## Commands
|Command|Description|
|--|--|
|`npm run web`| Run the app in the browser |
|`npm run desktop`| Run the app in Electron with hot reloading |
|`npm run lint`| Runs the code linter |
|`npm run test`| Runs unit tests |
|`npm run test:watch`| Runs unit tests and watches for changes |
|`npm run e2e`| Runs end to end tests (we probably won't use this) |
|`npm run electron:build`| Builds an packages app into single executable |

## Documentation

* [Angular](https://angular.io/api)
* [Angular CLI](https://angular.io/cli)
* [TypeScript](https://www.typescriptlang.org/docs/handbook/intro.html)
* [Electron](https://www.electronjs.org/docs)
* [Jasmine & Karma (testing)](https://jasmine.github.io/api/3.6/global)
* [ESLint (linting)](https://eslint.org/docs/rules/)
* [TailwindCSS (styling)](https://tailwindcss.com/docs)

## Project Structure Overview
```text
.
├── angular.json (Angular configuration)
├── e2e (end-to-end test data)
├── electron (electron launcher)
├── src
│   ├── app
│   │   ├── core (essential application services)
│   │   ├── pages (each view in the application)
│   │   │   ├── game (the game itself)
│   │   │   └── landing (the homepage)
│   │   └── shared
│   │       ├── components (shared components)
│   │       ├── directives (shared directives)
│   │       └── services (shared services)
│   ├── assets (icons, fonts, etc.)
│   ├── environments (modifies value if running in DEV or PROD mode)
│   ├── karma.conf.js (test runner configuration)
│   └── styles.scss (global stylesheet)
├── tailwind.config.js (TailwindCSS configuration)
└── tsconfig.json (TypeScript configuration)
```

## Component Structure Overview
Each component in the application follows this structure. For example, the pages `landing` and `game` are components, and are both organized in this fashion. It's best practice to place a service with it's component if it is only used by that component.
```text
.
├── interfaces
│   └── component.interface.ts (typescript interfaces)
├── services
│   ├── component.service.spec.ts (service test file)
│   └── component.service.ts (the service itself)
├── component-routing.module.ts (declares the module's routes)
├── component.component.html (the user interface)
├── component.component.scss (the styling, if required)
├── component.component.spec.ts (the component tests)
├── component.component.ts (the component itself)
└── component.module.ts (declares the module)
```

# Contributing

## Creating a Work Item

1. Navigate to our repository and click on the **Issues** tab.
2. Click the button titled **New issue**
3. Select which type of work item you are creating. There are two types:
    - Defect Report: Report a problem to help us improve
    - User Story: Suggest a new feature or enhancement
4. Click **Get started** on the appropriate template
5. Click **Projects** and select **Current Work Items**

For a User Story, make sure to fill out the **Description** and **Acceptance Criteria**. For a Defect Report, make sure to describe how to recreate the problem and the expected behavior.

If the work item needs more information before it can be worked on, add the **needs attention** label. If the work item can't be worked on because something else has to be finished first, add the **blocked** label.

## Taking a Work Item
1. Navigate to a work item with the **approved** label
2. Under **Assignees**, click **assign yourself**.
3. Under **Projects**, click the dropdown and move the work item to the **In Development**
4. Start your work! Check off items in **Acceptance Criteria** as you complete them so we can understand the progress being made on this work item.

## Opening a Pull Request
1. Navigate to the **Pull Requests** tab
2. Select **New pull request**
3. Describe the changes made by your PR in the **Description**
4. Under **Reviewers**, request a code review from two teammates
5. Click **Projects** and select **Current Work Items**
6. Create the pull request
7. Click **Linked Issues** and select the work item associated with this PR

## Projects
You can get an overview of the current state of the project by navigating to our repository, clicking on **Projects**, and selecting **Current Work Items**. This will show you the kanban board that organizes all work items and pull requests into several categories: **New**, **In Development**, **In QA**, **Done**, and **Abandoned**.