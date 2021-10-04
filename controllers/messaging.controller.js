const NotificationModel = require("../models/notificationModel");

exports.postNotification = async(req,res) => {
    const {title,version,link,logs} = req.body;
    try {
        const response = new NotificationModel({title,version,link,logs})
        await response.save();
        res.send(response)
    } catch (error) {
        res.send(error);
    }
}

exports.getNotification = async(req, res) => {
    try {
        const data = await NotificationModel.find();
        return res.send(data[data.length -1])
    } catch (error) {
        res.send(error);
    }
}