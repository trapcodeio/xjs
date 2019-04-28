/*
*   Name: AuthMiddleware
*   Exports: function(x) || Object of multiple functions(x)
*   Return: true/false
*/

module.exports = {
    guest(x) {
        if (x.isLogged()) return x.redirectToRoute('dashboard');
        x.next();
    },

    logged(x) {
        if (!x.isLogged()) return x.redirect('/');
        x.next()
    },
};