const on404 = (req,res)=>{
    res.status(404)
    .json({
        status:'not found path'
    })
}