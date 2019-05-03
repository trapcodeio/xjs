const DefaultTimestamp = 'YYYY-MM-DD H:mm:ss';

let serverConfig = {
    startOnBoot: true,
    port: 2000,
    protocol: 'http',
    domain: 'localhost',
    root: '/',
    includePortInUrl: true,
    baseUrl: '',
    ssl: {
        enabled: false,
        port: 443
    }
};


let xjsConfig = {
    name: 'Xjs',
    env: 'development',
    server: serverConfig,
    database: {
        startOnBoot: true,
        timestampFormat: DefaultTimestamp
    },
    date: {
        format: DefaultTimestamp
    },
    paths: {
        base: __dirname,
        // Should be relative to the base set above.
        // e.g base+'/'+backend should resolve to /full/path/base/backend
        backend: 'backend',
        frontend: 'frontend',
        public: 'public',
        storage: 'storage',
        xjs: 'xjs'
    },
    template: {
        use: false,
        engine: 'ejs',
        extension: 'ejs',
        // Relative to backend path
        viewsFolder: 'views',

        locals: {
            all: true,
            '__get': false,
            '__post': false,
            '__session': false,
            '__stackedScripts': false
        }
    },
    auth: {
        userModel: 'User',
        afterLoginRoute: 'dashboard',
        templateVariable: 'user',
        viewsFromEngine: true,
    },
    response: {
        cacheFiles: false,
        cacheFileExtensions: ['js', 'css'],
        cacheIfMatch: [],
        cacheMaxAge: 31536000,
        overrideServerName: true,
        serverName: 'Xjs',
    },
    backgroundMonitor: {
        start: "forever start {file}",
        stop: "forever stop {file}"
    },
    artisan: {
        singleModelName: true,
        pluralizeModelTable: true
    },
    session: {
        secret: '!xjsSecretKey!',
        cookie: {
            path: serverConfig.root,
            domain: serverConfig.domain,
            maxAge: 5000 * 60 * 24,
        },
        resave: true,
        saveUninitialized: true,
    },
    mail: {
        default: 'nodemailer',
        configs: {}
    }
};

module.exports = xjsConfig;