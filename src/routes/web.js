const express = require('express')
const {getHomePage} = require('../controllers/homeController')
const {getAbc} = require('../controllers/homeController')
const {getTien} = require('../controllers/homeController')
const router = express.Router()

router.get('/', getHomePage)

router.get('/abc',getAbc)

router.get('/tien', getTien)

module.exports = router
