const User = $.backendPath($.config.auth.userModel, true);

class AuthController extends $.controller {

    static middleware() {
        return {
            'auth.logged': 'dashboard',
            'auth.guest': ['index', 'login', 'register'],
        }
    }

    index(x) {
        const data = {
            action: x.get("action", "login")
        };

        if ($.config.auth.viewsFromEngine) {
            return x.renderViewFromEngine('index', data, true);
        } else {
            return x.renderView('index', data);
        }
    }

    dashboard(x) {
        if ($.config.auth.viewsFromEngine) {
            return x.renderViewFromEngine('dashboard');
        } else {
            return x.renderView('dashboard');
        }
    }

    async login(x) {
        let email = x.get("login-email", "");
        let password = x.get("login-password", "");
        let errorMsg = "Incorrect email/password combination!";
        let logged = false;

        const user = await User.query()
            .where({email})
            .first();

        if (user === undefined) {
            x.with("login_error", errorMsg);
        } else {
            if ($.bcrypt.compareSync(password, user.password)) {
                logged = true;
                x.session.email = $.base64.encode(user.email);
                x.session.loginKey = $.base64.encode($.bcrypt.hashSync(user.email, 10));
                x.with("login", "Login successful. Welcome to your dashboard!");
            } else {
                x.with("login_error", errorMsg);
            }
        }

        if (x.req.xhr) {
            return x.toApi({
                logged,
                msg: logged ? 'Login Successful.' : errorMsg,
            }, logged);
        }

        return x.redirectToRoute($.config.auth.afterLoginRoute);
    }

    async register(x) {
        const email = x.get("join-email");
        const user = await User.query()
            .where({email})
            .first();

        if (user !== undefined) {
            x.with("reg_error", "Email has an account already.");
            return x.withOld().redirectBack();
        }

        const password = $.bcrypt.hashSync(x.get("join-password"), 10);
        const name = x.get("join-name");

        let newUser = {email, password, name};

        await User.query().insert(newUser);

        x.with('reg_success', 'Registration successful, Login now!');
        return x.redirect('/');
    }

    logout(x) {

        delete x.session.email;
        delete x.session.loginKey;

        x.with({logout: "Logout successful."});

        return x.redirect("/");
    }
}

module.exports = AuthController;