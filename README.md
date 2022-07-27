# Authentication & Authorization REST API

## Features

1. Register a user
2. Verify user's email address
3. Send forgot password via email
4. Reset password
5. Get current user
6. Login
7. Logout
8. Access token
9. Refresh tokens
10. API Restriction (Authorization)
11. TDD
12. Swagger Docs (OpenAPI)
13. Performance Metrics

## Tech Stack Used

- [TypeScript](https://www.typescriptlang.org/) - Static-Type checking 
- [Express@5](https://expressjs.com/en/5x/api.html) - Web server
- [Typegoose](https://typegoose.github.io/typegoose/) - Mongoose wrapper for creating TypeScript interfaces and models
- [argon2](https://github.com/ranisalt/node-argon2#readme) - Password Hashing
- [Zod](https://github.com/colinhacks/zod) - Validation
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - Signing and Verifying JSON web tokens
- [Nodemailer](https://nodemailer.com/about/) - Sending Emails
- [Pino](https://github.com/pinojs/pino) - Logging
- [config](https://github.com/lorenwest/node-config) - Managing Configuration

## Tech Stack Used (For Testing)
- [jest](https://github.com/facebook/jest) - Testing framework
- [ts-jest](https://github.com/kulshekhar/ts-jest) - A Jest transformer with source map support that lets you use Jest to test projects written in TS.
- [MongoDB In-Memory Server](https://github.com/nodkz/mongodb-memory-server) - DB for mocking/testing that is isolated
- [Supertest](https://github.com/visionmedia/supertest) - provide a high-level abstraction for testing HTTP

## Tech Stack Used (For Documenting APIs)
- [swagger-js-doc](https://github.com/Surnet/swagger-jsdoc) - reads your JSDoc-annotated source code and generates an OpenAPI (Swagger) spec
- [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express) - auto-generate swagger-ui generated API docs from express

## Tech Stack Used (For Performance Metrics)
- [prom-client](https://github.com/siimon/prom-client) - Use to gather metrics
- [response-time](https://github.com/expressjs/response-time) - Middleware for express to gather response time for each request

## Tools Used

- [Postman](https://www.postman.com/downloads/)
- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/try/download/community)

## Structure

1. User API
    1. Create user
    2. Verify user
    3. Request reset password code
    4. Reset password
    5. Get current user
2. Authentication API
    1. Create user session
    2. Delete user session
    3. Get new access token with refresh tokens

## Generating Keys

- Generate new keys: [JSEncrypt](https://travistidwell.com/jsencrypt/demo/)
  - RSA 1024 bit
- Base64 encode the keys: [Base64Encode](https://www.base64encode.org/)
  - Private and Public Keys for Access and Refresh

## Access & Refresh Token Flow

```mermaid
graph TD
    A[Authorized Request]--> B{Is the access token valid?}
    B -->|NO| C(Return Unauthorized error)
    B -->|YES| D{Has the access token expired?}
    D -->|YES| E{Is a valid refresh token included?}
    D -->|NO| F["Process request (Go to route handler)"]
    E -->|YES| G(Issue a new access token)
    E -->|NO| C
```
