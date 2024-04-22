import jwt from "jsonwebtoken";

const generateAccessToken = (id) => {
    return jwt.sign({id}, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '10d'
    });
};

const generateRefreshToken = (id) => {
    return jwt.sign({id}, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '10d'
    });
}

export  { generateAccessToken, generateRefreshToken}