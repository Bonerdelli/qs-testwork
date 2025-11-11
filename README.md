# Tree Editor

Test work implementation for QS \
See task description in the TASK.md (in Russian)

### Features

* React-based frontend application
  * Written in TypeScript
  * Uses Ant Design as UI framework
  * Redux-based state management using easy-peasy library
  * Well-structured components
  * Separated API layer
    
* Sample backend application based on Express. Written in plain JS
  * Uses SQLite database with sample data
  * Transactional bulk-update of edited nodes

### Notes on constraints

* No localization support
* Only one level of newly added nodes is allowed
* Based on `react-scripts`, but in a serious project we should prefer custom configured builder
* Styled components, LESS or any other style preprocessor aren't used

Simple adjacency list is used for tree handling.
That's not optimal, especially for querying tree branches. I plan to replace it with the Nested Sets, see a `tryouts/ns-tree` branch for a very draft implementation

### Start the project

Just run `npm install && npm start` from a project root \
This command will install dependencies and then start both client and server applications
To start them separately, run `npm run start:client` and `npm run start:server` commands in separate terminals

### Available commands

* `npm start` - Starts both client and server applications concurrently
* `npm run build` - Builds the production-ready application
* `npm test` - Runs tests in watch mode
* `npm run ts-check` - Performs TypeScript type checking without emitting files
* `npm run lint` - Checks code for linting errors
* `npm run prettier` - Checks code formatting
