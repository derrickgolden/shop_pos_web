import multer from 'multer'
import path from 'path';
import fs from 'fs';

// Multer disk storage configuration
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const absolutePath = path.resolve(__dirname, 'uploads');
        if (!fs.existsSync(absolutePath)) {
            fs.mkdirSync(absolutePath, { recursive: true });
        }
        callback(null, absolutePath);
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname);
    },
});

// Multer upload configuration
export const upload = multer({ storage: storage });