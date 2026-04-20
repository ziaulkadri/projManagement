import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new Schema({

    avatar:{type:{url:String,localPath:String},default:{url:"https://cdn-icons-png.flaticon.com/512/149/149071.png",localPath:""}},
    username:{type:String,required:true,unique:true,lowercase:true,trim:true,index:true},
    fullName:{type:String,trim:true},
    email:{type:String,required:true,unique:true,lowercase:true,trim:true},
    password:{type:String,required:[true,"Password is required"]},
    isEmailVerified:{type:Boolean,default:false},
    refreshToken:{type:String},
    forgotPasswordToken:{type:String},
    forgotPasswordTokenExpiry:{type:Date},
    emailVerificationToken:{type:String},
    emailVerificationExpiry:{type:Date},
    // role:{type:String,default:"user",enum:["user","admin"]},
    // isBlocked:{type:Boolean,default:false},
    // isDeleted:{type:Boolean,default:false},


},
{
    timestamps:true
}

)

// pre hooks
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
    next()
})

// post hooks
//userSchema.post("save",function(doc,next){
//     console.log("User saved:",doc)
//     next()
// })

userSchema.methods.isPasswordCorrect = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password)
}




userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {_id:this._id,email:this.email,username:this.username},
        process.env.ACESS_TOKEN_SECRET,
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRE}
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {_id:this._id,email:this.email,username:this.username},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:process.env.REFRESH_TOKEN_EXPIRE}
    )
}   


userSchema.methods.generateTemporaryToken = function(type){

    const token = crypto.randomBytes(20).toString("hex")

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    const tokenExpiry = Date.now() + 20 * 60 * 1000

    return {token,hashedToken,tokenExpiry}
   
}

export const User = mongoose.model("User",userSchema)