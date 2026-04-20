import {User} from '../models/user.models.js';
import {ApiError} from '../utils/api-error.js';
import {asyncHandler} from '../utils/async-handler.js';
import {sendEmail,emailVerificationMailgenContent} from '../utils/mail.js';
import {ApiResponse} from '../utils/api-response.js';

const generateAccessAndRefreshTokens = async(userId) => {

    try {
        const user = await User.findById(userId)

    if(!user){
        throw new ApiError(404,"User not found")
    }

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave:false})

    return {accessToken,refreshToken}
        
    } catch (error) {
        // console.error("Error generating tokens: ", error)
        throw new ApiError(500,"Failed to generate tokens")
        
    }
    
}

const register = asyncHandler(async(req,res)=>{
    const {username,email,password} = req.body

    const existingUser = await User.findOne({$or:[{email},{username}]})

    if(existingUser){
        throw new ApiError(409,"User with this email or username already exists")
    }

    const user = await User.create({username,email,password,isVerified:false})

   const {token,hashedToken,tokenExpiry} = user.generateTemporaryToken()

   user.emailVerificationToken = hashedToken
   user.emailVerificationExpiry = tokenExpiry

   await user.save({validateBeforeSave:false})

   await sendEmail({
    email:user.email,
    subject:"Email Verification",
    mailgenContent:emailVerificationMailgenContent(user.username,`${req.protocol}://${req.get("host")}/api/v1/users/verify-email?token=${token}&id=${user._id}`)
   })

   const createdUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordTokenExpiry")

   if(!createdUser){
    throw new ApiError(500,"Failed to create user")
   }
    res.status(201).json(new ApiResponse(200,{user:createdUser},'User registered successfully'))
})

const login = asyncHandler(async(req,res)=>{
    const {email,password} = req.body

    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(400,"Invalid email or password")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid email or password")
    }

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    res.status(200).json({
        success:true,
        message:"User logged in successfully",
        data:{
            accessToken,
            refreshToken
        }
    })
})

export {register,login}