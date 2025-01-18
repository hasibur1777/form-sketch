const {
  userLogin,
  userRegister,
  userAuthenticate,
  getUser,
} = require('../middlewares/userMiddleware');

const createUser = (req, res) => {
  userRegister(req, res);
};

const loginUser = (req, res) => {
  userLogin(req, res);
};

const userProfile = (req, res) => {
  userAuthenticate(req, res, () => {
    getUser(req, res);
  });
};

module.exports = {
  loginUser,
  createUser,
  userProfile,
};
