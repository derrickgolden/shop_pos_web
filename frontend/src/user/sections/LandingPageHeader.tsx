import '../../assets/css/layouts/layouts.css';
import 'boxicons';
import Swal from 'sweetalert2'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronDown, faFileInvoice, faGear } from '@fortawesome/free-solid-svg-icons'
import { MdDashboard, MdInventory, MdPayments, MdPointOfSale } from "react-icons/md";
import { TbReportMoney } from "react-icons/tb";
import { FaLayerGroup, FaListAlt, FaSalesforce } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { server_baseurl } from '../../baseUrl';
import { pharmLogo } from '../../assets/images';
import DashboardHeader from '../components/userDashboard/DashboardHeader';
import AddPaymentDetails from '../components/userDashboard/AddPaymentDetails';

export default function LandingPageHeader() {

    const [plus, setPlus] = useState(true)
    const [plus2, setPlus2] = useState(true)
    const [plus3, setPlus3] = useState(true)
    const [plus4, setPlus4] = useState(true)
    const [plus5, setPlus5] = useState(true)
    const [plus6, setPlus6] = useState(true)
    const pathname = window.location.pathname
    const [render, setRender] = useState(true);
    const [headerToggle, setHeaderToggle] = useState(false);
    const [activeLink, setActiveLink] = useState("dashboard");

    const activeShop = useSelector((state: RootState) => state.activeShop); 
    const navigate = useNavigate();

    const menuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const headerSection = document.getElementById('header');
        if ( headerSection !== null) {
            headerToggle && headerSection.classList.add('body-pd');
            headerToggle !== true && headerSection.classList.remove('body-pd');
        }
        const handleOutsideClick: EventListener = (event: Event ) => {
            // Check if the click occurred outside of the menu component
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setHeaderToggle(false); // Close the menu
            }
        };
      
          // Attach event listener when the menu is open
          if (headerToggle) {
            document.addEventListener('click', handleOutsideClick);
        }
        
        // Clean up the event listener when the component unmounts or the menu closes
        return () => {
            document.removeEventListener('click', handleOutsideClick);
          };
    }, [headerToggle]);

    const handleLinkClick: React.MouseEventHandler<HTMLAnchorElement>= (e) =>{
        setRender(!render); 
        const target = e.currentTarget as HTMLAnchorElement;

        const value = target.id;
        setActiveLink(value); 
        setHeaderToggle(false);
    };

    const logoutHandle=()=>{
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure you want to log out!',
            showCancelButton: true,
            confirmButtonText: 'Yes',
          }).then((result) => {
            
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                sessionStorage.clear();
                navigate("/user/login")
                window.location.reload();
      
            } else if (result.isDenied) {
              Swal.fire('Changes are not saved', '', 'info')
            }
          })
    }

    const logo_url = activeShop.shop?.logo_path ? 
                    `${server_baseurl}/uploads/${activeShop.shop?.logo_path}` : `${pharmLogo}`;
    return (
        <>
        <div ref={menuRef}>
            <DashboardHeader 
                setHeaderToggle = {setHeaderToggle} 
                headerToggle = {headerToggle} 
                logoutHandle = {logoutHandle}
            />
            <AddPaymentDetails />
            <div className="manubar">
                <div className={`l-navbar menubar scroll-bar ${headerToggle ? "show" : ""}`} id="nav-bar">
                    <nav className="nav">
                        <div> 
                            <Link to="/user/dashboard" className="nav_logo"> 
                                <img src={logo_url} alt="" className='rounded' 
                                    style={{height: "30px", width:"30px"}}
                                />
                                <span className="text-white ">{activeShop?.shop?.shop_name}</span> 
                            </Link>

                            <div className="nav_list">  
                                <Link onClick={handleLinkClick} id='dashboard' to= "/user/dashboard"
                                className={`${activeLink === 'dashboard'? 'text-white font-weight-bold ' :"" }nav_link`}>
                                    <MdDashboard />
                                    <span className="nav_name ">Dashboard</span>
                                </Link>
                                <Link onClick={handleLinkClick} to='/user/session'id='session'
                                className={`${activeLink === 'session'? 'text-white font-weight-bold ' :"" }nav_link`}>
                                    <MdPointOfSale />
                                    <span className="nav_name ">Session</span>
                                </Link>
                                
                                <div className="accordion" id="accordionExample">
                                    <div className="accordion-item">
                                        <p className="accordion-header" id="headingOne">
                                            <Link  to="#" type="button"
                                                data-toggle="collapse" data-target="#paymentSystem" aria-expanded="true" 
                                                aria-controls="paymentSystem" id='inventory' 
                                                className={`${activeLink === 'inventory'? 'text-white font-weight-bold ' :"" }nav_link`}>
                                                <MdInventory id='inventory'/>
                                                <span className="nav_name "  id='inventory'>Invetory <b>{plus ? <FontAwesomeIcon icon={faChevronLeft} /> : <FontAwesomeIcon icon={faChevronDown} />}</b></span>
                                            </Link>
                                        </p>
                                        <div id="paymentSystem" className="collapse " aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                            <div className="accordion-body">
                                                <Link onClick={handleLinkClick} to="/user/inventory/product-list" className={`nav_link ${pathname == "/mobailBank/bKash" && 'active'}`}>
                                                    <FaListAlt />
                                                    <span className="nav_name">List of Products</span>
                                                </Link>
                                                <Link onClick={handleLinkClick} to="/user/inventory/product-group" className={`nav_link ${pathname == "/manage-bankTransfer" && 'active'}`}>
                                                    <FaLayerGroup style={{color: ""}}/>
                                                    <span className="nav_name">Product Groups</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion" id="accordionExample">
                                    <div className="accordion-item">
                                        <p className="accordion-header" id="headingOne">
                                            <Link  to="#" type="button" id='report'
                                            data-toggle="collapse" data-target="#systemSetting" aria-expanded="true" aria-controls="systemSetting" 
                                            className={`${activeLink === 'report'? 'text-white font-weight-bold ' :"" }nav_link`}>
                                                <TbReportMoney size={20}/>
                                                <span className="nav_name " id='report'
                                                >Reports <b>{plus2 ? <FontAwesomeIcon icon={faChevronLeft} /> : <FontAwesomeIcon icon={faChevronDown} />}</b></span>
                                            </Link>
                                        </p>
                                        <div id="systemSetting" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                            <div className="accordion-body">
                                                <Link onClick={handleLinkClick} to="/user/report/sales" className={`nav_link ${pathname == "/system-setting/app-setting" && 'active'}`}>
                                                    <FaSalesforce  style={{color: ""}}/>
                                                    <span className="nav_name">Sales Report</span>
                                                </Link>
                                              
                                                <Link onClick={handleLinkClick} to="/user/report/payments" className={`nav_link ${pathname == "/system-setting/templete" && 'active'}`}>
                                                    <MdPayments style={{color: ""}}/>
                                                    <span className="nav_name">Payments Report</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                             {/*    <div className="accordion" id="accordionExample">
                                    <div className="accordion-item">
                                        <p className="accordion-header" id="headingOne">
                                            <Link onClick={updateActive} to="#" type="button" onClick={() => setPlus4(!plus4)} data-bs-toggle="collapse" data-bs-target="#addons" aria-expanded="true" aria-controls="addons" className={`nav_link`}>
                                                <FontAwesomeIcon icon={faPuzzlePiece} />
                                                <span className="nav_name ">Addons <b>{plus4 ? <FontAwesomeIcon icon={faChevronLeft} /> : <FontAwesomeIcon icon={faChevronDown} />}</b></span>
                                            </Link>
                                        </p>
                                        <div id="addons" className="accordion-collapse collapse " aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                            <div className="accordion-body">
                                                <Link onClick={updateActive} to="/sms-transaction" className={`nav_link ${pathname == "/sms-transaction" && 'active'}`}>
                                                <FontAwesomeIcon icon={faMessage} />
                                                    <span className="nav_name">Sms Transaction</span>
                                                </Link>
                                                <Link onClick={updateActive} to="/sms-setting/bulksmsbd" className={`nav_link ${pathname == "/sms-setting/bulksmsbd" && 'active'}`}>
                                                <FontAwesomeIcon icon={faMessage} />
                                                    <span className="nav_name">Sms List</span>
                                                </Link>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion" id="accordionExample">
                                    <div className="accordion-item">
                                        <p className="accordion-header" id="headingOne">
                                            <Link onClick={updateActive} to="#" type="button" onClick={() => setPlus6(!plus6)} data-bs-toggle="collapse" data-bs-target="#rollManagement" aria-expanded="true" aria-controls="paymentSystem" className={`nav_link `}>
                                            <FontAwesomeIcon icon={faUsersGear} />
                                                <span className="nav_name ">Role Management <b>{plus6 ? <FontAwesomeIcon icon={faChevronLeft} /> : <FontAwesomeIcon icon={faChevronDown} />}</b></span>
                                            </Link>
                                        </p>
                                        <div id="rollManagement" className="accordion-collapse collapse " aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                            <div className="accordion-body">
                                                <Link onClick={updateActive} to="/role-user" className={`nav_link ${pathname == "/role-user" && 'active'}`}>
                                                    <FontAwesomeIcon icon={faPenToSquare} />
                                                    <span className="nav_name">Role Create</span>
                                                </Link>
                                                <Link onClick={updateActive} to="/role-access" className={`nav_link ${pathname == "/role-access" && 'active'}`}>
                                                <FontAwesomeIcon icon={faEye} />
                                                    <span className="nav_name">Role Access</span>
                                                </Link>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Link onClick={updateActive} to="/theme-market" className={`nav_link ${pathname == "/theme-market" && 'active'}`}>
                                    <FontAwesomeIcon icon={faStore} />
                                    <span className="nav_name">Theme Market</span>
                                </Link> */}
                                <Link onClick={handleLinkClick} to="/user/change-pass" id='changepass'
                                className={`${activeLink === 'changepass'? 'text-white font-weight-bold ' :"" }nav_link`}>
                                    <FontAwesomeIcon icon={faGear} />
                                    <span className="nav_name" id='changepass'>Change Password</span>
                                </Link>
                                {/* <Link onClick={updateActive} to="/activities" className={`nav_link ${pathname == "/activities" && 'active'}`}>
                                    <FontAwesomeIcon icon={faListCheck} />
                                    <span className="nav_name">Activity Logs</span>
                                </Link> */}
                                {/* <div className="accordion" id="accordionExample">
                                    <div className="accordion-item">
                                        <p className="accordion-header" id="headingOne">
                                            <Link onClick={updateActive} to="#" type="button" onClick={() => setPlus5(!plus5)} data-bs-toggle="collapse" data-bs-target="#help" aria-expanded="true" aria-controls="help" className={`nav_link `}>
                                                <FontAwesomeIcon icon={faCircleInfo} />
                                                <span className="nav_name ">Help <b>{plus5 ? <FontAwesomeIcon icon={faChevronLeft} /> : <FontAwesomeIcon icon={faChevronDown} />}</b></span>
                                            </Link>
                                        </p>
                                        <div id="help" className="accordion-collapse collapse " aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                            <div className="accordion-body">
                                                <Link onClick={updateActive} to="/general-setting" className={`nav_link `}>
                                                    <FontAwesomeIcon icon={faGear} />
                                                    <span className="nav_name">General Setting</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                <Link onClick={logoutHandle} to="#" id='logout'
                                className={`${activeLink === 'logout'? 'text-white font-weight-bold ' :"" }nav_link`}>
                                    <FontAwesomeIcon icon={faFileInvoice} />
                                    <span className="nav_name">Logout</span>
                                </Link>
                            </div>
                        </div> 
                    </nav>
                </div>
            </div>

        </div>
        <Outlet />
        </>
    )
}