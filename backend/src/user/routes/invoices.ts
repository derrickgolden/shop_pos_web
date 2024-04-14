import express, {Request, Response} from 'express';
import { universalResponse } from 'user/types/universalResponse';
import { getCustomerInvoiceDetails } from '../dbServices/invoices/getCustomerInvoice';
import { upadateInvoiceDetails } from '../dbServices/invoices/updateInvoiceDetails';

const router = express.Router();

router.get('/get-details/:sale_id', async(req: Request, res: Response) =>{
    const {sale_id} = req.params;

    try {
        const response:universalResponse = await getCustomerInvoiceDetails(sale_id);
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
    console.log(body)
    try {
        const response:universalResponse = await upadateInvoiceDetails(body);
        response.success ? 
            res.status(200).json(response):
            res.status(302).json(response)
        
    } catch (error) {
        console.log(error)
        res.status(302).json({success: false, msg: "sever side error", err: error.message})
    }
});

export default router;
