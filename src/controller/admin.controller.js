import Admin from "../models/Admin.model.js";
import Category from "../models/Category.model.js";
import bcrypt from "bcrypt"
import User from "../models/user.model.js";
import UserCategory from "../models/UserCategory.model.js";

const generateAdminAccessToken = async function (adminId) {
  try {
    const admin = await Admin.findByPk(adminId);

    if (!admin) {
      throw new ApiError(404, "Admin not found");
    }

    const accessToken = jwt.sign(
      {
        id: admin.id,
        role: "admin"   // optional but recommended
      },
      process.env.JWT_SECRET,
      { expiresIn: "15d" }
    );

    return { accessToken };

  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating admin access token"
    );
  }
};

const register_admin = async (req ,res) => {
    try {
        const {name , email , password} = req.body

        const existedAdmin = await Admin.findOne({where: {email}})
        if(existedAdmin){
            return res.json({status: false , message: "Admin already existed"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword
        })

        return res.json({
            status: true,
            message: "Admin registered successfully",
            data: admin
        })

    } catch (error) {
        return res.json({status: true , message: error.message})
    }
}

const login = async (req ,res) => {
    try {

        const {email , password} = req.body

        const existedAdmin = await Admin.findOne({where: {email}})
        if(!existedAdmin){
            return res.json({status: false , message: "Admin not found"})
        }

        const isPasswordValid = await bcrypt.compare(password , existedAdmin.password)
        if(!isPasswordValid){
            return res.json({status: false , message: "password invalid"})
        }

        const {accessToken} = await generateAdminAccessToken(existedAdmin.id)

        const loggedInAdmin = await User.findByPk(existedAdmin.id , {
            attributes: { exclude: ["password"] },
        })

        return res
        .status(201)
        .cookie("accessToken", accessToken)
        .json({
            status: true,
            message: "user LoggedIn successfully",
            data: {
                token: accessToken,
                admin: loggedInAdmin
            } , 
        })

        
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const create_category = async (req, res) => {
    try {

        const { category } = req.body

        const existedCategory = await Category.findOne({
            where: { category }
        });

        if (existedCategory) {
            return res.json({ status: false, message: "Category already exists" });
        }

        const newCategory = await Category.create({
            category
        })
        
        return res.json({
            status: true,
            message: "Category created successfully",
            data: newCategory
        });

    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const give_category_to_user = async (req ,res) => {
    try {

        const {user_id , category_id} = req.body

        const user = await User.findByPk(user_id)
        if (!user) {
            return res.json({status: false , message: "User not found"})
        }

        const category = await ModelCategory.findByPk(category_id)
        if (category) {
            return res.json({status: false , message: "Category not found"})
        }

        const alreadyAssigned = await UserCategory.findOne({
            where: {user_id , category_id}
        })

        if (alreadyAssigned) {
            return res.json({ status: false, message: "Category already assigned to user" });
        }

        const assignedCategory = await UserCategory.create({
            user_id,
            category_id,
        });

        return res.json({
            status: true,
            message: "Category assigned to user successfully",
            data: assignedCategory,
        });
        
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}


export {
    register_admin,
    create_category,
    login,
    give_category_to_user
}
