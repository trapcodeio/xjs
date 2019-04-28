const Auth = $.use.middleware('Auth');
/**
 * UploadController
 * @class
 * @extends $.controller
 */
class UploadController extends $.controller {

    /**
     * middleware - Set Middleware
     * @returns {Object}
     */
    static middleware() {
        return {}
    }


    getUpload(x) {
        return x.renderViewFromEngine('upload')
    }

    postUpload(x) {

        // x.file('image');
        return x.toApi({foo: x.req.files});
    }
}


module.exports = UploadController;