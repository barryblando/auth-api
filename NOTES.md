## Init package.json (I'm using pnpm)
pnpm init

## Init TypeScript
tsc --init

## Install dev dependencies
pnpm install typescript ts-node-dev @types/express @types/config pino-pretty @types/nodemailer @types/lodash @types/jsonwebtoken -D

## Install Express
pnpm install express@5

## Install dependencies
pnpm install mongoose @typegoose/typegoose config argon2 pino dayjs nanoid nodemailer lodash jsonwebtoken dotenv zod

## Running Mongo with Docker

```
docker run \
        -it \
        --rm \
        -p 27017:27017 \
        --name auth-api \
        -v data-vol:/data/db \
        mongo:latest
```
