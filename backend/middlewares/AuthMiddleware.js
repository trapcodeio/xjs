/*
*   Name: AuthMiddleware
*   Exports: function(x) || Object of multiple functions(x)
*   Return: true/false
*/

module.exports = {

    /**
     * Default Action for this middleware.
     * @param {RequestEngine} x
     * @return {*}
     */
    allow(x) {
        return this.logged(x)
    },

    guest(x) {
        if (x.isLogged())
            return x.redirectToRoute('dashboard');

        return x.next();
    },

    logged(x) {
        if (!x.isLogged())
            return x.redirect('/');

        return x.next()
    },
};