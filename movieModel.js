const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let movieSchema = mongoose.Schema({
    Title: String,
    Year: String,
    Released: String,
    Runtime: String,
    Genre: [String],
    Director: [String],
    Writers: [String],
    Actors: [String],
    Plot: [String]
})

Movie = mongoose.model("Movies", movieSchema);
module.exports= Movie;
