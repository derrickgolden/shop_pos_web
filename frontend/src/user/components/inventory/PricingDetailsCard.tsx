export interface pricingDetails {
    price: string;
    package_cost: string;
    package_size: string;
}
interface PricingDetailsCardProps{
    handlePricingInput: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; 
    pricingDetails: pricingDetails;
}

const PricingDetailsCard: React.FC<PricingDetailsCardProps> = ({handlePricingInput, pricingDetails}) =>{
    return(
        <div className="d-flex shadow-sm flex-wrap justify-content-between align-items-center p-5  bg-light mb-2">
                <div className="form-group mb-3 col-10 col-sm-5">
                    <label htmlFor="price">Price per unit</label>
                    <input onChange={handlePricingInput} value={pricingDetails?.price}
                        type="number" className="form-control" id="price" name="price"
                        placeholder="0.00" required/>
                </div>
                <div className="form-group mb-3 col-10 col-sm-5">
                        <label htmlFor="exampleFormControlSelect1">Cost per Package</label>
                        <input onChange={handlePricingInput} value={pricingDetails.package_cost}
                            type="number" className="form-control" id="package_cost" 
                            name="package_cost" placeholder="0.00" required/>
                        {/* <select onChange={handlePricingInput} value={pricingDetails?.unit_of_mesurement}
                        className="form-control" id="exampleFormControlSelect1" name="unit_of_mesurement">
                            <option>-select unit-</option>
                            {units.map((unit, i)=>(
                                <option key={i} >{unit}</option>
                            ))}
                        </select> */}
                </div>
                <div className="form-group mb-3 col-10 col-sm-5">
                    <label htmlFor="package_size">Units per Package</label>
                    <input onChange={handlePricingInput} value={pricingDetails?.package_size}
                        type="number" className="form-control" id="package_size" name="package_size"
                        placeholder="How many units are in 1 package" required/>
                </div>
       
        </div>
    )
}

export default PricingDetailsCard;

