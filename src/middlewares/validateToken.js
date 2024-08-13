import jwt from 'jsonwebtoken';
const SECRET_KEY = 'your_secret_key'

export const validateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  console.log(token)
  if (!token) {
    return res.status(403).send('Token requerido');
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send('Token inválido');
    }
    req.user = decoded; // Adjuntar el payload del token al objeto req
    next();
  });
};

