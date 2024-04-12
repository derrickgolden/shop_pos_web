import express, {Request, Response} from 'express';
import { universalResponse } from 'user/types/universalResponse';
import { addCustomer } from '../dbServices/customers/addCustomer';
import { editCustomerDetails } from '../dbServices/customers/editCustomerDetails';
import { getCustomerList } from '../dbServices/customers/getCustomers';

const router = express.Router();


router.post('/add-customer', async(req: Request, res: Response) =>{
    const body = req.body;

    try {
        const response:universalResponse = await addCustomer(body)
        response.success ? 
            res.status(200).json(response):
            res.status(302).json(response);
        
    } catch (error) {
        console.log(error)
        res.status(302).json({success: false, msg: "sever side error", err: error.message})
    }
});

router.post('/get-list', async(req: Request, res: Response) =>{
    const body = req.body;

    try {
        const response:universalResponse = await getCustomerList(body)
        response.success ? 
            res.status(200).json(response):
            res.status(302).json(response);
        
    } catch (error) {
        console.log(error)
        res.status(302).json({success: false, msg: "sever side error", err: error.message})
    }
});

router.patch('/edit-details', async(req: Request, res: Response) =>{
    const customerDetails = req.body;
    
    try {
        const response:universalResponse = await editCustomerDetails(customerDetails);
        response.success ? 
            res.status(200).json(response):
            res.status(302).json(response)
        
    } catch (error) {
        console.log(error)
        res.status(302).json({success: false, msg: "sever side error", err: error.message})
    }
});

export default router;