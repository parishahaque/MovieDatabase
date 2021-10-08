const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Movie = require("./movieModel")


let userSchema = mongoose.Schema({
     username: { type: String, required: true },
     password: { type: String, required: true },
     Login: String,
     WatchedMovies: [{type: mongoose.Schema.Types.ObjectId, ref: "Movie"}],
     AccountType: String,
     Review : [String],
     FollowingUsers: [String],
     FollowingPeople: [String],
     Notifications: [String],
});

User = mongoose.model("Users", userSchema);
module.exports= User;
