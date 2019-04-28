let Base64 = {
    encode(str) {
        if (typeof str === 'object') {
            str = JSON.stringify(str);
        }

        return Buffer.from(str).toString('base64');
    },

    decode(str) {
        return Buffer.from(str, 'base64').toString('ascii');
    },

    decodeToJson(str) {
        str = Base64.decode(str);
        return JSON.parse(str);
    }
};

module.exports = Base64;