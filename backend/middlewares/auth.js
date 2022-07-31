import jwt from "jsonwebtoken"
export const auth=async(req,res,next)=>{
const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(' ')[1];
if (!token) {
return res.sendStatus(401);}
jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
if (err) {
return res.sendStatus(401);
}
req.user = user;
next();
});
}
export const generateToken = (user) => {
    return jwt.sign(
      {
        _id: user._id,
        nom: user.nom,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
      }
    );
  };
  
  export const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
      const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
      jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
          res.status(401).send({ message: 'Invalid Token' });
        } else {
          req.user = decode;
          next();
        }
      });
    } else {
      res.status(401).send({ message: 'No Token' });
    }
  };