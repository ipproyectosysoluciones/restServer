import { request, response } from 'express';


const login = ( req = request, res = response ) => {

  res.json({
    msg: 'Login ok',
  });
};

export {
  login,
};