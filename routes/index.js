const express = require('express')
const router  = express.Router()
const MainController = require('../controllers/main-controller')

router.get('/home', MainController.home)

module.exports = router