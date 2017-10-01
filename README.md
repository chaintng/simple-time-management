# Simple Time Management

## How to run
1. `git clone` project.
2. `cp .env-example .env`
3. Correct `.env` file for database configuration
4. `$ npm install -g knex`
5. `$ knex migrate:latest`
6. `$ knex seed:run`
7. `npm start`
8. You can now access the website via http://localhost:3000