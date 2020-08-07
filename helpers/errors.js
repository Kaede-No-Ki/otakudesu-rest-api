const on404 = (req,res)=>{
    res.status(404)
    .json({
        status:'not found path',
        animeList:[]
    })
}
module.exports = on404