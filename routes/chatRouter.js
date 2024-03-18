const router = require('express').Router();
const fs = require('fs');

router.get('/get-message', (req, res, next) => {

    fs.readFile('chat.txt', 'utf8', (err, data) => {
        if (err) {
            res.send(`Loading...`);
        } else {
            res.send(`${data}`);
        }
    })
})

router.post('/send-message', (req, res, next) => {
    fs.appendFileSync('chat.txt', `\n${req.body.userName}: ${req.body.message}`);
    return res.status(200).json({message: req.body.message});
});

module.exports = router;