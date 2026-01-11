const { clerkClient } = require('@clerk/clerk-sdk-node');

module.exports = async function (req, res, next) {
    const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = await clerkClient.verifyToken(token);
        req.user = { id: decoded.sub, ...decoded };
        next();
    } catch (err) {
        console.error('Clerk verification error:', err);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
