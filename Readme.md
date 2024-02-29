# Prisma ORM

## Install prisma 

Create a project directory and navigate into it:

```sh
mkdir hello-prisma
cd hello-prisma
```

initialize a TypeScript project using npm:

```sh
npm init -y
npm install typescript ts-node @types/node --save-dev
```

Initialize TypeScript:

```sh
npx tsc --init
```

Install the Prisma CLI as a development dependency in the project:

```sh
npm install prisma --save-dev
```

Set up Prisma with the init command of the Prisma CLI:

```sh
npx prisma init --datasource-provider postgresql
```

This is the lib which performs the connection and query to the DB

```sh
npm i @prisma/client
```

To Migrate the prisma to equivalent SQL queries

```sh
npx prisma migrate dev
```
After creating the migration, to use the functions for that particular migrations to be suggested by prisma. We have to generate prisma (@prisma/client)

```sh
npx prisma generate
```

In tsconfig.json, change the outDir field.
This will create the .js files in that directory
```sh
{
  "outDir":"./dist"
}
```

Run typescript command to compile the .ts to .js files
```sh
tsc
or 
tsc -b
```

Run the .js file in dist folder
```sh
node dist/index.js
```