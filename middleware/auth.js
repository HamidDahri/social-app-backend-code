const config = require('config');
const jwt = require('jsonwebtoken')

module.exports = (req , res, next) => {
   const token = req.header("x-auth-token");
   
   if(!token){
    res.status(404).json({msg: "ACCESS DENIED, Token Missing"})
   }

   try {
      const decoded = jwt.verify(token , config.get("jwtSecret"));

      req.user = decoded.user;
      next();
   } catch (error) {
     res.status(404).json({msg: "Invalid Token"})
   }
   
}