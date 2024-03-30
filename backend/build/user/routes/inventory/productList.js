"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productList_1 = require("../../dbServices/inventory/productList");
const resizeImage_1 = require("../../middlewares/resizeImage");
const router = express_1.default.Router();
router.post('/add-product', resizeImage_1.resizeImages, async (req, res) => {
    const body = req.body;
    const img_file = req.file;
    try {
        const response = await (0, productList_1.addProduct)(body, img_file);
        response.success ?
            res.status(200).json(response) :
            res.status(302).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(302).json({ success: false, msg: "sever side error", err: error.message });
    }
});
router.post('/get-product', async (req, res) => {
    const body = req.body;
    try {
        const response = await (0, productList_1.getProductList)(body);
        response.success ?
            res.status(200).json(response) :
            res.status(302).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(302).json({ success: false, msg: "sever side error", err: error.message });
    }
});
router.post('/delete', async (req, res) => {
    const { product_id } = req.body;
    try {
        const response = await (0, productList_1.deleteProduct)(product_id);
        response.success ?
            res.status(200).json(response) :
            res.status(302).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(302).json({ success: false, msg: "sever side error", err: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=productList.js.map