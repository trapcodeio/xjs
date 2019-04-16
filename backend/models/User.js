class User extends $.model {
    static get tableName() {
        return 'users';
    }
}

User.prototype.$hidden = [
    'password'
];


module.exports = User;