const path = require('path');
const fs = require('node:fs/promises');

const imageUpload = (file, uploadPath) => {
    return new Promise((resolve, reject) => {
        file.mv(uploadPath, (error) => {
            if(error) {
                console.log(error,"@image-upload-error")
                reject({ status: "failed" });
            } else {
                resolve({ status: "success" });
            }
        });
    });
};

const isImage = (file) => {
     const maxSizeInBytes = 20 * 1024 * 1024; // 20 MB
    if (file.size > maxSizeInBytes) {
         return false;
    }

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']; 
    const fileExtension = path.extname(file.name);
    const imageMimeTypes = [
        'image/jpg',    // JPEG
        'image/jpeg',     // PNG
        'image/png',     // GIF
        'image/gif',     // BMP
        'image/webp',    // WEBP
    ];
    return allowedExtensions.includes(fileExtension.toLowerCase()) && imageMimeTypes.includes(file.mimetype)
}

const removeImage = async (folder, fileName) => {
    const imagePath = path.join(__dirname, '../../public/images', folder, fileName);
    try {
        await fs.access(imagePath); // Check if the file exists
        await fs.unlink(imagePath); // Delete the file
    } catch (err) {
        if (err.code === 'ENOENT') {
            //console.log(`File ${imagePath} does not exist`);
        } else {
            //console.error(`Error deleting ${imagePath}:`, err);
        }
    }
};

module.exports = { imageUpload, isImage, removeImage }