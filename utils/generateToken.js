import jwt from "jsonwebtoken";

const generateAccessToken = (id,  expiresIn = '10d') => {
    return jwt.sign({id}, process.env.JWT_ACCESS_SECRET, {
        expiresIn
    });
};

const generateRefreshToken = (id, expiresIn = '10d') => {
    return jwt.sign({id}, process.env.JWT_REFRESH_SECRET, {
        expiresIn
    });
}

export  { generateAccessToken, generateRefreshToken}