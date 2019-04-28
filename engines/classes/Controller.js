const multer = require('multer');
const fileStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './storage');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});

/**
 * Controller
 * @class
 */
class Controller {
    static get upload(){
        return multer({storage: fileStorage});
    }
}

Controller.prototype.request = null;

module.exports = Controller;