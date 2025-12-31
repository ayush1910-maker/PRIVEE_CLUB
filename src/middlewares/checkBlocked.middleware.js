import { Op } from "sequelize";
import BlockUser from "../models/BlockUser.model";

const checkBlocked = async (req , res , next) => {
    try {
        const user_id = req.user.id
        const {target_user_id} = req.body

        if(!target_user_id){ 
            return res.json({status: false , message: "Target id not found"})
        }


        const blockExists = await BlockUser.findOne({
            where: { [Op.or]: [
                {
                    user_id: user_id,
                    blocked_user_id: target_user_id
                },
                {
                    user_id: target_user_id,
                    blocked_user_id: user_id
                }
            ]
        }
        })

        if (blockExists) {
            return res.json({status: false , message: "you are blocked! by User"})
        }

        next();

    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

export default checkBlocked