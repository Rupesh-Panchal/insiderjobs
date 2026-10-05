import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.json({
                success: false,
                message: "Please login first",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;

        next();
    } catch (error) {
        console.error("User authentication error:", error.message);

        return res.json({
            success: false,
            message: "Invalid or expired token. Please login again.",
        });
    }
};

export default userAuth;
