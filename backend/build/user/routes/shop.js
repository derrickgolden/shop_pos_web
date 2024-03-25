"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shop_1 = require("../dbServices/shop");
const router = express_1.default.Router();
router.post('/register-shop', async (req, res) => {
    const shopDetails = req.body;
    const user = req.user;
    const logo = req.file;
    // return res.status(302).json({success: false, msg: "sever side error"})
    if (user.added_by !== user.user_id) {
        return res.status(200).json({ success: false, msg: "Only user registered as owner is allowed to register a shop" });
    }
    try {
        const response = await (0, shop_1.registerShop)({ shopDetails, user, logo });
        response.success ?
            res.status(200).json(response) :
            res.status(302).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(302).json({ success: false, msg: "sever side error", err: error.message });
    }
});
router.get('/shop-details', async (req, res) => {
    const { added_by } = req.user;
    try {
        const response = await (0, shop_1.getShopListDetails)(added_by);
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
//# sourceMappingURL=shop.js.map