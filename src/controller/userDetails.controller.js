import { AddPhotos, Category, ShoutOut, UserGiveRating } from "../utils/associations.js"
import User from "../models/user.model.js"
import { RatingTitles } from "../utils/associations.js"
import ReportUser from "../models/ReportUser.model.js"
import { BlockUser } from "../utils/associations.js"
import { Op } from "sequelize"


const getShoutOut = async (req,res) => {
    try {

        const expiryTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        await ShoutOut.destroy({
            where: {
                created_at: {
                    [Op.lt]: expiryTime
                }
            }
        })

        const ShoutOutDetail = await ShoutOut.findAll({
            order: [["created_at" , "DESC"]],
            include: [
                {
                    model: User,
                    as: "usersshoutout",
                    attributes: ["profile_name" , "upload_selfie"]
                }
            ]
        })

        return res.json({
            status: true,
            message: "all shoutouts fetched",
            data: ShoutOutDetail
        })
        
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const HomeScreen = async (req ,res) => {
    try {

        const newestMembers = await User.findAll({
            include: {
                model: Category,
                as: "categories",
                where: { category: "newest beautiful members"},
                attributes: []
            },
            attributes: ["id" , "first_name" , "last_name" , "date_of_birth" , "upload_selfie" , "created_at"],
            order: [["created_at" , "DESC"]],
            limit: 5
        })
        
        const newApplicants = await User.findAll({
            include: {
                model: Category,
                as: "categories",
                where: {category: "new applicants"},
                attributes: []
            },
            attributes: ["id" , "first_name" , "last_name" , "date_of_birth" , "upload_selfie" , "created_at"],
            order: [["created_at" , "DESC"]],
            limit: 5
        })

        const popularMember = await User.findAll({
            include: {
                model: Category,
                as: "categories",
                where: {category: "popular member"},
                attributes: []
            },
            attributes: ["id" , "first_name" , "last_name" , "date_of_birth" , "upload_selfie" , "created_at"],
            //order: [["DESC"]],
            limit: 5
        })

        const readyToInteract = await User.findAll({
          //  where: { isReadyToInteract: true },
            include: {
                model: Category,
                as: "categories",
                where: { category: "ready to interact" },
                attributes: []
            },
            attributes: ["id", "first_name", "last_name", "date_of_birth", "upload_selfie"],
            limit: 5
        });

        
        return res.json({
            status: true,
            data: {
                "newestBeautifulMembers": newestMembers,
                "newApplicants": newApplicants,
                "popularMembers": popularMember,
                "readyToInteract": readyToInteract,
                // "who viewed me": whoViewedMe
            }
        });

    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const getNewestBeautifulMembers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Category,
        as: "categories",
        where: { category: "newest beautiful members" },
        attributes: []
      },

      attributes: ["id" , "first_name" , "last_name" , "date_of_birth" , "upload_selfie","created_at"],
      order: [["created_at", "DESC"]],
    });

    return res.json({status: true , data: users});

  } catch (error) {
    return res.json({status: false,message: error.message});
  }
};

 const getNewApplicants = async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Category,
        as: "categories",
        where: { category: "new applicants" },
        attributes: []
      },
      attributes: ["id" , "first_name" , "last_name" , "date_of_birth" , "upload_selfie","created_at"],
      order: [["created_at", "DESC"]],
      limit: 5
    });

    return res.json({status: true , data: users});
  } catch (error) {
    return res.json({status: false,message: error.message});
  }
};

 const getPopularMembers = async (req, res) => {
  try {
    const users = await User.findAll({

      include: {
        model: Category,
        as: "categories",
        where: { category: "popular member" },
        attributes: []
      },
      attributes: ["id","first_name","last_name","date_of_birth","upload_selfie","created_at"],
      limit: 5
    });

    return res.json({status: true,data: users});
  } catch (error) {
    return res.json({status: false , message: error.message});
  }
};

const getReadyToInteract = async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Category,
        as: "categories",
        where: { category: "ready to interact" },
        attributes: []
      },
      attributes: ["id","first_name","last_name","date_of_birth","upload_selfie"],
      order: [["created_at", "DESC"]],
      limit: 5
    });

    return res.json({status: true,data: users});

  } catch (error) {
    return res.json({status: false, message: error.message});
  }
};

const AddRatingsTitles = async (req, res) => {
    try {
        let data = req.body;

        if (!Array.isArray(data)) {
            data = [data];
        }

        const Rating = await RatingTitles.bulkCreate(data);

        return res.json({
            status: true,
            message: "Rating Titles added successfully",
            data: Rating
        });

    } catch (error) {
        return res.json({ status: false, message: error.message });
    }
};

const giveRating = async (req ,res) => {
    try {

        const user_id  = req.user.id

        const {target_user_id , rating_titles_id , rating} = req.body

        const ratedUser = await User.findByPk(target_user_id)
        if(!ratedUser){
            return res.json({status: false , message: "rated user not found"})
        }

        const createdAt = new Date(ratedUser.created_at)
        const hourPassed = (Date.now() - createdAt) / (1000 * 60 * 60)

        if(hourPassed > 48){
            return res.json({status: false , message: "rating time expired"})
        }

        await UserGiveRating.create({
            user_id,
            rated_user_id: target_user_id,
            rating_titles_id,
            rating
        })

        const oldCount = ratedUser.rating_count || 0;
        const oldScore = ratedUser.rating_score || 0;

        const newScore = oldScore + rating

        const newCount = oldCount + 1 
        
        await ratedUser.update({
            rating_score: newScore,
            rating_count: newCount
        })

        return res.json({
            status: true,
            message: "Rating saved successfully",
            rating_score: newScore,
            rating_count: newCount
        })
        
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const getUserRatings = async (req ,res) => {
    try {

        const { user_id } = req.params

        const ratings = await UserGiveRating.findAll({
            where: {rated_user_id: user_id},
            include: [
                {model: User ,as: 'rater', attributes: ['id' , 'first_name' , 'last_name']},
                {model: RatingTitles , as: 'ratedUser', attributes: ['id']}
            ],
            order: [['created_at' , 'DESC']]
        })

        return res.json({
            status: true,
            ratings
        })
        
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const reportUser = async (req ,res) => {
    try {
        const user_id = req.user.id

        const {target_user_id , reason } = req.body 

        const targetuser = await User.findByPk(target_user_id)
        if(!targetuser){
            return res.json({status: false , message: "User not found"})
        }

        if(user_id === target_user_id){
            return res.json({status: false , message: "you cannot report yourself"})
        }

        const alreadyReported = await ReportUser.findOne({
            where: {
                user_id,
                target_user_id
            }
        })

        if(alreadyReported){
            return res.json({status: false , message: "you already report these user"})
        }

        const report = await ReportUser.create({
            user_id,
            target_user_id,
            reason
        })

        return res.json({
            status: true,
            message: "Reported Successfully",
            data: report
        })

    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const blockUser = async (req ,res) => {
    try {
    
        const user_id = req.user.id; 
        const { blocked_user_id } = req.body; 
        
        const findTarget = await User.findByPk(blocked_user_id);
        if (!findTarget) {
            return res.json({ status: false, message: "User not found" });
        }

        const alreadyBlocked = await BlockUser.findOne({
            where: { user_id, blocked_user_id }
        });

        if (alreadyBlocked) {
            return res.json({ status: false, message: "User already blocked" });
        }

        
        await BlockUser.create({
            user_id,
            blocked_user_id
        });

        return res.json({
            status: true,
            message: "User blocked successfully"
        });
    
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const unBlockUser = async (req ,res) => {
    try {

        const user_id = req.user.id
        const {blocked_user_id} = req.body

        const deleted = await BlockUser.destroy({
            where: {user_id , blocked_user_id}
        })

        if (!deleted) {
            return res.json({status: false , message: "User was not blocked"})
        }

        return res.json({
            status: true,
            message: "User Unblocked successfully"
        })
        
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const getUploadedPhotos = async (req ,res) => {
    try {
        const user_id = req.user.id 
        
        const user = await User.findByPk(user_id)
        if(!user){
            return res.json({status: false , message: "User not found"})
        }

        const Photos = await AddPhotos.findAll({
            where: {user_id},
            order: [["id" , "DESC"]]
        })

        return res.json({
            status: true,
            message: "photos fetched!",
            data: Photos
        })
        
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const getUploadedPrivatePhotos = async (req ,res) => {
    try {

        const user_id = req.user.id

        const user = await User.findByPk(user_id)
        if(!user){
            return res.json({status: false , message: "User not found"})
        }

        const PrivatePhotos = await User.findAll({
            where: {
                user_id
            },
            order: [["id" , "DESC"]]
        })

        return res.json({
            status: true,
            message: "fetched PrivatePhotos",
            data: PrivatePhotos
        })
        
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}



export {
    getShoutOut,
    AddRatingsTitles,
    giveRating,
    getUserRatings,
    reportUser,
    blockUser,
    unBlockUser,
    getUploadedPhotos,
    getUploadedPrivatePhotos,
    HomeScreen,
    getNewestBeautifulMembers,
    getNewApplicants,
    getReadyToInteract,
    getPopularMembers,
}