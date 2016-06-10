export const ERR_MSG_ONLY_BY_OWNER = 'Only the resource owner can take this action.';
export const ERR_MSG_MUST_BE_LOGGED_IN = 'Must be logged in to take this action.';

export const ERR_MSG_PARSING_ERROR = (service: string) =>
    `Could parse response from ${service}`;

export const ERR_MSG_EXTERNAL_ERROR = (msg: string) =>
    `External error: ${msg}`;

export const ERR_MSG_RBAC_FAILURE = (role: string, action: string, resource: string) =>
    `user(${role}) cannot ${action} ${resource}`;

export const ERR_MISSING_FIELDS = (fields: string[]) =>
    `Missing fields. Required: ${fields.join(', ')}`;

// @link https://tools.ietf.org/html/rfc7231
// @link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
export class HttpError extends Error {
    code = 500;
    name = 'Internal Server Error';
    message: string;

    constructor(message?: string) {
        super(message);
        this.message = message || this.message || this.name;
    }
}

// the server cannot or will not process the request due to an apparent client
// error (e.g., malformed request syntax, invalid request message framing, or
// deceptive request routing).
// @link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#400
export class BadRequestError extends HttpError {
    code = 400;
    name = 'Bad Request';
}

// similar to 403 forbidden, but specifically for use when authentication is
// required and has failed or has not yet been provided.
// @link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#401
export class UnauthorizedError extends HttpError {
    code = 401;
    name = 'Unauthorized';
}

// the request was a valid request, but the server is refusing to respond to
// it. 403 error semantically means "unauthorized", i.e. the user does not have
// the necessary permissions for the resource.
// @link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#403
export class ForbiddenError extends HttpError {
    code = 403;
    name = 'Forbidden';
}

// the requested resource could not be found but may be available in the
// future. subsequent requests by the client are permissible.
// @link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#404
export class NotFoundError extends HttpError {
    code = 404;
    name = 'Not Found';
}

// the server was acting as a gateway or proxy and received an invalid response
// from the upstream server.
// @link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#502
export class BadGatewayError extends HttpError {
    code = 502;
    name = 'Bad Gateway';
}

// The server is currently unavailable (because it is overloaded or down for
// maintenance). Generally, this is a temporary state.
// @link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#503
export class ServiceUnavailableError extends HttpError {
    code = 503;
    name = 'Service Unavailable';
    message = 'Service is currently unavailable';
}
