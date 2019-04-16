const Router = $.router;

Router.path('/', () => {
    Router.get('', 'index');
    Router.get('/dashboard', 'dashboard');
}).controller('Auth').actionsAsName();

Router.path('/auth', () => {
    Router.post('/login', 'login');
    Router.post('/register', 'register');
    Router.get('/logout', 'logout');
}).controller('Auth').actionsAsName().as('auth');