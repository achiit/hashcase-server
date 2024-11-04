# HashCase Server

## Description

Hash Case Server is a fundamental backend infrastructure designed to support web applications with efficiency and reliability. It offers a set of APIs intended for utilization by both the primary Hash Case platform and external developer integrations.

## Getting Started

### Prerequisites

- **Bun**: Since Bun is used as the runtime, ensure you have [Bun installed](https://bun.sh/) on your machine.

### Database Setup

This project employs Sequelize for ORM with a MySQL database. To align your local development and testing environments with the project's configuration, please ensure the following steps are completed:

1. **MySQL Installation**: Confirm MySQL is installed and running on your machine. If not, download and install it from the [official MySQL website](https://dev.mysql.com/downloads/mysql/).

2. **Database Configuration**: The project's database connection settings are specified in the `src/config/config.json` file. This file contains configurations for different environments. Here's an excerpt for reference:

   ```json
   {
     "development": {
       "username": "root",
       "password": "password",
       "database": "hashcase_db_dev",
       "host": "127.0.0.1",
       "dialect": "mysql",
       "logging": false
     },
     "test": {
       "username": "root",
       "password": "password",
       "database": "hashcase_db_test",
       "host": "127.0.0.1",
       "dialect": "mysql",
       "logging": false
     }
   }
   ```

3. **Creating the Databases**: Before running the application, you need to manually create the corresponding databases in MySQL. Use your preferred MySQL interface (e.g., MySQL Workbench, phpMyAdmin, or the command line) to create two databases named `hashcase_db_dev` and `hashcase_db_test` as specified in the `config.json`.

   In MySQL Workbench or a similar tool, execute the following SQL commands to create the databases:

   ```sql
   CREATE DATABASE hashcase_db_dev;
   CREATE DATABASE hashcase_db_test;
   ```

This setup ensures that your development and testing environments are correctly configured to match the project's expectations, allowing for smooth operation and development.

### Essential VS Code Extensions

Please install the following VS Code extensions for maintain consistency with the project's coding standards and ensuring a seamless integration into development process:

- ESLint (`dbaeumer.vscode-eslint`) for linting.
- Prettier (`esbenp.prettier-vscode`) for code formatting.
- Better Comments (`aaron-bond.better-comments`) to enhance code commenting.

### VS Code Settings

To ensure consistency in formatting and linting, include the following settings in your `settings.json` for VS Code:

```json
{
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll": "always",
    "source.fixAll.eslint": "always"
  },
  "eslint.validate": ["javascript", "typescript"],
  "eslint.alwaysShowStatus": true
}
```

### Installation

Clone the repository and install dependencies with Bun:

```bash
git clone https://github.com/incepthink/hashcase-server.git
cd hashcase-server
bun install
```

### Running the Application

Start the server in development mode:

```bash
bun run dev
```

For linting and identifying issues:

```bash
bun run lint
```

To automatically fix linting issues:

```bash
bun run lint:fix
```

### Testing

Execute tests with:

```bash
bun run test
```

For a comprehensive test suite with coverage:

```bash
bun run full-test
```

### Generating Documentation

Generate project documentation:

```bash
bun run generate-docs
```

## Built With

- [Bun](https://bun.sh/) - Used as the JavaScript runtime and for dependency management, offering a modern alternative with speed and efficiency.
- [Express](https://expressjs.com/) - The web framework for handling HTTP requests, simplifying the server creation and routing processes.
- [TypeScript](https://www.typescriptlang.org/) - Employed for its static typing features, enhancing code quality and maintainability.
- [Sequelize](https://sequelize.org/) - The ORM used for managing database actions with ease and efficiency, supporting a variety of SQL dialects.
- [Zod](https://github.com/colinhacks/zod) - Utilized for schema validation to enforce type safety at runtime, ensuring data integrity throughout the application.
- [Ethers.js](https://docs.ethers.io/v6/) - Integrated for interacting with the Ethereum blockchain, enabling secure and straightforward smart contract interactions.
- [Supertest](https://www.npmjs.com/package/supertest) - Applied for testing HTTP requests, ensuring the reliability and performance of the Express server endpoints.

## Authors

- Manan Shah - _Initial work_ - [View on Github](https://github.com/manan-m-shah)
