export class HttpError extends Error {
    code = 500;
    name = 'Internal Server Error';
    message: string;

    constructor(message?: string) {
        super(message);
        this.message = message;
    }
}

export class BadRequestError extends HttpError {
    code = 400;
    name = 'Bad Request';
}

export class UnauthorizedError extends HttpError {
    code = 401;
    name = 'Unauthorized';
}

export class ForbiddenError extends HttpError {
    code = 403;
    name = 'Forbidden';
}

export class NotFoundError extends HttpError {
    code = 404;
    name = 'Not Found';
}
