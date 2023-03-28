const dateConvert = () => {
    if (!Date.prototype.toUTCDate) {
        // eslint-disable-next-line no-extend-native
        Date.prototype.toUTCDate = function () {
            return this.getUTCFullYear() + '-' +
                ('0' + (this.getUTCMonth() + 1)).slice(-2) + '-' +
                ('0' + this.getUTCDate()).slice(-2);
        }
    }
    const sqlDate = new Date().toUTCDate()
    return sqlDate
}