const jwt = require('jsonwebtoken');

var methods = {
    CheckData: function(first_name, last_name, username, password, email)
    {
        return new Promise((resolve, reject) => {
            let regex = new RegExp(/^[a-zA-Z]{3,20}$/i);
            let userRegex = new RegExp(/^[a-zA-Z0-9]{3,20}$/i);
            let mailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            let passRegex = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{5,20}$/)

            if (!(regex.test(first_name)))
                reject("First name must have between 3 and 20 and only Alphabetic")
            else if (!(regex.test(last_name)))
                reject("last name must have between 3 and 20 and only Alphabetic")
            else if (!(userRegex.test(username)))
                reject("Username must have between 3 and 20 and only Alphanum")
            else if (!(mailRegex.test(email)))
                reject("Email is not Valid")
            else if (!(passRegex.test(password)))
                reject("Password requires 1 lower 1 upper case letter and 1 digit and between 5 and 20")
            else
            resolve("data_clear")
        })
    },

    UsernameExists: function(username, id)
    {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE username = ?', [username], function (error, results, fields){
            if (results.length == 0) 
                resolve("username Success")
            else if (results.length == 1)
            {
                if (results[0].id === id)
                    resolve("username Success")
                else
                    reject("Username Already Exists") 
            }
            else
                reject("Username Already Exists") 
        })
        })
    },

    EmailExists: function(email, id)
    {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE email = ?', [email], function (error, results, fields){
            if (results.length == 0)
                resolve("Email Success")
            else if (results.length == 1)
            {
                if (results[0].id === id)
                    resolve("Email Success")
                else
                    reject("Email Already Exists")
            }
            else
                reject("Email Already Exists")
        })
        })
    },

    OutsideLogin: function(username, first_name, last_name, email, avatar, password)
    {
        return new Promise((resolve, reject) => {
            console.log(username, first_name, last_name, email, avatar, password)
            const query = "SELECT * from users WHERE password = ?"
            db.query(query, [password], (error, results) => {
                if (results.length == 0)
                {
                    const checkQuery = "SELECT * from users WHERE username = ? OR email = ?"
                    db.query(checkQuery, [username, email], (error, results) => {
                    if (results.length == 0)
                    {
                        const query = "INSERT INTO users (username, avatar, first_name, last_name, password, email, verification_code, email_verified) values (?, ?, ?, ?, ?, ?, ?, ?)"
                        db.query(query, [username, avatar, first_name, last_name, password, email, 0, 1], (error, results) => {
                            if (results)
                                resolve(jwt.sign({id: results.insertId}, 'jwtPrivateKey'))
                            else
                                reject("insertQuery didn't deliver")
                        })
                    }
                    else if (results.length > 0)
                        reject("Email or Username Already Exists")
                    else
                        reject("Autorisation failed")
                    })
                }
                else if (results.length == 1)
                    resolve(jwt.sign({ id: results[0].id}, 'jwtPrivateKey'))
                else
                    reject("Autorisation failed")
            })
        })
    }
}

module.exports = methods

// user.login, user.avatar_url, user.login, user.login, user.id, req.emails[0].value, 0, 1

// router.post('/42', (req, res) => {
//     let options = {
//         headers: {'Authorization': 'Bearer ' + req.body.token}
//     };
//     console.log(req.body.token)
//     axios.get("https://api.intra.42.fr/v2/me", options)
//     .then(Response => {
//         let user = Response.data;
//         Repitition.OutsideLogin(user.login, user.first_name, user.last_name, user.email, user.image_url, user.id)
//     })
//     .then(finish => res.send({status: "success", msg: finish}))
//     .catch(error => res.send({status: "failure", msg: error.message}))
// })

// router.get('/github', passport.authenticate('github', {session: false}), function(req, res) {
//     let user = JSON.parse(req.user._raw)
//     Repitition.OutsideLogin(user.login, user.login, user.login, req.emails[0].value, user.avatar_url, user.id)
//     .then(finish => res.send({status: "success", msg: finish}))
//     .catch(error => res.send({status: "failure", msg: error.message}))
// });

// router.get('/google', passport.authenticate('google', {session: false}),
//   function(req, res) {
//     let user = req.user
//     Repitition.OutsideLogin(user._json.given_name, user._json.given_name, user._json.family_name, user._json.email, user._json.picture, user.id)
//     .then(finish => res.send({status: "success", msg: finish}))
//     .catch(error => res.send({status: "failure", msg: error.message}))
// });