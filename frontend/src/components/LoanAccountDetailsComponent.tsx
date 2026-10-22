import React, { useState, useEffect } from 'react';

type LoanAccountDetailsComponentProps = {
    data?: Record<string, any>;
    onSubmit?: (formData: Record<string, any>) => void | Promise<void>;
};

export const LoanAccountDetailsComponent: React.FC<LoanAccountDetailsComponentProps> = ({ data = {}, onSubmit }) => {
    const [formData, setFormData] = useState<Record<string, any>>({
        'parameterName': '',
    });
    const [backendActionNotice, setBackendActionNotice] = useState("");
    const { _csrf, border, currentUser, loanDetails, sessionScope } = data;

    const userObj = (data?.userObj || data?.sessionScope?.user || data?.currentUser || data?.user || null);
    const cust = loanDetails.customerProfile.data;
    const ld = loanDetails.loanDetails.data;
    const os = loanDetails.outstandingSummary.data;
    const del = loanDetails.delinquency.data;
    const rs = loanDetails.repaymentSchedule.data;
    const ph = loanDetails.paymentHistory.data;
    const cg = loanDetails.collateralGuarantor.data;
    const la = loanDetails.linkedAccount.data;

    useEffect(() => {
        // Preserved from original inline <script>:
        try {
            // Server-side session timeout is exactly 10 minutes (600 seconds)
                // Warning displayed 60 seconds before expiration (at 540 seconds)
                const TOTAL_TIMEOUT_SEC = 600;
                const WARNING_TIME_SEC = 60;
                const INACTIVITY_LIMIT_SEC = TOTAL_TIMEOUT_SEC - WARNING_TIME_SEC; // 540 seconds
            
                let inactivityTimer = 0;
                let warningCountdown = WARNING_TIME_SEC;
                let countdownInterval = null;
                let modalShown = false;
            
                function resetInactivity() {
                    if (!modalShown) {
                        inactivityTimer = 0;
                    }
                }
            
                // Reset inactivity counter on user interactions (mouse, keyboard)
                window.addEventListener('mousemove', resetInactivity);
                window.addEventListener('keydown', resetInactivity);
                window.addEventListener('click', resetInactivity);
            
                setInterval(function() {
                    if (!modalShown) {
                        inactivityTimer++;
                        if (inactivityTimer >= INACTIVITY_LIMIT_SEC) {
                            showWarningModal();
                        }
                    }
                }, 1000);
            
                function showWarningModal() {
                    modalShown = true;
                    warningCountdown = WARNING_TIME_SEC;
                    document.getElementById("sessionCountdown") /* TODO: useRef */.innerText = warningCountdown;
                    document.getElementById("sessionModal") /* TODO: useRef */.style.display = 'flex';
            
                    countdownInterval = setInterval(function() {
                        warningCountdown--;
                        document.getElementById("sessionCountdown") /* TODO: useRef */.innerText = warningCountdown;
                        if (warningCountdown <= 0) {
                            clearInterval(countdownInterval);
                            // Inactivity limit reached: redirect to login with expired notice
                            window.location.href = '/login?expired=true';
                        }
                    }, 1000);
                }
            
                function stayLoggedIn() {
                    // Send keep-alive request to server with CSRF header
                    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
                    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');
            
                    fetch('/session/keep-alive', {
                        method: 'POST',
                        headers: {
                            [csrfHeader]: csrfToken
                        }
                    }).then(response => {
                        if (response.ok) {
                            clearInterval(countdownInterval);
                            modalShown = false;
                            inactivityTimer = 0;
                            document.getElementById("sessionModal") /* TODO: useRef */.style.display = 'none';
                        } else {
                            window.location.href = '/login?expired=true';
                        }
                    }).catch(() => {
                        window.location.href = '/login?expired=true';
                    });
                }
            
                function logoutNow() {
                    // Submit logout form
                    const logoutForm = document.querySelector('.logout-form');
                    if (logoutForm) {
                        logoutForm.submit();
                    } else {
                        window.location.href = '/login?logout=true';
                    }
                }
            // Visual pulse effect for overdue badges
                const style = document.createElement('style');
                style.innerHTML = `
                    @keyframes pulse {
                        0% { opacity: 1; }
                        50% { opacity: 0.6; }
                        100% { opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
        } catch(e) {}
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name) setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (onSubmit) {
            await onSubmit(formData);
            return;
        }
        setBackendActionNotice("This form originally submitted to '/logout' using POST. That backend action has not been migrated to an API endpoint, so the form was not submitted.");
    
    };

    const handleBackendAction = async (
        e: React.MouseEvent<HTMLElement>,
        action: string = "",
    ) => {
        e.preventDefault();
        if (onSubmit) {
            await onSubmit(formData);
            return;
        }
        setBackendActionNotice(
            action
                ? `The original backend action '${action}' has not been migrated to an API endpoint, so the action was not sent.`
                : "This form originally submitted to '/logout' using POST. That backend action has not been migrated to an API endpoint, so the form was not submitted.",
        );
    };

    return (
        <>
        {backendActionNotice && (
            <div className="alert alert-warning" role="alert" data-apex-backend-action="unmigrated">
                {backendActionNotice}
            </div>
        )}
<div className="navbar">
            <div className="logo">
                <a href="/">
                    <img src="/images/bank-logo.jpg" alt="Bank of India" className="bank-logo" />
                    Bank of <span className="brand-orange">India</span>
                </a>
            </div>
        
            <div className="nav">
                {
                    (userObj != null) ? (<>
                        <span className="user-badge">
                            👤 {userObj?.name}
                            <span className="role-pill">
                                {
                                    (userObj?.role == 'ROLE_CUSTOMER') ? (<>Customer</>) :
                                    (userObj?.role == 'ROLE_LOAN_OFFICER') ? (<>Loan Officer</>) :
                                    (userObj?.role == 'ROLE_COLLECTIONS_AGENT') ? (<>Collections Agent</>) :
                                    (userObj?.role == 'ROLE_COLLECTIONS_MANAGER') ? (<>Collections Manager</>) :
                                    (userObj?.role == 'ROLE_ADMIN') ? (<>Admin</>) :
                                    (<>{userObj?.role}</>)
                                }
                            </span>
                        </span>
        
                        <a href="/dashboard">Dashboard</a>
        
                        {(userObj?.role == 'ROLE_LOAN_OFFICER' || userObj?.role == 'ROLE_COLLECTIONS_AGENT' || userObj?.role == 'ROLE_COLLECTIONS_MANAGER' || userObj?.role == 'ROLE_ADMIN') && (<>
                            <a href="/loan-search">Loan Search</a>
                        </>)}
        
                        {(userObj?.role == 'ROLE_ADMIN') && (<>
                            <a href="/admin/staff">Staff Management</a>
                            <a href="/admin/audit-logs">Audit Trail</a>
                            <a href="/admin/reminders/demo" style={{ color: '#d97706', fontWeight: '700' }}>🔔 DPD Reminders Demo</a>
                        </>)}
        
                        {(userObj?.role == 'ROLE_CUSTOMER') && (<>
                            <a href="/applyLoan">Apply Loan</a>
                        </>)}
        
                        <form onSubmit={handleSubmit} className="logout-form" action="/logout" method="post">
                            <input type="hidden" name={_csrf?.parameterName} value={_csrf?.token} />
                            <button type="submit" className="logout-btn">Log Out</button>
                        </form>
                    </>) :
                    (<>
                        <a href="/">Home</a>
                        <a href="/login">Login</a>
                        <a href="/register">Sign Up</a>
                    </>)
                }
            </div>
        </div>
        
        
        {(userObj != null) && (<>
        <div id="sessionModal">
            <div className="modal-content">
                <h3 style={{ marginTop: '0', color: '#2d3748' }}>Session Inactivity Warning</h3>
                <p style={{ color: '#718096', fontSize: '14px' }}>Your session is about to expire due to inactivity.</p>
                <div className="countdown-timer" id="sessionCountdown">60</div>
                <p style={{ color: '#718096', fontSize: '13px' }}>Seconds remaining before automatic logout</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button className="btn" onclick="stayLoggedIn()">Stay Logged In</button>
                    <button className="btn btn-secondary" onclick="logoutNow()">Log Out Now</button>
                </div>
            </div>
        </div>
        
        
        </>)}
        
        
        <div className="wide-card" style={{ maxWidth: '1400px', margin: '0 auto', padding: '25px' }}>
        
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #edf2f7', paddingBottom: '15px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h2 style={{ margin: '0', color: '#1e293b', fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>
                            🎯 360° Loan Account Profile
                        </h2>
                        <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '5px 12px', borderRadius: '14px', fontSize: '13px', fontWeight: '700', fontFamily: 'monospace' }}>
                            {loanDetails?.accountNumber}
                        </span>
                        <span style={{ background: '#f1f5f9', color: '#475569', padding: '5px 12px', borderRadius: '14px', fontSize: '12px', fontWeight: '600' }}>
                            🏢 Branch: {loanDetails?.branch}
                        </span>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: '6px 0 0 0' }}>
                        Unified real-time banking intelligence dashboard for authorized loan officers and collections specialists.
                    </p>
                </div>
        
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', color: '#334155' }}>
                        <span style={{ color: '#64748b' }}>⏱️ Last refreshed:</span>
                        <strong style={{ color: '#0f172a' }}>{loanDetails?.lastRefreshedFormatted}</strong>
                    </div>
        
                    
                    <a href="/loan-details?loanId={loanDetails?.loanId}&refresh=true" className="btn btn-outline-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', fontSize: '13px', fontWeight: '600', textDecoration: 'none', border: '1px solid #6366f1', color: '#6366f1', borderRadius: '6px', background: '#ffffff' }}>
                        🔄 Refresh Data
                    </a>
        
                    
                    <a href="/loan-details/{loanDetails?.loanId}/statement.pdf" target="_blank" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 16px', fontSize: '13px', fontWeight: '600', textDecoration: 'none', background: '#4f46e5', color: '#ffffff', borderRadius: '6px', border: 'none', boxShadow: '0 2px 4px rgba(79,70,229,0.2)' }}>
                        📄 Download Statement (PDF)
                    </a>
        
                    <a href="/loan-search" className="btn btn-secondary" style={{ padding: '7px 14px', fontSize: '13px', textDecoration: 'none', background: '#e2e8f0', color: '#334155', borderRadius: '6px', border: 'none' }}>
                        &larr; Search
                    </a>
                </div>
            </div>
        
            
            {(isRefreshed) && (<>
                <div className="alert alert-success" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 18px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <strong>✅ Data Refreshed Successfully:</strong> Authoritative loan and installment records have been synchronized as of <strong>{loanDetails?.lastRefreshedFormatted}.</strong>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '600', opacity: '0.8' }}>Correlation ID: {loanDetails?.correlationId}</span>
                </div>
            </>)}
        
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px', marginBottom: '25px' }}>
        
                
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
                        <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            👤 Customer Profile
                        </h3>
                        {
                            (loanDetails?.customerProfile.status == 'SUCCESS') ? (<>
                                <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>
                                    KYC: {loanDetails?.customerProfile.data.kycStatus}
                                </span>
                            </>) :
                            (<>
                                <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>
                                    {loanDetails?.customerProfile.status}
                                </span>
                            </>)
                        }
                    </div>
        
                    {
                        (loanDetails?.customerProfile.status == 'SUCCESS') ? (<>
                            {(cust?.contactDetailUpdateRequired) && (<>
                                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>⚠️</span>
                                    <div>
                                        <strong>Contact Detail Update Required:</strong> Customer communication bounced or email/mobile is invalid. Please request updated contact details during borrower outreach.
                                    </div>
                                </div>
                            </>)}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13px' }}>
                                <div>
                                    <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Customer Name</div>
                                    <div style={{ color: '#0f172a', fontWeight: '700', fontSize: '15px', marginTop: '2px' }}>{cust?.fullName}</div>
                                </div>
                                <div>
                                    <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Customer ID</div>
                                    <div style={{ color: '#4338ca', fontWeight: '600', fontFamily: 'monospace', marginTop: '2px' }}>{cust?.customerId}</div>
                                </div>
                                <div>
                                    <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Date of Birth</div>
                                    <div style={{ color: '#334155', marginTop: '2px' }}>{cust?.dateOfBirth}</div>
                                </div>
                                <div>
                                    <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Preferred Contact</div>
                                    <div style={{ color: '#334155', marginTop: '2px' }}>{cust?.preferredContactMethod}</div>
                                </div>
                                <div>
                                    <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Mobile Number</div>
                                    <div style={{ color: '#334155', fontFamily: 'monospace', marginTop: '2px' }}>
                                        {cust?.maskedPhone} <span style={{ color: '#94a3b8', fontSize: '11px' }}>(Masked)</span>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Email Address</div>
                                    <div style={{ color: '#334155', fontFamily: 'monospace', marginTop: '2px' }}>
                                        {cust?.maskedEmail} <span style={{ color: '#94a3b8', fontSize: '11px' }}>(Masked)</span>
                                    </div>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Permanent Address</div>
                                    <div style={{ color: '#334155', marginTop: '2px' }}>{cust?.address}</div>
                                </div>
                            </div>
                        </>) :
                        (<>
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px', borderRadius: '6px', fontSize: '13px' }}>
                                ⚠️ <strong>Customer Profile Unavailable:</strong> {loanDetails?.customerProfile.errorMessage}
                            </div>
                        </>)
                    }
                </div>
        
                
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
                        <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            💳 Loan Account Details
                        </h3>
                        {
                            (loanDetails?.loanDetails.data.loanStatus == 'APPROVED') ? (<>
                                <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>ACTIVE / APPROVED</span>
                            </>) :
                            (loanDetails?.loanDetails.data.loanStatus == 'CLOSED') ? (<>
                                <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>CLOSED</span>
                            </>) :
                            (<>
                                <span style={{ background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>
                                    {loanDetails?.loanDetails.data.loanStatus}
                                </span>
                            </>)
                        }
                    </div>
        
                    {
                        (loanDetails?.loanDetails.status == 'SUCCESS') ? (<>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13px' }}>
                                <div>
                                    <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Loan Account Number</div>
                                    <div style={{ color: '#0f172a', fontWeight: '700', fontFamily: 'monospace', fontSize: '14px', marginTop: '2px' }}>{ld?.loanAccountNumber}</div>
                                </div>
                                <div>
                                    <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Loan Product Type</div>
                                    <div style={{ color: '#334155', fontWeight: '600', marginTop: '2px' }}>{ld?.productType}</div>
                                </div>
                                <div>
                                    <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Sanctioned Amount</div>
                                    <div style={{ color: '#0f172a', fontWeight: '700', fontSize: '15px', marginTop: '2px' }}>
                                        ₹{ld?.sanctionedAmount}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Disbursed Amount</div>
                                    <div style={{ color: '#0f172a', fontWeight: '700', fontSize: '15px', marginTop: '2px' }}>
                                        ₹{ld?.disbursedAmount}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Disbursement Date</div>
                                    <div style={{ color: '#334155', marginTop: '2px' }}>{ld?.disbursementDate}</div>
                                </div>
                                <div>
                                    <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Interest Rate & Type</div>
                                    <div style={{ color: '#334155', fontWeight: '600', marginTop: '2px' }}>
                                        {ld?.interestRate}% p.a. ({ld?.interestType})
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Tenure</div>
                                    <div style={{ color: '#334155', marginTop: '2px' }}>{ld?.tenureMonths} Months</div>
                                </div>
                                <div>
                                    <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Monthly EMI</div>
                                    <div style={{ color: '#4338ca', fontWeight: '800', fontSize: '15px', marginTop: '2px' }}>
                                        ₹{ld?.monthlyEmi}
                                    </div>
                                </div>
                            </div>
                        </>) :
                        (<>
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px', borderRadius: '6px', fontSize: '13px' }}>
                                ⚠️ <strong>Loan Details Unavailable:</strong> {loanDetails?.loanDetails.errorMessage}
                            </div>
                        </>)
                    }
                </div>
            </div>
        
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '25px' }}>
        
                
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
                        <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            💰 Outstanding Balance Summary
                        </h3>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Accounting Rule: Exact BigDecimal Half-Up</span>
                    </div>
        
                    {
                        (loanDetails?.outstandingSummary.status == 'SUCCESS') ? (<>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
                                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                                    <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Principal Outstanding</div>
                                    <div style={{ color: '#0f172a', fontSize: '18px', fontWeight: '800', marginTop: '4px' }}>
                                        ₹{os?.principalOutstanding}
                                    </div>
                                </div>
                                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                                    <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Accrued Interest</div>
                                    <div style={{ color: '#0f172a', fontSize: '18px', fontWeight: '800', marginTop: '4px' }}>
                                        ₹{os?.accruedInterest}
                                    </div>
                                </div>
                                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                                    <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Penalties & Late Fees</div>
                                    <div style={{ color: '#b91c1c', fontSize: '18px', fontWeight: '800', marginTop: '4px' }}>
                                        ₹{os?.penaltiesAndLateFees}
                                    </div>
                                </div>
                                <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '8px', padding: '12px' }}>
                                    <div style={{ color: '#4338ca', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Total Payable Amount</div>
                                    <div style={{ color: '#3730a3', fontSize: '20px', fontWeight: '800', marginTop: '4px' }}>
                                        ₹{os?.totalPayable}
                                    </div>
                                </div>
                            </div>
        
                            
                            <div style={{ marginTop: '14px', background: '#fafafa', border: '1px dashed #d4d4d8', borderRadius: '6px', padding: '10px 14px', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong>🏦 Indicative Foreclosure Amount:</strong>
                                    {
                                        (os?.foreclosureAmount != null) ? (<>
                                            <span style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', marginLeft: '8px' }}>
                                                ₹{os?.foreclosureAmount}
                                            </span>
                                        </>) :
                                        (<>
                                            <span style={{ color: '#71717a', fontStyle: 'italic', marginLeft: '8px' }}>{os?.foreclosureStatus}</span>
                                        </>)
                                    }
                                </div>
                                <span style={{ color: '#a1a1aa', fontSize: '11px' }}>Subject to authoritative CBS verification at settlement date</span>
                            </div>
                        </>) :
                        (<>
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px', borderRadius: '6px', fontSize: '13px' }}>
                                ⚠️ <strong>Outstanding Balance Calculation Unavailable:</strong> {loanDetails?.outstandingSummary.errorMessage}
                            </div>
                        </>)
                    }
                </div>
        
                
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
                        <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            ⚠️ Delinquency & DPD
                        </h3>
                    </div>
        
                    {
                        (loanDetails?.delinquency.status == 'SUCCESS') ? (<>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '8px 12px', borderRadius: '6px' }}>
                                    <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '600' }}>Days Past Due (DPD):</span>
                                    {
                                        (del?.dpd == 0) ? (<>
                                            <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: '12px', fontWeight: '800', fontSize: '13px' }}>0 Days (Regular)</span>
                                        </>) :
                                        (del?.dpd <= 30) ? (<>
                                            <span style={{ background: '#fef3c7', color: '#b45309', padding: '3px 10px', borderRadius: '12px', fontWeight: '800', fontSize: '13px' }}>{del?.dpd} Days (SMA-0)</span>
                                        </>) :
                                        (del?.dpd <= 60) ? (<>
                                            <span style={{ background: '#ffedd5', color: '#c2410c', padding: '3px 10px', borderRadius: '12px', fontWeight: '800', fontSize: '13px' }}>{del?.dpd} Days (SMA-1)</span>
                                        </>) :
                                        (del?.dpd <= 90) ? (<>
                                            <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '3px 10px', borderRadius: '12px', fontWeight: '800', fontSize: '13px' }}>{del?.dpd} Days (SMA-2)</span>
                                        </>) :
                                        (<>
                                            <span style={{ background: '#991b1b', color: '#ffffff', padding: '3px 10px', borderRadius: '12px', fontWeight: '800', fontSize: '13px' }}>{del?.dpd} Days (NPA)</span>
                                        </>)
                                    }
                                </div>
        
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', fontSize: '13px' }}>
                                    <span style={{ color: '#64748b' }}>Delinquency Bucket:</span>
                                    <strong style={{ color: '#0f172a' }}>{del?.delinquencyBucket}</strong>
                                </div>
        
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', fontSize: '13px' }}>
                                    <span style={{ color: '#64748b' }}>Overdue Amount:</span>
                                    <strong style="color:{del?.overdueAmount > 0 ? '#b91c1c' : '#15803d'}; font-size:14px;">
                                        ₹{del?.overdueAmount}
                                    </strong>
                                </div>
        
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', fontSize: '13px' }}>
                                    <span style={{ color: '#64748b' }}>Account Classification:</span>
                                    <strong style={{ color: '#0f172a' }}>{del?.accountStatus}</strong>
                                </div>
        
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px', fontSize: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                                    <span style={{ color: '#94a3b8' }}>Last Reminder Sent:</span>
                                    <span style={{ color: '#64748b' }}>{del?.lastReminderSent}</span>
                                </div>
                            </div>
                        </>) :
                        (<>
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px', borderRadius: '6px', fontSize: '13px' }}>
                                ⚠️ <strong>Delinquency Data Unavailable:</strong> {loanDetails?.delinquency.errorMessage}
                            </div>
                        </>)
                    }
                </div>
            </div>
        
            
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)', marginBottom: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📅 Complete Repayment Schedule (Amortization)
                    </h3>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Automated DPD Calculation strictly applied on unpaid installments past due</span>
                </div>
        
                {
                    (loanDetails?.repaymentSchedule.status == 'SUCCESS') ? (<>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        <th style={{ padding: '10px 12px' }}>Inst #</th>
                                        <th style={{ padding: '10px 12px' }}>Due Date</th>
                                        <th style={{ padding: '10px 12px', textAlign: 'right' }}>EMI Amount</th>
                                        <th style={{ padding: '10px 12px', textAlign: 'right' }}>Principal</th>
                                        <th style={{ padding: '10px 12px', textAlign: 'right' }}>Interest</th>
                                        <th style={{ padding: '10px 12px', textAlign: 'right' }}>Paid Amount</th>
                                        <th style={{ padding: '10px 12px', textAlign: 'center' }}>Payment Status</th>
                                        <th style={{ padding: '10px 12px', textAlign: 'center' }}>DPD</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rs?.installments && rs?.installments.map((inst: any, index: number) => (<>
                                        <tr style="border-bottom:1px solid #f1f5f9; background:{inst.status == 'OVERDUE' ? '#fff1f2' : ((inst.status == 'PAID' || inst.status == 'COMPLETED') ? '#f0fdf4' : (inst.status == 'PARTIALLY_PAID' ? '#fffbeb' : '#ffffff'))};">
                                            <td style={{ padding: '10px 12px', fontWeight: '700', color: '#334155' }}>{inst.installmentNumber}</td>
                                            <td style={{ padding: '10px 12px', color: '#334155' }}>{inst.dueDate}</td>
                                            <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '700', color: '#0f172a' }}>
                                                ₹{inst.emiAmount}
                                            </td>
                                            <td style={{ padding: '10px 12px', textAlign: 'right', color: '#64748b' }}>
                                                ₹{inst.principalComponent}
                                            </td>
                                            <td style={{ padding: '10px 12px', textAlign: 'right', color: '#64748b' }}>
                                                ₹{inst.interestComponent}
                                            </td>
                                            <td style="padding:10px 12px; text-align:right; font-weight:600; color:{inst.paidAmount > 0 ? '#15803d' : '#94a3b8'};">
                                                ₹{inst.paidAmount}
                                            </td>
                                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                                {
                                                    (inst.status == 'PAID' || inst.status == 'COMPLETED') ? (<>
                                                        <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>PAID</span>
                                                    </>) :
                                                    (inst.status == 'PARTIALLY_PAID') ? (<>
                                                        <span style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>PARTIALLY PAID</span>
                                                    </>) :
                                                    (inst.status == 'OVERDUE') ? (<>
                                                        <span style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', animation: 'pulse 2s infinite' }}>⚠️ OVERDUE</span>
                                                    </>) :
                                                    (<>
                                                        <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>DUE</span>
                                                    </>)
                                                }
                                            </td>
                                            <td style="padding:10px 12px; text-align:center; font-weight:700; color:{inst.dpd > 0 ? '#b91c1c' : '#64748b'};">
                                                {inst.dpd}
                                            </td>
                                        </tr>
                                    </>))}
                                </tbody>
                            </table>
                        </div>
                    </>) :
                    (<>
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px', borderRadius: '6px', fontSize: '13px' }}>
                            ⚠️ <strong>Repayment Schedule Unavailable:</strong> {loanDetails?.repaymentSchedule.errorMessage}
                        </div>
                    </>)
                }
            </div>
        
            
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)', marginBottom: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📜 Verified Payment Transactions
                    </h3>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Direct ledger transactions (No fabricated repayment data)</span>
                </div>
        
                {
                    (loanDetails?.paymentHistory.status == 'SUCCESS') ? (<>
                        {
                            (!ph?.transactions) ? (<>
                                <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', fontSize: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                                    ℹ️ No repayment transactions have been recorded for this loan account yet.
                                </div>
                            </>) :
                            (<>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '11px', textTransform: 'uppercase' }}>
                                                <th style={{ padding: '10px 12px' }}>Payment Date</th>
                                                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Amount Paid</th>
                                                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Mode</th>
                                                <th style={{ padding: '10px 12px' }}>Transaction Reference</th>
                                                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ph?.transactions && ph?.transactions.map((tx: any, index: number) => (<>
                                                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                    <td style={{ padding: '10px 12px', color: '#334155' }}>{tx.paymentDate}</td>
                                                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '700', color: '#15803d' }}>
                                                        ₹{tx.amount}
                                                    </td>
                                                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                                        <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' }}>
                                                            {tx.paymentMode}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: '#4338ca' }}>{tx.transactionReference}</td>
                                                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                                        <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>
                                                            {tx.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </>))}
                                        </tbody>
                                    </table>
                                </div>
                            </>)
                        }
                    </>) :
                    (<>
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px', borderRadius: '6px', fontSize: '13px' }}>
                            ⚠️ <strong>Payment History Unavailable:</strong> {loanDetails?.paymentHistory.errorMessage}
                        </div>
                    </>)
                }
            </div>
        
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
        
                
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
                        <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            🛡️ Collateral & Guarantor Security
                        </h3>
                    </div>
        
                    {
                        (loanDetails?.collateralGuarantor.status == 'SUCCESS') ? (<>
                            <div style={{ marginBottom: '16px' }}>
                                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Pledged Collateral Assets</h4>
                                {
                                    (!cg?.collaterals) ? (<>
                                        <div style={{ fontSize: '12px', color: '#64748b', background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>
                                            No physical or liquid collateral pledged (Unsecured loan facility).
                                        </div>
                                    </>) :
                                    (<>
                                        {cg?.collaterals && cg?.collaterals.map((c: any, index: number) => (<>
                                            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px', marginBottom: '8px', fontSize: '13px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <strong style={{ color: '#0f172a' }}>{c.collateralType}</strong>
                                                    <span style={{ fontWeight: '700', color: '#15803d' }}>₹{c.estimatedValue}</span>
                                                </div>
                                                <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>{c.description}</div>
                                                <div style={{ fontSize: '11px', color: '#4338ca', marginTop: '2px' }}>Lien Status: {c.lienStatus}</div>
                                            </div>
                                        </>))}
                                    </>)
                                }
                            </div>
        
                            
                            <div>
                                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>Guarantor Details</h4>
                                {
                                    (!cg?.guarantors) ? (<>
                                        <div style={{ fontSize: '12px', color: '#64748b', background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>
                                            No third-party guarantor assigned to this facility.
                                        </div>
                                    </>) :
                                    (<>
                                        {cg?.guarantors && cg?.guarantors.map((g: any, index: number) => (<>
                                            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px', marginBottom: '8px', fontSize: '13px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <strong style={{ color: '#0f172a' }}>{g.name}</strong>
                                                    <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>KYC: {g.kycStatus}</span>
                                                </div>
                                                <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>Relationship: {g.relationship} | Phone: {g.phone}</div>
                                            </div>
                                        </>))}
                                    </>)
                                }
                            </div>
                        </>) :
                        (<>
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px', borderRadius: '6px', fontSize: '13px' }}>
                                ⚠️ <strong>Collateral & Guarantor Information Unavailable:</strong> {loanDetails?.collateralGuarantor.errorMessage}
                            </div>
                        </>)
                    }
                </div>
        
                
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
                        <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            🏦 Linked Accounts & CBS Auto-Debit
                        </h3>
                    </div>
        
                    {
                        (loanDetails?.linkedAccount.status == 'SUCCESS') ? (<>
                            {
                                (!la?.accounts) ? (<>
                                    <div style={{ fontSize: '12px', color: '#64748b', background: '#f8fafc', padding: '15px', borderRadius: '6px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
                                        ℹ️ No savings/current bank account is linked for auto-debit on this loan account.
                                    </div>
                                </>) :
                                (<>
                                    {la?.accounts && la?.accounts.map((acc: any, index: number) => (<>
                                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', marginBottom: '10px', fontSize: '13px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <strong style={{ color: '#0f172a' }}>{acc.bankName} ({acc.accountType})</strong>
                                                {(acc.autoDebitEnabled) && (<>
                                                    <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>AUTO-DEBIT ACTIVE</span>
                                                </>)}
                                            </div>
                                            <div style={{ marginTop: '6px', fontFamily: 'monospace', color: '#334155', fontSize: '14px' }}>
                                                Account: {acc.maskedAccountNumber}
                                            </div>
                                            <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                                <span style={{ color: '#64748b' }}>Live CBS Balance:</span>
                                                {
                                                    (acc.accountBalance != null) ? (<>
                                                        <strong style={{ color: '#15803d' }}>₹{acc.accountBalance}</strong>
                                                    </>) :
                                                    (<>
                                                        <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>{acc.coreBankingStatus}</span>
                                                    </>)
                                                }
                                            </div>
                                        </div>
                                    </>))}
                                </>)
                            }
                        </>) :
                        (loanDetails?.linkedAccount.status == 'UNAVAILABLE') ? (<>
                            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#475569', padding: '16px', borderRadius: '8px', fontSize: '13px' }}>
                                <div style={{ fontWeight: '700', marginBottom: '6px', color: '#1e293b' }}>
                                    ℹ️ Core Banking Integration Notice:
                                </div>
                                <p style={{ margin: '0', fontSize: '12px', lineHeight: '1.5' }}>
                                    {loanDetails?.linkedAccount.errorMessage}
                                </p>
                            </div>
                        </>) :
                        (<>
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px', borderRadius: '6px', fontSize: '13px' }}>
                                ⚠️ <strong>Linked Account Information Error:</strong> {loanDetails?.linkedAccount.errorMessage}
                            </div>
                        </>)
                    }
                </div>
            </div>
        </div>
        </>
    );
};

export default LoanAccountDetailsComponent;
