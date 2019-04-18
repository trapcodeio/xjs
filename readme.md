#### Xjs Framework (Beta)
###### Still in production

No Docs Yet!

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
You need to install a few things.

1. Install `knexJs` needed for database migrations 
2. `npm install knex -g`
3. Install `dotenv` needed to read your .env files.
4. `yarn add dotenv`


Now you need to do a few things.
1. rename `env.example` to `.env`
2. Please fill in a valid database, for now we need database to load up.


