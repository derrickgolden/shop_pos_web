import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

const Session = () =>{
    const navigate = useNavigate()
    const activeShop = useSelector((state: RootState) => state.activeShop); 

    const handleSessionStart = () => {
            navigate("/user/sales-entry");
    }; 

    return(
        <div className='body2 bg-white' style={{paddingTop: "2rem"}}>
            <div className="h-100 bg-light px-5 py-5 fullscreen" >
                <h2>Start new Session</h2>
                <h3>ActiveShop: <b className="text-secondary">
                    {activeShop.shop? activeShop?.shop?.shop_name : "Select a ShopactiveShop before proceding"}
                </b></h3>
                {
                    activeShop.shop? (
                        <div onClick={handleSessionStart} style={{width: "fit-content"}}
                        className="bg-white d-flex align-items-center justify-content-between" >
                            <button type="button"  className="btn btn-outline-warning"> 
                                <Link  to="/user/sales-entry" id='session' className="">              
                                    Start Session
                                </Link>
                            </button>
                        </div>
                    ): null
                }
            </div>
        </div>
    )
}

export default Session;