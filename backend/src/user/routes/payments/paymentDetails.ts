import express, {Request, Response} from 'express';
import { universalResponse } from 'user/types/universalResponse';
import { addPaymentDetails, getPaymentDetails } from '../../dbServices/payments/paymentDetails';

const router = express.Router();

router.post('/add-details', async(req: Request, res: Response) =>{
    const body = req.body;

    try {
        const response:universalResponse = await addPaymentDetails(body);
        response.success ? 
            res.status(200).json(response):
            res.status(302).json(response)
        
    } catch (error) {
        console.log(error)
        res.status(302).json({success: false, msg: "sever side error", err: error.message})
    }
});

router.post('/get-details', async(req: Request, res: Response) =>{
    const body = req.body;

    try {
        const response:universalResponse = await getPaymentDetails(body);
        response.success ? 
            res.status(200).json(response):
            res.status(302).json(response)
        
    } catch (error) {
        console.log(error)
        res.status(302).json({success: false, msg: "sever side error", err: error.message})
    }
});

export default router;