// PhonePe Payment Gateway Integration
const PHONE_PE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox"
const MERCHANT_ID = "PGTESTPAYUAT139"
const USER_ID = 123
const SALT_INDEX = 1
const SALT_KEY = "695d0547-3728-4b1c-825d-996479133615"

const PAY_END_POINT = "pg/v1/pay"
const MERCHANT_TRANSACTION_ID = uniqid()

const payload = {
  "merchantId": MERCHANT_ID,
  "merchantTransactionId": MERCHANT_TRANSACTION_ID,
  "merchantUserId": USER_ID,
  "amount": 10000,
  "redirectUrl": `http://${user.username}.${FRONTEND_URL}/redirect-url/${MERCHANT_TRANSACTION_ID}`,
  "redirectMode": "REDIRECT",
  "callbackUrl": "https://webhook.site/callback-url",
  "mobileNumber": "9999999999",
  "paymentInstrument": {
    "type": "PAY_PAGE"
  }
}

//SHA256(base64 encoded payload + “/pg/v1/pay” +salt key) + ### + salt index
const bufferObj = Buffer.from(JSON.stringify(payload), "utf-8");
const base64EncodedPayload = bufferObj.toString("base64")
const xVerify = sha256(base64EncodedPayload + PAY_END_POINT + SALT_KEY) + "###" + SALT_INDEX

const options = {
 method: 'post',
 url: `${PHONE_PE_HOST_URL}/${PAY_END_POINT}`,
 headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
    'X-VERIFY': xVerify
            },
 data: {
  request: base64EncodedPayload
 }
};

axios.request(options).then(function (response) {
  console.log(response.data);
  
}).catch(function (error) {
  console.error(error);
});