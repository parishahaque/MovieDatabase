const Movies = require("./movieModel");
const express = require('express');
let router = express.Router();

router.use(express.static('views'));
router.use(express.json());

const path = require('path');
const fs = require('fs');
const pug = require('pug');

//Movie Page (/movies/{#movie_id})
router.get("/:id", (req, res, next)=> {
    let movies = req.app.locals.movies;
    let users = req.app.locals.users;
    let people = req.app.locals.people;

    if (movies.hasOwnProperty(req.params.id)) {
        const afilm = movies[req.params.id];

        let disable = "";
        let alreadywatched = "unwatched";
        if (!req.session.loggedin) {
            //disable some functionalities if not logged in
            disable = "disabled";
        } else {
            //watched list
            if (users[req.session.username].WatchedMovies.includes(req.params.id)) {
                alreadywatched = "watched";
            }
        }

        //calculate movie average rating
        let av = 0;
        let mreviews = Object.values(req.app.locals.reviews).filter(x=>{return x.reviewMovie===afilm.Id});
        for (let i=0; i<mreviews.length; i++) {
            av += Number(mreviews[i].reviewRating);
        }
        av = av/mreviews.length;
        afilm.Rating = av;
        
        
        res.status(200).send(pug.renderFile("./views/movie.pug", { movies: movies, reviews: req.app.locals.reviews, film: afilm, people: people, users: users, disable:disable, alreadywatched:alreadywatched, username: req.session.username }));
    } else {
        let errorcode = "404";
        let errormessage = `Cannot find the movie with ID ${req.params.id}. This movie probably does not exist.`;
        res.status(200).send(pug.renderFile("views/error.pug", {errormessage, errorcode}))        
      }
}); 

//post request on individual movie page
router.post("/:id", (req, res, next) => {
    console.log(req.body);

    if (req.body.AddFilm) {
        //add to watched list
        req.app.locals.users[req.session.username].WatchedMovies.push(req.body.AddFilm);
        res.sendStatus(201);
    } else if (req.body.RemoveFilm) {
        //remove from watched list
        let removindex = req.app.locals.users[req.session.username].WatchedMovies.indexOf(req.body.RemoveFilm);
        if (removindex > -1) {
            req.app.locals.users[req.session.username].WatchedMovies.splice(removindex, 1);
        }
        res.sendStatus(201);
    } else if (req.body.DeleteReview) {
         //deleting review by pressing button
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
    }     

})

//List of Movies and Search Results for Movies
router.get("/", doquery);
router.get("/", loadm);

//Add a Movie from Contribute page
router.post("/", newMovie);



//New Movie Creation
function newMovie(req, res, next) {
    if (req.body.hasOwnProperty("title")) {

        //check whether there were appropriate input
        let bool = req.body.title.length>0 && req.body.year.length>0 && req.body.time.length>0 && req.body.genre.length>0;
        bool = bool && (req.body.actor.length>0 || req.body.director.length>0 || req.body.writer.length>0);
        bool = bool && (!isNaN(req.body.year) && !isNaN(req.body.time));

        let lmovies = Object.values(req.app.locals.movies);
        let movie = lmovies.find(x => {return x.Name === req.body.name});

        if (!bool) {
            res.redirect("/contribute");
        } else {
            let movies = req.app.locals.movies;
            let newId = "t";

            //set id of new movie (should be the biggest current id number +1)
            let all = Object.keys(movies);
            let max = Math.max(...all.map(x => Number(x.replace("t", ""))))+1;
            newId += max.toString();

            //create a new movie object
            movies[newId] = {};
            movies[newId].Title = req.body.title;
            movies[newId].Year = req.body.year;
            movies[newId].Plot = req.body.plot;
            movies[newId].Runtime = req.body.time + " min";
            movies[newId].Genre = [];
            movies[newId].Released = ""
            movies[newId].Rating = ""
            movies[newId].Id = newId;
            movies[newId].Director = [];
            movies[newId].Actors = [];
            movies[newId].Writer = [];
            movies[newId].Review = [];
            movies[newId].Poster = req.body.poster;

            //add in genres
            let g = req.body.genre.split(",");
            for (let i=0; i<g.length; i++) {
                movies[newId].Genre.push(g[i]);
            }
            let users = Object.values(req.app.locals.users);

            //add in actors
            if (req.body.actor.length>0) {
                let a = req.body.actor.split(",");
                for (let i=0; i<a.length; i++) {
                    movies[newId].Actors.push(a[i]);
                    
                    //if the person doesn't exist, redirect
                    if (typeof Object.values(req.app.locals.people).find(x=> {return x.Name===a[i]})==='undefined') {
                        res.redirect("/contribute");
                        return;
                    }
                    
                    //create notification for users that follow the person
                    let theperson = Object.values(req.app.locals.people).find(x=> {return x.Name===a[i]}).Id;

                    users = users.filter(x => {return x.FollowingPeople.includes(theperson)});
                    for (let j=0; j<users.length; j++) {
                        users[j].Notifications.push(a[i]+" has a new movie "+req.body.title+".");
                    }
                    
                    //modify the person object
                    if(!req.app.locals.people[theperson].hasOwnProperty("ActedMovie")) {
                        req.app.locals.people[theperson].ActedMovie=[];
                    }
                    req.app.locals.people[theperson].ActedMovie.push(newId);
                    req.app.locals.people[theperson].AllWork.push(newId);
                }
            }
            //add in writers
            if (req.body.writer.length>0) {
                let w = req.body.writer.split(",");
                for (let i=0; i<w.length; i++) {
                    movies[newId].Writer.push(w[i]);

                    //if the person doesn't exist, redirect
                    if (typeof Object.values(req.app.locals.people).find(x=> {return x.Name===w[i]})==='undefined') {
                        res.redirect("/contribute");
                        return;
                    }

                    //create notification
                    let theperson = Object.values(req.app.locals.people).find(x=> {return x.Name===w[i]}).Id;
                    users = users.filter(x => {return x.FollowingPeople.includes(theperson)});
                    for (let j=0; j<users.length; j++) {
                        users[j].Notifications.push(w[i]+" has a new movie "+req.body.title+".");
                    }

                    //modify the person object
                    if(!req.app.locals.people[theperson].hasOwnProperty("DirectedMovie")) {
                        req.app.locals.people[theperson].DirectedMovie=[];
                    }
                    req.app.locals.people[theperson].DirectedMovie.push(newId);
                    req.app.locals.people[theperson].AllWork.push(newId);

                }
            }
            //add in directors
            if (req.body.director.length>0) {
                let a = req.body.director.split(",");
                for (let i=0; i<a.length; i++) {
                    movies[newId].Director.push(a[i]);
                    
                    //person doesn't exist
                    if (typeof Object.values(req.app.locals.people).find(x=> {return x.Name===a[i]})==='undefined') {
                        res.redirect("/contribute");
                        return;
                    }

                    //notification
                    let theperson = Object.values(req.app.locals.people).find(x=> {return x.Name===a[i]}).Id;
                    users = users.filter(x => {return x.FollowingPeople.includes(theperson)});
                    for (let j=0; j<users.length; j++) {
                        users[j].Notifications.push(a[i]+" has a new movie "+req.body.title+".");
                    }
                    
                    //modify the person object
                    if(!req.app.locals.people[theperson].hasOwnProperty("WroteMovie")) {
                        req.app.locals.people[theperson].WroteMovie=[];
                    }
                    req.app.locals.people[theperson].WroteMovie.push(newId);
                    req.app.locals.people[theperson].AllWork.push(newId);

                }
            }

            //go to the new movie
            console.log("created: " + movies[newId]);
            res.redirect("/movies/"+newId);
        }
    }

}

//Query Parsing
function doquery(req, res, next) { 
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
	
	if(!req.query.title){
		req.query.title = "";
    }
    
    if(!req.query.genre){
		req.query.genre = "";
    }
    
    if(!req.query.actor){
		req.query.actor = "";
    }
    
    if(!req.query.director){
		req.query.director = "";
    }
    
    if(!req.query.writer){
		req.query.writer = "";
    }
    
    if(!req.query.year){
		req.query.year = "";
	}
	next();
}

//Filter Results by Query Paramters
function loadm(request, response, next) {
    lmovies = Object.values(request.app.locals.movies);

    //Search Result for Movies (check if query "title" was defined)
    if (request.query.hasOwnProperty("title")) {
        let amovie = decodeURI(request.query.title);
        if (amovie.length>0)
            lmovies = lmovies.filter(x=>{return x.Title.toLowerCase().includes(amovie.toLowerCase())});
    } //Genre
    if (request.query.hasOwnProperty("genre")) {
        let s = decodeURI(request.query.genre).toLowerCase();
        if (s.length>0)
            lmovies = lmovies.filter(x=>{
                for (let i=0; i<x.Genre.length; i++) {
                    if (x.Genre[i].toLowerCase().includes(s.toLowerCase()))
                        return x;
                }
            });
    } //Actor
    if (request.query.hasOwnProperty("actor")) {
        let s = decodeURI(request.query.actor);
        if (s.length>0)
            lmovies = lmovies.filter(x=>{
                for (let i=0; i<x.Actors.length; i++) {
                    if (x.Actors[i].toLowerCase().includes(s.toLowerCase()))
                        return x;
                }
            });
    } //Director
    if (request.query.hasOwnProperty("director")) {
        let s = decodeURI(request.query.director);
        if (s.length>0)
            lmovies = lmovies.filter(x=>{
                for (let i=0; i<x.Director.length; i++) {
                    if (x.Director[i].toLowerCase().includes(s.toLowerCase()))
                        return x;
                }
            });
    } //Writer
    if (request.query.hasOwnProperty("writer")) {
        let s = decodeURI(request.query.writer);
        if (s.length>0)
            lmovies = lmovies.filter(x=>{
                for (let i=0; i<x.Writer.length; i++) {
                    if (x.Writer[i].toLowerCase().includes(s.toLowerCase()))
                        return x;
                }
            });
    } //Year
    if (request.query.hasOwnProperty("year")) {
        let s = request.query.year;
        if (s.length>0 && !isNaN(Number(s)))
            lmovies = lmovies.filter(x=>{return x.Year === s});
    }

    //pagination
    if (request.query.page) {
        let s = Number(request.query.page);

        if (!isNaN(s)) {
            pagenum = s;
            lmovies = lmovies.splice(s*10-10, s*10);
        }
    } 
    lmovies = lmovies.splice(0, 10);

    response.status(200).send(pug.renderFile("./views/movies.pug", { movies: lmovies, pagenum: request.query.page, qstring: request.qstring }));

}

module.exports = router ;
