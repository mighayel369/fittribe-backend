const custom=(req,res,next)=>{
    res.version=2
    next()
}