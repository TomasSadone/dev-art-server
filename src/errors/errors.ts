class ResponseError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

class BadRequestError extends ResponseError {
    constructor(message: string) {
        super(message, 400);
    }
}

class NotFoundError extends ResponseError {
    constructor(message: string) {
        super(message, 404);
    }
}

class ConflictError extends ResponseError {
    constructor(message: string) {
        super(message, 409);
    }
}

class InternalServerError extends ResponseError {
    constructor(message: string) {
        super(message, 500);
    }
}

class UnauthorizedError extends ResponseError {
    constructor(message: string) {
        super(message, 401);
    }
}

export {
    ResponseError,
    BadRequestError,
    NotFoundError,
    ConflictError,
    InternalServerError,
    UnauthorizedError,
};
