import UserModel from '../models/UserModel.js';
import ErrorResponse from '../utils/errorResponse.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

import pdf from 'html-pdf';
import UserReport from '../utils/userReports/UserReport.js';
import path from 'path';
import UtilFunctions from '../utils/UtilFunctions.js';

const register = async (req, res, next) => {
  const { username, email, password, fname, lname, isAdmin } = req.body;

  try {
    const user = await UserModel.create({
      email,
      password,
      fname,
      lname,
      isAdmin,
    });

    sendToken(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc  Get All users
// @route GET /api/users/
// @access Admin

const getAllusers = async (req, res) => {
  await UserModel.find({})
    .then((data) => {
      res.status(200).send({ success: true, users: data });
    })
    .catch((error) => {
      res.status(500).send({ success: false, message: error });
    });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password is provided
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  try {
    // Check that user exists by email
    const user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check that password match
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    //sendToken(user, 200, res);

    var userData = {
      _id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      isAdmin: user.isAdmin,
      addressLine1: user.paymentDetails.addressLine1,
      addressLine2: user.paymentDetails.addressLine2,
      addressLine3: user.paymentDetails.addressLine3,
      city: user.paymentDetails.city,
      zipcode: user.paymentDetails.zipcode,
      contactNumber: user.paymentDetails.contactNumber,
      token: generateToken(user),
    };
    console.log(user);

    res.json(userData);
  } catch (err) {
    res.status(500).json({ sucess: false, error: error.message });
  }
};

const forgotPassword = async (req, res, next) => {
  // Send Email to email provided but first check if user exists
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return next(new ErrorResponse('No email could not be sent', 400));
    }

    // Reset Token Gen and add to database hashed (private) version of token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // Create reset url to email to provided email
    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

    // HTML Message
    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please make a put request to the following link:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        text: message,
      });

      res.status(200).json({ success: true, data: 'Email Sent' });
    } catch (err) {
      console.log(err);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return next(new ErrorResponse('Email could not be sent', 500));
    }
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  // Compare token in URL params to hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  try {
    const user = await UserModel.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse('Invalid Token', 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: 'Password Updated Success',
      token: user.getSignedJwtToken(),
    });
  } catch (err) {
    next(err);
  }
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({ sucess: true, token });
};

const generateToken = (user) => {
  return user.getSignedJwtToken();
};

const updateUserData = async (req, res) => {
  if (req.body && req.params) {
    //console.log(req.params.id);
    const query = { _id: req.params.id };
    //var password = this.hashPassword(req.body.password);
    var salt = await bcrypt.genSalt(10);
    var Hpassword = await bcrypt.hash(req.body.password, salt);
    //console.log(salt);
    console.log(Hpassword);
    const update = {
      fname: req.body.fname,
      lname: req.body.lname,
      password: Hpassword,
      email: req.body.email,
    };

    await UserModel.updateOne(query, update)
      .then((result) => {
        //console.log(result.nModified);
        if (result.nModified > 0) {
          res.status(200).send({
            success: true,
            message: 'User Info Updated Successfully!',
          });
        } else {
          res.status(200).send({
            success: false,
            message: 'Error!',
          });
        }
      })
      .catch((error) => {
        res.status(500).send({ success: false, message: error });
      });
  } else {
    res.status(200).send({ success: false, message: 'No Data Found' });
  }
};

// const hashPassword = async (password) => {
//   const salt = await bcrypt.genSalt(10);
//   password = await bcrypt.hash(this.password, salt);
//   return password;
// };

const updateUserAddress = async (req, res) => {
  if (req.body && req.params) {
    let userID = req.params.id;
    const {
      addressLine1,
      addressLine2,
      addressLine3,
      zipcode,
      city,
      contactNumber,
    } = req.body;

    var find = { _id: userID };

    const update = {
      $set: {
        'paymentDetails.addressLine1': addressLine1,
        'paymentDetails.addressLine2': addressLine2,
        'paymentDetails.addressLine3': addressLine3,
        'paymentDetails.contactNumber': contactNumber,
        'paymentDetails.zipcode': zipcode,
        'paymentDetails.city': city,
      },
    };

    await UserModel.updateOne(find, update)
      .then((result) => {
        if (result.n > 0) {
          res.status(200).send({
            success: true,
            message: 'User Info Updated Successfully!',
          });
        } else {
          res.status(200).send({
            success: false,
            message: 'Error!',
          });
        }
      })
      .catch((error) => {
        res.status(500).send({ success: false, message: error });
      });
  } else {
    res.status(200).send({ success: false, message: 'No Data Found' });
  }
};

const deleteUser = async (req, res) => {
  let userID = req.params.id;
  await UserModel.findByIdAndDelete(userID)
    .then(() => {
      res
        .status(200)
        .send({ success: true, message: 'User Deleted Succefully' });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ success: false, message: error });
    });
};

const generateUserDetails = async (req, res) => {
  console.log('generate Final User Details');

  const __dirname = path.resolve();

  const data = req.body;
  // console.log(data);

  //generate bill
  pdf
    .create(UserReport(data), {})
    .toFile(`${__dirname}/files/UserReport.pdf`, (err) => {
      if (err) {
        res.send(Promise.reject());
      }

      res.send(Promise.resolve());
    });
};

//get final order bill
// @route get /api/orders/fetchFinalBill
// @access User(Registered)
const getUserDetails = async (req, res) => {
  console.log('get Final User Details');

  const __dirname = path.resolve();

  res.sendFile(`${__dirname}/files/UserReport.pdf`);
};

export default {
  register,
  login,
  forgotPassword,
  resetPassword,
  sendToken,
  getAllusers,
  updateUserData,
  updateUserAddress,
  deleteUser,
  getUserDetails,
  generateUserDetails,
};
