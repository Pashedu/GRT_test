var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test_G_DB');
mongoose.connection.on('connected', function () {
  console.log('Connected');
});

var schema = mongoose.Schema;
var message = new schema({
  responseId: schema.Types.ObjectId,
  message: String
});
var messageModel = mongoose.model('messageModel',message);

/* GET messages listing. */
router.get('/messages', function(req, res, next) {
    messageModel.find(function (err, messages) {
      if(err)
      {
        console.log(err);
        res.send({error:err});
      }
      else
      {
        res.send({response:"Ok", messages:messages});
      }
    });
});

/* GET message by Id */
router.get('/messages/:id', function(req, res) {
    messageModel.findById(req.params.id, function (err, message) {
        if(err)
        {
            console.log(err);
            res.send({error:err});
        }
        else
        {
          if(message) {
            res.send({response:"Ok", messages:message});
          }else {
            res.send({response:"Not Found"});
          }
        }
    });
});

/* POST (create) new Message */
router.post('/messages', function(req, res) {
  var postMessage = new messageModel({
      responseId: null,
      message: req.body.message
  });
  postMessage.save(function (err) {
      if(err){
        console.log(err);
        res.send({error:err})
      }
      else
      {
        res.send({response:'Ok', message:postMessage});
      }
  });
});

/* Edit message with id number*/
router.put('/messages/:id', function(req, res) {
    messageModel.findById(req.params.id, function (err, message) {
        if(err)
        {
            console.log(err);
            res.send({error:err});
        }
        else
        {
            if(message) {
                message.message=req.body.message;
                message.save(function (err) {
                  if(err) {
                      console.log(err);
                      res.send({error: err});
                  }
                  else {
                    res.send({response:"Ok",message:message})
                  }
                });
            }else {
                res.send({response:"Not Found"});
            }
        }
    });
});

/* Delete message with id number*/
router.delete('/messages/:id', function(req, res) {
    messageModel.findById(req.params.id, function (err, message) {
      if(err){
          console.log(err);
          res.send({error: err});
      }
      if(message)
      {
          message.remove(function (err) {
              if(err){
                  console.log(err);
                  res.send({error: err});
              }
              else{
                  res.send({response:"Delete"})
              }
          });
      }
      else
      {
          res.send({response:"Not Found"});
      }
    });
});

module.exports = router;
