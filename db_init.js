const mongoose = require("mongoose");
const User = require("./userModel")
const Movie = require("./movieModel")
let mov = require("./movie-data/movie-data-2500.json");


var users = [
    { id: 1, username: "ron133", password: "43214321" },
    { id: 2, username: "ross200", password: "comp2406" },
    { id: 3, username: "rachel", password: "webdev123" },
    { id: 4, username: "severusnape", password: "00000000a" },
    { id: 5, username: "moviejunkie", password: "movieweb1" },
    { id: 6, username: "dumbledore", password: "lollol" },
    { id: 7, username: "popeyes", password: "somepassword" },
    { id: 7, username: "harry01", password: "12341234" },
]

mongoose.connect("mongodb://localhost/movieDB",  {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {

    console.log("Connecting to movieDB database");

    mongoose.connection.db.dropDatabase(function(err, result) {
        if(err) {
            console.log("Error dropping database");
            console.log(err);
            return;
        }

        console.log("Dropped database. Starting re-creation.");

        let totalUsers = users.length;
		let finishedusers = 0;
		let countuFail = 0;
		let countuSuccess = 0;
    
        users.forEach(user => {
            let u = new User()
            u.username = user.username;
            u.password = user.password;
            u.Login = user.Login;
            u.WatchedMovies = user.WatchedMovies;
            u.AccountType = user.AccountType;
            u.Review = user.Review;
            u.FollowingUsers = user.FollowingUsers;
            u.FollowingPeople = user.FollowingPeople;
            u.Notifications = user.Notifications;       
    
            u.save((err, result) => {
                finishedusers++;
                if (err) {
                    countuFail++;
                    console.log("Error saving user: " + JSON.stringify(u));
                    console.log(err.message);
                } else {
                    countuSuccess++;
                    console.log(JSON.stringify(u));
                }

                if(finishedusers == totalUsers){
					console.log("Users Finished.");
					console.log("Users Successfully added: " + countuSuccess);
                    console.log("Users Failed: " + countuFail);
                    mongoose.connection.close();
                }

            })
        })
    });
});
