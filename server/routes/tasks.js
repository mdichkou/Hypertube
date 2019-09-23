var express = require("express")
var router = express.Router()
const Tasks = require("../model/Tasks")

//Get all tasks

router.get('/tasks', (req, res) => {
    Tasks.findAll()
    .then(tasks => {
        res.json(tasks)
    })
    .catch(err => {
        res.send("error: " + err)
    })
})

//Add tasks 
router.post("/tasks", (req, res) => {
        if(!req.body.task_name){
            res.status(400)
            res.json({
                error : "Bad data"
            })
        }
        else{
            Tasks.create(req.body)
            .then(() => {
                res.send("Task Added")
            })
            .catch(err => {
                res.send("Error: " + err)
            })
        }
})


//Delete Task
router.delete("/tasks/:id", (req, res) => {
    Tasks.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(() => {
            res.send("Task deleted!")
        })
        .catch(err => {
            res.send("error: " + err)
        })
})

//Update Task
router.put("/tasks/:id", (req, res) => {
    if(!req.body.task_name){
        res.status(400)
        res.json({
            error : "Bad data"
        })
    }
    else{
        Tasks.update(
            { task_name: req.body.task_name},
            { where: { id: req.params.id } }
        )
        .then(() => {
            res.send("Task Updated")
        })
        .catch(err => {
            res.send("Error: " + err)
        })
    }
})


module.exports = router