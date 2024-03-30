"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Multer disk storage configuration
const storage = multer_1.default.diskStorage({
    destination: (req, file, callback) => {
        const absolutePath = path_1.default.resolve(__dirname, 'uploads');
        if (!fs_1.default.existsSync(absolutePath)) {
            fs_1.default.mkdirSync(absolutePath, { recursive: true });
        }
        callback(null, absolutePath);
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname);
    },
});
// Multer upload configuration
exports.upload = (0, multer_1.default)({ storage: storage });
//# sourceMappingURL=uploadImage.js.map