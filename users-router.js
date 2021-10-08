const User = require("./userModel");
const express = require('express');
let router = express.Router();

router.use(express.static('views'));
router.use(express.json());

const path = require('path');
const fs = require('fs');
const pug = require('pug');
const mongoose = require("mongoose");

//User Page (/users/{#user_id})
router.get("/:id", getuser);


//Profile (user) page post requests
router.post("/:id", userposts);


//User Watchlist Page Displayed
router.get("/:id/watchlist", getwatchl);

//User Watchlist Pagge - handle removal button
router.post("/:id/watchlist", userposts);


//User Following Page - Display
router.get("/:id/usersfollow", ufollowing);

//delete user from following
router.post("/:id/usersfollow", userposts);


//Persons Following Page - Display
router.get("/:id/peoplefollow", pfollowing);

//delete person from following
router.post("/:id/peoplefollow", userposts);


//User Notification Page
router.get("/:id/notification", notifpage);


//for deleting notification on notification page
router.post("/:id/notification", userposts);


//handle get request for individual user page
function getuser(req, res, next) {
    let users = req.app.locals.users;
    let movies = req.app.locals.movies;
    let people = req.app.locals.people;
    let reviews = req.app.locals.reviews;

    if (users.hasOwnProperty(req.params.id)) {
        //when accessing profile page (you are logged in)
        if (req.session.loggedin && req.session.username===users[req.params.id].Username) {
            res.status(200).send(pug.renderFile("./views/profile.pug", {user: users[req.session.username], movies: movies, people: people, users: users, reviews:reviews}));
        } else {
            //accessing other user's page
            const individual = users[req.params.id];

            console.log(individual.Review);
            
            //follow button should come up only if logged in
            let disable="";
            if (!req.session.loggedin) {
                disable="disabled";
            }

            //Following check:
            let buttonname = "Follow";
            if (req.session.loggedin) {
                if (users[req.session.username].FollowingUsers.includes(req.params.id)) {
                    buttonname = "Unfollow";
                }
            }

            res.status(200).send(pug.renderFile("./views/otheruser.pug", { user: individual, movies: movies, people: people, users: users, disable: disable, folbutton: buttonname, reviews:reviews}));
        }
    } else {
        // id does not exist
        let errorcode = "404";
        let errormessage = `Cannot find User ${req.params.id}. This user probably does not exist.`;
        res.status(200).send(pug.renderFile("views/error.pug", {errormessage, errorcode}))        
    }
} 


//handle post requests on the profile page / notification page / watchlist page/ following pages
function userposts(req, res, next) {
    let users = req.app.locals.users;
    let reviews = req.app.locals.reviews;

    console.log(req.body);
    if (req.body.FollowUser) {
        //follow user 
        users[req.session.username].FollowingUsers.push(req.body.FollowUser);
        //add notification to the other user
        users[req.body.FollowUser].Notifications.push(req.session.username+" started following you.")
        res.sendStatus(201);
    } else if (req.body.UnfollowUser) {
        //Unfollow User 
        let removindex = users[req.session.username].FollowingUsers.indexOf(req.body.UnfollowUser);
        if (removindex > -1) {
            users[req.session.username].FollowingUsers.splice(removindex, 1);
        }
        res.sendStatus(201);
    } else if (req.body.UnfollowPerson) {
        //Unfollow Person from profile page
        let removindex = users[req.session.username].FollowingPeople.indexOf(req.body.UnfollowPerson);
        if (removindex > -1) {
            users[req.session.username].FollowingPeople.splice(removindex, 1);
        }
        res.sendStatus(201);
    } else if (req.body.account_type) {
        //change account type
        let acctype=req.body.account_type;
        if (acctype==="2") {
            users[req.session.username].AccountType="Contributor";
        } else if (acctype==="1") {
            users[req.session.username].AccountType="Regular";
        }
        res.redirect("/profile");
    } else if (req.body.RemoveMovie) {
        //remove movie from watched list on profile page
        let removindex = users[req.session.username].WatchedMovies.indexOf(req.body.RemoveMovie);
        if (removindex > -1) {
            users[req.session.username].WatchedMovies.splice(removindex, 1);
        }
        res.sendStatus(201);
    } else if (req.body.DeleteReview) {
        //delete review from Movie
        let movId=reviews[req.body.DeleteReview].reviewMovie;
        let removindex2 = req.app.locals.movies[movId].Review.indexOf(req.body.DeleteReview);
        if (removindex2 > -1) {
            req.app.locals.movies[movId].Review.splice(removindex2, 1);
        }
        //delete review from user's reviews
        let removindex = users[req.session.username].Review.indexOf(req.body.DeleteReview);
        if (removindex > -1) {
            users[req.session.username].Review.splice(removindex, 1);
        }
        //delete review from all reviews
        delete reviews[req.body.DeleteReview];
        delete reviews[req.body.DeleteReview];

        res.sendStatus(201);     
    } else if (req.body.DeleteNotif) {
        //delete notifications on profile page
        let removindex = users[req.session.username].Notifications.indexOf(req.body.DeleteNotif);
        if (removindex > -1) {
            users[req.session.username].Notifications.splice(removindex, 1);
        }
        res.sendStatus(201);     
    }
}

//doing GET on user watchlist
function getwatchl(req, res, next) {
    let users = req.app.locals.users;

    //check if user is logged in and viewing their own
    let loggedin = users[req.params.id]===users[req.session.username];

    //if user exists, then render
    if (users.hasOwnProperty(req.params.id)) {
        res.status(200).send(pug.renderFile("./views/watchlist.pug", {user: users[req.params.id], movies: req.app.locals.movies, loggedin:loggedin}));
    } else {
        let errorcode = "404";
        let errormessage = `Cannot find User ${req.params.id}. This user probably does not exist.`;
        res.status(200).send(pug.renderFile("views/error.pug", {errormessage, errorcode}))        
    }
} 

//Handle Get requests for list of users the user follows - page
function ufollowing (req, res, next) {
    let users = req.app.locals.users;

    //check if user is logged in and viewing their own
    let loggedin = users[req.params.id]===users[req.session.username];

    if (users.hasOwnProperty(req.params.id)) {
        if (loggedin)
            res.status(200).send(pug.renderFile("./views/usersfollow.pug", {user: users[req.params.id], users, loggedin}));
        else {
            let errorcode = "401";
            let errormessage = `You are not allowed to see this.`;
            res.status(200).send(pug.renderFile("views/error.pug", {errormessage, errorcode}))            
        }
    } else {
        let errorcode = "404";
        let errormessage = `Cannot find User ${req.params.id}. This user probably does not exist.`;
        res.status(200).send(pug.renderFile("views/error.pug", {errormessage, errorcode}))        
    }
}

//Handle Get requests for list of persons the user follows - page
function pfollowing (req, res, next) {
    let users = req.app.locals.users;

    //check if user is logged in and viewing their own
    let loggedin = users[req.params.id]===users[req.session.username];

    if (users.hasOwnProperty(req.params.id)) {
        res.status(200).send(pug.renderFile("./views/peoplefollow.pug", {user: users[req.params.id], people:req.app.locals.people, loggedin}));
    } else {
        let errorcode = "404";
        let errormessage = `Cannot find User ${req.params.id}. This user probably does not exist.`;
        res.status(200).send(pug.renderFile("views/error.pug", {errormessage, errorcode}))        
    }
}


//get user notification page and display
function notifpage (req, res, next) {

    let users = req.app.locals.users;

    //check if user exists
    if (users.hasOwnProperty(req.params.id)) {
        //only the logged in user can view only their own notifications
        if (req.session.loggedin && req.session.username===users[req.params.id].Username) {
            res.status(200).send(pug.renderFile("./views/notification.pug", {user: users[req.session.username]}));
        } else {
            let errorcode = "401";
            let errormessage = `You are not allowed to see this.`;
            res.status(200).send(pug.renderFile("views/error.pug", {errormessage, errorcode}))            
        }
    } else {
        let errorcode = "404";
        let errormessage = `Cannot find User ${req.params.id}. This user probably does not exist.`;
        res.status(200).send(pug.renderFile("views/error.pug", {errormessage, errorcode}))        
    }
}

module.exports = router ;
