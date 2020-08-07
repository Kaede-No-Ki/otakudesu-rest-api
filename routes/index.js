const express = require('express')
const router  = express.Router()
const HomeController = require('../controllers/home-controller')

router.get('/home', HomeController.onGoingHome)

module.exports = router