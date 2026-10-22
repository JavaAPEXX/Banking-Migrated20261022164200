import React, { useState, useEffect } from 'react';

interface MfaComponentData {
    errorMessage?: number;
}

type MfaComponentProps = {
    data?: Record<string, any>;
    onSubmit?: (formData: Record<string, any>) => void | Promise<void>;
};

export const MfaComponent: React.FC<MfaComponentProps> = ({ data = {}, onSubmit }) => {
    const [formData, setFormData] = useState<Record<string, any>>({
        'parameterName': '',
        'code': '',
    });
    const [backendActionNotice, setBackendActionNotice] = useState("");
    const { _csrf, currentUser, errorMessage, sessionScope } = data;

    const userObj = (data?.userObj || data?.sessionScope?.user || data?.currentUser || data?.user || null);

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
            // 5-minute validity countdown
                let mfaSecondsRemaining = 300;
                const countdownEl = document.getElementById("mfaCountdown") /* TODO: useRef */;
            
                const mfaInterval = setInterval(function() {
                    mfaSecondsRemaining--;
                    if (mfaSecondsRemaining <= 0) {
                        clearInterval(mfaInterval);
                        countdownEl.innerText = "00:00 (Expired)";
                        alert("Your 5-minute authentication challenge has expired. Please log in again.");
                        window.location.href = '/login?error=true';
                        return;
                    }
            
                    const mins = Math.floor(mfaSecondsRemaining / 60);
                    const secs = mfaSecondsRemaining % 60;
                    countdownEl.innerText = (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
                }, 1000);
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
        
        
        <div className="card">
            <h2 style={{ textAlign: 'center', marginTop: '0', color: '#2c3e50' }}>Two-Factor Authentication</h2>
            <p style={{ textAlign: 'center', color: '#718096', fontSize: '13px', marginTop: '-10px', marginBottom: '25px' }}>
                Stage 2: Enter the 6-digit code from your <strong>Authenticator App (TOTP)</strong>
            </p>
        
            {(!!(errorMessage)) && (<>
                <div className="alert alert-error">
                    {errorMessage}
                </div>
            </>)}
        
            <div style={{ background: '#edf2f7', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '13px', textAlign: 'center', color: '#4a5568' }}>
                ⏳ Challenge expires in: <span id="mfaCountdown" style={{ fontWeight: '700', color: '#e53e3e' }}>05:00</span>
            </div>
        
            <form onSubmit={handleSubmit} action="/mfa-verify" method="post">
                
                <input type="hidden" name={_csrf?.parameterName} value={_csrf?.token} />
        
                <label htmlFor="code" style={{ fontWeight: '600', fontSize: '13px', color: '#4a5568' }}>6-Digit Security Code</label>
                <input onChange={handleInputChange} type="text" id="code" name="code" maxlength="6" pattern="[0-9]{6}" placeholder="000000" required autofocus autocomplete="one-time-code" style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '6px' }} />
        
                <button type="submit" className="btn" style={{ marginTop: '10px' }}>Verify & Complete Sign In</button>
            </form>
        
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <a href="/login" style={{ fontSize: '13px', color: '#718096', textDecoration: 'none' }}>Cancel & Return to Login</a>
            </div>
        </div>
        </>
    );
};

export default MfaComponent;
