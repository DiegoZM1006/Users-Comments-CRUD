export default class NotAuthorizedError extends Error {

    // Mensaje de error para cuando entre con un usuario no autorizado
    constructor(message : string) {
        super('')
        this.name = this.constructor.name;
        this.stack = message + ": " + this.stack
    }

}