const express = require('express');
let router = express.Router();

router.use(express.json());

const path = require('path');
const fs = require('fs');
const pug = require('pug');

//Review Page
router.get("/:id", (req, res, next) => {          
    let r = req.app.locals.reviews[req.params.id];
    let f = req.app.locals.movies[r.reviewMovie];
    res.status(200).send(pug.renderFile("./views/reviewpage.pug", {review: r, film: f}));
});


router.get("/", queryParser);
router.get("/", loadReviews);
router.get("/", respondReviews);

router.post("/", postr);

//Handle Post Requests here
function postr(req, res, next) {

    console.log(req.body);
    //deleting review by pressing button
    if (req.body.DeleteReview) {
        let reviews = req.app.locals.reviews;
        let users = req.app.locals.users;

        //delete review from Movie
        let movId=reviews[req.body.DeleteReview].reviewMovie;
        let removindex2 = req.app.locals.movies[movId].Review.indexOf(req.body.DeleteReview);
        if (removindex2 > -1) {
            req.app.locals.movies[movId].Review.splice(removindex2, 1);
        }
        //delete review from user's Reviews
        let removindex = users[req.session.username].Review.indexOf(req.body.DeleteReview);
        if (removindex > -1) {
            users[req.session.username].Review.splice(removindex, 1);
        }
        //delete review from all reviews
        delete reviews[req.body.DeleteReview];
        delete reviews[req.body.DeleteReview];
        res.sendStatus(201);     
    //create new review
    } else {
        let rating=req.body.rating;
        let brief=req.body.brief;
        let full=req.body.full;
        let user = req.session.username;
        let movie = "";
        if (!req.body.brb) {
            movie = req.body.frb;
        } else {
            movie = req.body.brb;
        }

        //check if user is logged in
        if (!req.session.loggedin) {
            res.redirect("/signin");
        } else {
            //conditions for creating review
            if ((rating.length>0 && brief.length>0 &&full.length>0 && req.body.frb) || (rating.length>0 && req.body.brb) ) {
                let newId = "r";

                //set id of new review (should be the biggest current id number +1)
                let allrev = Object.keys(req.app.locals.reviews);
                let max = Math.max(...allrev.map(x => Number(x.replace("r", ""))))+1;
                newId += max.toString();

                //new review object
                req.app.locals.reviews[newId] = {};
                req.app.locals.reviews[newId].reviewUser = user;
                req.app.locals.reviews[newId].reviewMovie = movie;
                req.app.locals.reviews[newId].reviewRating = rating;
                req.app.locals.reviews[newId].reviewText = full;
                req.app.locals.reviews[newId].reviewBrief = brief;
                req.app.locals.reviews[newId].reviewId = newId;

                //add review to the movie and to user
                req.app.locals.movies[movie].Review.push(newId);
                req.app.locals.users[req.session.username].Review.push(newId);

                //set notifications
                let users = Object.values(req.app.locals.users);
                users = users.filter(x => {return x.FollowingUsers.includes(req.session.username)});
                for (let i=0; i<users.length; i++) {
                    users[i].Notifications.push(req.session.username+" wrote a review for movie "+req.app.locals.movies[movie].Title+".");
                }

            } 
            res.redirect("/movies/"+movie);
        }
    }

}

//Query Parsing
function queryParser (req, res, next) { 

    let params = [];
	for(prop in req.query){
		if(prop == "page"){
			continue;
		}
		params.push(prop + "=" + req.query[prop]);
	}
    req.qstring = params.join("&");
    
    try{
		if(!req.query.limit){
			req.query.limit = 10;
		}

		req.query.limit = Number(req.query.limit);

		if(req.query.limit > MAX_PRODUCTS){
			req.query.limit = MAX_PRODUCTS;
		}
	}catch{
		req.query.limit = 10;
	}
		
	try{
		req.query.page = req.query.page || 1;
		req.query.page = Number(req.query.page);
		if(req.query.page < 1){
			req.query.page = 1;
		}
	}catch{
		req.query.page = 1;
	}
    
    //find by review movie id
	if(!req.query.movie){
		req.query.movie = "";
    }
    
    //find by reviewer
    if (!req.query.reviewer) {
        req.query.reviewer = "";
    }

	next();
}

function loadReviews(req, res, next) {
    let lreviews = Object.values(req.app.locals.reviews);

    //QUERY PARAMETERS
    //movie: id of movie
    //get reviews for the movie in query parameter
    if (req.query.hasOwnProperty("movie")) {
        const m = decodeURI(req.query.movie);
        if (m.length>0) {
            lreviews = lreviews.filter(x=>{return x.reviewMovie===m});
        }
    }

    //reviewer: get reviews by reviewer in query parameter
    if (req.query.hasOwnProperty("reviewer")) {
        const rw = decodeURI(req.query.reviewer);
        if (rw.length>0) {
            lreviews = lreviews.filter(x=>{return x.reviewUser===rw});
        }
    }

    //pagination
    if (req.query.page) {
        let s = Number(req.query.page);

        if (!isNaN(s)) {
            pagenum = s;
            lreviews = lreviews.splice(s*10-10, s*10);
        }
    } 
    lreviews = lreviews.splice(0, 10);

	res.reviews = lreviews;
	next();
}

//render page for reviews list
function respondReviews(req, res, next){
    res.status(200).send(pug.renderFile("./views/reviews.pug",  {reviews: res.reviews, qstring: req.qstring, pagenum: req.query.page, username: req.session.username, movies:req.app.locals.movies}));
}

module.exports = router;
