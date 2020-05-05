var User = /** @class */ (function () {
    function User(id, email, _token, tokenExpirationDate) {
        this.id = id;
        this.email = email;
        this._token = _token;
        this.tokenExpirationDate = tokenExpirationDate;
    }
    Object.defineProperty(User.prototype, "token", {
        get: function () {
            if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
                return null;
            }
            return this._token;
        },
        enumerable: true,
        configurable: true
    });
    return User;
}());
export { User };
//# sourceMappingURL=user.model.js.map