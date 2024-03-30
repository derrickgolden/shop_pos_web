"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resizeImages = void 0;
const fs_1 = __importDefault(require("fs"));
const jimp_1 = __importDefault(require("jimp"));
// Middleware function to process uploaded images using Sharp
// export const resizeImages = (req: Request, res: Response, next: NextFunction) => {
//     const file = req.file;
//     // Check if file are present in the request
//     if (!file) {
//         return next();
//     };
//         new Promise<void>((resolve, reject) => {
//             // Read the image file
//             fs.readFile(file.path, (err, data) => {
//                 if (err) {
//                     return reject(err);
//                 }
//                 // Check if the image size is below 15KB, if so, skip compression
//                 const fileSizeKB = data.length / 1024;
//                 if (fileSizeKB <= 15) {
//                     return resolve();
//                 }
//                 // Compress and resize the image using Sharp
//                 sharp(data)
//                     .resize({ width: 600, height: 450, fit: 'inside' })
//                     .jpeg({ quality: 15 })
//                     .toBuffer()
//                     .then((compressedData) => {
//                         // Write the compressed image back to the file
//                         fs.writeFile(file.path, compressedData, (err) => {
//                             if (err) {
//                                 return reject(err);
//                             }
//                             resolve();
//                         });
//                     })
//                     .catch((error) => {
//                         fs.unlink(file.path, (err) => {
//                             if (err) {
//                                 console.error(`Error deleting file ${file.originalname}:`, err);
//                             }
//                         });
//                         reject(error);
//                     });
//             });
//         }).then(() => {
//             next();
//         })
//         .catch((error) => {
//             res.status(500).json({success: false, msg: `Error compressing image ${file.originalname}. If the problem 
//             persists try uploading images less than 20kb` });
//         });    
//     };
// Middleware function to process uploaded images using Jimp
const resizeImages = (req, res, next) => {
    const file = req.file;
    // Check if file is present in the request
    if (!file) {
        return next();
    }
    // Read the image file
    fs_1.default.readFile(file.path, (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, msg: 'Error reading image file' });
        }
        // Check if the image size is below 15KB, if so, skip compression
        const fileSizeKB = data.length / 1024;
        if (fileSizeKB <= 15) {
            return next();
        }
        // Compress and resize the image using Jimp
        jimp_1.default.read(data)
            .then((image) => {
            return image
                .resize(600, 450) // Resize image to fit within 600x450 dimensions
                .quality(15) // Set JPEG quality to 15%
                .getBufferAsync(jimp_1.default.MIME_JPEG); // Convert image to buffer
        })
            .then((compressedData) => {
            // Write the compressed image back to the file
            fs_1.default.writeFile(file.path, compressedData, (err) => {
                if (err) {
                    console.error('Error writing compressed image file:', err);
                    return res.status(500).json({ success: false, msg: 'Error writing compressed image file' });
                }
                next();
            });
        })
            .catch((error) => {
            console.error('Error processing image with Jimp:', error);
            fs_1.default.unlink(file.path, (err) => {
                if (err) {
                    console.error(`Error deleting file ${file.originalname}:`, err);
                }
            });
            return res.status(500).json({ success: false, msg: 'Error processing image' });
        });
    });
};
exports.resizeImages = resizeImages;
//# sourceMappingURL=resizeImage.js.map