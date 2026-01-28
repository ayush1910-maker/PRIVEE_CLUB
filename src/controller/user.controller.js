// import User from "../models/user.model.js"
// import lookingFor from "../models/lookingFor.model.js";    
// import UserLookingFor from "../models/userlookingFor.model.js";
import {User , lookingFor , UserLookingFor} from "../utils/associations.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { sendEmailSMTP } from "../utils/nodemailer.js";
import admin from "../../firebaseAdmin.js";
import Admin from "../models/Admin.model.js"

const generateAccessTokens = async function (userId) {
  try {
    const user = await User.findByPk(userId);

    const accessToken = jwt.sign(
      {
        id: user.id,
        token_version: user.token_version
      },
      process.env.JWT_SECRET,
      { expiresIn: "15d" }
    );

    return { accessToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const register_user = async (req,res) => {
    try {
        const {first_name , last_name , profile_name, email , mobile_number , password , confirm_password } = req.body

        if(password !== confirm_password){
            return res.json({status: false , message: "password and confirm_password not match"})
        }

        const existedUser = await User.findOne({where: {email}})
        if(existedUser){
            return res.json({status: false , message: "user already existed"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            first_name,
            last_name,
            profile_name,
            email,
            mobile_number,
            password: hashedPassword,
        })

        return res.json({
            status: true,
            message: "User Registered successfully",
            data: user
        })

    } catch (error) {
        return res.send({status: false , message: error.message})
    }
}

const login = async (req,res) => {
    try {
        const {email , password , fcm_token} = req.body

        const existedUser = await User.findOne({where: {email}})
        if(!existedUser){
            return res.json({status: false , message: "User not found"})
        }

        const isPasswordValid = await bcrypt.compare(password , existedUser.password)
        if(!isPasswordValid){
            return res.json({status: false , message: "password invalid"})
        }

        if (fcm_token) {
            await User.update(
                { fcm_token },
                { where: { id: existedUser.id } }
            );
        }

        const {accessToken} = await generateAccessTokens(existedUser.id)

        const loggedInUser = await User.findByPk(existedUser.id , {
            attributes: { exclude: ["password"] },
        })

        await User.update(
            {
                last_login_at: new Date(),
                force_logged_out: false
            },
            {
                where: {
                    id: existedUser.id
                }
            }
        )

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(201)
        .cookie("accessToken", accessToken , options)
        .json({
            status: true,
            message: "user LoggedIn successfully",
            data: {
                token: accessToken,
                user: loggedInUser
            } , 
        })

    } catch (error) {
        return res.send({status: false , message: error.message})
    }
}

const SocialLogin = async (req ,res) => {
    try {
    const { idToken } = req.body;

    if (!idToken){
        return res.json({ status: false, message: "idToken is required" });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email , first_name} = decodedToken;

    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        email,
        first_name: first_name || "",
        firebaseUid: uid
      });
    }

    const {accessToken} = await generateAccessTokens(user.id)

    return res.json({
      status: true,
      message: "Login successful",
      accessToken,
      user
    });
        
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const upload_selfie = async (req, res) => {
  try {
    const user_id = req.user.id;

    const user = await User.findByPk(user_id);
    if (!user){
        return res.json({ status: false, message: "user not found" });
    } 
        
    const ImageLocalPath = req.file?.path; 
    
    if (ImageLocalPath) {
      user.upload_selfie = ImageLocalPath;
      await user.save();
    }

    return res.json({
      status: true,
      message: "picture submitted",
      data: { 
        user_id: user.id, 
        upload_selfie: user.upload_selfie 
    },
    });

  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const select_gender = async (req ,res) => {
    try {
        const {gender} = req.body
         const user_id = req.user.id;

        const user = await User.findByPk(user_id);
        if (!user){
            return res.json({ status: false, message: "user not found" });
        } 

        user.gender = gender
        await user.save()

        return res.json({
             status: true, 
             message: `chooses ${gender}`,
             data: user
        })

    } catch (error) {
        return res.send({status: false , message: error.message})
    }
}

const get_lookingfor_list = async (req ,res) => {
    try {

        const list = await lookingFor.findAll({
            attributes: ["id", "title"],
            order: [["id" , "ASC"]]
        })
        
        return res.json({
            status: true,
            message: "looking for list",
            data: list
        })

    } catch (error) {
        return res.json({status: false, message: true})
    }
}

const choose_looking_for = async (req , res) => {
    try {
        const user_id = req.user.id
        let { looking_for } = req.body

        const user = await User.findByPk(user_id)
        if(!user){
            return res.json({status: false , message: "User not found"})
        }

        const validTitles = await lookingFor.findAll({
            where: {id: looking_for}
        })

        if(validTitles.length !== looking_for.length){
            return res.json({status: false , message: "select between given titles"})
        }

        if(!Array.isArray(looking_for)){
            looking_for = [looking_for]
        }

        await UserLookingFor.destroy({where: {user_id}})

        const values = looking_for.map(id => ({
            user_id,
            looking_for_id: id
        }))

        await UserLookingFor.bulkCreate(values)

        await User.update(
          { looking_for: JSON.stringify(looking_for) },
          { where: { id: user_id } }
        );

        return res.json({
            status: true,
            message: "response submitted!",
            data: values
        })
        
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const get_user_looking_for = async (req, res) => {
  try {
    const user_id = req.user.id;

    const user = await User.findByPk(user_id, {
      include: {
        model: lookingFor,
        as: "lookingForOptions",
        attributes: ["id", "title"],
        through: { attributes: [] } 
      }
    });

    if (!user) {
      return res.json({ status: false, message: "User not found" });
    }

    return res.json({
      status: true,
      data: user.lookingForOptions 
    });

  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const user_info = async (req ,res) => {
    try {

        const user_id = req.user.id

        const user = await User.findByPk(user_id)
        if(!user){
            return res,json({status: false , message: "User Not found"})
        }

        const {
            date_of_birth,
            body_type,
            height,
            weight,
            eye_color,
            hair_color,
            region,
            nationality,
            sexual_orientation,
            city,
            field_of_work,
            education,
            zodiac_sign,
            relationship_status,
            drinking,
            smoking,
            piercing,
            tattoos,
            about_your_perfect_match,
            about_me,
        } = req.body;
        
        const update_user_info = await User.update({
            date_of_birth,
            body_type,
            weight,
            height,
            eye_color,
            hair_color,
            region,
            nationality,
            sexual_orientation,
            city,
            field_of_work,
            education,
            zodiac_sign,
            relationship_status,
            drinking,
            smoking,
            piercing,
            tattoos,
            about_your_perfect_match,
            about_me,
        },
        {
            where: { id: user_id },  // ***
        })

        return res.json({
            status: true ,
            message: "user information added successfully", 
            data: {
                update_user_info: {
                     date_of_birth: user.date_of_birth,
                     body_type: user.body_type,
                     weight: user.weight,
                     height: user.height,
                     eye_color: user.eye_color,
                     hair_color: user.hair_color,
                     region: user.region,
                     nationality: user.nationality,
                     sexual_orientation: user.sexual_orientation,
                     city: user.city,
                     field_of_work: user.field_of_work,
                     education: user.education,
                     zodiac_sign: user.zodiac_sign,
                     relationship_status: user.relationship_status,
                     drinking: user.drinking,
                     smoking: user.smoking,
                     piercing: user.piercing,
                     tattoos: user.tattoos,
                     about_your_perfect_match: user.about_your_perfect_match,
                     about_me: user.about_me,
            }
        }})           
    } catch (error) {
        return res.send({status: false , message: error.message})
    }
} 

const intrested_in = async (req ,res) => {
    try {
        const user_id = req.user.id

        const user = await User.findByPk(user_id)
        if(!user){
            return res.json({status: false , message: "User not found"})
        }

        const {
            favourite_music,
            favourite_tv_show, 
            favourite_movie, 
            favourite_book, 
            favourite_sport, 
            other } = req.body

        await user.update({
            favourite_music,
            favourite_tv_show, 
            favourite_movie, 
            favourite_book, 
            favourite_sport,
            other
        },
    )

        return res.json({
            status: true, 
            message: "submitted!", 
            data: {
                intrest_in: {
                    favourite_music: user.favourite_music,
                    favourite_tv_show: user.favourite_tv_show,
                    favourite_movie: user.favourite_movie, 
                    favourite_book: user.favourite_book, 
                    favourite_sport: user.favourite_sport, 
                    other: user.other,                    
                }
            }})
        
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const hear_about = async (req ,res) => {
    try {
        const user_id = req.user.id

        const user = await User.findByPk(user_id)
        if(!user){
            return res.json({status: false , message: "User not found"})
        }

        const {hear_about} = req.body

        user.hear_about = hear_about
        await user.save()

        return res.json({status: true , message: "submitted!" , data: user.hear_about})
        
    } catch (error) {
        return res.send({status: false , message: error.message})
    }
}

const forget_password = async (req ,res) => {
    try {
        const {email} = req.body

        let account = await User.findOne({where: {email}})
        
        if(!account){
           account =  await Admin.findOne({where: {email}})  
        }

        if (!account) {
            return res.json({status: false , message: "User/Admin not found"})
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const hashedOtp = await bcrypt.hash(otp , 10)

        account.otp = hashedOtp
        account.otp_expires = new Date(Date.now() + 10 * 60 * 1000); 
        await account.save();

        await sendEmailSMTP(email, "Password Reset OTP", "otpTemplate", {
            name: account.first_name || account.name,
            otp,
            expiry: "10 minutes",
        });

        return res.json({status: true ,message: "Please check your mail" , })
        
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const verify_otp = async (req ,res) => {
    try {
        const { email, otp } = req.body;
        
        let account = await User.findOne({ where: { email } });

        if (!account) {
            account = await Admin.findOne({where: {email}})
        }

        if (!account){
            return res.json({ status: false, message: "User/Admin not found" });
        } 

        if (!account.otp || account.otp_expires < Date.now()) {
            return res.json({ status: false, message: "OTP expired" });
        }
        
        const isMatch = await bcrypt.compare(otp, account.otp);
        if (!isMatch){
           return res.json({ status: false, message: "Invalid OTP" });
        } 
    
        return res.json({ status: true, message: "OTP verified. You can reset your password now."});
        
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
} 

const reset_password = async (req ,res) => {
    try {
    const {password, confirmPassword } = req.body;
    const id = req.user.id

    if (password !== confirmPassword) {
      return res.json({ status: false, message: "Passwords do not match" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.json({ status: false, message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    return res.json({ status: true, message: "Password reset successful" });
        
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

export {
    generateAccessTokens,
    register_user,
    login,
    SocialLogin,
    upload_selfie,
    select_gender,
    get_lookingfor_list,
    choose_looking_for,
    get_user_looking_for,
    user_info,
    intrested_in,
    hear_about,
    forget_password,
    verify_otp,
    reset_password
}
