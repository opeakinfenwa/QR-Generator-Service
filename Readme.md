![MIT License](https://img.shields.io/badge/license-MIT-green)

# QR Code Generator Service

An extensible backend service built with **Express.js** and **PostgreSQL**, allowing users to generate, manage, and track QR codes. This system follows a clear separation of concerns using a project-based structure (services, controllers, repositories, configs), while leveraging **raw SQL** for performance and control.

> Redis-based caching is also integrated to reduce redundant QR generation, improving response times and overall system efficiency.

## Architecture Overview

The service follows a **modular yet pragmatic structure** for real-world backend development. It avoids strict Domain-Driven Design (DDD) but maintains logical separation through well-scoped directories:

## Modules

#### User Module

* Handles registration, authentication, and password reset using secure questions.
* Passwords are hashed with `bcrypt` before storage.
* Only authenticated users can access or manage their data.

#### Auth Module

* Token-based authentication using **JWT** stored via headers or secure cookies.
* Includes:

  * `isAuth` middleware for protected endpoints.
  * `isOptionalAuth` middleware for routes accessible to both guests and logged-in users.

#### QR Code Module

* Users (or guests) can generate QR codes for URLs or plain text.
* QR code data is stored in the database with optional user association.
* Tracks scan counts and allows user-specific history retrieval.
* Uses the `qrcode` npm package to produce base64-encoded PNGs.

## Database Strategy & Optimization (PostgreSQL & Redis)

#### Redis Caching (Integrated)

* Caching is performed per-user using a `qr:<userId>:<data>` key format.
* If a QR code already exists for the same user and data, it's served directly from Redis.
* On **scan** or **delete** operations, Redis cache is automatically invalidated to ensure consistency.
* Works conditionally: if a user is unauthenticated, caching is skipped to prevent collisions or ambiguity.

#### Dockerized Redis for Local Development
To ensure consistent behavior across environments, Redis is containerized using Docker. The application connects to a Redis container defined in docker-compose.yml, enabling local caching functionality without manual Redis installation. This setup mirrors production-like infrastructure and local testing.

#### Custom Migration System

A lightweight, handcrafted SQL migration runner designed for precise schema evolution:

* `migrations/up/` for forward SQL scripts
* `migrations/down/` for rollback scripts
* Tracks applied migrations using:

  * `migration.history.json` (local)
  * PostgreSQL `migrations` table (persistent)

```bash
npm run migrate      # Apply all new migrations
npm run rollback     # Roll back the most recent migration
```

#### Custom Seeder System

Also included is a manual but powerful seeding system:

* `seeders/sql/` contains data insertion scripts
* `seeders/undo/` holds rollback scripts to reverse the seeding
* `seed-runner.ts` tracks seeding history in a local file (`seed.history.json`)

```bash
npm run seed         # Applies all seeders from sql/
npm run seed:undo    # Rolls back the last applied seed
```

## Testing & Reliability

* TypeScript ensures strong typing across logic and controllers
* Repository pattern enables service/repo decoupling for testability
* Error handling is centralized and clearly categorized (e.g., NotFound, Unauthorized)
* Modular middlewares separate concerns (e.g., `isAuth`, error handling, input checks)

## Project Structure

```
src/
├── config/              # Redis and PostgreSQL config
├── controllers/         # Request handlers
├── services/            # Business logic layer
├── repositories/        # Database access logic (pg client)
├── routes/              # Express route definitions
├── middlewares/         # isAuth, error handling, logging
├── migrations/
│   ├── up/
│   ├── down/
│   └── migration-runner.ts
├── seeders/
│   ├── sql/             # Forward seed scripts
│   ├── undo/            # Rollback scripts
│   └── seed-runner.ts
```

## Technologies Used

* **Express.js** – RESTful API routing and middleware
* **PostgreSQL** – Primary relational database
* **Redis** – Caching layer for QR code optimization
* **Docker** – Used to containerize and run Redis locally in a consistent development environment
* **TypeScript** – Static typing for reliability
* **JWT** – Stateless authentication mechanism
* **bcrypt** – Password hashing
* **QRCode** – Dynamic QR generation (`qrcode` npm package)
* **pg** – PostgreSQL native driver for raw SQL execution

## Getting Started

### Prerequisites

* Node.js (v18+ recommended)
* PostgreSQL (v14+)
* Redis (v6+)

### Environment Configuration

Create a `.env` file:

```env
DATABASE_URL=postgres://user:pass@localhost:5432/qrdb
DATABASE_URL_TEST=postgres://user:pass@localhost:5432/test_qrdb
DATABASE_URL_PROD=postgres://user:pass@localhost:5432/prod_qrdb
JWT_SECRET=your_jwt_secret
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
NODE_ENV=development
```

### Run Instructions

```bash
npm install          # Install dependencies

npm run migrate      # Run migrations
npm run seed         # Populate development data

npm run dev    # Start the dev server with watch mode

npm run build  # Compile TypeScript to /dist for production
npm run start  # Run from compiled output
```

## Future Improvements

* Add Swagger or Postman documentation
* Add expiration support to Redis cache entries
* Rate limiting and monitoring

## Acknowledgements

This project was crafted as part of a real-world backend engineering exercise, demonstrating:

* Proficiency in modular Express architecture
* Practical use of raw SQL and PostgreSQL
* Cache optimization using Redis
* A custom, version-controlled approach to migrations and seeding

It reflects an emphasis on **clarity**, **extensibility**, and **production-readiness** without over-engineering.

## License

This project is licensed under the MIT License