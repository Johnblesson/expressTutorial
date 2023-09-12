function validateAuthToken(req, res, next) {
    console.log('Inside validate Auth Token');
    const { authorization } = req.headers;
    if (authorization && authorization === process.env.AUTHORIZATION_KEY) {
        next();
} else {
    res.status(403).send('Forbidden')
}
}

module.exports = validateAuthToken;

// function validateCookies(req, res, next) {
//     const { cookies } = req;
//     console.log(cookies)
//     next();
// }

// module.exports = validateCookies;