import cron from "node-cron";
import User from "../../models/user.model.js";
import sequelize from "../../db/db.js";
import { Op } from "sequelize";

cron.schedule("*/15 * * * *", async () => {
    try {
        console.log("15 minutes completed");

        const cutoffTime = new Date(Date.now() - 48 * 60 * 60 * 1000)

        const result = await User.update(
            {
                token_version: sequelize.literal("token_version + 1"),
                force_logged_out: true
            },
            {
                where: {
                    rating_score: {[Op.lt]: 4},
                    created_at: { [Op.lte]: cutoffTime },
                    force_logged_out: false
                }
            }
        )

        console.log(`force logout users count => ${result[0]}`);

    } catch (error) {
        console.error("Cron Error:", error.message);
    }
});