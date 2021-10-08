const express = require('express');
const session = require('express-session');
let app = express();
const mongoose = require("mongoose");

app.use(express.static('views'));
app.use(express.json());

const path = require('path');
const fs = require('fs');
const pug = require('pug');

mongoose.connect("mongodb://localhost/movieDB", {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;

app.use(session(
    {secret: 'some secret key here',
    resave: true,
    saveUninitialized: false,
}))
app.use(function(req, res, next){
    console.log(req.session);
    next();
})

app.use(express.urlencoded({extended: true}));

let bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


//Movie Objects
let mov = require("./movie-data/movie-data-2500.json");
const { resolve6 } = require('dns');
const { redirect } = require('statuses');
let movies = {};
let id = 0;
mov.forEach(film => {
    film.Review=[];

    film.Rating = "";

    film.Id="t"+id.toString();
    id+=1;
    
    movies[film.Id] = film;
})
app.locals.movies = movies;


//Person Objects
let people = {};
let v = 0;
let allpeople = []
mov.forEach(film => {
    for (let i=0; i<film.Actors.length; i++) {
        let actor = film.Actors[i];
        if (allpeople.includes(actor)) {
            let theId = Object.keys(people).find(id => {return people[id].Name === actor});
            if (people[theId].hasOwnProperty('ActedMovie')) {
                people[theId].ActedMovie.push(film.Id);
                if (!people[theId].AllWork.includes(film.Id))
                    people[theId].AllWork.push(film.Id);
            }
            else {
                people[theId].ActedMovie = [film.Id];
                if (!people[theId].AllWork.includes(film.Id))
                    people[theId].AllWork.push(film.Id);
            }
        } else {
            let idnum = "p"+ v;
            people[idnum] = {};
            people[idnum].Id = idnum;
            people[idnum].Name = actor;
            people[idnum].ActedMovie = [film.Id];
            people[idnum].AllWork = [film.Id];
            allpeople.push(actor);
            v+=1;
        }
    }
    for (let i=0; i<film.Writer.length; i++) {
        let writer = film.Writer[i];
        if (allpeople.includes(writer)) {
            let theId = Object.keys(people).find(id => {return people[id].Name === writer});
            if (people[theId].hasOwnProperty('WroteMovie')) {
                people[theId].WroteMovie.push(film.Id);
                if (!people[theId].AllWork.includes(film.Id))
                    people[theId].AllWork.push(film.Id);
            }
            else {
                people[theId].WroteMovie = [film.Id];
                if (!people[theId].AllWork.includes(film.Id))
                    people[theId].AllWork.push(film.Id);
            }
        } else {
            let idnum = "p"+ v;
            people[idnum] = {};
            people[idnum].Id = idnum;
            people[idnum].Name = writer;
            people[idnum].WroteMovie = [film.Id];
            people[idnum].AllWork = [film.Id];
            allpeople.push(writer);
            v+=1;
        }
    }
    for (let i=0; i<film.Director.length; i++) {
        let director = film.Director[i];
        if (allpeople.includes(director)) {
            let theId = Object.keys(people).find(id => {return people[id].Name === director});
            if (people[theId].hasOwnProperty('DirectedMovie')){
                people[theId].DirectedMovie.push(film.Id);
                if (!people[theId].AllWork.includes(film.Id))
                    people[theId].AllWork.push(film.Id);
            }
            else {
                people[theId].DirectedMovie = [film.Id];
                if (!people[theId].AllWork.includes(film.Id))
                    people[theId].AllWork.push(film.Id);
            }
        } else {
            let idnum = "p"+ v;
            people[idnum] = {};
            people[idnum].Id = idnum;
            people[idnum].Name = director;
            people[idnum].DirectedMovie = [film.Id];
            people[idnum].AllWork = [film.Id];
            allpeople.push(director);
            v+=1;
        }
    }
})
app.locals.people = people;


// User Objects
let users = {
    "ron133": {
        Username: "ron133",
        Password: "43214321",
        LogIn: "False",
        AccountType: "Contributor",
        Review: ["r0", "r1"],
        FollowingUsers: ["dumbledore", "severusnape", "rachel","harry01", "popeyes"],
        FollowingPeople: ["p0", "p2", "p1", "p6", "p3", "p7"],
        WatchedMovies: ["t0", "t1", "t2", "t3"],
        Notifications: ["Ralph Fiennes has a new movie The Grand Budapest Hotel.", "dumbledore started following you."] 
    },
    "harry01": {
        Username: "harry01",
        Password: "12341234",
        LogIn: "True",
        AccountType: "Regular",
        Review: ["r2", "r3"],
        FollowingUsers: ["ron133", "dumbledore", "severusnape", "rachel","ross200"],
        FollowingPeople: ["p0", "p2", "p1", "p6", "p3", "p7"],
        WatchedMovies: ["t0", "t1", "t2", "t3"],
        Notifications: ["Ralph Fiennes has new movie The Grand Budapest Hotel.", "dumbledore started following you.", "ron133 wrote a review for Meatballs 4."] 
    },
    "ross200":{
        Username: "ross200",
        Password: "comp2406",
        AccountType: "Contributor",
        Review: [],
        FollowingUsers: ["ron133", "dumbledore", "severusnape", "rachel","harry01", "popeyes"],
        FollowingPeople: ["p0", "p2", "p1", "p6", "p3", "p7"],
        WatchedMovies: ["t0", "t1", "t2", "t3"],
        Notifications: [] 
    },
    "rachel":{
        Username: "rachel",
        Password: "webdev1234",
        LogIn: "False",
        AccountType: "Regular",
        Review: [],
        FollowingUsers: ["ron133", "dumbledore", "severusnape", "ross200","harry01"],
        FollowingPeople: ["p0", "p2", "p1", "p3", "p6", "p7"],
        WatchedMovies: ["t0", "t1", "t2", "t3"],
        Notifications: [] 

    },
    "severusnape": {
        Username: "severusnape",
        Password: "00000000a",
        LogIn: "False",
        AccountType: "Contributor",
        Review: [],
        FollowingUsers: ["ron133", "dumbledore", "moviejunkie", "rachel","harry01"],
        FollowingPeople: ["p0", "p2", "p1", "p3", "p6", "p7"],
        WatchedMovies: ["t0", "t1", "t2", "t3"],
        Notifications: [] 

    },
    "moviejunkie": {
        Username: "moviejunkie",
        Password: "movieweb1",
        LogIn: "False",
        AccountType: "Regular",
        Review: [],
        FollowingUsers: ["ron133", "dumbledore", "severusnape", "rachel","harry01"],
        FollowingPeople: ["p0", "p2", "p1", "p6", "p3", "p7"],
        WatchedMovies: ["t0", "t1", "t2", "t3"],
        Notifications: [] 

    },
    "dumbledore": {
        Username: "dumbledore",
        Password: "lollol",
        LogIn: "False",
        AccountType: "Regular",
        Review : ["r4"],
        FollowingUsers: ["ron133", "dumbledore", "severusnape", "rachel","harry01", "moviejunkie"],
        FollowingPeople: ["p0", "p2", "p1", "p6", "p3", "p7"],
        WatchedMovies: ["t0", "t1", "t2", "t3"],
        Notifications: [] 
    },
    "popeyes": {
        Username: "popeyes",
        Password: "somepassword",
        LogIn: "False",
        AccountType: "Contributor",
        Review: [],
        FollowingUsers: ["ron133", "dumbledore", "severusnape", "rachel","harry01"],
        FollowingPeople: ["p3", "p7", "p6", "p0", "p2", "p1"],
        WatchedMovies: ["t0", "t1", "t2", "t3"],
        Notifications: [] 
    }
}
app.locals.users = users;

//Review Objects
let reviews = {
    "r0": {
        reviewUser: "ron133",
        reviewMovie: "t0",
        reviewRating: "5", 
        reviewText: "Just okay? But it could have been better. It had many flaws",
        reviewBrief: "Not as bad as I thought.",
        reviewId: "r0"            
    },
    "r1": {
        reviewUser: "ron133",
        reviewMovie: "t0",
        reviewRating: "5", 
        reviewText: "I'll just write whatever here",
        reviewBrief: "Whatever....." ,
        reviewId: "r1"            
    },
    "r2":{
        reviewUser: "harry01",
        reviewMovie: "t2",
        reviewRating: "1", 
        reviewText: "Worst movie ever.",
        reviewBrief: ":(",       
        reviewId: "r2"                 
    },
    "r3": {
        reviewUser: "harry01",
        reviewMovie: "t3",
        reviewRating: "7", 
        reviewText: "I'm too lazy to write this review. It is a strange movie",
        reviewBrief: "I don't know how to describe this movie",
        reviewId: "r3"                        
    },
    "r4": {
        reviewUser: "dumbledore",
        reviewMovie: "t4",
        reviewRating: "9", 
        reviewText: "I want to watch this again",
        reviewBrief: "I think it's a nice movie.",
        reviewId: "r4"            
    }
}
movies["t4"].Review.push("r4");
movies["t3"].Review.push("r3");
movies["t2"].Review.push("r2");
movies["t0"].Review.push("r0");
movies["t0"].Review.push("r1");

app.locals.reviews = reviews;

//All the Routers
let userRouter = require("./users-router");
app.use("/users", userRouter);
let moviesRouter = require("./movies-router");
app.use("/movies", moviesRouter);
let peopleRouter = require("./people-router");
app.use("/people", peopleRouter);
let reviewsRouter = require("./reviews-router");
app.use("/reviews", reviewsRouter);
const { Mongoose } = require('mongoose');	
const { Script } = require('vm');

//Home Page
app.get("/", (request, response, next) => {
    response.status(200).send(pug.renderFile("views/homepage.pug", {}));
});


//Sign in Page
app.get("/signin", (req, res, next) => {
    res.status(200).send(pug.renderFile("views/signin.pug", {}));
});
app.post("/signin", signin);

//Sign Out
app.post("/signout", signout);

//Register Page
app.get("/register", (req, res, next) => {
    res.status(200).send(pug.renderFile("views/register.pug"));
});


//Profile Page
app.get("/profile", (req, res, next)=> {
    if (!req.session.loggedin) {
        res.redirect("/signin");
    } else {
        res.redirect("/users/"+req.session.username);
    }
}); 


// Get Contribute (Add Movie/Person) Page
app.get("/contribute", (req, res, next) => {
    if (!req.session.loggedin) {
        res.redirect("/signin");
    } else {
        if (users[req.session.username].AccountType==="Contributor") {
            res.status(200).send(pug.renderFile("views/contribute.pug", {users: users}));
        } else {
            let errorcode = "403";
            let errormessage = `You are a Regular user. Upgrade your account to Contributing to access the page!`;
            res.status(200).send(pug.renderFile("views/error.pug", {errormessage, errorcode}))
        }
    }

});

// Advanced Search Page
app.get("/search", (req, res, next) => {
    res.status(200).send(pug.renderFile("./views/advsearch.pug", {}));
});
app.post("/search", dosearch);

app.post("/signup", register);


//404 Error page
app.use((req, res)=>{
    // res.status(404).send("Not found");
    let errorcode = "404";
    let errormessage = `Not found`;
    res.status(200).send(pug.renderFile("views/error.pug", {errormessage, errorcode}))

});

 function signin(req, res, next) {
    if (req.session.loggedin) {
        console.log("Logged in already!");
        let errorcode = "";
        let errormessage = `Logged in already!`;
        res.status(200).send(pug.renderFile("views/error.pug", {errormessage, errorcode}))            
        return;
    }
    let username = req.body.username;
    let password = req.body.password;

    db.collection('users').findOne({ username: req.body.username}, function(err, user) {
        
        // In case the user not found   
        if(err) {
            console.log('THIS IS ERROR RESPONSE')
            res.json(err)
        } 
        if (user && user.password === req.body.password){
            console.log('User and password is correct')
            req.session.loggedin = true;
            req.session.username = username;
            req.session.id = user._id;
            console.log("ID: "+req.session.id);
            res.redirect("/");
         
        } else {
            console.log("Credentials wrong");
            let errorcode = "401";
            let errormessage = `Wrong password or the user does not exist!`;
            res.status(200).send(pug.renderFile("views/error.pug", {errormessage, errorcode}))        
            // res.status(401).send("Wrong password!");
          
        }              
    });
}


//Sign out
function signout(req, res, next) {
    if (req.session.loggedin) {
        req.session.destroy();
        res.redirect("/");
        return;
    } else {
        let errorcode = "401";
        let errormessage = `You can't log out. You are not even logged in!`;
        res.status(200).send(pug.renderFile("views/error.pug", {errormessage, errorcode}))        
        // res.status(401).send("You can't log out. You are not even logged in");
    }

}

//register
function register(req, res, next) {
    if (req.session.loggedin) {
        console.log("Logged in already!");
        let errorcode = "";
        let errormessage = `Logged in already!`;
        res.status(200).send(pug.renderFile("views/error.pug", {errormessage, errorcode}))            
        return;
    }

    let username = req.body.username;
    let password = req.body.password;
    console.log("Password: " + password + "             " + "Username: " + username);
    let obj = {username: username, password: password};

    User.findOne({ username: req.body.username }, function (err, user) {
        if (err) throw err;

        if (user) {
            let errorcode = "400";
            let errormessage = `A user with that username already exists. Please go back and pick another username.`;
            res.status(200).send(pug.renderFile("views/error.pug", {errormessage, errorcode}))            
            // res.status(400).send("A user with that username already exists. Please go back and pick another username.");
        }
        else {
            users[username] = {};
            users[username].Username=username;
            users[username].Password=password;
            users[username].LogIn="True";
            users[username].AccountType="Regular";
            users[username].Review=[];
            users[username].FollowingUsers=[];
            users[username].FollowingPeople=[];
            users[username].WatchedMovies=[];
            users[username].Notifications=["Thank you for registering!"];
    
            mongoose.connection.db.collection("users").insertOne(obj, function (err, result) {
                res.redirect("/signin");
            });
        }
    });
};
   
//Build url with queries
function dosearch(req, res, next) {
    console.log(req.body);

    let querylink="/";

    //search by person on the Advanced search page
    if (req.body.hasOwnProperty("searchbyperson")) {
        querylink="/people?name="+req.body.searchbyperson;
    } else if (req.body.hasOwnProperty("selectv")){     
    //use search bar
        let selectv = req.body.selectv;
        if (selectv==="title") {
            querylink="/movies?title="+req.body.dosearchbar;
        } else if (selectv==="genre") {
            querylink="/movies?genre="+req.body.dosearchbar;
        } else if (selectv==="person") {
            querylink="/people?name="+req.body.dosearchbar;
        }
    } else {            
    //search by movies on the advanced search page
        querylink = "/movies?";
        if (req.body.searchtitle.length>0) {
            querylink+="title="+req.body.searchtitle;
        }
        if (req.body.searchyear.length>0) {
            querylink+="&year="+req.body.searchyear;
        }
        if (req.body.searchgenre.length>0) {
            querylink+="&genre="+req.body.searchgenre;
        }
        if (req.body.searchactor.length>0) {
            querylink+="&actor="+req.body.searchactor;
        }
        if (req.body.searchdirector.length>0) {
            querylink+="&director="+req.body.searchdirector;
        }
        if (req.body.searchwriter.length>0) {
            querylink+="&writer="+req.body.searchwriter;
        }         
    }
    res.redirect(querylink);
}

app.listen(3000);
console.log("Server listening at http://localhost:3000");
