const jwt = require("jsonwebtoken");
const { sendEmail } = require("./sentEmail");
const {  v4: uuidv4 } = require('uuid');
const redis = require("../config/redis");
const { emailTemplate } = require("./emailTemplates");

// create jwt token & storing to redis
const createJwtToken = async (id) => {
    const jtid = uuidv4()
    const token = jwt.sign({ id, jtid: jtid }, process.env.JWT_SEC, { expiresIn: 15552000 });
    await storeSessionRedis(id, jtid)
    return token
}

// verify jwt token
const verifyJwtToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(" ")[1]

    if(token){
        jwt.verify(token, process.env.JWT_SEC, async (error, decodedToken) => {
            if (error) {
                return res.status(401).json({ status: false, message: "authentiacation failed" })
            } else {
                req.userId = decodedToken.id
                req.jtid = decodedToken.jtid
                const isSession = await checkIsSession(decodedToken.id, decodedToken.jtid)
                if(isSession){
                   next()
                }else{
                   return res.status(401).json({ status: false, message: "authentiacation failed, code: ior" })
                }
            }
        });
    }else{
        return res.send({ status: false, message: "authentiacation failed" })
    }

}

// store sessions in redis
const storeSessionRedis = async (id, jtid) => {
  try {
    await redis.set(`${id + jtid}`, "ls", 'PX', 15552000000);
  } catch (error) {
    console.log("@store_session_redis", error)
  }
}

// check there is session available
const checkIsSession = async (id, jtid) => {
   try {
    const value = await redis.get(`${id + jtid}`);
    return value
   } catch (error) {
    console.log("@check_session", error)
   }
};

// remove one session
const removeSession = async (id, jtid) => {
    try {
      const value = await redis.del(`${id + jtid}`);
      return value
    } catch (error) {
      console.log("@remove_session", error)
    }
}

// remove all sessions for user
const removeAllSessionsForUser = async (userId) => {
    try {
      let cursor = '0';
      const pattern = `${userId}*`;
      
      do {
        const [newCursor, sessionKeys] = await redis.scan(cursor, 'MATCH', pattern);
        cursor = newCursor;

        for (const sessionKey of sessionKeys) {
          await redis.del(sessionKey);
        }
      } while (cursor !== '0');
  
    } catch (error) {
      console.error("@remove_all_sessions", error);
    }
  };
  
  
  

// generate otp
async function generateOtp(email) {
    const chars = "0123456789";
    const len = 4;
    let otp = "";
    for (let i = 0; i < len; i++) {
        otp += chars[Math.floor(Math.random() * chars.length)];
    }

    const subject = 'OTP for Growthfied Reset Activity';
    const content = `Your OTP is: ${otp} OTP will be expiry after 10 minutes`;
    const html = emailTemplate(subject, content)
    await sendEmail(email, subject, html);
    return otp;
}

module.exports = { createJwtToken, verifyJwtToken, generateOtp, removeAllSessionsForUser, removeSession }