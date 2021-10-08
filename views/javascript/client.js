
//Follow/Unfollow Person Button
function follow() {
    if (document.getElementsByName("Follow").length>0) {

		let personid = "{\"FollowPerson\"" +": \""+document.getElementById("follow_button").value+"\"}";
		console.log(personid);

		setTimeout(function(){
			window.location.reload();
		},100); 	

        let request = new XMLHttpRequest();
		request.onreadystatechange = function(){	
			if(this.readyState == 4 && this.status == 200){
				document.getElementById("follow_button").innerHTML="Unfollow";

			}else if(this.readyState==4 && this.status==404){	
				alert("404 Error");
			} else if (this.readyState==4 && this.status==500){
				alert("500 Error");
			}
	
		}
		request.open("POST", window.location.href, true);
		request.setRequestHeader('Content-type', 'application/json');
		request.send(personid);	

    } else if (document.getElementsByName("Unfollow").length>0) {
		let personid = "{\"UnfollowPerson\"" +": \""+document.getElementById("follow_button").value+"\"}";
		console.log(personid);

		setTimeout(function(){
			window.location.reload();
		},100); 

        let request = new XMLHttpRequest();
		request.onreadystatechange = function(){	
			if(this.readyState == 4 && this.status == 200){
				document.getElementById("follow_button").innerHTML="Follow";
            }else if(this.readyState==4 && this.status==404){	
				alert("404 Error");
			} else if (this.readyState==4 && this.status==500){
				alert("500 Error");
			}
	
		}
		request.open("POST", window.location.href, true);
		request.setRequestHeader('Content-type', 'application/json');
		request.send(personid);	
     
    }
}

//Follow/Unfollow User Button
function followUser() {
    if (document.getElementsByName("Follow").length>0) {

		let userid = "{\"FollowUser\"" +": \""+document.getElementById("follow_button").value+"\"}";
		console.log(userid);

		setTimeout(function(){
			window.location.reload();
		},100); 	

        let request = new XMLHttpRequest();
		request.onreadystatechange = function(){	
			if(this.readyState == 4 && this.status == 200){
				document.getElementById("follow_button").innerHTML="Unfollow";

			}else if(this.readyState==4 && this.status==404){	
				alert("404 Error");
			} else if (this.readyState==4 && this.status==500){
				alert("500 Error");
			}
	
		}
		request.open("POST", window.location.href, true);
		request.setRequestHeader('Content-type', 'application/json');
		request.send(userid);	

    } else if (document.getElementsByName("Unfollow").length>0) {
		let userid = "{\"UnfollowUser\"" +": \""+document.getElementById("follow_button").value+"\"}";
		console.log(userid);

		setTimeout(function(){
			window.location.reload();
		},100); 

        let request = new XMLHttpRequest();
		request.onreadystatechange = function(){	
			if(this.readyState == 4 && this.status == 200){
				document.getElementById("follow_button").innerHTML="Follow";
            }else if(this.readyState==4 && this.status==404){	
				alert("404 Error");
			} else if (this.readyState==4 && this.status==500){
				alert("500 Error");
			}
	
		}
		request.open("POST", window.location.href, true);
		request.setRequestHeader('Content-type', 'application/json');
		request.send(userid);	
     
    }
}

//Unfollow User from Profile page
function unfollowUser(clickedone) {
	let userid = "{\"UnfollowUser\"" +": \""+clickedone+"\"}";
	console.log(userid);

	setTimeout(function(){
		window.location.reload();
	},100); 

	let request = new XMLHttpRequest();
	request.onreadystatechange = function(){	
		if(this.readyState == 4 && this.status == 200){
		}else if(this.readyState==4 && this.status==404){	
			alert("404 Error");
		} else if (this.readyState==4 && this.status==500){
			alert("500 Error");
		}

	}
	request.open("POST", window.location.href, true);
	request.setRequestHeader('Content-type', 'application/json');
	request.send(userid);	
}

//Unfollow Person from Profile Page
function unfollowPerson(clickedone) {
	let personid = "{\"UnfollowPerson\"" +": \""+clickedone+"\"}";
	console.log(personid);

	setTimeout(function(){
		window.location.reload();
	},100); 

	let request = new XMLHttpRequest();
	request.onreadystatechange = function(){	
		if(this.readyState == 4 && this.status == 200){
		}else if(this.readyState==4 && this.status==404){	
			alert("404 Error");
		} else if (this.readyState==4 && this.status==500){
			alert("500 Error");
		}

	}
	request.open("POST", window.location.href, true);
	request.setRequestHeader('Content-type', 'application/json');
	request.send(personid);	

}

//Add/remove to watched list on Movie page
function doWatched(filmid) {
	if (document.getElementsByName("AddW").length>0) {
		let film = "{\"AddFilm\": \""+filmid+"\"}";
		console.log(film);

		setTimeout(function(){
			window.location.reload();
		},100); 

		let request = new XMLHttpRequest();
		request.onreadystatechange = function(){	
			if(this.readyState == 4 && this.status == 200){
				document.getElementById("watchlistadd").innerHTML="Remove from Watched List";
			}else if(this.readyState==4 && this.status==404){	
				alert("404 Error");
			} else if (this.readyState==4 && this.status==500){
				alert("500 Error");
			}

		}
		request.open("POST", window.location.href, true);
		request.setRequestHeader('Content-type', 'application/json');
		request.send(film);

	} else if (document.getElementsByName("RemoveW").length>0) {
		let film = "{\"RemoveFilm\": \""+filmid+"\"}";
		console.log(film);

		setTimeout(function(){
			window.location.reload();
		},100); 

		let request = new XMLHttpRequest();
		request.onreadystatechange = function(){	
			if(this.readyState == 4 && this.status == 200){
				document.getElementById("watchlistadd").innerHTML="Add to Watched List";
			}else if(this.readyState==4 && this.status==404){	
				alert("404 Error");
			} else if (this.readyState==4 && this.status==500){
				alert("500 Error");
			}

		}
		request.open("POST", window.location.href, true);
		request.setRequestHeader('Content-type', 'application/json');
		request.send(film);
	}

}

//Remove Movie from Watched list on Profile page
function removemovie(thismovie) {
	let movie = "{\"RemoveMovie\"" +": \""+thismovie+"\"}";
	console.log(movie);

	setTimeout(function(){
		window.location.reload();
	},100); 

	let request = new XMLHttpRequest();
	request.onreadystatechange = function(){	
		if(this.readyState == 4 && this.status == 200){
		}else if(this.readyState==4 && this.status==404){	
			alert("404 Error");
		} else if (this.readyState==4 && this.status==500){
			alert("500 Error");
		}

	}
	request.open("POST", window.location.href, true);
	request.setRequestHeader('Content-type', 'application/json');
	request.send(movie);	

}

//Delete Review
function deletereview(thereview) {
	let review = "{\"DeleteReview\"" +": \""+thereview+"\"}";
	console.log(review);

	setTimeout(function(){
		window.location.reload();
	},100); 

	let request = new XMLHttpRequest();
	request.onreadystatechange = function(){	
		if(this.readyState == 4 && this.status == 200){
		}else if(this.readyState==4 && this.status==404){	
			alert("404 Error");
		} else if (this.readyState==4 && this.status==500){
			alert("500 Error");
		}

	}
	request.open("POST", window.location.href, true);
	request.setRequestHeader('Content-type', 'application/json');
	request.send(review);	
}


//Delete Notification
function deletenotif(notif) {
	let n = "{\"DeleteNotif\"" +": \""+notif+"\"}";
	console.log(n);

	setTimeout(function(){
		window.location.reload();
	},100); 

	let request = new XMLHttpRequest();
	request.onreadystatechange = function(){	
		if(this.readyState == 4 && this.status == 200){
		}else if(this.readyState==4 && this.status==404){	
			alert("404 Error");
		} else if (this.readyState==4 && this.status==500){
			alert("500 Error");
		}

	}
	request.open("POST", window.location.href, true);
	request.setRequestHeader('Content-type', 'application/json');
	request.send(n);	

}

//Refresh Profile page every 20 seconds (for new notifications)
function refresh() {
	setInterval(function() {
		console.log("refresh");
		window.location.reload();
	}, 20000);
}

//full review: check if rating, full and brief reviews are filled out
function reviewcheck() {
	let full = document.getElementById("full").value;
	let brief = document.getElementById("brief").value;
	let rating = document.getElementById("rating").value;
	let movie = document.getElementById("frb").value;

	if (full.trim().length>0 && brief.trim().length>0 && rating.length>0) {	
	}
	else if (full.trim().length<=0 || brief.trim().length<=0) {
		alert("Please write both the basic summary and the full review!");
		return;
	} else if (!isNaN(rating)) {
		alert("Please write in the rating!");
		return;
	}
}

//basic review - check if things are written
function basicreview() {
	if (document.getElementById("rating").value.length<=0) {
		alert("Please write in the rating!");
		return;
	}
}