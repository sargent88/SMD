const express = require('express'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    massive = require('massive'),
    passport = require('passport'),
    Auth0Strategy = require('passport-auth0'),
    config = require('./config.js'),
    cors = require('cors');

const app = express();

const port = 3000;

const controller = require('./server/patient_visit_ctrl.js');
const controllerUser = require('./server/user_ctrl.js');

massive(config.url).then(db => {
    app.set('db', db)
}).catch((err) => {
    console.log(err)
})

app.use(bodyParser.json());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.secret
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('./public'));

//Middleware Policy//
const checkAuth = (req, res, next) => {
    if (!req.isAuthenticated()) return res.status(401).send("unauthorized");
    return next()
}

/////////////
// DATABASE //
/////////////


passport.use(new Auth0Strategy({
        domain: config.auth0.domain,
        clientID: config.auth0.clientID,
        clientSecret: config.auth0.clientSecret,
        callbackURL: '/auth/callback'
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
        var db = app.get('db')
            //Find user in database
        db.getUserByAuthId([profile.id]).then((user) => {
            user = user[0];
            if (!user) { //if there isn't one, we'll create one!
                console.log('CREATING USER');
                db.createUserByAuth([profile.displayName, profile.id, profile.nickname]).then((user) => {
                    console.log('USER CREATED', user);
                    return done(null, user[0]); // GOES TO SERIALIZE USER
                })
            } else { //when we find the user, return it
                console.log('FOUND USER', user);
                return done(null, user);
            }
        })
    }
));

//THIS IS INVOKED ONE TIME TO SET THINGS UP
passport.serializeUser(function(userA, done) {
    console.log('serializing', userA);
    var userB = userA;
    //Things you might do here :
    //Serialize just the id, get other information to add to session, 
    done(null, userB); //PUTS 'USER' ON THE SESSION
});

//USER COMES FROM SESSION - THIS IS INVOKED FOR EVERY ENDPOINT
passport.deserializeUser(function(userB, done) {
    var userC = userB;
    //Things you might do here :
    // Query the database with the user id, get other information to put on req.user
    done(null, userC); //PUTS 'USER' ON REQ.USER
});

app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback',
    passport.authenticate('auth0', { successRedirect: '/' }),
    function(req, res) {
        res.status(200).send(req.user);
    })

app.get('/auth/me', function(req, res) {
    if (!req.user) return res.sendStatus(404);
    //THIS IS WHATEVER VALUE WE GOT FROM userC variable above.
    res.status(200).send(req.user);
})

app.get('/auth/logout', function(req, res) {
    req.logout();
    res.redirect('/');
})

// function UserInfoCtrl($scope, auth) {
//   $scope.auth = auth.profile;
//   if($scope.auth !== null) {
//   $scope.loggedin
// }
// }


app.get('/api/getPatients', controller.getPatients);
app.get('/api/getVisits/:id', controller.getVisits);
app.post('/api/addNewPatient', controller.addNewPatient);
app.post('/api/addNewVisit/:id', controller.addNewVisit);
app.put('/api/updatePatient', controller.changePatient);
app.put('/api/updateVisit', controller.changeVisit);
app.delete('/api/deletePatient/:id', controller.removePatient);
app.delete('/api/deleteVisit/:visit_id', controller.removeVisit);

app.get('/api/getUsers', controllerUser.getUsers);
app.delete('/api/deleteUser/:id', controllerUser.removeUser);
app.post('/api/addUser', controllerUser.addNewUser);
app.put('/api/updateUsers', controllerUser.changeUsers);


app.get('/security', checkAuth, (req, res, next) => {
    return res.status(200).send(req.user)
})


app.listen(3000, function() {
    console.log(`Connected on port ${port}`)
})