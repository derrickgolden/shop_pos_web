import express, {Request, Response} from 'express';
import { 
    addProductGroup, 
    getProductGroups, 
    shiftProductGroup, 
    updateProductDetails 
} from '../../dbServices/inventory/productGroup';
import { productgroupDetails } from 'user/types/productGroupTypes';
import { universalResponse } from 'user/types/universalResponse';

const router = express.Router();

router.post('/add-group', async(req: Request, res: Response) =>{
    const { group_name, description, shop_id }: productgroupDetails = req.body;
    const token: string = req.header('Authorization');

    try {
        const response:universalResponse = await addProductGroup({group_name, description, shop_id})
        response.success ? 
            res.status(200).json(response):
            res.status(302).json(response)
        
    } catch (error) {
        console.log(error)
        res.status(302).json({success: false, msg: "sever side error", err: error.message})
    }
});

router.post('/get-groups', async(req: Request, res: Response) =>{
    const {filterNull, shop_id} = req.body || false
        
    try {
        const response:universalResponse = await getProductGroups(filterNull, shop_id);
        response.success ? 
            res.status(200).json(response):
            res.status(302).json(response)
        
    } catch (error) {
        console.log(error)
        res.status(302).json({success: false, msg: "sever side error", err: error.message})
    }
});

router.post('/update', async(req: Request, res: Response) =>{
    const body = req.body;
    
    try {
        const response:universalResponse = await updateProductDetails (body)
        response.success ? 
            res.status(200).json(response):
            res.status(302).json(response)
        
    } catch (error) {
        console.log(error)
        res.status(302).json({success: false, msg: "sever side error", err: error.message})
    }
});

router.patch('/shift-group', async(req: Request, res: Response) =>{
    const body = req.body;
    
    try {
        const response:universalResponse = await shiftProductGroup(body)
        response.success ? 
            res.status(200).json(response):
            res.status(302).json(response)
        
    } catch (error) {
        console.log(error)
        res.status(302).json({success: false, msg: "sever side error", err: error.message})
    }
});

export default router;