export const ERR_MSG_ONLY_BY_OWNER = 'Only the resource owner can take this action.';

export const ERR_MSG_PARSING_ERROR = (service: string) =>
    `Could parse response from ${service}`;

export const ERR_MSG_EXTERNAL_ERROR = (msg: string) =>
    `External error: ${msg}`;

export const ERR_MSG_RBAC_FAILURE = (role: string, action: string, resource: string) =>
    `user(${role}) cannot ${action} ${resource}`;

export const ERR_MSG_MISSING_FIELDS = (fields: string[]) =>
    `Missing fields. Required: ${fields.join(', ')}`;

export const ERR_MSG_INVALID_ENTITY_TYPE = (supplied: string, supported: string[]) =>
    `Invalid entity type (${supplied}) supplied. Supported types: ${supported.join(', ')}`;

export const ERR_MSG_INVALID_PARTS = (parts: string[]) =>
    `Invalid part(s): ${parts.join(', ')}`;

// @link https://tools.ietf.org/html/rfc7231
// @link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
export class HttpError extends Error {
    static code = 500;
    code = 500;
    name = 'Internal Server Error';
    message: string;

    constructor(message?: string) {
        super(message);
        this.code = (<any>this.constructor).code;
        this.message = message || (<any>this.constructor).message || this.name;
    }
}

// the server cannot or will not process the request due to an apparent client
// error (e.g., malformed request syntax, invalid request message framing, or
// deceptive request routing).
// @link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#400
export class BadRequestError extends HttpError {
    static code = 400;
    name = 'Bad Request';
}

// similar to 403 forbidden, but specifically for use when authentication is
// required and has failed or has not yet been provided.
// @link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#401
export class UnauthorizedError extends HttpError {
    static code = 401;
    name = 'Unauthorized';
    message = 'Must be logged in to take this action.';
}

// the request was a valid request, but the server is refusing to respond to
// it. 403 error semantically means "unauthorized", i.e. the user does not have
// the necessary permissions for the resource.
// @link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#403
export class ForbiddenError extends HttpError {
    static code = 403;
    name = 'Forbidden';
}

// the requested resource could not be found but may be available in the
// future. subsequent requests by the client are permissible.
// @link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#404
export class NotFoundError extends HttpError {
    static code = 404;
    name = 'Not Found';
}

// the server timed out waiting for the request. according to HTTP
// specifications: "The client did not produce a request within the time that
// the server was prepared to wait. The client MAY repeat the request without
// modifications at any later time."
// @link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#408
export class RequestTimeoutError extends HttpError {
    static code = 408;
    name = 'Request Timeout';
}

// indicates that the request could not be processed because of conflict in the
// request, such as an edit conflict between multiple simultaneous updates.
// @link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#409
export class ConflictError extends HttpError {
    static code = 409;
    name = 'Conflict Error';
}

// the request is larger than the server is willing or able to process.
// previously called "Request Entity Too Large".
// @link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#413
export class PayloadTooLargeError extends HttpError {
    static code = 413;
    name = 'Payload Too Large';
}

// the request was well-formed but was unable to be followed due to semantic
// errors.
// @link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#422
export class UnprocessableEntityError extends HttpError {
    static code = 422;
    name = 'Unprocessable Entity';
}

// A generic error message, given when an unexpected condition was encountered
// and no more specific message is suitable.
// @link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#500
export class InternalServerError extends HttpError {
    static code = 500;
    name = 'Internal Server';
}

// the server was acting as a gateway or proxy and received an invalid response
// from the upstream server.
// @link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#502
export class BadGatewayError extends HttpError {
    static code = 502;
    name = 'Bad Gateway';
}

// The server is currently unavailable (because it is overloaded or down for
// maintenance). Generally, this is a temporary state.
// @link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#503
export class ServiceUnavailableError extends HttpError {
    static code = 503;
    name = 'Service Unavailable';
    message = 'Service is currently unavailable.';
}
