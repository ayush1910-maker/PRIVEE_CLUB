import User from "../models/user.model.js";
import AddPhotos from "../models/AddPhotos.model.js";
import AddPrivatePhotos from "../models/AddPrivatePhotos.model.js";
import lookingFor from "../models/lookingFor.model.js";
import UserLookingFor from "../models/userlookingFor.model.js";
import ShoutOut from "../models/ShoutOut.model.js";
import RatingTitles from "../models/RatingTitles.model.js";
import UserGiveRating from "../models/usergiveRating.model.js";
import BlockUser from "../models/BlockUser.model.js";
import UserCategory from "../models/UserCategory.model.js";
import Category from "../models/Category.model.js";

User.hasMany(AddPhotos, {
    foreignKey: "user_id",
    as: "photos",
    onDelete: "CASCADE",
});

AddPhotos.belongsTo(User, {
    foreignKey: "user_id",
    as: "usersphoto",
});


User.hasMany(AddPrivatePhotos, {
    foreignKey: "user_id",
    as: "privatephotos",
    onDelete: "CASCADE",
});

AddPrivatePhotos.belongsTo(User, {
    foreignKey: "user_id",
    as: "usersprivatephotos",
});


User.belongsToMany(lookingFor, {
    through: UserLookingFor,
    foreignKey: "user_id",
    otherKey: "looking_for_id",
    as: "lookingForOptions",
});

lookingFor.belongsToMany(User, {
    through: UserLookingFor,
    foreignKey: "looking_for_id",
    otherKey: "user_id",
    as: "users",
});

User.hasMany(ShoutOut , {
    foreignKey: "user_id",
    as: "shout_out",
    onDelete: "CASCADE"
})

ShoutOut.belongsTo(User , {
    foreignKey: "user_id",
    as: "usersshoutout",
    onDelete: "CASCADE"
})

User.hasMany(UserGiveRating , {
    foreignKey: "user_id",
    as: "givenRatings",
    onDelete: "CASCADE"
})

UserGiveRating.belongsTo(User , {
    foreignKey: "user_id",
    as: "rater"
})

User.hasMany(UserGiveRating , {
    foreignKey: "rated_user_id",
    as: "receivedRatings"     
})

RatingTitles.hasMany(UserGiveRating , {
    foreignKey: "rating_titles_id",
    as: "ratingDetails",
    onDelete: "CASCADE",    
})

UserGiveRating.belongsTo(RatingTitles, {
    foreignKey: "rating_titles_id",
    as: "ratedUser"
});


User.hasMany(BlockUser, {
    foreignKey: "user_id",
    as: "blockedUsers"
});

User.hasMany(BlockUser, {
    foreignKey: "blocked_user_id",
    as: "blockedBy"
});

BlockUser.belongsTo(User, {
    foreignKey: "user_id",
    as: "blocker"
});

BlockUser.belongsTo(User, {
    foreignKey: "blocked_user_id",
    as: "blocked"
});

User.belongsToMany(Category, {
    through: UserCategory,
    foreignKey: "user_id",
    otherKey: "category_id",
    as: "categories"
});

Category.belongsToMany(User, {
    through: UserCategory,
    foreignKey: "category_id",
    otherKey: "user_id",
    as: "users"
});


export {
    User, 
    AddPhotos, 
    AddPrivatePhotos, 
    lookingFor, 
    UserLookingFor,
    ShoutOut,
    UserGiveRating,
    RatingTitles,
    BlockUser,
    Category,
    UserCategory
};
