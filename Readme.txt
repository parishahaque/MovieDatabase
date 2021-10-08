PARTNERS:

Name: Yun Hye Nam
Student ID: 101211656

Name: Parisha Haque
Student ID: 101118747


HOW TO INSTALL AND RUN:
On Terminal, to the project folder’s directory. 
Have mongo daemon running.
Execute "npm install"
Once everything is installed, 
	type "node db_init.js" to initialize the database
	type “node movie-server.js” and enter to start the server.
Wait for 5-15 seconds for the server to load (for 2500 json file).
Go to localhost:3000 on a browser to test the server. It will lead to the home page.


DOCUMENTATION:
The project report is in the directory: /Nam_Haque_COMP2406_Report.pdf


FILES:

For individual pages:
/views/advsearch.pug
/views/contribute.pug
/views/error.pug
/views/exampleperson.pug
/views/homepage.pug
/views/movie.pug
/views/movies.pug
/views/notification.pug
/views/otheruser.pug
/views/people.pug
/views/peoplefollow.pug
/views/profile.pug
/views/register.pug
/views/reviewpage.pug
/views/reviews.pug
/views/signin.pug
/views/usersfollow.pug
/views/watchlist.pug

Client side Javascript:
/views/javascript/client.js
 
For partial page:
/partial/footer.pug
/partial/header.pug
/partial/searchbar.pug

JSON files:
/movie-data/movie-data-10.json
/movie-data/movie-data-100.json
/movie-data/movie-data-1000.json
/movie-data/movie-data-2500.json

CSS:
/movie.css

MAIN SERVER:
/movie-server.js

ROUTERS:
/users-router.js
/reviews-router.js
/movies-router.js
/people=router.js

MONGODB:
/db_init.js
/movieModel.js
/userModel.js

OTHER FILES:
/package.json
/package-lock.json

MOVIE DATA:
/movie-data/movie-data-2500.json




DOCUMENTATION:


HOW TO TEST THE SERVER:
To go to homepage:
1. click "Home" in the Navigation Bar
2. Go to link "/"

Profile page:
1.click "Profile" in the Navigation bar
2. Or go to "/profile"
3. If you are not logged in, it will redirect to SignIn page
4. If you are logged in, the profile page will redirect to the user page "/users/[username]" but with profile functionalities.
5. Refreshes page every 20 seconds (for new notifications) - see client.js

Buttons:
1. Click Unfollow button to remove user/person from following list
2. In the Account Type corner, select the appropriate account type and click "Save" to set the account to either Contributing or Regular
3. Click Remove buttons to remove a movie from watched list

Search page:
1. click "Search" menu in the Navigation bar.
2. Or go to "/search"
3. Search by typing in a value in the input, and click search button. It will redirect to a page containing result
4. If you don't type in anything, the search result will show all movies

Contributing page
1. click "Add Person/Movie" in the Navigation bar.
2. Or go to "/contribute"
3. If you are not logged in, it will redirect to SignIn page
4. If you are logged in but not a Contributing user, then it will go to an error page
5. If you are logged-in Contributing user, then you will be able to access the page

SignIn/SignUp page
1. click "Sign-in/Sign-up" in the Navigation bar.
2. Or go to "/signin"
3. If the username doesn't exist, it will go to an error page
4. If the password doesn't match, it will go to an error page.
5. After signing in, it will redirect to home page.
6. To go to SignUp page, click the sign up button

Sign out:
1. To sign out, click "Sign Out" button in the Navigation bar.
2. It will redirect to home page
3. If you are not logged in and click the button, it will go to an error page

To go to a movie search result page, 
1. click the search buttons in the search bar or in the Search page.
2. Click on one of the genres in a Movie page.
3. Or type in appropriate queries "/movies?title=[value]&year=[value]&genre=[value]&actor=[value]&director=[value]&writer=[value]
4. To go to the different pages, click Next or Previous buttons

Search Query:
1. For title, genre, actor, director, writer, if the query parameter is a substring of the elements of a movie or person, that movie/person will be shown  (ex. "/movies?title=potter" results will include some Harry Potter movies)

To go to a Movie page:
1. Go to Add Person/Movie page, and click add movie button
2. GO to Profile, and click on one of the "movies you watched" or "recommended" links.
3. Go to search result, click on one of the movies.
4. "/movies/{movieId}"

Person page:
1. Go to Add Person/Movie page, and click add person button
2. GO to Profile, and click on one of the "people following" links.
3. Go to a Movie page, and click on one of the Actors, Directors or Writers.
4. Go to "/people/{personId}"
5. If you are logged in, then you will be able to see and use the Follow/Unfollow button
6. If you are not logged in, then the button will not be shown


Another User page:
1. Go to a Movie page, click on the reviewer link in the Reviews section.
2. Go to the Profile page, click on one of the users following.
3. Go to "/user/{userid}"
5. If you are logged in, then you will be able to see and use the Follow/Unfollow button
6. If you are not logged in, then the button will not be shown

To go to review page:
1. Go to a Movie page, click on the "view details" of the Reviews section
2. Go to a Profile or another user page, click on the "view details" link of the Reviews section.
3. Click on the Submit Basic Review / Submit Full review buttons in a Movie page.
4. "/reviews/{reviewId}"

To go to Notification page
1. go to the Profile page, and click on the "view" button beside notifications.
2. "/notification"

To go to Movies List page:
1. "/movies"

To go to Person List page:
1. "/people"

To search Person:
1. "/people?name={person name}"



