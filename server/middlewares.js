export function notFound(req, res, next) {
    if (process.env.REACT_APP) next(); // In order to show custom error 404 page
    else {
        res.status(404);
        const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
        next(error);
    }
}

export function errorHandler(err, req, res, next) {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
}
