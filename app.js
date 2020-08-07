const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const router = require('./routes/index')
const cors = require('cors')

app.use(cors())

app.use('/api',router)

app.use('*',(req,res) =>{
    res.json({
        'status':'not found path',
        message: 'read the docs here https://github.com/Kaede-No-Ki/otakudesu-rest-api'
    })
})
app.listen(port, () => {
    console.log('listening on port', port)
})