import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars,faX } from '@fortawesome/free-solid-svg-icons'
import { RxAvatar } from 'react-icons/rx';
import { getSessionStorage } from '../../controllers/getSessionStorage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useEffect } from 'react';
import { getShopDetailsApi } from '../../sections/shop/apiCalls/getShopDetails';
import { setActiveShop } from '../../../redux/activeShop';
import { setShopListDetails } from '../../../redux/shopListDetails';
import { Link } from 'react-router-dom';

interface DashboardHeaderProps{
    setHeaderToggle: React.Dispatch<React.SetStateAction<boolean>>; 
    headerToggle: boolean;
    logoutHandle: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ setHeaderToggle, headerToggle, logoutHandle }) =>{
    const activeShop = useSelector((state: RootState) => state.activeShop); 
    const shopListDetails = useSelector((state: RootState) => state.shopListDetailsList);
    const dispatch = useDispatch();
    
    const userShop = getSessionStorage();
    const { user } = userShop;

    useEffect(() =>{
        const shopDetails = getShopDetailsApi()
        shopDetails.then(data =>{
            if(!activeShop.shop && data !== undefined) {
                sessionStorage.setItem("activeshop", JSON.stringify(data[0]));
                dispatch(setActiveShop({shop: data[0]}));
            }
            dispatch(setShopListDetails(data));
        })
    },[shopListDetails.length === 0]);

    return(
            <header className="header mb-4 dropdown body-pd border-bottom border " id="header">
                <div onClick={() => setHeaderToggle(!headerToggle)} 
                    className="header_toggle" id="header-toggle">
                    {headerToggle ? <FontAwesomeIcon icon={faX} /> : <FontAwesomeIcon icon={faBars} /> }
                </div>
                <div className='dropdown'>
                    <div style={{cursor: "pointer"}} className="d-flex align-items-center dropdown-toggle" 
                    id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        <span className="header_img d-flex align-items-center">
                            <RxAvatar  size={32}/>  
                        </span>
                        <span className="ms-1">{user?.first_name}({user?.user_id})</span> 
                    </div>
                
                    <ul  className={`dropdown-menu droping dropdown-menu-right `} 
                        style={{padding: '0, 2rem'}} aria-labelledby="dropdownMenuButton1" >
                        {
                        shopListDetails.map((data, i) =>(
                            <li key={i} onClick={() => {
                                sessionStorage.setItem("activeshop", JSON.stringify(data));
                                dispatch(setActiveShop({shop: data}));
                            }
                            }>
                                <Link className="dropdown-item" to="#">
                                    {data?.shop_name}
                                </Link>
                            </li>
                        ))
                        }
                        <li>
                            <Link className="dropdown-item" to="/user/register-shop">
                                Register Shop
                            </Link>
                        </li>
                        <li>
                            <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#addPaymentModal">
                                Add Payment
                            </Link>
                        </li>
                        <li><hr className="dropdown-divider"/></li>
                        <li onClick={logoutHandle}>
                            <Link className="dropdown-item" to="#">
                                Log Out
                            </Link>
                        </li>
                    </ul>
                </div>
            </header>
    )
}

export default DashboardHeader;