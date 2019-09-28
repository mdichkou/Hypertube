const express   = require('express');
const router    = express.Router();
const  bcrypt = require('bcrypt');
const  saltRounds = 10;

function SendMail(vkey, email, username)
{
    return new Promise((resolve, reject) => {
        mailOptions = {
              to : email,
              subject : "Hypertube password reset",
              html : "<h6>Hello " + username + ",</h6><br> <p>You're new password:</p><br><p>" + vkey + "</p>"
        }
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error) 
                reject(error)
            else
                resolve("Mail was sent");
        });
    })
}

function isNumeric(value) {
    return /^\d+$/.test(value);
}

function    EmailExists(email)
{
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM users WHERE email = ?', [email], function (error, results, fields){
        if (results.length == 0)
            reject("No account has this Email")
        else if (results.length == 1 && isNumeric(results[0].password))
            reject("This email is not registred")
        else if (results.length == 1 && !isNumeric(results[0].password))
            resolve(results[0].username)
        else
            reject("Query didn't deliver")
    })
    })
}

function    updatePassword(password, email)
{
    return new Promise((resolve, reject) => {
        db.query('UPDATE users SET password = ? WHERE email = ?', [password, email], function (error, results, fields){
        if (results)
            resolve("Password reset was successful")
        else
            reject("updateQuery didn't deliver")
    })
    })
}

router.post('/', (req, res) => {
    let email = req.body.email
    let vkey = Math.random().toString(36).substr(3) + Math.random().toString(36).substr(3);
    var salt      = bcrypt.genSaltSync(saltRounds);
    var hash_pass = bcrypt.hashSync(vkey, salt);

    EmailExists(email)
    .then(name => SendMail(vkey, email, name))
    .then(rep => updatePassword(hash_pass, email))
    .then(finish => res.send({status: "success", msg: finish}))
    .catch(error => res.send({status: "failure", msg: error}))

})

module.exports = router