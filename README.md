# Custom Rule Engine

## Overview

The **Custom Rule Engine** is a powerful, flexible, and extensible rule evaluation system built in **Node.js**. It allows users to define rules with multiple conditions and apply them to datasets. The engine supports both **AND** and **OR** logic for evaluating conditions and can handle complex rule evaluations for real-world applications.

### Key Features:
- Define rules with multiple conditions.
- Support for **AND** / **OR** logic between conditions.
- Evaluate multiple objects against multiple rules efficiently.
- Easily extendable to support additional operators or complex conditions.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Directory Structure](#directory-structure)
- [File Descriptions](#file-descriptions)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Installation

To get started with the project, clone this repository to your local machine and install the necessary dependencies.

```bash
# Clone the repository
git clone https://github.com/mbishnoi29786/custom-rule-engine.git

# Navigate to the project directory
cd custom-rule-engine

# Install dependencies

# Install Express
npm install express

# Install Mongoose
npm install mongoose

# Install dotenv
npm install dotenv

# Install Jest (for testing)
npm install jest

```

# Usage 
``` text
This rule engine can be used to evaluate objects against defined rules. Below is an example of how to use the core functionality in your project.
```

``` javascript
const { evaluateObjectsAgainstRules } = require('./services/ruleEvaluator');

const objects = [
    { name: 'Alice', age: 25, score: 85 },
    { name: 'Bob', age: 19, score: 65 }
];

const rules = [
    {
        ruleName: 'Age Check',
        conditions: [{ field: 'age', operator: '>=', value: 20 }],
        logic: 'AND'
    },
    {
        ruleName: 'Score Check',
        conditions: [{ field: 'score', operator: '>', value: 80 }],
        logic: 'AND'
    }
];

const result = evaluateObjectsAgainstRules(objects, rules);
console.log(result);

```


# Directory Structure
``` bash
/custom-rule-engine
├── /configure
│   └── db.js                  # MongoDB connection setup
├── /middleware
│   ├── errorHandler.js         # Global error handling middleware
│   ├── validateId.js           # Middleware to validate ObjectID format
│   └── validateRequestBody.js  # Middleware for validating request body
├── /models
│   ├── DataObject.js           # Schema for data objects
│   └── Rule.js                 # Schema for rules and conditions
├── /routes
│   ├── objectRoutes.js         # Routes to handle objects
│   └── rules.js                # Routes to handle rules and evaluations
├── /services
│   └── ruleEvaluator.js        # Functions to evaluate conditions and rules
├── /tests
│   ├── ruleEvaluator.test.js   # Unit tests for rule evaluation functions
│   └── db.test.js              # Unit tests for database connection
├── app.js                      # Main application entry point
├── .env                        # Environment variables (e.g., MongoDB URI)
└── package.json                # Node.js dependencies and scripts

```

# File Descriptions
``` bash
1. Configure Folder
db.js: Configures the connection to MongoDB using Mongoose, establishing the connection string from the environment variable.
2. Middleware Folder
errorHandler.js: A global error-handling middleware that catches all errors and sends a formatted response to the client.
validateId.js: Middleware that validates if the provided MongoDB ObjectID in the request is in a valid format.
validateRequestBody.js: Middleware that validates the request body based on predefined schemas, ensuring data integrity.
3. Models Folder
DataObject.js: Defines the schema for data objects, including fields like name, age, score, and timestamps for creation and updates.
Rule.js: Defines the schema for rules, including conditions (field, operator, value) and evaluation logic (AND / OR).
4. Routes Folder
objectRoutes.js: Contains routes to create and read data objects from the database.
rules.js: Routes to create, read, update, delete, and evaluate rules.
5. Services Folder
ruleEvaluator.js: Contains the core functions:
evaluateCondition: Evaluates individual conditions against an object.
evaluateRule: Evaluates an entire rule by checking conditions against an object.
evaluateObjectsAgainstRules: Applies multiple rules to a list of objects and returns the evaluation results.
6. Tests Folder
ruleEvaluator.test.js: Unit tests for the ruleEvaluator.js functions, ensuring conditions and rules are evaluated correctly.
db.test.js: Tests for verifying MongoDB connection functionality.
7. Root Files
app.js: The entry point for the application, where the server is set up, routes are integrated, and middleware is applied.
.env: Stores environment variables such as the MongoDB URI and the server port.
package.json: Lists dependencies and scripts for the project, including the npm test command to run tests using Jest.

```

# Testing
``` text
To run the tests for the project, use the following command:
```
``` bash
# To run all tests
npm test
```

``` text
This will execute the unit tests and provide output on which tests passed and which failed. The project uses Jest as the testing framework.

The tests currently cover:

Condition Evaluation: Verifying that conditions are correctly evaluated against objects.
Rule Evaluation: Ensuring that rules with multiple conditions (AND/OR logic) are processed correctly.
Object Evaluation: Testing that multiple objects are evaluated against multiple rules.
```

# Contributing
``` text
Contributions are welcome! If you would like to improve the project, feel free to fork the repository, create a branch, and submit a pull request. Make sure to follow these guidelines:

Ensure that your code follows the existing style and conventions.
Write tests for new features or bug fixes.
Update documentation as necessary.
```

# License
``` bash
This project is licensed under the MIT License - see the LICENSE file for details.
```
# Notes
``` text
Feel free to expand upon this engine by adding more operators, customizing error handling, or even creating a user interface for rule creation and evaluation. The project is designed to be flexible and scalable, allowing easy additions and enhancements.
```

