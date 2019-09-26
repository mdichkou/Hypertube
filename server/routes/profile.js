const express   = require('express');
const router    = express.Router();
const auth      = require('../middleware/auth')

router.get('/', auth, (req, res) => {
    const query = "SELECT * FROM users WHERE id = ?"
    db.query(query, [req.id], (error, results) => {
        if (results.length == 1)
        {
            let user = {
                username: results[0].username,
                first_name: results[0].first_name,
                last_name: results[0].last_name,
                avatar: results[0].avatar,
            }
            res.send(user)
        }
        else
            res.send("failure")
    })
})

router.post('/visit', auth, (req, res) => {
    const query = "SELECT * FROM users WHERE id = ?"
    db.query(query, [req.body.id], (error, results) => {
        if (results.length == 1)
        {
            let user = {
                username: results[0].username,
                first_name: results[0].first_name,
                last_name: results[0].last_name,
                avatar: results[0].avatar,
            }
            res.send({status: "success", msg: user})
        }
        else
            res.send({status: "failure", msg: "This user doesn't exists"})
    })
})

router.post('/searchUser', auth, (req, res) => {
    //console.log(req.body.search)
    const query = "SELECT id, username, avatar FROM users WHERE username LIKE '%" + req.body.search + "%' LIMIT 5"
    db.query(query, [], (error, results) => {
        if (results.length == 0)
            res.send({status: "success", users: "No Users Found"})
        else if (results.length > 0)
            res.send({status: "success", users: results})
        else
            res.send({status: "failure", users: "userQuery didn't deliver"})
    })
})

module.exports = router