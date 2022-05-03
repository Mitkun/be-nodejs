import db from "../models/index";
import bcrypt from 'bcryptjs';
import { reject } from "bcrypt/promises";

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (err) {
      console.log(err);
      reject(err)
    }
  })
};

const handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};

      let isExist = await checkUserEmail(email);
      if (isExist) {
        //user already exist
        let user = await db.User.findOne({
          attributes: ['email', 'roleId', 'password'],
          where: { email: email },
          raw: true
        })
        if (user) {
          //compare password
          let check = await bcrypt.compareSync(password, user.password);

          if (check) {
            userData.errCode = 0;
            userData.errMessage = "Ok";

            //! Loại bỏ trường mật khẩu từ db trả về
            delete user.password
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = 'Wrong password';
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = `User's not found`
        }
      } else {
        //return error
        userData.errCode = 1;
        userData.errMessage = `Your's Email isn't exist in your system. Plz try other email!`;

      }
      resolve(userData);

    } catch (error) {
      reject(error)
    }
  })
}


const checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail }
      })

      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }

    } catch (error) {
      reject(error)
    }
  })
}

const getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = '';
      if (userId === 'ALL') {
        users = await db.User.findAll({
          attributes: {
            exclude: ['password']
          }
        })
      }
      if (userId && userId !== 'ALL') {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ['password']
          },
        })
      }
      resolve(users)
    } catch (err) {
      reject(err);
    }
  })
}

const createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {

      let checkEmailIsExist = await checkUserEmail(data.email)

      if (checkEmailIsExist) {
        resolve({
          errCode: 1,
          message: 'Your email is already in used. Plz try another email!'
        });
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phonenumber: data.phonenumber,
          gender: data.gender === '1' ? true : false,
          roleId: data.roleId,
        })
        resolve({
          errCode: 0,
          message: 'OK'
        });
      }


    } catch (error) {
      reject(error)
    }
  })
}

const deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId }
      })

      if (!user) {
        resolve({
          errCode: 2,
          message: `The user isn't exist`
        })
      } else {
        await db.User.destroy({
          where: { id: userId }
        });
        resolve({
          errCode: 0,
          message: `The user is deleted`
        })
      }

    } catch (error) {
      reject(error)
    }
  })
}

const updateUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {

      if (!data.id) {
        resolve({
          errCode: 2,
          message: 'Missing required parameters'
        })
      }

      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false
      })

      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        await user.save()

        // await db.User.save({
        //   firstName: data.firstName,
        //   lastName: data.lastName,
        //   address: data.address,
        // })


        resolve({
          errCode: 0,
          message: 'Update the user succeeds!'
        })

      } else {
        resolve({
          errCode: 1,
          errMessage: `User's not found`
        })
      }

    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  updateUser: updateUser,
}