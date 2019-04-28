const {resolve} = require('path');

module.exports = {
    // Use Middlewares
    middlewares: {
        'Auth': $.backendPath('/middle/AuthMiddleware'),
        // 'Formidable': '//xjs-formidable-middleware'
    }
};