import express, {Request, Response} from 'express';
import { ModifiedReq, universalResponse } from 'user/types/universalResponse';
import { getShopListDetails, registerShop } from '../dbServices/shop';

const router = express.Router();

router.post('/register-shop', async(req: ModifiedReq, res: Response) =>{
    const shopDetails = req.body;
    const user = req.user
    const logo = req.file;
    // return res.status(302).json({success: false, msg: "sever side error"})

    if(user.added_by !== user.user_id){
       return  res.status(200).json({success: false, msg: "Only user registered as owner is allowed to register a shop"})
    }
    
    try {
        const response:universalResponse = await registerShop({shopDetails, user, logo});
        response.success ? 
            res.status(200).json(response):
            res.status(302).json(response)
        
    } catch (error) {
        console.log(error)
        res.status(302).json({success: false, msg: "sever side error", err: error.message})
    }
});

router.get('/shop-details', async(req: ModifiedReq, res: Response) =>{
    const {added_by} = req.user;
    
    try {
        const response:universalResponse = await getShopListDetails(added_by);
        response.success ? 
            res.status(200).json(response):
            res.status(302).json(response)
        
    } catch (error) {
        console.log(error)
        res.status(302).json({success: false, msg: "sever side error", err: error.message})
    }
});

export default router;