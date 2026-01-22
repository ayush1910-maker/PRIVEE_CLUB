import admin from "../../firebaseAdmin.js";
import FCMtoken from "../models/FCMtoken.model.js";

export const sendFCMNotification = async (userId, title, body, data = {}) => {
    try {
        const tokens = await FCMtoken.findAll({
            where: { user_id: userId },
            attributes: ["fcm_token"]
        });

        if (!tokens.length) return;

        const message = {
            notification: {
                title,
                body
            },
            data,
            tokens: tokens.map(t => t.fcm_token)
        };

        await admin.messaging().sendEachForMulticast(message);
    } catch (error) {
        console.error("FCM Error:", error.message);
    }
};
