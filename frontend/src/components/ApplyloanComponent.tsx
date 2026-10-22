import React, { useState, useEffect } from 'react';

interface ApplyloanComponentData {
    minLoanAmount?: number;
    maxLoanAmount?: number;
}

type ApplyloanComponentProps = {
    data?: Record<string, any>;
    onSubmit?: (formData: Record<string, any>) => void | Promise<void>;
};

export const ApplyloanComponent: React.FC<ApplyloanComponentProps> = ({ data = {}, onSubmit }) => {
    const [formData, setFormData] = useState<Record<string, any>>({
        'parameterName': '',
        'amount': '',
    });
    const [backendActionNotice, setBackendActionNotice] = useState("");
    const { _csrf, currentUser, defaultInterestRate, defaultTenureMonths, maxLoanAmount, minLoanAmount, sessionScope } = data;

    const userObj = (data?.userObj || data?.sessionScope?.user || data?.currentUser || data?.user || null);
    const actingUser = (data?.actingUser || data?.sessionScope?.user || data?.currentUser || data?.user || null);
    const isStaffUser = Boolean((data?.actingUser || data?.currentUser || data?.user || null)?.role && (data?.actingUser || data?.currentUser || data?.user || null)?.role !== 'ROLE_CUSTOMER');

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
        
        
        {
            (isStaffUser) ? (<>
                <div className="card" style={{ maxWidth: '520px', width: '90%', textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>🛡️</div>
                    <h2 style={{ marginTop: '0', color: '#24446B' }}>Staff Operational Portal</h2>
                    <div className="alert alert-info" style={{ textAlign: 'left', margin: '20px 0', fontSize: '13px', lineHeight: '1.5' }}>
                        ℹ️ <strong>Staff Policy Restriction:</strong> Loan origination and customer loan applications cannot be submitted by staff accounts. Loan applications must be initiated directly by registered customers through the borrower self-service portal.
                    </div>
                    <a href="/dashboard" className="btn" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '10px', backgroundColor: '#24446B' }}>
                        Return to Operational Dashboard
                    </a>
                </div>
            </>) :
        
            (<>
                <div className="card" style={{ maxWidth: '520px', width: '90%' }}>
                    <h2 style={{ textAlign: 'center', marginTop: '0', color: '#24446B' }}>Apply for a Loan</h2>
                    <p style={{ textAlign: 'center', color: '#64748B', fontSize: '13px', marginTop: '-10px', marginBottom: '20px' }}>
                        Calculate your EMI and submit your loan application.
                    </p>
        
                    <form onSubmit={handleSubmit} action="/applyLoan" method="post">
                        
                        <input type="hidden" name={_csrf?.parameterName} value={_csrf?.token} />
        
                        <label style={{ fontWeight: '600', fontSize: '13px', color: '#24446B' }}>Loan Amount (₹) <span style={{ color: '#DC2626' }}>*</span></label>
                        <input onChange={handleInputChange} type="number" step="any" name="amount" min={minLoanAmount != null ? minLoanAmount : 100} max={maxLoanAmount != null ? maxLoanAmount : 10000000} placeholder="e.g. 50000" required />
                        {(minLoanAmount != null) && (<>
                            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '-8px', marginBottom: '14px' }}>
                                Permitted range: ₹{minLoanAmount} – ₹{maxLoanAmount}
                            </div>
                        </>)}
        
                        
                        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                                🏛️ Predefined Loan Terms (Indian Bank Standard Policy)
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '10px' }}>
                                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Annual Interest Rate</div>
                                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#24446B', marginTop: '2px' }}>
                                        {defaultInterestRate != null ? defaultInterestRate : 10.5}% <span style={{ fontSize: '11px', fontWeight: '500', color: '#059669' }}>(Fixed)</span>
                                    </div>
                                </div>
                                <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '10px' }}>
                                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Standard Tenure</div>
                                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#24446B', marginTop: '2px' }}>
                                        {defaultTenureMonths != null ? defaultTenureMonths : 24} Months
                                    </div>
                                </div>
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '8px' }}>
                                ℹ️ Rates and tenure are standardized by Indian Bank policy and calculated automatically upon submission.
                            </div>
                        </div>
        
                        <button type="submit" className="btn" style={{ marginTop: '10px', backgroundColor: '#ED7D16' }}>Submit Loan Application</button>
                    </form>
        
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <a href="/dashboard" style={{ fontSize: '13px', color: '#64748B', textDecoration: 'none' }}>Cancel & Back to Dashboard</a>
                    </div>
                </div>
            </>)
        }
        </>
    );
};

export default ApplyloanComponent;
