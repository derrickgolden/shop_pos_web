import { Route, Routes } from 'react-router-dom';
import './App.css';
import { ForgotPassword, Login, ResetPassword, Signup } from './user/components/auth';
import { Inventory, InventoryProductGroup, InventoryProductList, 
  PaymentReport, SalesEntry, SalesReport, Session, UserDashboard } from './user/pages';
import { ALogin } from './admin/components';
import LandingPageHeader from './user/sections/LandingPageHeader';
import RegisterShop from './user/sections/shop/RegisterShop';
import SummaryDetails from './user/components/inventory/SummaryDetails';
import ChangePassword from './user/pages/ChangePassword';
import { useEffect } from 'react';

function App() {
  useEffect(() =>{

  }, []);
  return (
    <>
      <div>
        <Routes>
          <Route path='/user' element={<LandingPageHeader />}>
            <Route path='dashboard' element={<UserDashboard />} />
            <Route path='dashboard/details' element={<SummaryDetails />} />
            <Route path='register-shop' element={<RegisterShop />} />
            <Route path='session' element={<Session />} />
            <Route path='change-pass' element={<ChangePassword />} />
            <Route path='inventory'>
              <Route index element={< Inventory />} />
              <Route path='product-list' element={<InventoryProductList />}/>
              <Route path='product-group' element={<InventoryProductGroup />}/>
            </Route>
            <Route path='report'>
              <Route path='sales' element={<SalesReport />}/>
              <Route path='payments' element={<PaymentReport />}/>
            </Route>
          </Route>

          <Route path='/:urltoken' element={<Login />} />
          <Route path='/' element={<Login />} />
          <Route path='/user' >
            <Route path="login/:urltoken" element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="reset-password/:urltoken" element={<ResetPassword />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path='sales-entry' element={<SalesEntry />} />
          </Route>
          <Route path='/admin'>
            <Route path="login" element={<ALogin />} />
          </Route>
        </Routes>
      </div>     
    </>
  )
}

export default App