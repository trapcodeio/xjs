const xAuthController = $.engine('backend/controllers/AuthController', true);

class AuthController extends xAuthController {

    static middleware() {
        return {
            'auth': 'dashboard',
            'auth.guest': ['index', 'login', 'register'],
        }
    }

}

module.exports = AuthController;