const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');


const Activity = require('../models/activityModel');

const router = express.Router();

const jwtAuth = passport.authenticate('jwt', { session: false });

const jsonParser = bodyParser.json();

///////////// "Get" User owned activities list~! :D - sorted by their assigned priority
router.get('/user-list', jwtAuth, (req, res, next) => {
    Activity.find({ user_Id: req.user.id })
        .sort({ priority: 'asc' })
        .then(results => {
            res.json(results);
        })
        .catch(err => {
            next(err);
        });
});
//////////// Get public activities <3 - sorted by newest item shown first & doesn't take priority into account
router.get('/public', jwtAuth, (req, res, next) => {

    Activity.find({ isPublic: true })
        .sort({ createdAt: 'desc' })
        .then(results => {
            res.json(results);
        })
        .catch(err => {
            next(err);
        })
})

////////////// User owned timeframes 
router.get('/user-list/:time', jwtAuth, (req, res, next) => {

    Activity.find({ user_Id: req.user.id, time: req.params.time })
        .sort({ createdAt: 'desc' }).limit(25)
        .then(results => {
            res.json(results);
        })
        .catch(err => {
            next(err);
        })
})
////////////// Public timeframes 

router.get('/public/:time', jwtAuth, (req, res, next) => {

    Activity.find({ time: req.params.time, isPublic: true })
        .sort({ createdAt: 'desc' }).limit(25)
        .then(results => {
            res.json(results);
        })
        .catch(err => {
            next(err);
        })
})


////////////// Create an Activity
router.post('/', [jwtAuth, jsonParser], (req, res, next) => {
    const { title, time, priority, description, isPublic } = req.body;
    const user_Id = req.user.id;

    if (!title || !time) {
        const err = new Error('Missing `title` or `time` in request body');
        err.status = 400;
        return next(err);
    }


    const newActivity = { title, time, priority, description, isPublic, user_Id };
    return Activity.create(newActivity)
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => {
            next(err);
        });
});


//////// Delete User owned Activity 
router.delete('/delete/:id', jwtAuth, (req, res, next) => {
    const { id } = req.params;
    const user_Id = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error('The `id` is not valid');
        err.status = 400;
        return next(err);
    }

    Activity.findOneAndRemove({ _id: id, user_Id })
        .then(() => {
            res.sendStatus(204);
        })
        .catch(err => {
            next(err);
        });
});

//////// Update User owned Activity - maybe want a patch instead ?
router.put('/update/:id', [jwtAuth, jsonParser], (req, res, next) => {
    const { id } = req.params;
const { updatedActivity }= req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error('The `id` is not valid');
        err.status = 400;
        return next(err);
    }

    Activity.findOneAndUpdate({ _id: id }, updatedActivity, {new: true})
    .then(activity => {
        res.status(200).json(activity);
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;