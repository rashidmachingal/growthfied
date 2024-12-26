const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")
const userModal = require("../../models/user.modal")
const parser = require('ua-parser-js');
const { createJwtToken, generateOtp, removeSession, verifyJwtToken, removeAllSessionsForUser } = require("../../utils/auth");
const { sendEmail } = require("../../utils/sentEmail");
const { emailTemplate } = require("../../utils/emailTemplates");


router.post("/check-username", async (req, res) => {
    const { username } = req.body;

    try {
        const isAlreadyUsername = await userModal.findOne({ username: username }).select("username")

        if (isAlreadyUsername) {
            return res.status(409).json({ message: "subdomain already in use, please choose another"})
        }else{
            return res.status(200).json({ message: "success"})
        }
        
    } catch (error) {
       console.log("@error_check_username", error)
       return res.status(500).json({ message: "something went wrong" })
    }
})

router.post("/signup", async (req, res) => {
    const { username, mobile_number, email, password } = req.body;

    try {
        const isAlreadyUser = await userModal.findOne({ email: email }).select("email")
        if (isAlreadyUser) return res.status(409).json( { message: "email already registered" } )

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new userModal({
          username,
          mobile_number,
          email,
          password: hashedPassword,
          device_info: {
            ip: req.ip,
            ua: parser(req.headers['user-agent'])
          }
        });

        const savedUser = await newUser.save();
        const token = await createJwtToken(savedUser._id)
        res.status(200).json({ token })

        const subject = 'Welcome to Growthfied! 🎉';
        const content = `Welcome to Growthfied! We’re thrilled to have you on board, We're excited to support you on your e-commerce journey and wish you all the best in growing your business. We're here to help you succeed every step of the way!`;
        const html = emailTemplate(subject, content)
        await sendEmail(email, subject, html);
      } catch (error) {
        console.log("@error_signup", error)
        return res.status(500).json({ message: "something went wrong" })
      }
})

router.post("/login", async (req, res) => {

    const { email, password } = req.body;
  
    try {
      const user = await userModal.findOne({ email }).
      select("password _id on_boarding username profile_picture email")

      if (!user) return res.status(401).json({ message: "invalid email or password" })
  
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ message: "invalid email or password" })
  
      const token = await createJwtToken(user._id)
      res.status(200).json(
        { 
          token: token, 
          on_boarding: user.on_boarding, 
          username: user.username, 
          profile_picture: user.profile_picture
        })

      const subject = 'A new device has logged in to your Growthfied account';
      const content = `It looks like you signed into your account from a new device. If this was you, there’s nothing more you need to do. If you did not sign in, please take a moment to secure your account.`
      const html = emailTemplate(subject, content) 
      await sendEmail(user.email, subject, html);
    } catch (error) {
        console.log("@login_error",error)
        return res.status(500).json({ message: "something went wrong" })
    }
})


router.put("/check-current-password-valid", verifyJwtToken, async (req, res) => {
  const { current_password } = req.body;
  const userId = req.userId

  try {
    const currentUser = await userModal.findById(userId).
    select("password email")

    const isCurrentPasswordValid = bcrypt.compareSync(current_password, currentUser.password);
    if (!isCurrentPasswordValid){
      return res.status(403).json({ message: "current password is invalid" })
    }else{
      return res.status(200).json({ email: currentUser.email, message: "current password valid" })
    }

  } catch (error) {
      console.log("@check_current_password", error)
      return res.status(500).json({ message: "something went wrong" })
  }
}) 


router.put("/update-password", verifyJwtToken, async (req, res) => {
  const { new_password, current_password, otp } = req.body;
  const userId = req.userId

  try {
    const user = await userModal.findById(userId).
    select("password otp _id email")
    const isCurrentPasswordValid = bcrypt.compareSync(current_password, user.password);
    if (!isCurrentPasswordValid) return res.status(403).json({ message: "current password is invalid" })

     // otp validation
     const currentTime = new Date().getTime();
     const timestamp = new Date(user.otp.expiry).getTime()
     const diffMinutes = (currentTime - timestamp) / (1000 * 60);
     if(diffMinutes > 10){
      return res.status(400).json({ message: "otp is expired" })
     }
     if(otp !== user.otp.code){
      return res.status(400).json({ message: "otp is not valid" })
     }

    const hashedPassword = bcrypt.hashSync(new_password, 10);
      await userModal.findByIdAndUpdate(userId, {
          password: hashedPassword
      });
      await removeAllSessionsForUser(userId)
      const token = await createJwtToken(user._id)
      res.status(200).json({ token });

      const subject = 'Your Growthfied Account Password Changed';
      const content = 'If you didn’t make this change, it’s important to act quickly to protect your account. Please update your password immediately to secure your account from any unauthorized access.';
      const html = emailTemplate(subject, content)
      await sendEmail(user.email, subject, html);
  } catch (error) {
      console.log("@update_password", error)
      return res.status(500).json({ message: "something went wrong" })
  }
}) 

router.put("/update-email", verifyJwtToken, async (req, res) => {
  const { new_email, otp, current_email } = req.body;

  try {
      const user = await userModal.findOne({ email:current_email }).
      select("otp _id")

      // otp validation
      const currentTime = new Date().getTime();
      const timestamp = new Date(user.otp.expiry).getTime()
      const diffMinutes = (currentTime - timestamp) / (1000 * 60);
      if(diffMinutes > 10){
       return res.status(400).json({ message: "otp is expired" })
      }
      if(otp !== user.otp.code){
       return res.status(400).json({ message: "otp is not valid" })
      }

      alreadyEmail = await userModal.findOne({ email: new_email})

      if(alreadyEmail){
        return res.status(400).json({ message: "this email is already used" })
      }else{
        await userModal.findByIdAndUpdate(user._id, {
          email: new_email
        });
        res.status(200).json({ message: "Email updated successfully" });

        const subject = 'Your Growthfied Account Email Changed!';
        const content = `
        Your Growthfied Account Email Changed, 
        If you didn't make this change immediaty change your password or contact Growthfied Support
        `;
        const html = emailTemplate(subject, content)
        await sendEmail(current_email, subject, html);
      }
  } catch (error) {
      console.log("@update_password", error)
      return res.status(500).json({ message: "something went wrong" })
  }
}) 

router.post("/logout", verifyJwtToken, async (req, res) => {
  try {
    await removeSession(req.userId, req.jtid)
    return res.status(200).json({ message: "logout successfully"})
  } catch (error) {
    console.log("@logout_error",error)
    return res.status(500).json({ message: "something went wrong" })
  }
})

router.post("/sent-otp", async (req, res) => {
  const { email } = req.body;

  try {
      const isEmailRegistered = await userModal.findOne({ email: email }).select("email")

      if (isEmailRegistered === null) {
          return res.status(422).json({ message: "email address is not registered"})
      }

      const OTP  = await generateOtp(email)
      const expiry = new Date();

      await userModal.findOneAndUpdate(
        { email },
        { $set: { "otp.code": OTP, "otp.expiry": expiry } },
        { new: true }
      ).then(()=> {
        return res.status(200).json({ message: "OTP sented successfully"})
      }).catch((error) => {
        console.log(error)
        return res.status(500).json({ message: "Something went wrong"})
      })
     
      
  } catch (error) {
     console.log("@sent_otp", error)
     return res.status(500).json({ message: "something went wrong" })
  }
})

router.post("/submit-otp", async (req, res) => {
  const { otp, email } = req.body;

  try {
    const user = await userModal.findOne({ email }).
    select("otp ")

    if (user === null) {
      return res.status(422).json({ message: "email address is not registered"})
    }

    const currentTime = new Date().getTime();
    const timestamp = new Date(user.otp.expiry).getTime()
    const diffMinutes = (currentTime - timestamp) / (1000 * 60);

    if(diffMinutes > 10){
      return res.status(401).json({ message: "otp is expired" })
    }

    if(otp === user.otp.code){
      return res.status(200).json({ message: "otp verfication success" })
    }else{
      return res.status(401).json({ message: "invalid otp" })
    }

  } catch (error) {
    console.log("@submit_otp",error)
    res.status(500).json({ message: "something went wrong"})
  }
})

router.put("/forgot-reset-password", async (req, res) => {
  const { otp, email, new_password } = req.body;

  try {
    const user = await userModal.findOne({ email });

    if (user === null) {
      return res.status(422).json({ message: "email address is not registered"})
    }

    const currentTime = new Date().getTime();
    const timestamp = new Date(user?.otp.expiry).getTime()
    const diffMinutes = (currentTime - timestamp) / (1000 * 60);

    if(diffMinutes > 10){
      return res.status(401).json({ message: "request time expired" })
    }

    if(user?.otp.code === otp){
      const hashedPassword = bcrypt.hashSync(new_password, 10);
      await userModal.findByIdAndUpdate(user.id, {
        password: hashedPassword
      });
      return res.status(200).json({ message: "password reset successfully"})
    }else{
      return res.status(401).json({ message: "otp verfication failed" })
    }
  } catch (error) {
    console.log("@forgot-reset-password", error)
    return res.status(500).json({ message: "something went wrong"})
  }
})


module.exports = router