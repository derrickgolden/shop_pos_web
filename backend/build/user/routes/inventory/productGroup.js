"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productGroup_1 = require("../../dbServices/inventory/productGroup");
const router = express_1.default.Router();
router.post('/add-group', async (req, res) => {
    const { group_name, description, shop_id } = req.body;
    const token = req.header('Authorization');
    try {
        const response = await (0, productGroup_1.addProductGroup)({ group_name, description, shop_id });
        response.success ?
            res.status(200).json(response) :
            res.status(302).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(302).json({ success: false, msg: "sever side error", err: error.message });
    }
});
router.post('/get-groups', async (req, res) => {
    const { filterNull, shop_id } = req.body || false;
    try {
        const response = await (0, productGroup_1.getProductGroups)(filterNull, shop_id);
        response.success ?
            res.status(200).json(response) :
            res.status(302).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(302).json({ success: false, msg: "sever side error", err: error.message });
    }
});
router.post('/update', async (req, res) => {
    const body = req.body;
    try {
        const response = await (0, productGroup_1.updateProductDetails)(body);
        response.success ?
            res.status(200).json(response) :
            res.status(302).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(302).json({ success: false, msg: "sever side error", err: error.message });
    }
});
router.patch('/shift-group', async (req, res) => {
    const body = req.body;
    try {
        const response = await (0, productGroup_1.shiftProductGroup)(body);
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
//# sourceMappingURL=productGroup.js.map