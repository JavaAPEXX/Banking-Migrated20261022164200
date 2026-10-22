import React, { useState, useEffect } from 'react';

interface AdminStaffComponentData {
    errorMessage?: number;
}

type AdminStaffComponentProps = {
    data?: Record<string, any>;
    onSubmit?: (formData: Record<string, any>) => void | Promise<void>;
};

export const AdminStaffComponent: React.FC<AdminStaffComponentProps> = ({ data = {}, onSubmit }) => {
    const [formData, setFormData] = useState<Record<string, any>>({
        'parameterName': '',
        'staffId': '',
        'email': '',
        'name': '',
        'password': '',
        'newRole': '',
        'role': '',
    });
    const [backendActionNotice, setBackendActionNotice] = useState("");
    const { _csrf, currentUser, errorMessage, param, roles, sessionScope, staffList } = data;

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
        
        
        <div className="wide-card">
            <h2 style={{ marginTop: '0', color: '#2c3e50' }}>🛡️ Bank Staff Management</h2>
            <p style={{ color: '#718096', fontSize: '14px', marginTop: '-10px' }}>
                Authorized Administrator Portal: Provision staff accounts, assign roles, unlock accounts, and reset MFA.
            </p>
        
            {(param?.success == 'provisioned') && (<>
                <div className="alert alert-success">Staff member successfully provisioned with mandatory MFA enrollment.</div>
            </>)}
            {(param?.success == 'unlocked') && (<>
                <div className="alert alert-success">Staff account has been unlocked. Failed attempt counter reset.</div>
            </>)}
            {(param?.success == 'role_updated') && (<>
                <div className="alert alert-success">Staff role successfully updated.</div>
            </>)}
            {(param?.success == 'mfa_reset') && (<>
                <div className="alert alert-success">MFA secret has been reset for the staff member.</div>
            </>)}
            {(!!(errorMessage)) && (<>
                <div className="alert alert-error">{errorMessage}</div>
            </>)}
        
            <h3 style={{ color: '#2d3748', marginTop: '30px', borderBottom: '2px solid #edf2f7', paddingBottom: '10px' }}>Existing Staff Directory</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>MFA</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {staffList && staffList?.map((staff: any, index: number) => (<>
                        <tr>
                            <td>{staff.id}</td>
                            <td><strong>{staff.name}</strong></td>
                            <td>{staff.email}</td>
                            <td>
                                <form onSubmit={handleSubmit} action="/admin/staff/role" method="post" style={{ display: 'flex', gap: '6px', margin: '0' }}>
                                    <input type="hidden" name={_csrf?.parameterName} value={_csrf?.token} />
                                    <input type="hidden" name="staffId" value={staff.id} />
                                    <select onChange={handleInputChange} name="newRole" style={{ padding: '4px 8px', margin: '0', width: 'auto', fontSize: '12px' }}>
                                        {roles && roles?.map((r: any, index: number) => (<>
                                            <option value={r} selected={staff.role == r}>{r.displayName}</option>
                                        </>))}
                                    </select>
                                    <button type="submit" className="btn" style={{ padding: '4px 8px', width: 'auto', fontSize: '12px' }}>Change</button>
                                </form>
                            </td>
                            <td>
                                {
                                    (staff.accountNonLocked) ? (<>
                                        <span style={{ color: '#276749', background: '#c6f6d5', padding: '3px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '600' }}>ACTIVE</span>
                                    </>) :
                                    (<>
                                        <span style={{ color: '#c53030', background: '#fed7d7', padding: '3px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '600' }}>LOCKED (5 failures)</span>
                                    </>)
                                }
                            </td>
                            <td>
                                <span style={{ color: '#2b6cb0', background: '#bee3f8', padding: '3px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '600' }}>
                                    {staff.mfaType} (Enrolled)
                                </span>
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    {(!staff.accountNonLocked) && (<>
                                        <form onSubmit={handleSubmit} action="/admin/staff/unlock" method="post" style={{ margin: '0' }}>
                                            <input type="hidden" name={_csrf?.parameterName} value={_csrf?.token} />
                                            <input type="hidden" name="email" value={staff.email} />
                                            <button type="submit" className="btn btn-secondary" style={{ padding: '4px 10px', width: 'auto', fontSize: '12px' }}>Unlock</button>
                                        </form>
                                    </>)}
                                    <form onSubmit={handleSubmit} action="/admin/staff/reset-mfa" method="post" style={{ margin: '0' }}>
                                        <input type="hidden" name={_csrf?.parameterName} value={_csrf?.token} />
                                        <input type="hidden" name="staffId" value={staff.id} />
                                        <button type="submit" className="btn btn-danger" style={{ padding: '4px 10px', width: 'auto', fontSize: '12px' }}>Reset MFA</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    </>))}
                </tbody>
            </table>
        
            <h3 style={{ color: '#2d3748', marginTop: '40px', borderBottom: '2px solid #edf2f7', paddingBottom: '10px' }}>➕ Provision New Staff Account</h3>
            <form onSubmit={handleSubmit} action="/admin/staff/provision" method="post" style={{ maxWidth: '600px', marginTop: '20px' }}>
                <input type="hidden" name={_csrf?.parameterName} value={_csrf?.token} />
        
                <label style={{ fontWeight: '600', fontSize: '13px', color: '#4a5568' }}>Full Name</label>
                <input onChange={handleInputChange} type="text" name="name" placeholder="Staff Member Name" required />
        
                <label style={{ fontWeight: '600', fontSize: '13px', color: '#4a5568' }}>Corporate Email Address</label>
                <input onChange={handleInputChange} type="email" name="email" placeholder="staff@bank.com" required />
        
                <label style={{ fontWeight: '600', fontSize: '13px', color: '#4a5568' }}>Temporary Password</label>
                <input onChange={handleInputChange} type="password" name="password" placeholder="Min 8 characters with upper, lower, number, special" required />
        
                <label style={{ fontWeight: '600', fontSize: '13px', color: '#4a5568' }}>Assigned Role</label>
                <select onChange={handleInputChange} name="role" required>
                    <option value="ROLE_LOAN_OFFICER">Loan Officer (Origination & Processing)</option>
                    <option value="ROLE_COLLECTIONS_AGENT">Collections Agent (Repayment Management)</option>
                    <option value="ROLE_COLLECTIONS_MANAGER">Collections Manager (Supervision & Repayments)</option>
                    <option value="ROLE_ADMIN">Administrator (Staff Provisioning & Security Auditing)</option>
                </select>
        
                <button type="submit" className="btn" style={{ marginTop: '10px', width: 'auto', padding: '12px 30px' }}>Provision Staff Member</button>
            </form>
        </div>
        </>
    );
};

export default AdminStaffComponent;
