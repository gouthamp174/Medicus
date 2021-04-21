
// User errors
export class UnauthorizedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UnauthorizedError'
  }
}


// Custom HTTP Errors
// 400 series Error Codes
export class HttpBadRequestError extends Error {
  constructor(message) {
    super(message)
    this.name = 'HttpBadRequestError'
    this.statusCode = 400
  }
}

export class HttpUnauthorizedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'HttpUnauthorizedError'
    this.statusCode = 401
  }
}

export class HttpForbiddenError extends Error {
  constructor(message) {
    super(message)
    this.name = 'HttpForbiddenError'
    this.statusCode = 403
  }
}

export class HttpNotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name = 'HttpNotFoundError'
    this.statusCode = 404
  }
}

// 500 series Error Codes
export class HttpInternalServerError extends Error {
  constructor(message) {
    super(message)
    this.name = 'HttpInternalServerError'
    this.statusCode = 500
  }
}
