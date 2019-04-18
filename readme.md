#### Xjs Framework (Beta)
###### Still in production

A powerful framework for nodejs, Using `expressjs` as a server and also other community proven worthy libraries.


### What you get
1. Complete MVC structure
2. User Authentication
3. Nested Routing
4. Named Routes
5. A tinker (beta)
6. Webpack ready using `laravel-mix`
7. All database supported by `KnexJs` e.g **Postgres**, **MSSQL**, **MySQL**, **MariaDB**, **SQLite3**, **Oracle**, and **Amazon Redshift**
8. Custom console commands
9. _So much more!!!_

### Installation
Installing Xjs Framework for now you have to use these steps.
In future we will create a better way.

Note: For this docs we will be using **yarn**, you can also use npm.

#### Step One
Make your project folder e.g **xjs-app**
1. Cd into **xjs-app**
2. Run `yarn init`
3. Run `yarn add @trapcode/xjs`

Now you have **Xjs** in your project.
lets get xjs to reveal all the files we need.

Create a file named `install.js` or any name at all.
Then put the following codes in it.
```javascript
const installXjs = require('@trapcode/xjs/install');

// Run Installation
installXjs(__filename);
```

You see this in your console.
```
===> Started Installation!
===> Moving files to /your/path/to/xjs-app
===> Installation Finished!
```


##### YAAAYYYY!!!!!
You now have **Xjs** installed.

#### What Next?
Rename `env.example` to `.env`


You need to install `knexJs` needed for database migrations
```
npm install knex -g
```

Open your console and run database migration
```
knex migrate:latest
```

You should see

```
Using environment: development
Batch 1 run: 1 migrations 
20190208064039_create_user_table.js
```

That's all! We are now ready to start our app with
```
node server.js

// Or using Nodemon

nodemon server.js
```

#### Hurray!
```
===>  Starting Xjs...
===>  Server started and available on http://localhost:2000/
===>  PORT:2000
```

You get a login and register function on default.

### CLI Commands.
Yes we support cli-commands to make things easy for you.

#### Make Controller
```console
node xjs make:controller {name}
```

#### Make Model
```console
node xjs make:model {name} {tableName?}
```

### Make View
```console
node xjs make:view {path}
```

### Make Job
```console
node xjs make:job {path} {callCommand?}
```


This is all we have for now..

### XJS STATUS
Used in over 15 projects and works perfectly fine.

If you use xjs, please let us know how you found it.