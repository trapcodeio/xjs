const Route = $.router;

Route.path('/', () => {
    Route.get('', 'index');
    Route.get('@dashboard');
}).controller('Auth').actionsAsName();


Route.path('/auth', () => {
    Route.post('@login');
    Route.post('@register');
    Route.all('@logout');
}).controller('Auth', true).as('auth');