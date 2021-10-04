const mongoose = require('mongoose')

const schema = mongoose.Schema({
    title: {
        type: 'String',
        required: true,
    },
    version: {
        type: 'String',
        unique: true,
        required:true,
    },
    link: {
        type: 'String',
        required:true,
    },
    logs:[{
        type:'String',
        required:true,
    }]
})

const NotificationModel = mongoose.model('Notification',schema)

module.exports = NotificationModel