import React, { useState, useEffect } from 'react';

interface LoanSearchComponentData {
    officerBranch?: string;
    errorMessage?: number;
    infoMessage?: number;
    query?: string;
    searchType?: string;
    size?: number;
}

type LoanSearchComponentProps = {
    data?: Record<string, any>;
    onSubmit?: (formData: Record<string, any>) => void | Promise<void>;
};

export const LoanSearchComponent: React.FC<LoanSearchComponentProps> = ({ data = {}, onSubmit }) => {
    const [formData, setFormData] = useState<Record<string, any>>({
        'parameterName': '',
        'query': '',
        'searchType': '',
    });
    const [backendActionNotice, setBackendActionNotice] = useState("");
    const { _csrf, border, currentUser, errorMessage, infoMessage, officerBranch, query, results, searchType, sessionScope, size } = data;

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
            function updateSearchPlaceholder() {
                    const type = document.getElementById("searchTypeSelect") /* TODO: useRef */.value;
                    const input = document.getElementById("queryInput") /* TODO: useRef */;
                    const hint = document.getElementById("queryFormatHint") /* TODO: useRef */;
            
                    if (type === 'ACCOUNT_NUMBER') {
                        input.placeholder = "Enter 12-character Account Number (e.g. LN0000000004)";
                        input.maxLength = 12;
                        hint.innerHTML = "💡 Exact Loan Account Number format: 2 uppercase letters followed by 10 digits (e.g., <strong>LN0000000004</strong>).";
                    } else if (type === 'CUSTOMER_ID') {
                        input.placeholder = "Enter Customer ID (e.g. CUST000001 or 1)";
                        input.maxLength = 25;
                        hint.innerHTML = "💡 Secondary search: Exact Customer ID match within your authorized branch.";
                    } else if (type === 'PHONE') {
                        input.placeholder = "Enter 10-digit mobile number (e.g. 9876543210)";
                        input.maxLength = 15;
                        hint.innerHTML = "💡 Secondary search: Registered phone number matching authorized customer accounts.";
                    } else if (type === 'NAME') {
                        input.placeholder = "Enter customer name (e.g. John Doe)";
                        input.maxLength = 50;
                        hint.innerHTML = "💡 Secondary search: Case-insensitive customer name match within your branch.";
                    }
                }
            
                // Set initial placeholder on page load
                document.addEventListener('DOMContentLoaded', updateSearchPlaceholder);
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                    <h2 style={{ margin: '0', color: '#2c3e50' }}>🔍 Loan Account & Customer Search</h2>
                    <p style={{ color: '#718096', fontSize: '14px', margin: '4px 0 0 0' }}>
                        Authorized Bank Staff Portal — Search customer loan accounts and KYC profiles.
                    </p>
                </div>
                <div>
                    <span style={{ background: '#edf2f7', color: '#2d3748', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', border: '1px solid #cbd5e0' }}>
                        🏢 Authorized Branch: <strong>{officerBranch}</strong>
                    </span>
                </div>
            </div>
        
            
            {(!!(errorMessage)) && (<>
                <div className="alert alert-error" id="searchErrorMessage">
                    <strong>⚠️ Notice:</strong> {errorMessage}
                </div>
            </>)}
        
            {(!!(infoMessage)) && (<>
                <div className="alert alert-info">
                    ℹ️ {infoMessage}
                </div>
            </>)}
        
            
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', marginBottom: '25px' }}>
                <form onSubmit={handleSubmit} action="/loan-search" method="get" id="searchForm">
                    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 140px', gap: '15px', alignItems: 'end' }}>
                        <div>
                            <label style={{ fontWeight: '600', fontSize: '13px', color: '#4a5568' }}>Search By Category</label>
                            <select onChange={handleInputChange} name="searchType" id="searchTypeSelect" onchange="updateSearchPlaceholder()" style={{ marginTop: '6px', marginBottom: '0' }}>
                                <option value="ACCOUNT_NUMBER" selected={searchType == 'ACCOUNT_NUMBER'}>Loan Account No</option>
                                <option value="CUSTOMER_ID" selected={searchType == 'CUSTOMER_ID'}>Customer ID</option>
                                <option value="PHONE" selected={searchType == 'PHONE'}>Registered Mobile</option>
                                <option value="NAME" selected={searchType == 'NAME'}>Customer Name</option>
                            </select>
                        </div>
        
                        <div>
                            <label style={{ fontWeight: '600', fontSize: '13px', color: '#4a5568' }} id="queryInputLabel">Search Query</label>
                            <input onChange={handleInputChange} type="text" name="query" id="queryInput" value={query} placeholder="Enter 12-character Account Number (e.g. LN0000000004)" required maxlength="50" style={{ marginTop: '6px', marginBottom: '0' }} />
                        </div>
        
                        <div>
                            <button type="submit" className="btn" style={{ height: '44px', marginBottom: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <span>🔎 Search</span>
                            </button>
                        </div>
                    </div>
        
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#718096' }} id="queryFormatHint">
                        💡 Exact Loan Account Number format: 2 uppercase letters followed by 10 digits (e.g., <strong>LN0000000004</strong>).
                    </div>
                </form>
            </div>
        
            
            {(hasSearched) && (<>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ margin: '0', color: '#2d3748' }}>
                        Search Results 
                        {(results != null && results?.totalElements > 0) && (<>
                            <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#718096' }}>
                                (Found {results?.totalElements} matching record{results?.totalElements > 1 ? 's' : ''})
                            </span>
                        </>)}
                    </h3>
                </div>
        
                {
                    (results != null && results?.totalElements > 0) ? (<>
                        <table>
                            <thead>
                                <tr>
                                    <th>Account No</th>
                                    <th>Customer ID</th>
                                    <th>Customer Name</th>
                                    <th>Mobile</th>
                                    <th>Branch</th>
                                    <th>Sanctioned</th>
                                    <th>Outstanding</th>
                                    <th>Repayment</th>
                                    <th>DPD</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results?.content && results?.content.map((row: any, index: number) => (<>
                                    <tr>
                                        <td>
                                            <strong style={{ color: '#2b6cb0', fontFamily: 'monospace', fontSize: '14px' }}>
                                                {row.accountNumber}
                                            </strong>
                                        </td>
                                        <td>
                                            <span style={{ fontFamily: 'monospace', color: '#4a5568' }}>
                                                {row.customerId}
                                            </span>
                                        </td>
                                        <td><strong>{row.customerName}</strong></td>
                                        <td>{row.maskedPhone}</td>
                                        <td>
                                            <span style={{ background: '#edf2f7', color: '#4a5568', padding: '3px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
                                                {row.branch}
                                            </span>
                                        </td>
                                        <td>₹{row.amount}</td>
                                        <td><strong style="color:{row.remaining > 0 ? '#c53030' : '#276749'};">₹{row.remaining}</strong></td>
                                        <td>
                                            {
                                                (row.repaymentStatus == 'OVERDUE') ? (<>
                                                    <span style={{ color: '#9b2c2c', background: '#fed7d7', padding: '3px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '700' }}>
                                                        ⚠️ OVERDUE
                                                        {(row.overdueAmount > 0) && (<>
                                                            (₹{row.overdueAmount})
                                                        </>)}
                                                    </span>
                                                </>) :
                                                (row.repaymentStatus == 'CURRENT') ? (<>
                                                    <span style={{ color: '#22543d', background: '#c6f6d5', padding: '3px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '600' }}>CURRENT</span>
                                                </>) :
                                                (row.repaymentStatus == 'CLOSED') ? (<>
                                                    <span style={{ color: '#4a5568', background: '#e2e8f0', padding: '3px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '600' }}>CLOSED</span>
                                                </>) :
                                                (<>
                                                    <span style={{ color: '#744210', background: '#feebc8', padding: '3px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '600' }}>{row.repaymentStatus}</span>
                                                </>)
                                            }
                                        </td>
                                        <td>
                                            {
                                                (row.dpd > 0) ? (<>
                                                    <span style={{ color: '#742a2a', background: '#fed7d7', padding: '3px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '700' }}>
                                                        {row.dpd} DPD
                                                    </span>
                                                </>) :
                                                (row.status == 'CLOSED') ? (<>
                                                    <span style={{ color: '#a0aec0', fontSize: '12px' }}>-</span>
                                                </>) :
                                                (<>
                                                    <span style={{ color: '#22543d', background: '#c6f6d5', padding: '3px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '600' }}>0 DPD</span>
                                                </>)
                                            }
                                        </td>
                                        <td>
                                            {
                                                (row.status == 'ACTIVE') ? (<>
                                                    <span style={{ color: '#276749', background: '#c6f6d5', padding: '3px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '600' }}>ACTIVE</span>
                                                </>) :
                                                (row.status == 'CLOSED') ? (<>
                                                    <span style={{ color: '#4a5568', background: '#e2e8f0', padding: '3px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '600' }}>CLOSED</span>
                                                </>) :
                                                (<>
                                                    <span style={{ color: '#b7791f', background: '#feebc8', padding: '3px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '600' }}>{row.status}</span>
                                                </>)
                                            }
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <a href="/loan-details?loanId={row.loanId}" className="btn" style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center', padding: '6px 14px', fontSize: '12px', width: 'auto', background: '#24446B', color: '#ffffff', fontWeight: '600', borderRadius: '4px' }}>
                                                Profile
                                            </a>
                                        </td>
                                    </tr>
                                </>))}
                            </tbody>
                        </table>
        
                        
                        {(results?.totalPages > 1) && (<>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #edf2f7' }}>
                                <div style={{ fontSize: '13px', color: '#718096' }}>
                                    Page <strong>{results?.number + 1}</strong> of <strong>{results?.totalPages}</strong>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {(results?.hasPrevious?.()) && (<>
                                        <a href="/loan-search?searchType={searchType}&query={query}&page={results?.number - 1}&size={size}" className="btn btn-secondary" style={{ padding: '6px 14px', width: 'auto', fontSize: '13px', textDecoration: 'none' }}>
                                            &laquo; Previous
                                        </a>
                                    </>)}
                                    {(results?.hasNext?.()) && (<>
                                        <a href="/loan-search?searchType={searchType}&query={query}&page={results?.number + 1}&size={size}" className="btn btn-secondary" style={{ padding: '6px 14px', width: 'auto', fontSize: '13px', textDecoration: 'none' }}>
                                            Next &raquo;
                                        </a>
                                    </>)}
                                </div>
                            </div>
                        </>)}
                    </>) :
                    (<>
                        <div style={{ background: '#fffaf0', border: '1px solid #feebc8', padding: '25px', borderRadius: '8px', textAlign: 'center', color: '#744210', marginTop: '10px' }}>
                            <p style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 6px 0' }}>No Loan Account Records Match Your Criteria</p>
                            <p style={{ fontSize: '13px', color: '#975a16', margin: '0' }}>
                                Please verify the input and ensure the account belongs to your authorized branch.
                            </p>
                        </div>
                    </>)
                }
            </>)}
        </div>
        </>
    );
};

export default LoanSearchComponent;
