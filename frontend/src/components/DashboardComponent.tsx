import React, { useState, useEffect } from 'react';

interface DashboardComponentData {
    officerBranch?: string;
    activeLoansCount?: number;
    pendingLoansCount?: number;
    totalPrincipal?: number;
    totalRemaining?: number;
    overdueLoansCount?: number;
    totalOverdueAmount?: number;
    totalLoansCount?: number;
    parRate?: string;
    dpdCurrentCount?: number;
    dpdCurrentAmount?: number;
    dpdSma0Count?: number;
    dpdSma0Amount?: number;
    dpdSma1Count?: number;
    dpdSma1Amount?: number;
    dpdSma2Count?: number;
    dpdSma2Amount?: number;
    dpdNpaCount?: number;
    dpdNpaAmount?: number;
}

type DashboardComponentProps = {
    data?: Record<string, any>;
    onSubmit?: (formData: Record<string, any>) => void | Promise<void>;
};

export const DashboardComponent: React.FC<DashboardComponentProps> = ({ data = {}, onSubmit }) => {
    const [formData, setFormData] = useState<Record<string, any>>({
        'parameterName': '',
        'loanId': '',
        'amount': '',
        'transactionReference': '',
        'reason': '',
        'paymentMode': '',
    });
    const [backendActionNotice, setBackendActionNotice] = useState("");
    const { _csrf, activeLoanCount, activeLoansCount, currentUser, delinquentLoans, dpdCurrentAmount, dpdCurrentCount, dpdNpaAmount, dpdNpaCount, dpdSma0Amount, dpdSma0Count, dpdSma1Amount, dpdSma1Count, dpdSma2Amount, dpdSma2Count, loans, officerBranch, outstandingBalance, overdueLoansCount, parRate, pendingLoanCount, pendingLoans, pendingLoansCount, recentActivities, recentCollections, sessionScope, totalLoanCount, totalLoansCount, totalOverdueAmount, totalPrincipal, totalRemaining } = data;

    const userObj = (data?.userObj || data?.sessionScope?.user || data?.currentUser || data?.user || null);
    const staffUser = (data?.staffUser || data?.sessionScope?.user || data?.currentUser || data?.user || null);
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
            function openRejectModal(loanId, accountNumber, borrowerName) {
                            document.getElementById("rejectModalLoanId") /* TODO: useRef */.value = loanId;
                            document.getElementById("rejectModalAccount") /* TODO: useRef */.innerText = accountNumber;
                            document.getElementById("rejectModalBorrower") /* TODO: useRef */.innerText = borrowerName;
                            document.getElementById("rejectModal") /* TODO: useRef */.style.display = 'flex';
                        }
            
                        function closeRejectModal() {
                            document.getElementById("rejectModal") /* TODO: useRef */.style.display = 'none';
                        }
            
                        function openCollectionModal(loanId, accountNumber, borrowerName, remaining, suggestedAmount) {
                            document.getElementById("collectModalLoanId") /* TODO: useRef */.value = loanId;
                            document.getElementById("collectModalAccount") /* TODO: useRef */.innerText = accountNumber;
                            document.getElementById("collectModalBorrower") /* TODO: useRef */.innerText = borrowerName;
                            document.getElementById("collectModalBalance") /* TODO: useRef */.innerText = '₹' + Number(remaining).toLocaleString('en-IN', {minimumFractionDigits: 2});
                            document.getElementById("collectModalOverdue") /* TODO: useRef */.innerText = '₹' + Number(suggestedAmount).toLocaleString('en-IN', {minimumFractionDigits: 2});
                            document.getElementById("collectModalAmount") /* TODO: useRef */.value = suggestedAmount > 0 ? suggestedAmount : remaining;
                            document.getElementById("collectModalAmount") /* TODO: useRef */.max = remaining;
                            document.getElementById("collectModalRef") /* TODO: useRef */.value = 'COL' + Date.now();
                            document.getElementById("collectionModal") /* TODO: useRef */.style.display = 'flex';
                        }
            
                        function closeCollectionModal() {
                            document.getElementById("collectionModal") /* TODO: useRef */.style.display = 'none';
                        }
            
                        // Close modals on clicking backdrop
                        window.addEventListener('click', function(event) {
                            const rejectModal = document.getElementById("rejectModal") /* TODO: useRef */;
                            const collectModal = document.getElementById("collectionModal") /* TODO: useRef */;
                            if (event.target === rejectModal) {
                                closeRejectModal();
                            }
                            if (event.target === collectModal) {
                                closeCollectionModal();
                            }
                        });
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
        
        
        <div style={{ padding: '10px 20px 40px 20px' }}>
        
        {
            
            (isStaff) ? (<>
                <div className="staff-dashboard">
        
                    
                    {(param.approved == 'true') && (<>
                        <div className="alert alert-success" style={{ marginBottom: '20px' }}>
                            ✅ <strong>Application Approved:</strong> Loan application has been successfully sanctioned and activated. Amortization schedule has been generated.
                        </div>
                    </>)}
                    {(param.rejected == 'true') && (<>
                        <div className="alert alert-info" style={{ marginBottom: '20px' }}>
                            ℹ️ <strong>Application Rejected:</strong> Loan application status updated to REJECTED.
                        </div>
                    </>)}
                    {(param.collectionRecorded == 'true') && (<>
                        <div className="alert alert-success" style={{ marginBottom: '20px' }}>
                            ✅ <strong>Collection Recorded:</strong> Payment receipt generated, borrower balance updated, and installment schedule synchronized.
                        </div>
                    </>)}
        
                    
                    <div className="staff-banner">
                        <div>
                            <h1 className="staff-banner-title">
                                {
                                    (staffUser?.role == 'ROLE_LOAN_OFFICER') ? (<>🏛️ Loan Officer Operations Hub</>) :
                                    (staffUser?.role == 'ROLE_COLLECTIONS_AGENT') ? (<>💳 Collections Agent Operations Hub</>) :
                                    (staffUser?.role == 'ROLE_COLLECTIONS_MANAGER') ? (<>📊 Collections Management & Risk Portfolio</>) :
                                    (<>🛡️ Central Staff Administration Portal</>)
                                }
                            </h1>
                            <div className="staff-banner-sub">
                                <span>Staff Member: <strong>{staffUser?.name}</strong></span>
                                <span className="role-pill">{staffUser?.role}</span>
                                {(!!(officerBranch)) && (<>
                                    <span style={{ background: '#EDF2F7', color: '#2D3748', padding: '3px 10px', borderRadius: '12px', fontWeight: '600', fontSize: '12px' }}>
                                        🏢 Branch: <strong>{officerBranch}</strong>
                                    </span>
                                </>)}
                            </div>
                        </div>
        
                        
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <a href="/loan-search" className="btn btn-secondary" style={{ width: 'auto', padding: '10px 18px', fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <span>🔍 Loan & Customer Search</span>
                            </a>
                        </div>
                    </div>
        
                    
                    {
        
                        
                        (staffUser?.role == 'ROLE_LOAN_OFFICER') ? (<>
                            <div className="metrics-grid">
                                <div className="metric-card">
                                    <div className="metric-label">
                                        <span>Active Loans</span>
                                        <span style={{ color: '#059669' }}>📈</span>
                                    </div>
                                    <div className="metric-value">{activeLoansCount}</div>
                                    <div className="metric-hint">Currently servicing in branch</div>
                                </div>
        
                                <div className="metric-card" style={{ borderTop: '3px solid #ED7D16' }}>
                                    <div className="metric-label">
                                        <span>Pending Applications</span>
                                        <span style={{ color: '#ED7D16' }}>📝</span>
                                    </div>
                                    <div className="metric-value" style={{ color: '#ED7D16' }}>{pendingLoansCount}</div>
                                    <div className="metric-hint">Require officer review & approval</div>
                                </div>
        
                                <div className="metric-card">
                                    <div className="metric-label">
                                        <span>Disbursed Volume</span>
                                        <span style={{ color: '#24446B' }}>🏛️</span>
                                    </div>
                                    <div className="metric-value">₹{totalPrincipal}</div>
                                    <div className="metric-hint">Cumulative sanctioned principal</div>
                                </div>
        
                                <div className="metric-card">
                                    <div className="metric-label">
                                        <span>Branch Outstanding</span>
                                        <span style={{ color: '#DC2626' }}>💼</span>
                                    </div>
                                    <div className="metric-value" style={{ color: '#DC2626' }}>₹{totalRemaining}</div>
                                    <div className="metric-hint">Total principal receivable</div>
                                </div>
                            </div>
                        </>) :
        
                        
                        (staffUser?.role == 'ROLE_COLLECTIONS_AGENT') ? (<>
                            <div className="metrics-grid">
                                <div className="metric-card" style={{ borderTop: '3px solid #DC2626' }}>
                                    <div className="metric-label">
                                        <span>Overdue Accounts</span>
                                        <span style={{ color: '#DC2626' }}>⚠️</span>
                                    </div>
                                    <div className="metric-value" style={{ color: '#DC2626' }}>{overdueLoansCount}</div>
                                    <div className="metric-hint">Accounts requiring collection action</div>
                                </div>
        
                                <div className="metric-card" style={{ borderTop: '3px solid #B91C1C' }}>
                                    <div className="metric-label">
                                        <span>Delinquent Amount</span>
                                        <span style={{ color: '#B91C1C' }}>💸</span>
                                    </div>
                                    <div className="metric-value" style={{ color: '#B91C1C' }}>₹{totalOverdueAmount}</div>
                                    <div className="metric-hint">Total overdue EMI balance</div>
                                </div>
        
                                <div className="metric-card">
                                    <div className="metric-label">
                                        <span>Critical DPD (&gt;30 Days)</span>
                                        <span style={{ color: '#F59E0B' }}>🚨</span>
                                    </div>
                                    <div className="metric-value">{dpdSma1Count + dpdSma2Count + dpdNpaCount}</div>
                                    <div className="metric-hint">Accounts at risk of NPA</div>
                                </div>
        
                                <div className="metric-card">
                                    <div className="metric-label">
                                        <span>Total Branch Accounts</span>
                                        <span style={{ color: '#24446B' }}>🏢</span>
                                    </div>
                                    <div className="metric-value">{totalLoansCount}</div>
                                    <div className="metric-hint">Assigned branch portfolio</div>
                                </div>
                            </div>
                        </>) :
        
                        
                        (staffUser?.role == 'ROLE_COLLECTIONS_MANAGER') ? (<>
                            <div className="metrics-grid">
                                <div className="metric-card" style={{ borderTop: '3px solid #DC2626' }}>
                                    <div className="metric-label">
                                        <span>Portfolio At Risk (PAR)</span>
                                        <span style={{ color: '#DC2626' }}>📊</span>
                                    </div>
                                    <div className="metric-value" style={{ color: '#DC2626' }}>{parRate}%</div>
                                    <div className="metric-hint">Overdue vs Total Outstanding</div>
                                </div>
        
                                <div className="metric-card">
                                    <div className="metric-label">
                                        <span>Total Delinquent Amount</span>
                                        <span style={{ color: '#B91C1C' }}>💸</span>
                                    </div>
                                    <div className="metric-value" style={{ color: '#B91C1C' }}>₹{totalOverdueAmount}</div>
                                    <div className="metric-hint">{overdueLoansCount} delinquent borrower accounts</div>
                                </div>
        
                                <div className="metric-card">
                                    <div className="metric-label">
                                        <span>Total Active Portfolio</span>
                                        <span style={{ color: '#059669' }}>💼</span>
                                    </div>
                                    <div className="metric-value">₹{totalRemaining}</div>
                                    <div className="metric-hint">{activeLoansCount} servicing loans</div>
                                </div>
        
                                <div className="metric-card">
                                    <div className="metric-label">
                                        <span>Total Accounts</span>
                                        <span style={{ color: '#24446B' }}>🏛️</span>
                                    </div>
                                    <div className="metric-value">{totalLoansCount}</div>
                                    <div className="metric-hint">Total branch accounts monitored</div>
                                </div>
                            </div>
        
                            
                            <div className="dpd-grid">
                                <div className="dpd-card current">
                                    <div className="dpd-title">Standard (0 DPD)</div>
                                    <div className="dpd-count">{dpdCurrentCount}</div>
                                    <div className="dpd-amt">₹{dpdCurrentAmount}</div>
                                </div>
                                <div className="dpd-card sma0">
                                    <div className="dpd-title">SMA-0 (1-30 DPD)</div>
                                    <div className="dpd-count">{dpdSma0Count}</div>
                                    <div className="dpd-amt">₹{dpdSma0Amount}</div>
                                </div>
                                <div className="dpd-card sma1">
                                    <div className="dpd-title">SMA-1 (31-60 DPD)</div>
                                    <div className="dpd-count">{dpdSma1Count}</div>
                                    <div className="dpd-amt">₹{dpdSma1Amount}</div>
                                </div>
                                <div className="dpd-card sma2">
                                    <div className="dpd-title">SMA-2 (61-90 DPD)</div>
                                    <div className="dpd-count">{dpdSma2Count}</div>
                                    <div className="dpd-amt">₹{dpdSma2Amount}</div>
                                </div>
                                <div className="dpd-card npa">
                                    <div className="dpd-title" style={{ color: '#991B1B' }}>NPA (90+ DPD)</div>
                                    <div className="dpd-count" style={{ color: '#991B1B' }}>{dpdNpaCount}</div>
                                    <div className="dpd-amt" style={{ color: '#991B1B' }}>₹{dpdNpaAmount}</div>
                                </div>
                            </div>
                        </>) :
        
                        
                        (<>
                            <div className="metrics-grid">
                                <div className="metric-card">
                                    <div className="metric-label">
                                        <span>Total Loans</span>
                                        <span style={{ color: '#24446B' }}>🏛️</span>
                                    </div>
                                    <div className="metric-value">{totalLoansCount}</div>
                                    <div className="metric-hint">Across authorized branches</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-label">
                                        <span>Active Borrowers</span>
                                        <span style={{ color: '#059669' }}>👥</span>
                                    </div>
                                    <div className="metric-value">{activeLoansCount}</div>
                                    <div className="metric-hint">Servicing loans</div>
                                </div>
                                <div className="metric-card" style={{ borderTop: '3px solid #ED7D16' }}>
                                    <div className="metric-label">
                                        <span>Pending Applications</span>
                                        <span style={{ color: '#ED7D16' }}>📝</span>
                                    </div>
                                    <div className="metric-value" style={{ color: '#ED7D16' }}>{pendingLoansCount}</div>
                                    <div className="metric-hint">Awaiting officer sanction</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-label">
                                        <span>Total Outstanding</span>
                                        <span style={{ color: '#DC2626' }}>💼</span>
                                    </div>
                                    <div className="metric-value" style={{ color: '#DC2626' }}>₹{totalRemaining}</div>
                                    <div className="metric-hint">Total portfolio receivable</div>
                                </div>
                            </div>
                        </>)
        
                    }
        
                    
        
                    
                    {(staffUser?.role == 'ROLE_LOAN_OFFICER' || staffUser?.role == 'ROLE_ADMIN') && (<>
                        <div className="staff-panel">
                            <div className="staff-panel-header">
                                <h2 className="staff-panel-title">
                                    <span>📝 Pending Loan Applications for Review</span>
                                    <span className="status-badge status-pending">{pendingLoansCount} Pending</span>
                                </h2>
                            </div>
        
                            <div className="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Application / Account</th>
                                            <th>Borrower Name</th>
                                            <th>Customer ID</th>
                                            <th>Sanction Amount</th>
                                            <th>Interest & Tenure</th>
                                            <th>Est. Monthly EMI</th>
                                            <th>Branch</th>
                                            <th>Status</th>
                                            <th style={{ textAlign: 'center' }}>Decision Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingLoans && pendingLoans?.map((pl: any, index: number) => (<>
                                            <tr>
                                                <td>
                                                    <strong style={{ color: '#2B6CB0', fontFamily: 'monospace', fontSize: '14px' }}>
                                                        {pl.accountNumber}
                                                    </strong>
                                                </td>
                                                <td><strong>{pl.user.name}</strong></td>
                                                <td><span style={{ fontFamily: 'monospace', color: '#475569' }}>{pl.customerId}</span></td>
                                                <td><strong>₹{pl.amount}</strong></td>
                                                <td>{pl.interest}% &bull; {pl.months} mos</td>
                                                <td style={{ color: '#2B6CB0', fontWeight: '600' }}>₹{pl.emi}</td>
                                                <td>
                                                    <span style={{ background: '#EDF2F7', color: '#475569', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '600' }}>
                                                        {pl.branch}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="status-badge status-pending">{pl.status}</span>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <div className="action-btn-group">
                                                        
                                                        <a href="/loan-details?loanId={pl.loanId}" className="btn-profile" title="Open 360° Comprehensive Profile">
                                                            Profile
                                                        </a>
        
                                                        
                                                        <form onSubmit={handleSubmit} action="/staff/loans/approve" method="post" style={{ display: 'inline', margin: '0' }}>
                                                            <input type="hidden" name={_csrf?.parameterName} value={_csrf?.token} />
                                                            <input type="hidden" name="loanId" value={pl.loanId} />
                                                            <button type="submit" className="btn-approve" onclick="return confirm('Approve and sanction loan account {pl.accountNumber}?')">
                                                                Approve
                                                            </button>
                                                        </form>
        
                                                        
                                                        <button type="button" className="btn-reject" onclick="openRejectModal('{pl.loanId}', '{pl.accountNumber}', '{pl.user.name}')">
                                                            Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </>))}
                                        {(!pendingLoans) && (<>
                                            <tr>
                                                <td colspan="9" style={{ textAlign: 'center', padding: '35px 20px', color: '#64748B' }}>
                                                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                                                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#1E293B' }}>No Pending Loan Applications</div>
                                                    <div style={{ fontSize: '13px', color: '#94A3B8' }}>All applications submitted to your authorized branch have been reviewed.</div>
                                                </td>
                                            </tr>
                                        </>)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>)}
        
                    
                    {(staffUser?.role == 'ROLE_COLLECTIONS_AGENT' || staffUser?.role == 'ROLE_COLLECTIONS_MANAGER' || staffUser?.role == 'ROLE_ADMIN') && (<>
                        <div className="staff-panel">
                            <div className="staff-panel-header">
                                <h2 className="staff-panel-title">
                                    <span>⚠️ Delinquent & Overdue Loan Accounts</span>
                                    <span className="status-badge status-overdue">{overdueLoansCount} Overdue</span>
                                </h2>
                            </div>
        
                            <div className="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Account No</th>
                                            <th>Borrower Name</th>
                                            <th>Mobile (Masked)</th>
                                            <th>Principal Sanctioned</th>
                                            <th>Outstanding Balance</th>
                                            <th>Overdue Amount</th>
                                            <th>DPD Bucket</th>
                                            <th>Branch</th>
                                            <th style={{ textAlign: 'center' }}>Collection Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {delinquentLoans && delinquentLoans?.map((dl: any, index: number) => (<>
                                            <tr>
                                                <td>
                                                    <strong style={{ color: '#2B6CB0', fontFamily: 'monospace', fontSize: '14px' }}>
                                                        {dl.accountNumber}
                                                    </strong>
                                                </td>
                                                <td><strong>{dl.user.name}</strong></td>
                                                <td>{dl.maskedPhone}</td>
                                                <td>₹{dl.amount}</td>
                                                <td>
                                                    <strong style={{ color: '#DC2626' }}>₹{dl.remaining}</strong>
                                                </td>
                                                <td>
                                                    <strong style={{ color: '#991B1B', background: '#FEE2E2', padding: '3px 8px', borderRadius: '6px' }}>
                                                        ₹{dl.overdueAmount > 0 ? dl.overdueAmount : dl.emi}
                                                    </strong>
                                                </td>
                                                <td>
                                                    {
                                                        (dl.dpd > 90) ? (<>
                                                            <span className="dpd-pill dpd-pill-high">{dl.dpd} DPD (NPA)</span>
                                                        </>) :
                                                        (dl.dpd > 30) ? (<>
                                                            <span className="dpd-pill dpd-pill-high">{dl.dpd} DPD</span>
                                                        </>) :
                                                        (dl.dpd > 0) ? (<>
                                                            <span className="dpd-pill dpd-pill-low">{dl.dpd} DPD</span>
                                                        </>) :
                                                        (<>
                                                            <span className="dpd-pill dpd-pill-zero">Current</span>
                                                        </>)
                                                    }
                                                </td>
                                                <td>
                                                    <span style={{ background: '#EDF2F7', color: '#475569', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '600' }}>
                                                        {dl.branch}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <div className="action-btn-group">
                                                        
                                                        <a href="/loan-details?loanId={dl.loanId}" className="btn-profile" title="Open 360° Comprehensive Profile">
                                                            Profile
                                                        </a>
        
                                                        
                                                        <button type="button" className="btn-collect" onclick="openCollectionModal('{dl.loanId}', '{dl.accountNumber}', '{dl.user.name}', '{dl.remaining}', '{dl.overdueAmount > 0 ? dl.overdueAmount : dl.emi}')">
                                                            Record Collection
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </>))}
                                        {(!delinquentLoans) && (<>
                                            <tr>
                                                <td colspan="9" style={{ textAlign: 'center', padding: '35px 20px', color: '#64748B' }}>
                                                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎉</div>
                                                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#1E293B' }}>Zero Delinquency</div>
                                                    <div style={{ fontSize: '13px', color: '#94A3B8' }}>All loan accounts in your authorized branch are currently up-to-date.</div>
                                                </td>
                                            </tr>
                                        </>)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>)}
        
                    
                    {((staffUser?.role == 'ROLE_COLLECTIONS_AGENT' || staffUser?.role == 'ROLE_COLLECTIONS_MANAGER' || staffUser?.role == 'ROLE_ADMIN') && !!(recentCollections)) && (<>
                        <div className="staff-panel">
                            <div className="staff-panel-header">
                                <h2 className="staff-panel-title">
                                    <span>💳 Recent Branch Collections Activity</span>
                                </h2>
                            </div>
        
                            <div className="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Transaction Ref</th>
                                            <th>Loan Account</th>
                                            <th>Payment Mode</th>
                                            <th>Amount Collected</th>
                                            <th>Date & Time</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentCollections && recentCollections?.map((rc: any, index: number) => (<>
                                            <tr>
                                                <td><span style={{ fontFamily: 'monospace', color: '#2B6CB0', fontWeight: '600' }}>{rc.transactionReference}</span></td>
                                                <td>
                                                    {
                                                        (!!(rc.loan)) ? (<>
                                                            <a href="/loan-details?loanId={rc.loan.loanId}" style={{ textDecoration: 'none', fontFamily: 'monospace', fontWeight: '700', color: '#24446B' }}>
                                                                {rc.loan.accountNumber}
                                                            </a>
                                                        </>) :
                                                        (<>
                                                            <span style={{ color: '#94A3B8' }}>-</span>
                                                        </>)
                                                    }
                                                </td>
                                                <td>
                                                    <span style={{ background: '#EDF2F7', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                                                        {rc.paymentMode}
                                                    </span>
                                                </td>
                                                <td><strong style={{ color: '#15803D' }}>₹{rc.amount}</strong></td>
                                                <td>{rc.paymentDate}</td>
                                                <td><span className="status-badge status-active">{rc.status}</span></td>
                                            </tr>
                                        </>))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>)}
        
                    
                    <div className="staff-panel">
                        <div className="staff-panel-header">
                            <h2 className="staff-panel-title">
                                <span>🏛️ Authorized Branch Loan Portfolio</span>
                                <span style={{ fontSize: '13px', fontWeight: 'normal', color: '#64748B' }}>({totalLoansCount} accounts)</span>
                            </h2>
                        </div>
        
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Account No</th>
                                        <th>Borrower Name</th>
                                        <th>Sanctioned (₹)</th>
                                        <th>Interest & Tenure</th>
                                        <th>Monthly EMI</th>
                                        <th>Outstanding Balance</th>
                                        <th>Repayment Status</th>
                                        <th>DPD</th>
                                        <th>Loan Status</th>
                                        <th style={{ textAlign: 'center' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loans && loans?.map((l: any, index: number) => (<>
                                        <tr>
                                            <td>
                                                <strong style={{ color: '#2B6CB0', fontFamily: 'monospace', fontSize: '14px' }}>
                                                    {l.accountNumber}
                                                </strong>
                                            </td>
                                            <td><strong>{l.user.name}</strong></td>
                                            <td>₹{l.amount}</td>
                                            <td>{l.interest}% &bull; {l.months} mos</td>
                                            <td style={{ color: '#2B6CB0', fontWeight: '600' }}>₹{l.emi}</td>
                                            <td>
                                                <strong style="color:{l.remaining > 0 ? '#DC2626' : '#15803D'};">
                                                    ₹{l.remaining}
                                                </strong>
                                            </td>
                                            <td>
                                                {
                                                    (l.repaymentStatus == 'OVERDUE') ? (<>
                                                        <span className="status-badge status-overdue">⚠️ Overdue</span>
                                                    </>) :
                                                    (l.repaymentStatus == 'CURRENT') ? (<>
                                                        <span className="status-badge status-active">Current</span>
                                                    </>) :
                                                    (l.repaymentStatus == 'CLOSED') ? (<>
                                                        <span className="status-badge status-closed">Closed</span>
                                                    </>) :
                                                    (<>
                                                        <span className="status-badge status-pending">{l.repaymentStatus}</span>
                                                    </>)
                                                }
                                            </td>
                                            <td>
                                                {
                                                    (l.dpd > 0) ? (<>
                                                        <span className="dpd-pill dpd-pill-high">{l.dpd} DPD</span>
                                                    </>) :
                                                    (l.status == 'CLOSED') ? (<>
                                                        <span style={{ color: '#94A3B8', fontSize: '12px' }}>-</span>
                                                    </>) :
                                                    (<>
                                                        <span className="dpd-pill dpd-pill-zero">0 DPD</span>
                                                    </>)
                                                }
                                            </td>
                                            <td>
                                                {
                                                    (l.status == 'ACTIVE') ? (<>
                                                        <span className="status-badge status-active">Active</span>
                                                    </>) :
                                                    (l.status == 'CLOSED') ? (<>
                                                        <span className="status-badge status-closed">Closed</span>
                                                    </>) :
                                                    (l.status == 'REJECTED') ? (<>
                                                        <span className="status-badge status-rejected">Rejected</span>
                                                    </>) :
                                                    (<>
                                                        <span className="status-badge status-pending">{l.status}</span>
                                                    </>)
                                                }
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                
                                                <a href="/loan-details?loanId={l.loanId}" className="btn-profile" title="Open 360° Comprehensive Profile">
                                                    Profile
                                                </a>
                                            </td>
                                        </tr>
                                    </>))}
                                    {(!loans) && (<>
                                        <tr>
                                            <td colspan="10" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
                                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📋</div>
                                                <div style={{ fontSize: '15px', fontWeight: '600', color: '#1E293B' }}>No Loan Records Found</div>
                                                <div style={{ fontSize: '13px', color: '#94A3B8' }}>There are currently no loan records assigned to your branch.</div>
                                            </td>
                                        </tr>
                                    </>)}
                                </tbody>
                            </table>
                        </div>
                    </div>
        
                </div>
        
                
                <div id="rejectModal" className="staff-modal-backdrop">
                    <div className="staff-modal-card">
                        <h3 style={{ marginTop: '0', color: '#24446B' }}>Reject Loan Application</h3>
                        <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '16px' }}>
                            Account: <strong id="rejectModalAccount"></strong> &bull; Borrower: <strong id="rejectModalBorrower"></strong>
                        </p>
                        <form onSubmit={handleSubmit} action="/staff/loans/reject" method="post">
                            <input type="hidden" name={_csrf?.parameterName} value={_csrf?.token} />
                            <input type="hidden" name="loanId" id="rejectModalLoanId" />
        
                            <label style={{ fontWeight: '600', fontSize: '13px', color: '#334155' }}>Rejection Reason <span style={{ color: '#DC2626' }}>*</span></label>
                            <select onChange={handleInputChange} name="reason" style={{ marginTop: '6px', marginBottom: '16px' }} required>
                                <option value="Credit score does not meet minimum bank threshold">Credit score does not meet minimum bank threshold</option>
                                <option value="Debt-to-income ratio exceeds permissible limits">Debt-to-income ratio exceeds permissible limits</option>
                                <option value="Incomplete or unverified borrower KYC documentation">Incomplete or unverified borrower KYC documentation</option>
                                <option value="Customer employment / income verification unconfirmed">Customer employment / income verification unconfirmed</option>
                                <option value="Application does not meet eligibility criteria">Other bank policy criteria not met</option>
                            </select>
        
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-secondary" style={{ width: 'auto', padding: '8px 16px', fontSize: '13px' }} onclick="closeRejectModal()">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-danger" style={{ width: 'auto', padding: '8px 16px', fontSize: '13px' }}>
                                    Confirm Rejection
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
        
                
                <div id="collectionModal" className="staff-modal-backdrop">
                    <div className="staff-modal-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h3 style={{ margin: '0', color: '#24446B' }}>Record Collection Payment</h3>
                            <button type="button" onclick="closeCollectionModal()" style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748B' }}>&times;</button>
                        </div>
                        <p style={{ color: '#64748B', fontSize: '13px', margin: '0 0 16px 0' }}>
                            Account: <strong id="collectModalAccount" style={{ color: '#2B6CB0' }}></strong> &bull; 
                            Borrower: <strong id="collectModalBorrower"></strong>
                        </p>
        
                        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase' }}>Outstanding Balance</div>
                                <div style={{ fontSize: '16px', fontWeight: '700', color: '#DC2626' }} id="collectModalBalance">₹0.00</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase' }}>Overdue EMI Due</div>
                                <div style={{ fontSize: '16px', fontWeight: '700', color: '#991B1B' }} id="collectModalOverdue">₹0.00</div>
                            </div>
                        </div>
        
                        <form onSubmit={handleSubmit} action="/staff/collections/record" method="post">
                            <input type="hidden" name={_csrf?.parameterName} value={_csrf?.token} />
                            <input type="hidden" name="loanId" id="collectModalLoanId" />
        
                            <label style={{ fontWeight: '600', fontSize: '13px', color: '#334155' }}>Collection Amount (₹) <span style={{ color: '#DC2626' }}>*</span></label>
                            <input onChange={handleInputChange} type="number" step="any" min="1" name="amount" id="collectModalAmount" required style={{ marginTop: '6px', marginBottom: '12px' }} />
        
                            <label style={{ fontWeight: '600', fontSize: '13px', color: '#334155' }}>Payment Mode <span style={{ color: '#DC2626' }}>*</span></label>
                            <select onChange={handleInputChange} name="paymentMode" style={{ marginTop: '6px', marginBottom: '12px' }} required>
                                <option value="CASH">CASH (Physical Receipt Issued)</option>
                                <option value="UPI">UPI (QR / VPA Transfer)</option>
                                <option value="NEFT">NEFT / RTGS</option>
                                <option value="CHEQUE">Bank Cheque</option>
                                <option value="DD">Demand Draft</option>
                            </select>
        
                            <label style={{ fontWeight: '600', fontSize: '13px', color: '#334155' }}>Receipt / Transaction Reference</label>
                            <input onChange={handleInputChange} type="text" name="transactionReference" id="collectModalRef" placeholder="e.g. REC-2026-90812 or Bank Ref" maxlength="50" style={{ marginTop: '6px', marginBottom: '18px' }} />
        
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-secondary" style={{ width: 'auto', padding: '8px 16px', fontSize: '13px' }} onclick="closeCollectionModal()">
                                    Cancel
                                </button>
                                <button type="submit" className="btn" style={{ width: 'auto', padding: '8px 20px', fontSize: '13px', backgroundColor: '#ED7D16' }}>
                                    Confirm & Record Collection
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
        
                
            </>) :
        
            
            (<>
                <div className="customer-dashboard">
        
                    
                    <div className="welcome-banner">
                        <div>
                            <h1 className="welcome-title">Welcome back, {userObj?.name}!</h1>
                            <p className="welcome-sub">Here's an overview of your loan account.</p>
                        </div>
                        <div>
                            <a href="/applyLoan" className="btn-orange-primary">
                                <span style={{ fontSize: '16px', fontWeight: '800' }}>+</span> Apply for Loan
                            </a>
                        </div>
                    </div>
        
                    
                    {(param.selectLoan) && (<>
                        <div className="alert alert-info" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '4px solid #315B91' }}>
                            <span style={{ fontSize: '20px' }}>ℹ️</span>
                            <div>
                                <strong>Select Loan for Repayment:</strong> You have multiple active loan accounts. Please click the <strong>"Pay EMI"</strong> button next to the specific loan you wish to repay below.
                            </div>
                        </div>
                    </>)}
        
                    
                    <div className="summary-grid">
                        
                        <div className="summary-card">
                            <div className="card-top">
                                <span className="card-label">Total Loans</span>
                                <div className="card-icon-wrap" style={{ background: '#F0F4F8', color: '#24446B' }}>📋</div>
                            </div>
                            <div className="card-value">
                                {totalLoanCount != null ? totalLoanCount : 0}
                            </div>
                            <div className="card-desc">All loan accounts on record</div>
                        </div>
        
                        
                        <div className="summary-card">
                            <div className="card-top">
                                <span className="card-label">Active Loans</span>
                                <div className="card-icon-wrap" style={{ background: '#E6F7F3', color: '#0F9B79' }}>🟢</div>
                            </div>
                            <div className="card-value">
                                {activeLoanCount != null ? activeLoanCount : 0}
                            </div>
                            <div className="card-desc">Currently servicing</div>
                        </div>
        
                        
                        <div className="summary-card">
                            <div className="card-top">
                                <span className="card-label">Pending Applications</span>
                                <div className="card-icon-wrap" style={{ background: '#FEF3EB', color: '#ED7D16' }}>⏳</div>
                            </div>
                            <div className="card-value">
                                {pendingLoanCount != null ? pendingLoanCount : 0}
                            </div>
                            <div className="card-desc">Awaiting sanction / review</div>
                        </div>
        
                        
                        <div className="summary-card" style={{ borderLeft: '3px solid #ED7D16' }}>
                            <div className="card-top">
                                <span className="card-label">Outstanding Balance</span>
                                <div className="card-icon-wrap" style={{ background: '#FEF3EB', color: '#ED7D16' }}>💳</div>
                            </div>
                            <div className="card-value" style={{ color: '#ED7D16' }}>
                                ₹{outstandingBalance != null ? outstandingBalance : (totalRemaining != null ? totalRemaining : 0.0)}
                            </div>
                            <div className="card-desc">Total remaining principal</div>
                        </div>
                    </div>
        
                    
                    {
                        (!!(loans) && activeLoanCount > 0) ? (<>
                            <div className="dashboard-section-card">
                                <div className="section-header">
                                    <div>
                                        <h2 className="section-title">Your Loan Portfolio</h2>
                                        <p className="section-subtitle">Real-time balances and EMI installment commitments</p>
                                    </div>
                                    <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>
                                        Showing {loans?.size?.()} accounts
                                    </span>
                                </div>
        
                                <div className="table-responsive" style={{ marginTop: '0', border: 'none' }}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Loan Account</th>
                                                <th>Product Type</th>
                                                <th>Sanctioned Amount</th>
                                                <th>Interest Rate</th>
                                                <th>Tenure</th>
                                                <th>Monthly EMI</th>
                                                <th>Outstanding Balance</th>
                                                <th>Status</th>
                                                <th style={{ textAlign: 'center' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loans && loans?.map((l: any, index: number) => (<>
                                                <tr>
                                                    <td>
                                                        <strong style={{ color: '#24446B', fontFamily: 'monospace', fontSize: '14px' }}>
                                                            {
                                                                (!!(l.accountNumber)) ? (<>
                                                                     {l.accountNumber}
                                                                </>) :
                                                                (<>
                                                                     {l.loanId}
                                                                </>)
                                                            }
                                                        </strong>
                                                    </td>
                                                    <td>
                                                        <c:out value={Boolean(l.productType) ? l.productType : 'Personal Loan'}/>
                                                    </td>
                                                    <td>₹{l.amount}</td>
                                                    <td>{l.interest}% (<c:out value={Boolean(l.interestType) ? l.interestType : 'FIXED'}/>)</td>
                                                    <td>{l.months} mos</td>
                                                    <td style={{ color: '#315B91', fontWeight: '600' }}>
                                                        ₹{l.emi}
                                                    </td>
                                                    <td>
                                                        <strong style="color:{l.remaining > 0 ? '#ED7D16' : '#0F9B79'};">
                                                            ₹{l.remaining}
                                                        </strong>
                                                    </td>
                                                    <td>
                                                        {
                                                            (l.status == 'ACTIVE' || l.status == 'APPROVED') ? (<>
                                                                <span className="badge-pill badge-success">ACTIVE</span>
                                                            </>) :
                                                            (l.status == 'CLOSED') ? (<>
                                                                <span className="badge-pill badge-secondary">CLOSED</span>
                                                            </>) :
                                                            (l.status == 'REJECTED') ? (<>
                                                                <span className="badge-pill badge-danger">REJECTED</span>
                                                            </>) :
                                                            (<>
                                                                <span className="badge-pill badge-warning">{l.status}</span>
                                                            </>)
                                                        }
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        {
                                                            (l.remaining > 0) ? (<>
                                                                <a href="/payPage?loanId={l.loanId}" className="btn" style={{ padding: '7px 16px', fontSize: '13px', width: 'auto', textDecoration: 'none', display: 'inline-block', background: '#24446B', color: '#FFFFFF', borderRadius: '6px', fontWeight: '600' }}>
                                                                    Pay EMI
                                                                </a>
                                                            </>) :
                                                            (<>
                                                                <span style={{ color: '#0F9B79', fontSize: '13px', fontWeight: '700' }}>Fully Paid</span>
                                                            </>)
                                                        }
                                                    </td>
                                                </tr>
                                            </>))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>) :
                        (<>
                            
                            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '48px 32px', textAlign: 'center', maxWidth: '560px', margin: '20px auto 32px auto', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                                <div style={{ fontSize: '52px', marginBottom: '16px' }}>🏦</div>
                                <h3 style={{ color: '#172B4D', fontSize: '22px', fontWeight: '700', margin: '0 0 10px 0' }}>No Active Loans</h3>
                                <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.5', margin: '0 0 24px 0' }}>
                                    You don't have any active loans yet. Start a new application to get started.
                                </p>
                                <a href="/applyLoan" className="btn-orange-primary" style={{ margin: '0 auto' }}>
                                    Apply for a Loan
                                </a>
                            </div>
                        </>)
                    }
        
                    
                    <div className="dashboard-section-card activity-section">
                        <div className="section-header">
                            <div>
                                <h2 className="section-title">Recent Activity</h2>
                                <p className="section-subtitle">Your latest loan applications, approvals, and repayment records</p>
                            </div>
                        </div>
        
                        {
                            (!!(recentActivities)) ? (<>
                                <div className="activity-list">
                                    {recentActivities && recentActivities?.map((act: any, index: number) => (<>
                                        <div className="activity-row">
                                            <div className="activity-left">
                                                <div className="activity-icon">
                                                    {act.icon}
                                                </div>
                                                <div>
                                                    <h4 className="activity-title">{act.title}</h4>
                                                    <p className="activity-desc">{act.description}</p>
                                                </div>
                                            </div>
                                            <div className="activity-right">
                                                <span className="badge-pill {act.badgeClass}">
                                                    {act.status}
                                                </span>
                                                <div className="activity-date">{act.formattedDate}</div>
                                            </div>
                                        </div>
                                    </>))}
                                </div>
                            </>) :
                            (<>
                                <div style={{ textAlign: 'center', padding: '36px 20px', color: '#64748B' }}>
                                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏱️</div>
                                    <p style={{ margin: '0', fontSize: '14px', fontWeight: '500' }}>
                                        Your recent applications and repayments will appear here.
                                    </p>
                                </div>
                            </>)
                        }
                    </div>
        
                </div>
            </>)
        }
        
        </div>
        </>
    );
};

export default DashboardComponent;
