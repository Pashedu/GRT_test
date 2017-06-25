var express = require('express');
var router = express.Router();
var sanitize = require("mongo-sanitize");
var bcrypt = require("bcrypt");
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test_G_DB');
mongoose.connection.on('connected', function () {
    console.log('Connected');
});

var schema = mongoose.Schema;
var user = new schema({
    login: {type: String, index: {unique: true}},
    pass: String
});


var userModel = mongoose.model('userModel',user);

router.get('/', function(req, res) {
  res.render('login/login');
});

router.post('/', function(req, res) {
    var userLogin=sanitize(req.body.login);
    userModel.findOne({login: userLogin}, function (err, user) {
        if(err) {
            console.log(err);
            res.render('500.twig');
        }
        if(!user){
            return res.render('login/login', {error:'login or password mistmatch'});
        }
        else {
            bcrypt.compare(req.body.password, user.pass, function (err, match) {
                if (err) {
                    console.log(err);
                    res.response('500.twig');
                } else if (match) {
                    console.log(user);
                    req.session.sessionId = user._id;//Here should be mega secure ID generator
                    res.redirect("chat");
                }
                else {
                    res.render('login/login', {error: 'login or password mistmatch'});
                }

            })
        }
    })

});
router.get ('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/login');
});
router.post('/register', function(req, res) {
    userLogin=sanitize(req.body.login);
    console.log(userLogin+"logIn");
    if (userLogin === req.body.login) {
        if(req.body.password !== req.body.confirm){
            return res.render('login/register', {error: "passwords isn't equal"});
        }
        userModel.findOne({login: userLogin}, function (err, user) {
            if (err) {
                console.log(err);
                return res.render('500');
            }
            if (user) {
                return res.render('login/register', {error: 'login is already taken'});
            }
        });
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password,salt);
        newUser = new userModel(
        {
            login: userLogin,
            pass: hash
        });
        newUser.save(function (err) {
            if (err) {
                console.log(err);
                res.render("500");
            }
            else {
                res.redirect("/login");
            }
        });
    }
    else {
        res.send("Booo login");
    }
});
router.get('/register', function(req, res) {
    res.render('login/register');
});



module.exports = router;
