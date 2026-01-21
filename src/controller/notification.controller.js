import admin from "../../firebaseAdmin.js"
import FCMtoken from "../models/FCMtoken.model.js"


const saveFcmToken = async (req, res) => {
    try {
        const user_id = req.user.id
        const { fcm_token, device_type } = req.body;

        if (!fcm_token) {
            return res.json({ status: false, message: "FCM token is required" });
        }

        
        const [fcm, created] = await FCMtoken.findOrCreate({
            where: { fcm_token },
            defaults: {
                user_id: user_id || null,        
                device_type: device_type || null 
            }
        });

        
        if (!created) {
            let updated = false;

            if (user_id && fcm.user_id !== user_id) {
                fcm.user_id = user_id;
                updated = true;
            }

            if (device_type && fcm.device_type !== device_type) {
                fcm.device_type = device_type;
                updated = true;
            }

            if (updated) await fcm.save();
        }

        return res.json({
            status: true,
            message: "FCM token saved successfully",
            data: fcm
        });

    } catch (error) {
        console.log(error);
        return res.json({
            status: false,
            message: error.message
        });
    }
};

const sendTestPushNotification = async (req, res) => {
    try {

        const {token} = req.body

        if (!token) {
            return res.json({
                status: false,
                messsage: "No FCM token found"
            })
        }
        
        const messsage = {
            token,
            notification: {
                title: "test notification",
                body: "Firebase push notification working"
            }
        }

        await admin.messaging().send(messsage)

        return res.json({
            status: true,
            messsage: "Test notification send successfully"
        })


    } catch (error) {
        console.log(error);
        return res.json({status: true , messsage: messsage.error})
    }
}


export {
    saveFcmToken,
    sendTestPushNotification,
}