const jwt = require("jsonwebtoken");
const crypto = require('crypto-js');

// Generate a unique number
const generateUniqueNumber = () => {
    let timestamp = new Date().getTime();
    let random = Math.floor(Math.random() * 10000);
    let uniqueNumber = timestamp.toString() + random.toString();
    let token = jwt.sign({ uniqueNumber }, "S");
    let id = token.split(".")[2]
    return uniqueNumber + id;
}

// encryptData
const encryptData = (data) => {
    const ciphertext = crypto.AES.encrypt(data, `${process.env.ENCRYPTION_KEY}`).toString();
    return ciphertext
};

// decryptData
const decryptData = (encryptedData) => {
    const bytes = crypto.AES.decrypt(encryptedData, `${process.env.ENCRYPTION_KEY}`);
    const originalText = bytes.toString(crypto.enc.Utf8);
    return originalText
};

const convertToSlug = (title) => {
    title = title.toLowerCase();
    title = title.replace(/[^a-z0-9]+/g, '-');
    title = title.replace(/^-+|-+$/g, '');
    return title;
}

module.exports = { generateUniqueNumber, encryptData, decryptData, convertToSlug }