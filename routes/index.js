var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
router.get('/chat', authCheck, function(req, res) {
    res.render('chat');
});

function authCheck(req,res, next){

    if(!req.session.sessionId){
        res.render('login/apologies');
    }else {
        next();
    }
}
module.exports = router;
