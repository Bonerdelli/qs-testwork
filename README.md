# Tree Editor

Test work implementation for QS \
See task description in the TASK.md (in russian)

### Features

* React-based frontend application
  * Written in TypeScript
  * Uses Ant Design as UI framework
  * Redux-based state management using easy-peasy library
  * Strong component structure
  * Separated API layer
    
* Sample backend application based on Express. Written in plain JS
  * Uses SQLite database filled with sample data
  * Transactional bulk-update of edited nodes

### Notes of constraints

* No localization support
* Zero tests coverage
* No mobile layout support
* Only one level of newly added nodes are allowed
* Based on `react-create-app`, but in a serious project we should prefer customly configured builder
* LESS or any other style preprocessor aren't used, because styles is not complex
* Styled components aren't used, because of antd framework

Simple adjacency list are used for tree handling.
That's not optimal, especially for querying tree branches. I suppose to replace it with the Nested Sets, see a `tryouts/ns-tree` branch for a very draft implementation

### Start the project

Just run `yarn && yarn start` from a project root \
This command will install dependencies and then starts both cliend and server applications
To start its separately, run `yarn run start:client` and `yarn run start:server` commands in separate terminals
