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
        //Find user in database
        db.getUserByAuthId([profile.id], function(err, user) {
            user = user[0];
            if (!user) { //if there isn't one, we'll create one!
                console.log('CREATING USER');
                db.createUserByAuth([profile.displayName, profile.id], function(err, user) {
                    console.log('USER CREATED', userA);
                    return done(err, user[0]); // GOES TO SERIALIZE USER
                })
            } else { //when we find the user, return it
                console.log('FOUND USER', user);
                return done(err, user);
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
    var userC = userC;
    //Things you might do here :
    // Query the database with the user id, get other information to put on req.user
    done(null, userC); //PUTS 'USER' ON REQ.USER
});



app.get('/auth', passport.authenticate('auth0'));


//**************************//
//To force specific provider://
//**************************//
// app.get('/login/google',
//   passport.authenticate('auth0', {connection: 'google-oauth2'}), function (req, res) {
//   res.redirect("/");
// });

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

app.get('/api/getPatients', controller.getPatients);

app.listen(3000, function() {
    console.log('Connected on port', port)
})