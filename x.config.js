require('dotenv').config();

module.exports = {
    name: 'Xjs',
    env: 'development',
    database: {
        startOnBoot: false
    },
    server: {
        port: process.env.APP_PORT,
        protocol: 'http',
        domain: process.env.APP_DOMAIN,
        root: '/',
        includePortInUrl: true,
    },
    paths: {
        base: __dirname,
        backend: 'backend',
        frontend: 'frontend',
        public: 'public',
    },
    session: {
        cookie: {
            path: '/',
            domain: process.env.APP_DOMAIN,
            maxAge: 5000 * 60 * 24,
        },
    },
    response: {
        cacheFiles: true,
    }
};