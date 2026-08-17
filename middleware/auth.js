
// ==========================================
// NAPHTECH HUB AUTHENTICATION MIDDLEWARE
// ==========================================

function requireLogin(req, res, next) {

    if (!req.session.user) {

        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });

    }

    next();
}


// ==========================================
// ADMIN ROLE CHECK
// ==========================================

function requireAdmin(req, res, next) {

    if (!req.session.user) {

        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });

    }

    if (req.session.user.role !== "admin") {

        return res.status(403).json({
            success: false,
            message: "Access denied. Administrator privileges required."
        });

    }

    next();
}


module.exports = {
    requireLogin,
    requireAdmin
};
