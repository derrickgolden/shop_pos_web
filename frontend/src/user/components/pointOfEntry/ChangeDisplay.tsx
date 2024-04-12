import { ChangeDisplayProps } from "./types";

const ChangeDisplay: React.FC<ChangeDisplayProps> = ({customerGave, totalPrice, paymentDetails}) =>{
    return(
        <div className='border' style={{height: "22dvh"}}>
        {!Object.keys(customerGave).length && (
          <div className='d-flex flex-column justify-content-center text-center h-100'>
            <h1 className='text-primary'>{totalPrice} Ksh</h1>
            <p>Please select a payment method</p>
          </div>
        )
        }
        {Object.keys(customerGave).length !== 0 && (
          <div className='d-flex flex-column-reverse flex-sm-row justify-content-sm-between align-items-center p-2 h-100'>
            <div>
              <h3 className=''>Remaining <span className='text-warning'>{paymentDetails.remaining} Ksh</span></h3>
              <p>Total Due {totalPrice} Ksh</p>
            </div>
            <div className="">
              <h3>Change <span className='text-warning'>{paymentDetails.change} Ksh</span></h3>
            </div>
          </div>
        )
        }
      </div>
    )
}

export default ChangeDisplay;