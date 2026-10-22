import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/modern-ui.css';
import './styles/original-jsp-styles.css';
import AdminAuditsComponent from './components/AdminAuditsComponent';
import AdminRemindersComponent from './components/AdminRemindersComponent';
import AdminStaffComponent from './components/AdminStaffComponent';
import ApplyloanComponent from './components/ApplyloanComponent';
import CustomerProfileComponent from './components/CustomerProfileComponent';
import DashboardComponent from './components/DashboardComponent';
import ForgotPasswordComponent from './components/ForgotPasswordComponent';
import HeaderComponent from './components/HeaderComponent';
import IndexComponent from './components/IndexComponent';
import LoanAccountDetailsComponent from './components/LoanAccountDetailsComponent';
import LoanSearchComponent from './components/LoanSearchComponent';
import LoginComponent from './components/LoginComponent';
import MfaEnrollComponent from './components/MfaEnrollComponent';
import MfaComponent from './components/MfaComponent';
import PayComponent from './components/PayComponent';
import RegisterComponent from './components/RegisterComponent';
import ResetPasswordComponent from './components/ResetPasswordComponent';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/adminaudits" element={<AdminAuditsComponent />} />
        <Route path="/adminreminders" element={<AdminRemindersComponent />} />
        <Route path="/adminstaff" element={<AdminStaffComponent />} />
        <Route path="/applyloan" element={<ApplyloanComponent />} />
        <Route path="/customerprofile" element={<CustomerProfileComponent />} />
        <Route path="/" element={<DashboardComponent />} />
        <Route path="/dashboard" element={<DashboardComponent />} />
        <Route path="/forgotpassword" element={<ForgotPasswordComponent />} />
        <Route path="/header" element={<HeaderComponent />} />
        <Route path="/index" element={<IndexComponent />} />
        <Route path="/loanaccountdetails" element={<LoanAccountDetailsComponent />} />
        <Route path="/loansearch" element={<LoanSearchComponent />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/mfaenroll" element={<MfaEnrollComponent />} />
        <Route path="/mfa" element={<MfaComponent />} />
        <Route path="/pay" element={<PayComponent />} />
        <Route path="/register" element={<RegisterComponent />} />
        <Route path="/resetpassword" element={<ResetPasswordComponent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
