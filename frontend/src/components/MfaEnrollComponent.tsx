import React, { useState, useEffect } from 'react';

interface MfaEnrollComponentData {
    errorMessage?: number;
    qrCodeDataUri?: any[];
    secretKey?: string;
    accountEmail?: number;
    issuer?: boolean;
}

type MfaEnrollComponentProps = {
    data?: Record<string, any>;
    onSubmit?: (formData: Record<string, any>) => void | Promise<void>;
};

export const MfaEnrollComponent: React.FC<MfaEnrollComponentProps> = ({ data = {}, onSubmit }) => {
    const [formData, setFormData] = useState<Record<string, any>>({
        'parameterName': '',
        'code': '',
    });
    const [backendActionNotice, setBackendActionNotice] = useState("");
    const { _csrf, accountEmail, border, currentUser, errorMessage, issuer, qrCodeDataUri, secretKey, sessionScope } = data;

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
            // 5-minute countdown timer
                let enrollSecondsRemaining = 300;
                const countdownEl = document.getElementById("enrollCountdown") /* TODO: useRef */;
            
                const enrollInterval = setInterval(function() {
                    enrollSecondsRemaining--;
                    if (enrollSecondsRemaining <= 0) {
                        clearInterval(enrollInterval);
                        countdownEl.innerText = "00:00 (Expired)";
                        alert("Your 5-minute enrollment session has expired. Please log in again to generate a new setup code.");
                        window.location.href = '/login?expired=true';
                        return;
                    }
            
                    const mins = Math.floor(enrollSecondsRemaining / 60);
                    const secs = enrollSecondsRemaining % 60;
                    countdownEl.innerText = (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
                }, 1000);
            
                function copySecretKey() {
                    const rawKey = "${rawSecret}";
                    navigator.clipboard.writeText(rawKey).then(function() {
                        const copyBtn = document.getElementById("copyBtn") /* TODO: useRef */;
                        copyBtn.innerText = "✓ Copied!";
                        copyBtn.style.background = "#dcfce7";
                        copyBtn.style.borderColor = "#86efac";
                        setTimeout(function() {
                            copyBtn.innerText = "📋 Copy";
                            copyBtn.style.background = "#f1f5f9";
                            copyBtn.style.borderColor = "#cbd5e1";
                        }, 2500);
                    }).catch(function() {
                        alert("Secret key: " + rawKey);
                    });
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
        
        
        <div className="card" style={{ width: '500px', maxWidth: '92%' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '54px', height: '54px', background: '#eef2ff', borderRadius: '50%', color: '#4338ca', fontSize: '26px', marginBottom: '12px' }}>
                    🔐
                </div>
                <h2 style={{ margin: '0', color: '#1e293b', fontSize: '22px', fontWeight: '700' }}>Two-Factor Authentication Setup</h2>
                <p style={{ color: '#64748b', fontSize: '13px', margin: '6px 0 0 0' }}>
                    Secure your account with Google Authenticator or any standard TOTP app.
                </p>
            </div>
        
            {(!!(errorMessage)) && (<>
                <div className="alert alert-error" style={{ marginBottom: '18px' }}>
                    {errorMessage}
                </div>
            </>)}
        
            
            <div style={{ background: '#f1f5f9', padding: '10px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', textAlign: 'center', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span>⏳ Enrollment session expires in:</span>
                <span id="enrollCountdown" style={{ fontWeight: '700', color: '#dc2626', fontFamily: 'monospace', fontSize: '15px' }}>05:00</span>
            </div>
        
            
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', marginBottom: '20px', textAlign: 'center' }}>
                <div style={{ fontWeight: '600', fontSize: '14px', color: '#334155', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <span style={{ background: '#e67e22', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>1</span>
                    Scan this QR code with your Authenticator app
                </div>
        
                <div style={{ display: 'inline-block', padding: '10px', background: '#ffffff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
                    <img src={qrCodeDataUri} alt="MFA Provisioning QR Code" width="220" height="220" style={{ display: 'block', borderRadius: '4px' }} id="qrCodeImage" />
                </div>
        
                
                <div style={{ marginTop: '14px', fontSize: '12px', color: '#64748b' }}>
                    <span>Cannot scan QR code? Enter this key manually:</span>
                    <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <code id="secretKeyText" style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '13px', fontWeight: '700', letterSpacing: '2px', color: '#0f172a' }}>{secretKey}</code>
                        <button type="button" onclick="copySecretKey()" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#334155', fontWeight: '600' }} id="copyBtn">
                            📋 Copy
                        </button>
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                        Account: <strong>{accountEmail}</strong> | Issuer: <strong>{issuer}</strong>
                    </div>
                </div>
            </div>
        
            
            <div style={{ marginBottom: '10px' }}>
                <div style={{ fontWeight: '600', fontSize: '14px', color: '#334155', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <span style={{ background: '#e67e22', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>2</span>
                    Enter the 6-digit code from your app
                </div>
        
                <form onSubmit={handleSubmit} action="/mfa-enroll" method="post" id="enrollForm">
                    
                    <input type="hidden" name={_csrf?.parameterName} value={_csrf?.token} />
        
                    <input onChange={handleInputChange} type="text" id="code" name="code" maxlength="6" pattern="[0-9]{6}" placeholder="000000" required autofocus autocomplete="one-time-code" inputmode="numeric" style={{ textAlign: 'center', fontSize: '26px', fontWeight: '700', letterSpacing: '8px', fontFamily: 'monospace', padding: '12px', color: '#1e293b' }} />
        
                    <button type="submit" className="btn" style={{ marginTop: '10px', padding: '14px', fontSize: '15px' }}>
                        Verify Code & Complete Enrollment
                    </button>
                </form>
            </div>
        
            <div style={{ textAlign: 'center', marginTop: '18px' }}>
                <a href="/login" style={{ fontSize: '13px', color: '#64748b', textDecoration: 'none' }}>Cancel & Return to Login</a>
            </div>
        </div>
        </>
    );
};

export default MfaEnrollComponent;
