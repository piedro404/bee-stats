export class CustomError extends Error {
    constructor(message, details) {
        super(message);
        this.name = "CustomError";
        this.details = details;
    }
}
