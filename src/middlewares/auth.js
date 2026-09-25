import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


export const verifyJWT = asyncHandler(async (req, res, next) => {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) throw new ApiError(401, "Unauthorized Request");

        const verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const verifiedUser = await User.findById(verifiedToken?._id).select("-password -refreshToken");

        if (!verifiedUser) throw new ApiError(401, "Invalid Access Token.")

        req.user = verifiedUser;
        next();

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token.")
    }

})