import { AddPhotos, Category, ShoutOut, UserGiveRating } from "../utils/associations.js"
import User from "../models/user.model.js"
import { RatingTitles } from "../utils/associations.js"
import ReportUser from "../models/ReportUser.model.js"
import { BlockUser } from "../utils/associations.js"
import { Op  ,fn , col, Model} from "sequelize"
import Request from "../models/Request.model.js"
import { sendFCMNotification } from "../utils/sendNotification.js"


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

        const sender = await User.findByPk(user_id)
        
        await sendFCMNotification(
            ratedUser,
            "You've Got a New Rating ⭐",
            `${sender.first_name} ${sender.last_name} Rated you!`,
            {
                type: "Rated",
                sender_id: user_id.toString(),
                receiver_id: target_user_id.toString()   
            }
        )

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

const sendRequestPrivateAccess = async (req ,res) => {
    try {
        const sender_id = req.user.id
        const {receiver_id} = req.body

        const receiverId = await User.findByPk(receiver_id)
        if (!receiverId) {
            return res.json({status: false , message: "receiverId are not found"})
        }
        
        if (sender_id === receiver_id ) {
            return res.json({status: false , message: "sender and receiver are same"})
        }

        const existingRequest = await Request.findOne({
            where: {
                [Op.or]: [
                    {sender_id , receiver_id},
                    {sender_id: receiver_id , receiver_id: sender_id}
                ]
            }
        })

        if (existingRequest) {
            return res.json({status: false , message: "you already send request"})
        }

        const request = await Request.create({
            sender_id,
            receiver_id,
            status: "Pending Request"
        })

        const sender = await User.findByPk(sender_id)

        await sendFCMNotification(
            receiver_id,
            "Private Access Request",
            `${sender.first_name} sent you a request for private access`,
            {
                type: "Private_ACCESS_REQUEST",
                sender_id: sender_id.toString(),
                receiver_id: receiver_id.toString()
            }
        )

        return res.json({
            status: true,
            message: "Request send successfully",
            data: request
        })
 
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const getRecievedRequests = async (req ,res) => {
    try {
        const user_id = req.user.id

        const user = await User.findByPk(user_id)
        if(!user){
            return res.json({status: false , message: "User not found"})
        }

        const FindRequest = await Request.findAll({
            where: {receiver_id: req.user.id , status: "Pending Request"},
            include: [
                { 
                    model: User,
                    as: "sender",
                    attributes: ["first_name" , "last_name" , "upload_selfie"]
                },
            ],
            order: [["created_at" , "DESC"]]
        })

        return res.json({
            status: true,
            message: "request fetched successfully",
            data: FindRequest
        })
        
    } catch (error) {
        console.log(error);
        return res.json({status: false , message: error.message})
    }
}

const AcceptRequest = async (req ,res) => {
    try {

        const user_id = req.user.id  // reciever
        const { request_id } = req.body // sender

        const requestId = await User.findByPk(request_id)

        if (!requestId) {
            return res.json({status: false , message: "User not found"})
        }

        const request = await Request.findOne({
            where: {
                sender_id: request_id,
                receiver_id: user_id,
                status: "Pending Request"
            }
        })

        if (!request) {
            return res.json({status: false , message: "request not found"})
        }

        request.status = "Confirmed Request"
        await request.save()

        const reciever = await User.findByPk(user_id)

        await sendFCMNotification(
            request_id,
            "Private Access Request Accepted!",
            `${reciever.first_name} Accepted Your request for private access`,
            {
                type: "Private_ACCESS_REQUEST",
                sender_id: user_id.toString(),
                receiver_id: request_id.toString()
            }
        )
        
        return res.json({
            status: true,
            message: "request Accepted",
            data: request
        })

    } catch (error) {
        console.log(error);
        return res.json({status: false , message: error.message})
    }
}

const RejectRequest = async (req, res) => {
    try {

        const receiver_id = req.user.id  // reciever

        const {request_id} = req.body   // sender

        const requestId = await User.findByPk(request_id)

        if (!requestId) {
            return res.json({status: false , message: "user not found"})
        }

        const request = await Request.findOne({
            where: {
                sender_id: request_id,
                receiver_id,
                status: "Pending Request"
            }
        })

        if (!request) {
            return res.json({status: false , message: "request not found"})
        }

        await request.destroy()

        const reciever = await User.findByPk(receiver_id)

        await sendFCMNotification(
            requestId,
            "Private Access Request Rejected!",
            `${reciever.first_name} ${reciever.last_name ? last_name : null} reject your private access request`,
            {
                type: "Private_ACCESS_REJECTED",
                receiver_id: receiver_id.toString(),
                sender_id: request_id.toString()
            }
        )

        return res.json({
            status: true,
            message: "request reject successfully",
            data: request
        })
        
    } catch (error) {
        console.log(error);
        return res.json({status: false , message: error.message})
    }
}

const getConfirmedRequest = async (req ,res) => {
    try {

        const user_id = req.user.id

        const ConfirmedRequests = await Request.findAll({
            where: {receiver_id: user_id , status: "Confirmed Request"},
            include: [
                {
                    model: User,
                    as: "sender",
                    attributes: ["first_name" , "last_name" , "upload_selfie"],
                },
            ],
            order: [["created_at" , "DESC"]]
        })

        return res.json({
            status: true,
            message: "ConfirmedRequests Fetched!",
            data: ConfirmedRequests
        })
        
    } catch (error) {
        console.log(error);
        return res.json({status: false , message: error.message})
    }
}

const deleteConfirmedRequest = async (req , res) => {
    try {

        const user_id = req.user.id

        const {request_id} = req.body

        const requestId = await User.findByPk(request_id)
        if (!requestId) {
            return res.json({status: false , message: "requested user not found"})
        }

        const deleteRequest = await Request.findOne({
            where: {
                sender_id: request_id,
                receiver_id: user_id ,
                status: "Confirmed Request",
            },
            include: [
                {
                    model: User,
                    as: "sender",
                    attributes: ["first_name" , "last_name" , "upload_selfie" ]
                }
            ]
        })

        await deleteRequest.destroy()

        return res.json({
            status: true,
            message: "User remove from freind list",
            data: deleteRequest
        })


        
    } catch (error) {
        console.log(error);
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

    sendRequestPrivateAccess,
    getRecievedRequests,
    AcceptRequest,
    RejectRequest,
    getConfirmedRequest,
    deleteConfirmedRequest

}