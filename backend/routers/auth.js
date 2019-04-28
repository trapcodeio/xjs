const Route = $.router;

Route.path('/', () => {
    Route.get('', 'index');
    Route.get('/dashboard', 'dashboard');
}).controller('Auth').actionsAsName();

Route.path('/auth', () => {
    Route.post('/login', 'login');
    Route.post('/register', 'register');
    Route.get('/logout', 'logout');
}).controller('Auth').actionsAsName().as('auth');