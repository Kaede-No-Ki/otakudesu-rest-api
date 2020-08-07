const express = require('express')
const router  = express.Router()
const MainController = require('../controllers/main-controller')

router.get('/home', MainController.home)
router.get('/complete',MainController.completeAnimeList)
router.get('/complete/page/:page',MainController.completeAnimeList)
router.get('/ongoing',MainController.onGoingAnimeList)
router.get('/ongoing/page/:page',MainController.onGoingAnimeList)
router.get('/schedule',MainController.schedule)

module.exports = router