import UserModel from '../models/UserModel.js';
import ErrorResponse from '../utils/errorResponse.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

const register = async (req, res, next) => {
  const { username, email, password, fname, lname, isAdmin } = req.body;

  try {
    const user = await UserModel.create({
      username,
      email,
      password,
      fname,
      lname,
      isAdmin,
    });

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
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
      token: generateToken(user),
    };
    console.log(userData);

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
      return next(new ErrorResponse('No email could not be sent', 404));
    }

    // Reset Token Gen and add to database hashed (private) version of token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // Create reset url to email to provided email
    const resetUrl = `http://localhost:5000/passwordreset/${resetToken}`;

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

// const updateUserData = async(req, res) => {

//   if(req.body && req.params){

//       const query = { "_id": req.params.id };
//       const update = {
//           "fname": req.body.title,
//           "lname": req.body.venue,
//           "startDate": req.body.startDate,
//           "endDate": req.body.endDate,
//           "description": req.body.description,
//        };

//       await UserModel.updateOne( query , update)
//       .then( result => {
//           // console.log(result.modifiedCount);
//           res.status(200).send({ success: true, 'message': "Conference Updated Successfully!" })
//       })
//       .catch( (error) => {
//           res.status(500).send({ success: false, 'message': error })
//       } )

//   }else{
//       res.status(200).send({ success: false, 'message': "No Data Found" })
//   }
// }

export default {
  register,
  login,
  forgotPassword,
  resetPassword,
  sendToken,
};
