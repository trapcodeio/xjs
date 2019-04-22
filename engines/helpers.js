let {buildUrl} = $.pkgs;

/* HELPER FUNCTIONS */
let helpers = {
    /**
     * Get full url of path
     * @param {string} $path
     * @param {object} $query
     */
    url($path = '', $query = {}) {
        let url = '';
        let server = $.config.server;

        if ($path.substr(0, 1) === '/') $path = $path.substr(1);

        if (server.baseUrl.length) {
            url = server.baseUrl + $path;
        } else {
            let d = server.domain;
            let p = server.protocol;

            if (server.includePortInUrl && (server.port !== 80 && server.port !== 443)) {
                d = d + ':' + server.port;
            }

            if ($.myConfig.get('server.ssl.enabled', false)) {
                p = 'https'
            }

            url = p + '://' + d + server.root + $path;
        }

        if (Object.keys($query).length) {
            url = buildUrl(url, {
                queryParams: $query
            });
        }

        return url;
    },

    /**
     * Get url of route.
     * @param {string} $route
     * @param {array|string} $keys
     * @param {Object|boolean} $query
     * @param {boolean} $includeUrl
     */
    route($route, $keys = [], $query = {}, $includeUrl = true) {

        if (typeof $query === "boolean") {
            $includeUrl = $query;
            $query = {};
        }

        if (!Array.isArray($keys)) {
            $keys = [$keys];
        }

        let routes = $.router.nameToPath();
        if (typeof routes[$route] !== 'undefined') {
            let path = routes[$route];
            if (path.substr(-1) === '*' && !$keys.length) {
                return path.substr(0, path.length - 1)
            }
            let hasRegex = path.match(new RegExp('[|&;$%@"<>()+:,*]'));
            if (Array.isArray(hasRegex) && hasRegex.length) {
                // find * and :keys
                let findKeys = new RegExp('[*]|(:[a-zA-Z]+)', 'g');
                let HasKeys = path.match(findKeys);

                if (Array.isArray(HasKeys) && HasKeys.length) {
                    let counter = 0;
                    let replacer = (...args) => {
                        if (args[0] === '*' && !$keys.length) {
                            counter++;
                            return '*';
                        }

                        let key = $keys[counter] || (args[0] === '*' ? '*' : '_??_');
                        counter++;
                        return key;
                    };

                    path = path.replace(findKeys, replacer);
                }
            }
            return $includeUrl ? this.url(path, $query) : path;
        }
        return $includeUrl ? this.url($route, $query) : $route;
    },

    /**
     * Get Config
     * @param {string} $config - Config key
     * @param {*} $default - Default return value if config is not found.
     */
    config($config, $default = undefined) {
        return _.get($.config, $config, $default);
    },

    /**
     * Laravel Mix Helper
     * @param {string} file - Public path to file.
     */
    mix(file) {
        let mix;
        let localVariableName = 'laravelMixManifest';
        if (file.substr(0, 1) === '/') file = file.substr(1);
        file = '/public/' + file;

        if ($.engineData.has(localVariableName)) {
            mix = $.engineData.get(localVariableName);
        } else {
            const mixFile = $.basePath('mix-manifest.json');
            const fs = require('fs');
            if (fs.existsSync(mixFile)) {
                let manifestJson = fs.readFileSync(mixFile).toString();
                let manifest = {};
                try {
                    manifest = JSON.parse(manifestJson);
                } catch (e) {
                }

                $.engineData.set(localVariableName, manifest);
                mix = manifest;
            }
        }


        if (typeof mix[file] !== "undefined") {
            file = mix[file];
        }

        if (file.substr(0, 8) === '/public/') {
            file = file.substr(8);
        }

        file = this.url(file);

        return file;
    },

    env: $.env,

    /**
     * Random string generator
     * @param {number} length - length of string.
     */
    randomStr(length = 10) {
        let i, possible, text;
        text = '';
        possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        i = 0;
        while (i < length) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
            i++;
        }
        return text;
    },

    now() {
        return moment().format($.config.date.format);
    },

    today() {
        return this.now();
    }
};

module.exports = helpers;