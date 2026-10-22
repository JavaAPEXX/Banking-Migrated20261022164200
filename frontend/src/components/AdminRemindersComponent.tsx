import React, { useState, useEffect } from 'react';

interface AdminRemindersComponentData {
    today?: string;
}

type AdminRemindersComponentProps = {
    data?: Record<string, any>;
    onSubmit?: (formData: Record<string, any>) => void | Promise<void>;
};

export const AdminRemindersComponent: React.FC<AdminRemindersComponentProps> = ({ data = {}, onSubmit }) => {
    const [formData, setFormData] = useState<Record<string, any>>({
        'parameterName': '',
        'customerName': '',
        'customerEmail': '',
        'customerPhone': '',
        'emiAmount': '',
        'sendImmediately': '',
        'dpdDays': '',
    });
    const [backendActionNotice, setBackendActionNotice] = useState("");
    const { _csrf, currentUser, overdueInstallments, sessionScope, today } = data;

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
        
        
        <div className="wide-card" style={{ maxWidth: '1400px', margin: '20px auto', padding: '25px' }}>
        
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #edf2f7', paddingBottom: '15px', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ margin: '0', color: '#1e293b', fontSize: '24px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        🔔 DPD 1–3 Automated Loan Reminder Interactive Demo
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: '6px 0 0 0' }}>
                        Demonstrate automated reminder dispatches, DPD 1–3 email notices, webhook lifecycle, and SMS fallback for overdue borrowers.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                        📅 System Business Date: <strong>{today}</strong>
                    </span>
                    <span style={{ background: '#fef3c7', color: '#92400e', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                        ⏰ Scheduler: <strong>Daily at 9:00 AM (Asia/Kolkata)</strong>
                    </span>
                </div>
            </div>
        
            
            {(param.success == 'loan_created_and_sent') && (<>
                <div className="alert alert-success" style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46', padding: '14px 18px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(16,185,129,0.1)' }}>
                    <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>✉️ Overdue Loan Created & Reminder Email Sent!</div>
                    <div>The delinquent installment was recorded and the DPD reminder email has been dispatched immediately to the recipient's email address. Check your inbox!</div>
                </div>
            </>)}
            {(param.success == 'loan_created') && (<>
                <div className="alert alert-success" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 18px', borderRadius: '8px', marginBottom: '20px' }}>
                    ✅ <strong>Demo Overdue Installment Created!</strong> The customer and delinquent installment are now primed for automated reminder processing.
                </div>
            </>)}
            {(param.success == 'scheduler_executed') && (<>
                <div className="alert alert-success" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 18px', borderRadius: '8px', marginBottom: '20px' }}>
                    ⚡ <strong>Reminder Engine Executed!</strong> Overdue installments have been processed, reminder notices dispatched, and audit logs recorded.
                </div>
            </>)}
            {(param.success != null && param.success.startsWith('webhook_')) && (<>
                <div className="alert alert-info" style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', padding: '12px 18px', borderRadius: '8px', marginBottom: '20px' }}>
                    📡 <strong>Provider Webhook Simulated!</strong> Status transition successfully reconciled in database.
                </div>
            </>)}
        
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '25px', marginBottom: '30px' }}>
        
                
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '22px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ marginTop: '0', color: '#1e293b', fontSize: '17px', fontWeight: '700', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🎯 Step 1: Create or Setup Overdue Borrower
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '18px' }}>
                        Create a loan installment with a due date in the past (1, 2, or 3 days overdue) to trigger the workflow.
                    </p>
        
                    <form onSubmit={handleSubmit} action="/admin/reminders/demo/create-overdue-loan" method="post">
                        <input type="hidden" name={_csrf?.parameterName} value={_csrf?.token} />
        
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Borrower Name</label>
                            <input onChange={handleInputChange} type="text" name="customerName" placeholder="Enter borrower name" required style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }} />
                        </div>
        
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                                Recipient Email (Enter recipient email to receive reminder notice)
                            </label>
                            <input onChange={handleInputChange} type="email" name="customerEmail" placeholder="e.g. customer@example.com" required style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }} />
                        </div>
        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Mobile Number</label>
                                <input onChange={handleInputChange} type="text" name="customerPhone" placeholder="Enter 10-digit mobile" required style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Overdue EMI (&#8377;)</label>
                                <input onChange={handleInputChange} type="number" step="0.01" name="emiAmount" placeholder="e.g. 4500.00" required style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }} />
                            </div>
                        </div>
        
                        <div style={{ marginBottom: '18px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Delinquency Window (Days Past Due)</label>
                            <select onChange={handleInputChange} name="dpdDays" style={{ width: '100%', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', background: '#ffffff' }}>
                                <option value="1">DPD 1: 1 Day Overdue (Friendly Notice | &#8377;0 Penalty)</option>
                                <option value="2">DPD 2: 2 Days Overdue (Second Notice | &#8377;150 Penalty)</option>
                                <option value="3">DPD 3: 3 Days Overdue (Final Notice Before IVR | &#8377;300 Penalty)</option>
                            </select>
                        </div>
        
                        <div style={{ marginBottom: '18px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '10px 14px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: '#1e40af', cursor: 'pointer', margin: '0' }}>
                                <input onChange={handleInputChange} type="checkbox" name="sendImmediately" value="true" checked="checked" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                                ⚡ Send Reminder Email Immediately (Demo Mode)
                            </label>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', marginLeft: '24px' }}>
                                Sends the DPD notice to the recipient's inbox immediately upon submitting.
                            </div>
                        </div>
        
                        <button type="submit" className="btn btn-primary" style={{ background: '#2563eb', color: '#ffffff', fontWeight: '700', border: 'none', borderRadius: '6px', padding: '11px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
                            🚀 Create Overdue Loan & Send Email Now
                        </button>
                    </form>
                </div>
        
                
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '22px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ marginTop: '0', color: '#1e293b', fontSize: '17px', fontWeight: '700', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            ⚡ Step 2: Trigger Reminder Workflow
                        </h3>
                        <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.6' }}>
                            The DPD engine identifies unpaid installments where <code>dueDate</code> is 1, 2, or 3 calendar days ago.
                            It computes accurate penalties, enforces database unique claims to prevent duplicates, and dispatches the customized notice.
                        </p>
        
                        <div style={{ background: '#f8fafc', borderLeft: '4px solid #2563eb', padding: '12px 16px', margin: '15px 0', fontSize: '13px', color: '#334155' }}>
                            <div style={{ fontWeight: '700', marginBottom: '4px' }}>📋 Automated Process Flow:</div>
                            1. Re-verifies payment status (skips paid loans)<br />
                            2. Checks channel eligibility (Email or SMS)<br />
                            3. Acquires atomic DB claim (no duplicates)<br />
                            4. Dispatches outside DB transaction with retries<br />
                            5. Records audit log with provider message ID
                        </div>
                    </div>
        
                    <form onSubmit={handleSubmit} action="/admin/reminders/demo/trigger-now" method="post" style={{ marginTop: '15px' }}>
                        <input type="hidden" name={_csrf?.parameterName} value={_csrf?.token} />
                        <button type="submit" className="btn" style={{ background: '#059669', color: '#ffffff', fontSize: '15px', fontWeight: '700', border: 'none', borderRadius: '6px', padding: '12px', cursor: 'pointer' }}>
                            ⚡ Trigger DPD 1–3 Reminder Engine Now
                        </button>
                    </form>
                </div>
            </div>
        
            
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', marginBottom: '30px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '15px' }}>
                    <h3 style={{ margin: '0', fontSize: '17px', fontWeight: '700', color: '#1e293b' }}>
                        📋 Delinquent Installments Eligible for Reminders Today
                    </h3>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                        Found: <strong>{overdueInstallments != null ? overdueInstallments?.size?.() : 0}</strong> records
                    </span>
                </div>
        
                {
                    (!overdueInstallments) ? (<>
                        <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', fontSize: '14px', background: '#f8fafc', borderRadius: '6px' }}>
                            ℹ️ No overdue installments found for today?.Use the form above to create a demo delinquent loan!
                        </div>
                    </>) :
                    (<>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                <thead>
                                    <tr style={{ background: '#f1f5f9', textAlign: 'left', color: '#475569' }}>
                                        <th style={{ padding: '10px 14px' }}>Customer Name</th>
                                        <th style={{ padding: '10px 14px' }}>Recipient Email</th>
                                        <th style={{ padding: '10px 14px' }}>Loan Account</th>
                                        <th style={{ padding: '10px 14px' }}>Due Date</th>
                                        <th style={{ padding: '10px 14px' }}>Overdue Amount</th>
                                        <th style={{ padding: '10px 14px' }}>DPD Calculation</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {overdueInstallments && overdueInstallments?.map((inst: any, index: number) => (<>
                                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '12px 14px', fontWeight: '600' }}>{inst.loan.user.name}</td>
                                            <td style={{ padding: '12px 14px', fontFamily: 'monospace' }}>{inst.loan.user.email}</td>
                                            <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: '700' }}>{inst.loan.accountNumber}</td>
                                            <td style={{ padding: '12px 14px' }}>{inst.dueDate}</td>
                                            <td style={{ padding: '12px 14px', fontWeight: '700', color: '#b91c1c' }}>
                                                &#8377; {inst.emiAmount - inst.paidAmount}
                                            </td>
                                            <td style={{ padding: '12px 14px' }}>
                                                {
                                                    (today?.toEpochDay?.() - inst.dueDate.toEpochDay() == 1) ? (<>
                                                        <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>DPD 1 (Friendly)</span>
                                                    </>) :
                                                    (today?.toEpochDay?.() - inst.dueDate.toEpochDay() == 2) ? (<>
                                                        <span style={{ background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>DPD 2 (Notice)</span>
                                                    </>) :
                                                    (today?.toEpochDay?.() - inst.dueDate.toEpochDay() == 3) ? (<>
                                                        <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>DPD 3 (Final Notice)</span>
                                                    </>) :
                                                    (<>
                                                        <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '10px', fontSize: '11px' }}>
                                                            {today?.toEpochDay?.() - inst.dueDate.toEpochDay()} Days
                                                        </span>
                                                    </>)
                                                }
                                            </td>
                                        </tr>
                                    </>))}
                                </tbody>
                            </table>
                        </div>
                    </>)
                }
            </div>
        
        </div>
        </>
    );
};

export default AdminRemindersComponent;
