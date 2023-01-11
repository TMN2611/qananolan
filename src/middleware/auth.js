const jwt = require('jsonwebtoken')


async function requireToken(req, res, next) {
    const {token} = req.params;

    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {

        if(decoded?.data) {
            next();
        }
        else {
            res.json({err:"Token invalid"})
        }
    })
}

module.exports = {requireToken};
