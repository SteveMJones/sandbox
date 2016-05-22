/**
 * Created by sjones on 5/21/16.
 */
var express = require('express');
var Message = require('./models/message');

// Get the router
var router = express.Router();

//Define Models


// Middleware for all this routers requests
router.use(function timeLog(req, res, next) {
    console.log('Request Received: ', dateDisplayed(Date.now()));
    next();
});

// Welcome message for a GET at http://localhost:8080/restapi
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the REST API' });
});

// GET all messages (using a GET at http://localhost:8080/messages)
router.route('/messages')
    .get(function(req, res) {
        Message.find(function(err, messages) {
            if (err)
                res.send(err);
            res.json(messages);
        });
    })
    .post(function(req, res) {
        var message = new Message();
        // Set text and user values from the request
        message.text = req.body.text;
        message.user = req.body.user;

        // Save message and check for errors
        message.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Message created successfully!' });
        });
    });

router.route('/messages/:message_id')
    .get(function(req, res) {
        Message.findById(req.params.message_id, function(err, message) {
            if (err)
                res.send(err);
            res.json(message);
        });
    })
    .put(function(req, res) {
    Message.findById(req.params.message_id, function(err, message) {
            if (err)
                res.send(err);
            // Update the message text
            message.text = req.body.text;
            message.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Message successfully updated!' });
            });

        });
    })
    .delete(function(req, res) {
        Message.remove({
            _id: req.params.message_id
        }, function(err, message) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted message!' });
        });
    });;

module.exports = router;

function dateDisplayed(timestamp) {
    var date = new Date(timestamp);
    return (date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
}