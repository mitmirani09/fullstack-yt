import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const registerUser = asyncHandler(async (req, res) => {
    // 1. take the form data validate it as well check for if existing user if yes then redirect

    const { fullName, username, email, password } = req.body;

    if (
        [fullName, username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required!")
    }

    const existingUser = User.findOne({
        $or: [{ fullName }, { email }]
    });

    if (existingUser) {
        throw new ApiError(409, "Account with this email or username already exists!")
    }

    // 2. check for images avatar and upload on cloudinary 

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) throw new ApiError(500);



    // 3. create user object in db
    const user = await User.create({
        fullName,
        email,
        username: username.toLowerCase(),
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })


    // 4. remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    // check for user creation
    if (!createdUser) throw new ApiError(500, "Something went wrong while creating account.")
    // if created successfully then send response

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User created Successfully")
    )
})

export { registerUser }