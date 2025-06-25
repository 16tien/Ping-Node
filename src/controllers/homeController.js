const getHomePage = (req,res)=>{
     res.send('Hello World vs Tien');
     
}
const getAbc = (req,res) =>{
    res.send('check Abc');
}
const getTien= (req,res) =>{
    res.render('sample')
}
module.exports={
    getHomePage,
    getAbc,
    getTien
}