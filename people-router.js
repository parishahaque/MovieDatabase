const express = require('express');
let router = express.Router();

router.use(express.static('views'));
router.use(express.json());

const path = require('path');
const fs = require('fs');
const pug = require('pug');


//Person Page
router.get("/:id", (req, res, next)=> {
    if (req.app.locals.people.hasOwnProperty(req.params.id)) {
        const aperson = req.app.locals.people[req.params.id];

        //Following check:
        let buttonname = "Follow";
        if (req.session.loggedin) {
            if (req.app.locals.users[req.session.username].FollowingPeople.includes(req.params.id)) {
                buttonname = "Unfollow";
            }
        }

        //disable follow buttons if not logged in
        let disable = "";
        if (!req.session.loggedin) {
            disable="disabled";
        }


    //Frequent Collaborators for the person
        let frequent = {};
        for (p in req.app.locals.people) {
            //counter: how many collaboration that aperson had with p
            let counter =0;
            for (let i=0; i<aperson.AllWork.length; i++) {
                if (req.app.locals.people[p]!=aperson && req.app.locals.people[p].AllWork.includes(aperson.AllWork[i])) {
                    counter += 1;
                }
            }
            // If there is least 1 collaboration, the person is added to
            if (counter>0) {
                counter = counter.toString();
                if (frequent.hasOwnProperty(counter))
                    frequent[counter].push(req.app.locals.people[p]);
                else
                    frequent[counter]=[req.app.locals.people[p]];
            }
        }
    res.status(200).send(pug.renderFile("./views/exampleperson.pug", { person: aperson, frequent: frequent, movies: req.app.locals.movies, folbutton: buttonname, disable: disable}));
    } else {
        let errorcode = "404";
        let errormessage = `Cannot find the person with ID ${req.params.id}. This person probably does not exist.`;
        res.status(200).send(pug.renderFile("views/error.pug", {errormessage, errorcode}))        
      }
}); 

//Follow and Unfollow Person from the Person page
router.post("/:id", (req, res, next)=> {
    console.log(req.body);

    //Follow
    if (req.body.FollowPerson) {
        req.app.locals.users[req.session.username].FollowingPeople.push(req.params.id);
        res.sendStatus(201);
        return;
    } else if (req.body.UnfollowPerson) {
        //Unfollow Person
        let removindex = req.app.locals.users[req.session.username].FollowingPeople.indexOf(req.params.id);
        if (removindex > -1) {
            req.app.locals.users[req.session.username].FollowingPeople.splice(removindex, 1);
        }
        res.sendStatus(201);
        return;

    }
});


//List of Persons 
router.get("/", queryParser);
router.get("/", load);

//Add a Person from Contribute page
router.post("/", newperson);


//function for adding a person
function newperson(req, res, next) {
    console.log(req.body.name);

    if (req.body.hasOwnProperty("name")) {
        let lpeople = Object.values(req.app.locals.people);
        let person = lpeople.find(x => {return x.Name === req.body.name});

        //if the person exists, then go to that person's page
        if (typeof person !== 'undefined') {
            res.redirect("/people/"+person.Id);
        } else if (req.body.name.length<=0){
            //no input so refresh
            res.redirect("/contribute");
        } else {
            let people = req.app.locals.people;
            let newId = "p";

            //set id of new person (should be the biggest current id number +1)
            let all = Object.keys(people);
            let max = Math.max(...all.map(x => Number(x.replace("p", ""))))+1;
            newId += max.toString();
            people[newId] = {};
            people[newId].Name = req.body.name;
            people[newId].Id = newId;
            people[newId].AllWork = [];
            console.log("created: " + people[newId]);
            res.redirect("/people/"+newId);
        }
    }
}


//query parsing
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
	
	if(!req.query.name){
		req.query.name = "";
	}
	next();

}

//render result
function load(req, res, next) {

    lpeople = Object.values(req.app.locals.people);

    //Search Result for People (check if query "name" was defined)
    if (req.query.hasOwnProperty("name")) {
        const aname = decodeURI(req.query.name);
        //get Persons whose name includes query parameter
        lpeople = lpeople.filter(x=>{return x.Name.toLowerCase().includes(aname.toLowerCase())});
    }

    //pagination
    if (req.query.page) {
        let s = Number(req.query.page);

        if (!isNaN(s)) {
            pagenum = s;
            lpeople = lpeople.splice(s*10-10, s*10);
        }
    } 

    //render page
    lpeople = lpeople.splice(0, 10);
    res.status(200).send(pug.renderFile("./views/people.pug", { people: lpeople, pagenum: req.query.page, qstring: req.qstring }));
    return;

}


module.exports = router ;
