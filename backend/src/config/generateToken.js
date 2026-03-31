import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: '30d', // Token 30 দিন valid থাকবে
    }
  );
};

export default generateToken;