'use strict';
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    time: { type: String, required: true },
    priority: { type: Number },
    description: { type: String },
    isPublic: { type: Boolean },
    // tags: [{ type: String }], future feature
    // progress: { type: Number }, future feature
    // completed: { type: Boolean }, future feature <3
    user_Id: { type: mongoose.Schema.Types.ObjectId }
});

activitySchema.set('timestamps', true);

activitySchema.set ('toJSON', {
    virtuals: true,
    transform: (doc, result) => {
        delete result.__v;
        delete result._id;
    }
});

module.exports = mongoose.model('Activity', activitySchema);