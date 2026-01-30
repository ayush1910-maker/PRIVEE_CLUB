import Request from "../models/Request.model.js"

const checkPrivateAcess = async (req ,res ,next) => {
    try {
        const viewer_id = req.user.id
        const { user_id } = req.params

        const access = await Request.findOne({
            where: {
                sender_id: viewer_id,
                receiver_id: user_id,
                status: "Confirmed Request"
            }
        })

        if (!access) {
            return res.json({
                status: false,
                message: "Private access not granted!"
            })
        }

        next();
        
    } catch (error) {
        return res.json({status: false , message: error})
    }
}

export default checkPrivateAcess