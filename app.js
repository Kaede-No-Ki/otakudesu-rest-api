const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const router = require('./routes/index')

app.use('/api',router)

app.listen(port, () => {
    console.log('listening on port', port)
})