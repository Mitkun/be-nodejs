import userService from "../services/userService"

const handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: 'Missing input parameter'
    })
  }

  const userData = await userService.handleUserLogin(email, password);

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {}
  })
};

const handleGetAllUsers = async (req, res) => {
  let id = req.query.id; // ALL, id

  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: 'Missing required parameters',
      users: []
    })
  }

  let users = await userService.getAllUsers(id);

  return res.status(200).json({
    errCode: 0,
    errMessage: 'OK',
    users
  })
}

const handleCreateNewUser = async (req, res) => {
  let message = await userService.createNewUser(req.body);
  return res.status(200).json(message)
}

const handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: 'Missing required parameters',
    })
  }
  let message = await userService.deleteUser(req.body.id);
  return res.status(200).json(message)
}

const handleEditUser = async (req, res) => {
  let data = req.body;
  let message = await userService.updateUser(data);
  return res.status(200).json(message)
}

module.exports = {
  handleLogin: handleLogin,
  handleGetAllUsers: handleGetAllUsers,
  handleCreateNewUser: handleCreateNewUser,
  handleEditUser: handleEditUser,
  handleDeleteUser: handleDeleteUser,
}