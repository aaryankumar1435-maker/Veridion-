import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ShieldAlert, ShieldCheck, FileCheck, Fingerprint, User, Lock, 
  TrendingUp, Wallet, LifeBuoy, DownloadCloud, Key, ArrowRight, Info, Target, 
  Eye, Lightbulb, Feather, ServerCrash, UserCheck, Send, UploadCloud, Search, 
  Trash2, PlusCircle, CheckSquare, Camera, RotateCw, Banknote, DollarSign, 
  Zap, Clock, Smartphone, Monitor, AlertTriangle, Paperclip, Mail, Phone,
  X, Menu, ChevronRight, FolderOpen, RefreshCw, LogOut, LayoutDashboard, Globe
} from 'lucide-react';

const INITIAL_USERS = [
  {
    name: "Administrator Demo",
    email: "user@example.com",
    password: "password123",
    createdDate: "2026-06-11",
    uuid: "UID-87F9A01B"
  }
];

const INITIAL_TRANSACTIONS = [
  { id: "TX-9021A", date: "2026-06-14 11:24:12", action: "BUY Bitcoin (BTC)", flow: "+0.0245 BTC / -$1,647.39 USD", hash: "0x8fa3f80c...b11a", verification: "VRD-OK-98" },
  { id: "TX-8842B", date: "2026-06-13 15:10:45", action: "BUY Ethereum (ETH)", flow: "+0.8450 ETH / -$2,940.77 USD", hash: "0x4cc9d11b...fa22", verification: "VRD-OK-44" },
  { id: "TX-7711C", date: "2026-06-12 09:30:00", action: "DEPOSIT CASH POOL", flow: "+$20,000.00 USD", hash: "0x119fa99e...a2b2", verification: "SYSTEM-INIT" }
];

const INITIAL_TICKETS = [
  {
    id: "VRD-TKT-1082",
    category: "Transaction issues",
    subject: "Delayed BTC Swapping Settlement Ledger Checkpoint",
    description: "Executing a Buy swap on BTC took over 45 seconds to settle in memory. This is causing slippage delays.",
    status: "UNDER INVESTIGATION",
    date: "2026-06-15 10:14:00",
    attachments: ["screenshot_slippage_error.png"],
    emailNotifications: true,
    responses: [
      { sender: "System Gatekeeper", date: "2026-06-15 10:15:00", message: "Automated verification check complete. Case assigned to Tier 2 Security Analyst." }
    ]
  },
  {
    id: "VRD-TKT-0941",
    category: "Account access problems",
    subject: "MFA Dual-Factor TOTP Sync Clock Drift",
    description: "The 6-digit verification code was rejected three times despite generating within the valid window.",
    status: "RESOLVED",
    date: "2026-06-12 16:45:10",
    attachments: ["auth_app_sync.pdf"],
    emailNotifications: false,
    responses: [
      { sender: "Aria Tanaka", date: "2026-06-12 17:30:00", message: "Hello! We detected a slight clock drift on Security Server Node 4. We synced the NTP pools and verified TOTP windows are now perfectly aligned. Please let us know if you encounter any other challenges." }
    ]
  }
];

const LEADERSHIP_DATA = {
  elizabeth: {
    name: "Elizabeth Harris",
    role: "CEO & Co-Founder",
    icon: "User",
    bio: "Elizabeth leads our overall design vision, product operations, and strategic roadmaps. Under her oversight, Veridion has prioritized light architectures that process enterprise updates instantaneously.",
    instagram: "https://instagram.com/elizabeth_harris_flow",
    instagram_handle: "@elizabeth_harris_flow",
    twitter: "https://twitter.com/elizabeth_flow",
    twitter_handle: "@elizabeth_flow",
    linkedin: "https://linkedin.com/company/veridion-mvp",
    linkedin_handle: "elizabeth-harris-nexus",
    email: "elizabeth@veridion.xyz"
  },
  marcus: {
    name: "Marcus Vance",
    role: "Lead System Architect",
    icon: "User",
    bio: "Marcus commands full system telemetry. He specializes in designing lightweight, distributed REST architectures, optimizing query response rates, and orchestrating native database configurations.",
    instagram: "https://instagram.com/marcus_architect",
    instagram_handle: "@marcus_architect",
    twitter: "https://twitter.com/marcus_vance",
    twitter_handle: "@marcus_vance",
    linkedin: "https://linkedin.com/company/veridion-mvp",
    linkedin_handle: "marcus-vance-nexus",
    email: "marcus@veridion.xyz"
  },
  aria: {
    name: "Aria Tanaka",
    role: "Head of API Security",
    icon: "User",
    bio: "Aria safeguards the transmission integrity of our platform. She focuses on engineering cryptographically secure endpoints, OAuth pipeline structures, and client identity verification logic.",
    instagram: "https://instagram.com/aria_sec_tanaka",
    instagram_handle: "@aria_sec_tanaka",
    twitter: "https://twitter.com/aria_tanaka",
    twitter_handle: "@aria_tanaka",
    linkedin: "https://linkedin.com/company/veridion-mvp",
    linkedin_handle: "aria-tanaka-nexus",
    email: "aria@veridion.xyz"
  }
};

export default function App() {
  // Navigation & General Routing
  const [currentView, setCurrentView] = useState('home');
  const [dashboardTab, setDashboardTab] = useState('assets');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeModalMember, setActiveModalMember] = useState(null);
  const [modalBioExtendLoading, setModalBioExtendLoading] = useState(false);

  // Authentication & Users State
  const [users, setUsers] = useState(INITIAL_USERS);
  const [currentSession, setCurrentSession] = useState(null);
  const [tempLoginStore, setTempLoginStore] = useState(null); // Used during 2FA challenge transitions

  // Forms Binding State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginToken2FA, setLoginToken2FA] = useState('');
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState('request'); // 'request' | 'reset'
  const [forgotTokenInput, setForgotTokenInput] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');

  // Profile Form bindings
  const [profileNameInput, setProfileNameInput] = useState('');
  const [profileCurrentPassword, setProfileCurrentPassword] = useState('');
  const [profileNewPassword, setProfileNewPassword] = useState('');

  // Dynamic Portfolio & Market Asset State
  const [balances, setBalances] = useState({
    USD: 15400.00,
    BTC: 0.1245,
    ETH: 1.8450,
    VRD: 2500.00
  });
  const [prices, setPrices] = useState({
    BTC: 67240.50,
    ETH: 3480.20,
    VRD: 1.25
  });
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  // Quick Trade variables
  const [tradeAsset, setTradeAsset] = useState('BTC');
  const [tradeAction, setTradeAction] = useState('BUY');
  const [tradeVolume, setTradeVolume] = useState('');

  // Support & Incident System State
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [complaintForm, setComplaintForm] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: '',
    enableNotifications: true
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [searchTicketId, setSearchTicketId] = useState('');
  const [searchedTicketResult, setSearchedTicketResult] = useState(null);
  const [supportMode, setSupportMode] = useState('form'); // 'form' | 'tracker'
  const [aiPolishLoading, setAiPolishLoading] = useState(false);

  // Security & Inactivity firewall variables
  const [securitySettings, setSecuritySettings] = useState({
    is2faEnabled: true,
    twoFactorToken: "123456",
    lockTimeout: 60,
    lockCounter: 60,
    isLocked: false
  });
  const [activeDevices, setActiveDevices] = useState([
    { id: "DEV-01", name: "Chrome - Mac OS X (Active Session)", location: "Jabalpur, India", ip: "103.88.22.45", timestamp: "Active Now", status: "Primary" },
    { id: "DEV-02", name: "Veridion Native Client v1.0", location: "Jabalpur, India", ip: "103.88.22.46", timestamp: "Synchronized: 15m ago", status: "Secondary" }
  ]);
  const [securityLogs, setSecurityLogs] = useState([
    { date: "2026-06-14 12:44:02", action: "Double-Factor Standard Validated", status: "SUCCESS" },
    { date: "2026-06-14 11:15:30", action: "Credentials Verified", status: "SUCCESS" },
    { date: "2026-06-13 14:00:22", action: "IP Geolocation Verified", status: "SUCCESS" }
  ]);

  // Toast deck state
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  useEffect(() => {
    let timer;
    if (currentSession && !securitySettings.isLocked) {
      timer = setInterval(() => {
        setSecuritySettings((prev) => {
          if (prev.lockCounter <= 1) {
            // Trigger automatic lock overlay
            showToast("Terminal locked due to user inactivity.", "error");
            return {
              ...prev,
              lockCounter: prev.lockTimeout,
              isLocked: true
            };
          }
          return {
            ...prev,
            lockCounter: prev.lockCounter - 1
          };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentSession, securitySettings.isLocked, securitySettings.lockTimeout, showToast]);

  // Global activity reset triggers
  const resetInactivityTimer = useCallback(() => {
    if (currentSession && !securitySettings.isLocked) {
      setSecuritySettings((prev) => ({
        ...prev,
        lockCounter: prev.lockTimeout
      }));
    }
  }, [currentSession, securitySettings.isLocked]);

  useEffect(() => {
    const interactionEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    const handler = () => resetInactivityTimer();
    interactionEvents.forEach(evt => window.addEventListener(evt, handler));
    return () => interactionEvents.forEach(evt => window.removeEventListener(evt, handler));
  }, [resetInactivityTimer]);

  useEffect(() => {
    const tickerInterval = setInterval(() => {
      if (currentSession && !securitySettings.isLocked) {
        setPrices((prev) => {
          const updated = {
            BTC: parseFloat((prev.BTC * (1 + (Math.random() * 0.004 - 0.002))).toFixed(2)),
            ETH: parseFloat((prev.ETH * (1 + (Math.random() * 0.006 - 0.003))).toFixed(2)),
            VRD: parseFloat((prev.VRD * (1 + (Math.random() * 0.010 - 0.005))).toFixed(4))
          };
          return updated;
        });
      }
    }, 12000);
    return () => clearInterval(tickerInterval);
  }, [currentSession, securitySettings.isLocked]);

  const addSecurityAuditLog = useCallback((action, status) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setSecurityLogs((prev) => [
      { date: timestamp, action, status },
      ...prev
    ]);
  }, []);

  const handleNavigation = (viewName) => {
    setMobileMenuOpen(false);
    const protectedRoutes = ['dashboard', 'profile'];
    if (protectedRoutes.includes(viewName) && !currentSession) {
      showToast('Authentication required. Redirecting to login portal...', 'error');
      setCurrentView('login');
      return;
    }
    setCurrentView(viewName);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewName === 'profile' && currentSession) {
      setProfileNameInput(currentSession.name);
    }
  };

  const handleManualTickerSync = () => {
    setPrices((prev) => ({
      BTC: parseFloat((prev.BTC * (1 + (Math.random() * 0.005 - 0.0025))).toFixed(2)),
      ETH: parseFloat((prev.ETH * (1 + (Math.random() * 0.007 - 0.0035))).toFixed(2)),
      VRD: parseFloat((prev.VRD * (1 + (Math.random() * 0.012 - 0.006))).toFixed(4))
    }));
    showToast("Ledger telemetry synchronized successfully.", "success");
    addSecurityAuditLog("Manual ticker recalculation triggered", "SUCCESS");
  };

  const executeTrade = (e) => {
    e.preventDefault();
    const volume = parseFloat(tradeVolume);
    if (!volume || volume <= 0) {
      showToast("Slippage error: Enter a valid asset quantity.", "error");
      return;
    }

    const indexPrice = prices[tradeAsset];
    const settlementCost = volume * indexPrice;

    if (tradeAction === "BUY") {
      if (balances.USD < settlementCost) {
        showToast("Execution Rejected: Insufficient USD Cash Pool.", "error");
        return;
      }
      setBalances((prev) => ({
        ...prev,
        USD: prev.USD - settlementCost,
        [tradeAsset]: prev[tradeAsset] + volume
      }));
      
      const txId = "TX-" + Math.floor(10000 + Math.random() * 90000) + "A";
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const mockHash = "0x" + Math.random().toString(16).substr(2, 8) + "..." + Math.random().toString(16).substr(2, 4);

      setTransactions((prev) => [
        {
          id: txId,
          date: timestamp,
          action: `BUY ${tradeAsset}`,
          flow: `+${volume} ${tradeAsset} / -$${settlementCost.toFixed(2)} USD`,
          hash: mockHash,
          verification: "VRD-OK-" + Math.floor(10 + Math.random() * 89)
        },
        ...prev
      ]);
      showToast("Exchange completed. Handshake authorized.", "success");
      addSecurityAuditLog(`Exchange Executed: Buy ${volume} ${tradeAsset}`, "SUCCESS");
    } else {
      if (balances[tradeAsset] < volume) {
        showToast(`Execution Rejected: Insufficient ${tradeAsset} coordinates.`, "error");
        return;
      }
      setBalances((prev) => ({
        ...prev,
        USD: prev.USD + settlementCost,
        [tradeAsset]: prev[tradeAsset] - volume
      }));

      const txId = "TX-" + Math.floor(10000 + Math.random() * 90000) + "A";
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const mockHash = "0x" + Math.random().toString(16).substr(2, 8) + "..." + Math.random().toString(16).substr(2, 4);

      setTransactions((prev) => [
        {
          id: txId,
          date: timestamp,
          action: `SELL ${tradeAsset}`,
          flow: `-${volume} ${tradeAsset} / +$${settlementCost.toFixed(2)} USD`,
          hash: mockHash,
          verification: "VRD-OK-" + Math.floor(10 + Math.random() * 89)
        },
        ...prev
      ]);
      showToast("Assets liquidated. Ledger coordinates update finalized.", "success");
      addSecurityAuditLog(`Exchange Executed: Sell ${volume} ${tradeAsset}`, "SUCCESS");
    }

    setTradeVolume('');
  };

  const replenishUSD = () => {
    setBalances((prev) => ({
      ...prev,
      USD: prev.USD + 10000.00
    }));
    showToast("Drawn $10,000.00 mock cash into accounts.", "success");
    addSecurityAuditLog("USD Cash balance pool refreshed (+10,000.00 USD)", "SUCCESS");
  };

  const handleLoginNextStep = (e) => {
    e.preventDefault();
    const email = loginEmail.trim().toLowerCase();
    const match = users.find(u => u.email.toLowerCase() === email && u.password === loginPassword);

    if (match) {
      if (securitySettings.is2faEnabled) {
        setTempLoginStore(match);
        showToast("Credentials accepted. Awaiting MFA TOTP verification token.", "info");
      } else {
        setCurrentSession(match);
        showToast(`Authentication accepted. Established session for ${match.name}.`, 'success');
        addSecurityAuditLog("User session initialized", "SUCCESS");
        setLoginEmail('');
        setLoginPassword('');
        setCurrentView('dashboard');
      }
    } else {
      showToast("Rejected credentials verification coordinates.", "error");
      addSecurityAuditLog("Failed login attempt with bad credentials", "FAILURE");
    }
  };

  const handleLoginFinalSubmit = (e) => {
    e.preventDefault();
    if (loginToken2FA === securitySettings.twoFactorToken) {
      const verifiedUser = tempLoginStore;
      setCurrentSession(verifiedUser);
      setTempLoginStore(null);
      showToast(`MFA verification successful. Access granted.`, "success");
      addSecurityAuditLog("MFA Validation check match complete", "SUCCESS");
      setLoginEmail('');
      setLoginPassword('');
      setLoginToken2FA('');
      setCurrentView('dashboard');
    } else {
      showToast("Verification code mismatched. Rejected access payload authorization.", "error");
      addSecurityAuditLog("MFA code validation rejection", "FAILURE");
    }
  };

  const logout = () => {
    showToast("Active credentials revoked. Session destroyed.", "success");
    addSecurityAuditLog("Manually requested session revocation", "SUCCESS");
    setCurrentSession(null);
    setCurrentView('home');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const { name, email, password, confirm } = registerForm;
    if (password !== confirm) {
      showToast("Verification error: Passwords do not match.", "error");
      return;
    }

    const emailExists = users.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (emailExists) {
      showToast("Operational Failure: Email coordinates already registered.", "error");
      return;
    }

    const newUser = {
      name: name.trim(),
      email: email.trim(),
      password: password,
      createdDate: new Date().toISOString().split('T')[0],
      uuid: "UID-" + Math.random().toString(36).substr(2, 8).toUpperCase()
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentSession(newUser);
    showToast("Compliance index mapped. Welcome to Veridion.", "success");
    addSecurityAuditLog("New credential parameters registered", "SUCCESS");
    setRegisterForm({ name: '', email: '', password: '', confirm: '' });
    setCurrentView('dashboard');
  };

  const handleForgotRequest = (e) => {
    e.preventDefault();
    const checkExists = users.some(u => u.email.toLowerCase() === forgotEmail.trim().toLowerCase());
    if (checkExists) {
      setForgotStep('reset');
      showToast("Verification code generated. Use code VRD-777.", "info");
    } else {
      showToast("Error: Email coordinate is not indexed in system.", "error");
    }
  };

  const handleForgotComplete = (e) => {
    e.preventDefault();
    if (forgotTokenInput.trim() === "VRD-777") {
      setUsers((prev) => prev.map(u => {
        if (u.email.toLowerCase() === forgotEmail.trim().toLowerCase()) {
          return { ...u, password: forgotNewPassword };
        }
        return u;
      }));
      showToast("Security variables rotated. Sign in using new parameters.", "success");
      addSecurityAuditLog(`Rotated password coordinate for: ${forgotEmail}`, "SUCCESS");
      setForgotEmail('');
      setForgotTokenInput('');
      setForgotNewPassword('');
      setForgotStep('request');
      setCurrentView('login');
    } else {
      showToast("Disruption validation failed. Master lock enforced.", "error");
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    if (currentSession) {
      const updatedSession = { ...currentSession, name: profileNameInput };
      setCurrentSession(updatedSession);
      setUsers((prev) => prev.map(u => u.email === currentSession.email ? updatedSession : u));
      showToast("Metadata credentials updated successfully.", "success");
      addSecurityAuditLog("User credentials profile metadata update", "SUCCESS");
    }
  };

  const handlePasswordRotate = (e) => {
    e.preventDefault();
    if (currentSession.password !== profileCurrentPassword) {
      showToast("Security error: Current verification value incorrect.", "error");
      return;
    }
    const updatedSession = { ...currentSession, password: profileNewPassword };
    setCurrentSession(updatedSession);
    setUsers((prev) => prev.map(u => u.email === currentSession.email ? updatedSession : u));
    showToast("Security secret keys successfully rotated.", "success");
    addSecurityAuditLog("Manually mutated security parameters", "SUCCESS");
    setProfileCurrentPassword('');
    setProfileNewPassword('');
  };

  const handleRestoreLock = (e) => {
    e.preventDefault();
    const passInput = e.target.elements.lockPass.value;
    if (currentSession && currentSession.password === passInput) {
      setSecuritySettings((prev) => ({ ...prev, isLocked: false }));
      showToast("Identity verified. Restoration process finalized.", "success");
      addSecurityAuditLog("Unlocked inactive terminal environment", "SUCCESS");
      e.target.reset();
    } else {
      showToast("Authorization rejected. Session lock maintained.", "error");
    }
  };

  const handleComplaintSubmit = (e) => {
    e.preventDefault();
    const tktId = "VRD-TKT-" + Math.floor(1000 + Math.random() * 9000);
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newTicket = {
      id: tktId,
      category: complaintForm.category,
      subject: complaintForm.subject,
      description: complaintForm.message,
      status: "PENDING REVIEW",
      date: timestamp,
      attachments: uploadedFiles,
      emailNotifications: complaintForm.enableNotifications,
      responses: [
        { sender: "System Gatekeeper", date: timestamp, message: `System validation complete. Case compiled under registration coordinate: ${tktId}` }
      ]
    };

    setTickets((prev) => [newTicket, ...prev]);
    showToast(`Telemetry incident registered. Ticket reference: ${tktId}`, "success");
    addSecurityAuditLog(`Incident ticket compiled: ${tktId}`, "SUCCESS");

    // Reset support form
    setComplaintForm({
      name: '',
      email: '',
      category: '',
      subject: '',
      message: '',
      enableNotifications: true
    });
    setUploadedFiles([]);

    // Auto navigate user to view status
    setSupportMode('tracker');
    setSearchTicketId(tktId);
    setSearchedTicketResult(newTicket);
  };

  const handleTicketSearch = (e) => {
    e.preventDefault();
    const targetId = searchTicketId.trim().toUpperCase();
    const match = tickets.find(t => t.id === targetId);
    if (match) {
      setSearchedTicketResult(match);
      showToast("Found incident tracking telemetry database.", "success");
    } else {
      setSearchedTicketResult(null);
      showToast("Incident reference index not discovered.", "error");
    }
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const names = Array.from(files).map(f => f.name);
      setUploadedFiles((prev) => [...prev, ...names]);
      showToast(`Mapped ${files.length} diagnostic elements.`, "success");
    }
  };

  const removeAttachment = (index) => {
    setUploadedFiles((prev) => prev.filter((_, idx) => idx !== index));
    showToast("Diagnostic element unmapped.", "info");
  };

  // Automated templates loader
  const triggerComplaintNavigation = () => {
    setCurrentView('contact');
    setSupportMode('form');
    setComplaintForm({
      name: currentSession?.name || 'Administrator Demo',
      email: currentSession?.email || 'user@example.com',
      category: 'Transaction issues',
      subject: 'Complaint: Telemetry Handshake Timeout Verification',
      message: 'Processing a simulated asset trade experienced delayed confirmation. Database update pipelines did not respond within established SOC 2 compliant milestones.',
      enableNotifications: true
    });
    showToast("Incident template successfully mapped.", "info");
  };

  // Polishing text with simulated AI (using delay & structured response)
  const polishComplaintText = () => {
    if (!complaintForm.message.trim()) {
      showToast("Operational Error: Message narrative is blank.", "error");
      return;
    }
    setAiPolishLoading(true);
    setTimeout(() => {
      setComplaintForm(prev => ({
        ...prev,
        message: `[COMPLIANT INCIDENT ANALYSIS REPORT]\nSUBJECT COORDINATE: ${prev.subject || "UNASSIGNED"}\n\nERROR NARRATIVE:\n${prev.message}\n\nTECHNICAL REPERCUSSIONS:\n1. Network latency parameters exceeded established SOC 2 threshold windows.\n2. Threat evaluation: Minor system state lag, awaiting administrative cache reset.`
      }));
      setAiPolishLoading(false);
      showToast("Gemini telemetry narrative polishing complete.", "success");
    }, 1500);
  };

  const simulateDownload = () => {
    showToast("Querying regional secure package mirror nodes...", "info");
    setTimeout(() => {
      showToast("Started binary download: veridion-crypto-ledger-cli.pkg 🚀", "success");
    }, 1500);
  };

  const btcUSDVal = balances.BTC * prices.BTC;
  const ethUSDVal = balances.ETH * prices.ETH;
  const vrdUSDVal = balances.VRD * prices.VRD;
  const totalValuation = balances.USD + btcUSDVal + ethUSDVal + vrdUSDVal;

  return (
    <div className="min-h-screen text-zinc-100 bg-[#0a0a0c] flex flex-col font-sans transition-all selection:bg-[#c29943]/30 selection:text-[#c29943]">
      
      {/* Toast Alert Deck */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 max-w-sm pointer-events-none w-full px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 p-4 rounded-xl border shadow-2xl pointer-events-auto transition-all duration-300 bg-zinc-900 border-zinc-800 text-zinc-100 ${
              toast.type === 'success' ? 'border-[#c29943]/40' : toast.type === 'error' ? 'border-red-900/40' : 'border-zinc-700'
            }`}
          >
            {toast.type === 'success' && <ShieldCheck className="w-5 h-5 text-[#c29943] flex-shrink-0" />}
            {toast.type === 'error' && <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-zinc-400 flex-shrink-0" />}
            <p className="text-xs font-semibold flex-grow leading-relaxed">{toast.message}</p>
            <button onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} className="text-zinc-500 hover:text-zinc-300">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      { }
      {/* Session Inactivity Locked Firewall */}
      {currentSession && securitySettings.isLocked && (
        <div className="fixed inset-0 z-[90] bg-[#0a0a0c]/90 backdrop-blur-2xl flex flex-col items-center justify-center p-4">
          <div className="bg-[#121214] border border-zinc-800/80 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
            <div className="inline-flex h-16 w-16 bg-red-950/40 text-red-500 rounded-2xl items-center justify-center border border-red-900/30">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white">Console Session Locked</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Terminal secured automatically due to user keyboard/mouse inactivity to prevent terminal exposure.
              </p>
            </div>
            <form onSubmit={handleRestoreLock} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Authenticator Signature Pass</label>
                <input
                  name="lockPass"
                  type="password"
                  required
                  placeholder="Enter session security key"
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943] transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#c29943] hover:bg-[#aa8032] text-black font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Unlock Session Environment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic Team Member Spotlight Modal */}
      {activeModalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all">
          <div className="relative bg-[#121214] rounded-3xl border border-zinc-800 max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setActiveModalMember(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-[#18181b] flex items-center justify-center border-2 border-[#c29943] mb-4">
                <User className="w-10 h-10 text-[#c29943]" />
              </div>
              <h3 className="text-xl font-bold text-white">{LEADERSHIP_DATA[activeModalMember].name}</h3>
              <p className="text-xs text-[#c29943] font-bold tracking-widest uppercase mt-1">{LEADERSHIP_DATA[activeModalMember].role}</p>
            </div>

            <div className="bg-zinc-950 rounded-2xl p-4 border border-zinc-800 relative">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Biography Parameters</span>
                <button
                  onClick={() => {
                    setModalBioExtendLoading(true);
                    setTimeout(() => {
                      showToast("Backstory successfully extended with Gemini security insights.", "success");
                      setModalBioExtendLoading(false);
                    }, 1200);
                  }}
                  className="inline-flex items-center gap-1.5 text-[9px] bg-zinc-900 hover:bg-zinc-800 text-[#c29943] font-bold py-1 px-2.5 rounded-lg border border-[#c29943]/20 transition-all"
                >
                  Extend with AI
                </button>
              </div>
              {modalBioExtendLoading ? (
                <div className="flex flex-col items-center justify-center py-6 gap-2">
                  <RefreshCw className="w-5 h-5 text-[#c29943] animate-spin" />
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Generating backtrace elements...</span>
                </div>
              ) : (
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {LEADERSHIP_DATA[activeModalMember].bio}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Secure Communication Channels</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                  <span className="text-zinc-500 font-semibold">LinkedIn</span>
                  <a href={LEADERSHIP_DATA[activeModalMember].linkedin} target="_blank" rel="noopener noreferrer" className="font-mono text-[#c29943] hover:underline">
                    {LEADERSHIP_DATA[activeModalMember].linkedin_handle}
                  </a>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                  <span className="text-zinc-500 font-semibold">X / Twitter</span>
                  <a href={LEADERSHIP_DATA[activeModalMember].twitter} target="_blank" rel="noopener noreferrer" className="font-mono text-[#c29943] hover:underline">
                    {LEADERSHIP_DATA[activeModalMember].twitter_handle}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {}
      {/* Platform Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0c]/95 border-b border-zinc-900 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 items-center justify-between">
            
            {/* Logo */}
            <div onClick={() => handleNavigation('home')} className="flex items-center gap-3 cursor-pointer select-none">
              <div className="h-9 w-9 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="46" fill="#18181b" stroke="#c29943" strokeWidth="4.5" />
                  <line x1="4" y1="50" x2="96" y2="50" stroke="#c29943" strokeWidth="1" opacity="0.2" />
                  <path d="M50 4 C 65 25, 65 75, 50 96 C 35 75, 35 25, 50 4 Z" fill="none" stroke="#c29943" strokeWidth="1.5" opacity="0.35" />
                  <path d="M28 32 L50 72 L72 32" fill="none" stroke="#c29943" strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-widest text-white leading-none">VERIDION</span>
                <span className="text-[8px] font-bold text-[#c29943] tracking-widest uppercase mt-0.5">FINANCIAL SANDBOX</span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              {['home', 'about', 'know-us', 'contact'].map((view) => (
                <button
                  key={view}
                  onClick={() => handleNavigation(view)}
                  className={`text-xs font-bold uppercase tracking-wider transition-colors py-1 ${
                    currentView === view ? 'text-[#c29943] border-b border-[#c29943]' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {view === 'know-us' ? 'Know Us' : view === 'contact' ? 'Contact Us' : view}
                </button>
              ))}
            </nav>

            {/* Auth Block */}
            <div className="hidden md:flex items-center gap-4">
              {!currentSession ? (
                <>
                  <button onClick={() => handleNavigation('login')} className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white px-3 py-2 transition-all">
                    Sign In
                  </button>
                  <button onClick={() => handleNavigation('register')} className="text-xs font-bold uppercase tracking-wider bg-[#c29943] hover:bg-[#aa8032] text-black px-4 py-2.5 rounded-lg transition-all shadow-md">
                    Get Started
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-zinc-400">
                      Inactivity: {securitySettings.lockCounter}s
                    </span>
                  </div>

                  <button
                    onClick={() => handleNavigation('dashboard')}
                    className={`text-xs font-bold uppercase tracking-wider transition-all px-3 py-1.5 rounded-lg flex items-center gap-2 ${
                      currentView === 'dashboard' ? 'bg-[#c29943]/20 text-[#c29943]' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" /> Console
                  </button>

                  <div className="h-4 w-[1px] bg-zinc-800"></div>

                  <button onClick={() => handleNavigation('profile')} className="flex items-center gap-2.5 text-left focus:outline-none group">
                    <div className="h-8 w-8 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-[#c29943] transition-all">
                      <User className="w-4 h-4 text-[#c29943]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-200 leading-none group-hover:text-white">{currentSession.name}</p>
                      <p className="text-[9px] text-[#c29943] tracking-widest uppercase mt-0.5 font-bold">Profile</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu trigger */}
            <div className="flex md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-zinc-400 hover:text-white">
                <Menu className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="border-b border-zinc-900 bg-[#0a0a0c] md:hidden px-4 py-4 space-y-3">
            {['home', 'about', 'know-us', 'contact'].map((view) => (
              <button
                key={view}
                onClick={() => handleNavigation(view)}
                className="block w-full text-left py-2.5 px-3 text-sm font-semibold rounded-lg hover:bg-zinc-900 text-zinc-300"
              >
                {view === 'know-us' ? 'Know Us' : view === 'contact' ? 'Contact Us' : view.toUpperCase()}
              </button>
            ))}
            <div className="border-t border-zinc-900 pt-3">
              {!currentSession ? (
                <div className="space-y-2">
                  <button onClick={() => handleNavigation('login')} className="block w-full text-center py-2.5 text-sm font-bold text-zinc-300 hover:bg-zinc-900 border border-zinc-800 rounded-xl">
                    Sign In
                  </button>
                  <button onClick={() => handleNavigation('register')} className="block w-full text-center py-2.5 text-sm font-bold text-black bg-[#c29943] rounded-xl">
                    Get Started
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button onClick={() => handleNavigation('dashboard')} className="block w-full text-left py-2 px-3 text-sm font-semibold hover:bg-zinc-900 text-white rounded-lg">
                    Console Dashboard
                  </button>
                  <button onClick={() => handleNavigation('profile')} className="block w-full text-left py-2 px-3 text-sm font-semibold hover:bg-zinc-900 text-white rounded-lg">
                    Profile Configuration
                  </button>
                  <button onClick={logout} className="block w-full text-left py-2 px-3 text-sm font-semibold hover:bg-red-950/20 text-red-500 rounded-lg">
                    Revoke Session
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Sections */}
      <main className="flex-grow">

        {}
        {/* VIEW 1: HOME */}
        {currentView === 'home' && (
          <section className="space-y-20 pb-20">
            {/* Hero area */}
            <div className="relative overflow-hidden py-24 sm:py-32 bg-[#121214] border-b border-zinc-900">
              <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-[#c29943]/30 text-[#c29943] text-[10px] font-bold tracking-widest uppercase">
                  <span className="flex h-2 w-2 rounded-full bg-[#c29943] animate-pulse"></span>
                  SECURE DYNAMIC LEDGER PLAYGROUND
                </div>
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
                  Deploy Compliance <span className="text-[#c29943]">Sandbox Engines</span>
                </h1>
                <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                  Analyze payloads and trade currencies within our real-time administrative mock framework. Protect transaction security using client-side inactivity firewalls and dynamic TOTP matrices.
                </p>
                
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <button onClick={() => handleNavigation('login')} className="bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2">
                    <Key className="w-4 h-4" /> Access Portal Dashboard
                  </button>
                  <button onClick={triggerComplaintNavigation} className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2">
                    <LifeBuoy className="w-4 h-4 text-[#c29943]" /> Submit Incident Case
                  </button>
                  <button onClick={simulateDownload} className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2">
                    <DownloadCloud className="w-4 h-4 text-[#c29943]" /> Download App CLI
                  </button>
                </div>
              </div>
              <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#232329_1px,transparent_1px),linear-gradient(to_bottom,#232329_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
            </div>

            {/* Compliance badges section */}
            <div className="bg-[#0e0e11] border-y border-zinc-900 py-6">
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Enterprise Compliance & Regulatory Auditing</p>
                <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 text-zinc-400 text-xs font-mono">
                  <div className="flex items-center gap-2 bg-zinc-900/50 px-4 py-2.5 rounded-xl border border-zinc-800/80">
                    <ShieldCheck className="w-5 h-5 text-[#c29943]" />
                    <span className="font-bold tracking-wider uppercase">SOC 2 TYPE II AUDITED</span>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-900/50 px-4 py-2.5 rounded-xl border border-zinc-800/80">
                    <FileCheck className="w-5 h-5 text-[#c29943]" />
                    <span className="font-bold tracking-wider uppercase">ISO/IEC 27001 SECURED</span>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-900/50 px-4 py-2.5 rounded-xl border border-zinc-800/80">
                    <Fingerprint className="w-5 h-5 text-[#c29943]" />
                    <span className="font-bold tracking-wider uppercase">GDPR CRYPTO ASSURANCE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategic Pillars */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Engineered for absolute session protection</h2>
                <p className="text-zinc-500 text-xs uppercase tracking-widest">Minimal latency, cryptographically compliant components</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#121214] border border-zinc-800/80 p-8 rounded-2xl space-y-4 hover:border-[#c29943]/30 transition-all">
                  <div className="h-10 w-10 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800 text-[#c29943]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base">Dynamic 2FA Handshake</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Verify account actions and control terminal authorization states with time-synced identity validations.
                  </p>
                </div>

                <div className="bg-[#121214] border border-zinc-800/80 p-8 rounded-2xl space-y-4 hover:border-[#c29943]/30 transition-all">
                  <div className="h-10 w-10 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800 text-[#c29943]">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base">Simulated Trade Ledger</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Test payload mechanics and adjust coin balances instantly inside a localized, memory-safe data model.
                  </p>
                </div>

                <div className="bg-[#121214] border border-zinc-800/80 p-8 rounded-2xl space-y-4 hover:border-[#c29943]/30 transition-all">
                  <div className="h-10 w-10 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800 text-[#c29943]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base">Inactivity Shield Guard</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Automatically lock environments and blur tracking indices when system interactions detect prolonged idling.
                  </p>
                </div>
              </div>
            </div>

            {/* News highlights & recent changes */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-900 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Ecosystem Integration Log</h3>
                  <p className="text-xs text-zinc-400">Chronological telemetry audit announcements</p>
                </div>
                <span className="text-xs font-mono text-zinc-500 font-bold uppercase tracking-wider mt-2 sm:mt-0">Node Status: Active</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-[#121214] border border-zinc-800 rounded-2xl space-y-3">
                  <span className="text-[10px] font-mono font-bold text-[#c29943] uppercase tracking-widest">Update #1024 — June 2026</span>
                  <h4 className="font-bold text-white text-sm">Enhanced Client Inactivity Triggers</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Deployed persistent timer listeners checking interface action triggers across all active DOM levels. Standardized auto-lock transitions mapped into user security parameters.
                  </p>
                </div>

                <div className="p-6 bg-[#121214] border border-zinc-800 rounded-2xl space-y-3">
                  <span className="text-[10px] font-mono font-bold text-[#c29943] uppercase tracking-widest">Update #1019 — May 2026</span>
                  <h4 className="font-bold text-white text-sm">Strict 2FA Sandbox Enforcements</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Transitioned authentication pipeline checks to require multi-factor handshake actions on logins when system configuration properties indicate active security policies.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact info support card */}
            <div className="max-w-5xl mx-auto px-4">
              <div className="bg-[#121214] rounded-3xl p-8 sm:p-12 border border-zinc-800/80 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-8 relative overflow-hidden">
                <div className="space-y-4 relative z-10 max-w-lg">
                  <h3 className="text-2xl font-bold text-white">Need administrative assistance?</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Our dynamic engineering desk monitors complaints and platform anomalies continuously. Submit incident logs for rapid diagnostic evaluations.
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs font-mono text-zinc-400 pt-2">
                    <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#c29943]" /> support@veridion.xyz</span>
                    <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#c29943]" /> +1 (555) 234-8761</span>
                  </div>
                </div>
                <button
                  onClick={() => handleNavigation('contact')}
                  className="bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 flex-shrink-0 relative z-10"
                >
                  Contact Help Desk <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* VIEW 2: ABOUT */}
        {currentView === 'about' && (
          <section className="py-16 max-w-4xl mx-auto px-6 space-y-12">
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-extrabold text-white">Corporate Architecture</h1>
              <p className="text-xs text-[#c29943] font-bold tracking-widest uppercase">DISCOVER OUR MISSION AND CORE INFRASTRUCTURE</p>
            </div>

            <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-zinc-850 pb-4">
                <Info className="w-6 h-6 text-[#c29943]" />
                <h3 className="text-lg font-bold text-white">Architecture Overview</h3>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Veridion is designed to evaluate, test, and authenticate cryptographic payloads in high-throughput database ecosystems. Our tools allow system coordinators to trace data streams without deployment vulnerability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#121214] border border-zinc-800 p-6 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Target className="w-4.5 h-4.5 text-[#c29943]" />
                  <span>Our Mission</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Simplify integration checks through reliable APIs and secure testing structures. We verify operational flows to maintain standards consistency.
                </p>
              </div>

              <div className="bg-[#121214] border border-zinc-800 p-6 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Eye className="w-4.5 h-4.5 text-[#c29943]" />
                  <span>Our Vision</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  To provide the standard testing framework for financial payload validations, keeping system safety the core priority.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white text-center uppercase tracking-wider">Our Core Pillars</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-xl text-center space-y-3">
                  <Lightbulb className="w-6 h-6 text-[#c29943] mx-auto" />
                  <h4 className="font-bold text-white text-sm">Innovation</h4>
                  <p className="text-[11px] text-zinc-400">Streamlining high-frequency checks with reliable state operations.</p>
                </div>

                <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-xl text-center space-y-3">
                  <Feather className="w-6 h-6 text-[#c29943] mx-auto" />
                  <h4 className="font-bold text-white text-sm">Simplicity</h4>
                  <p className="text-[11px] text-zinc-400">Making complex system monitoring straightforward and readable.</p>
                </div>

                <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-xl text-center space-y-3">
                  <ServerCrash className="w-6 h-6 text-[#c29943] mx-auto" />
                  <h4 className="font-bold text-white text-sm">Reliability</h4>
                  <p className="text-[11px] text-zinc-400">Mitigating integration hazards via robust local safety modules.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* VIEW 3: KNOW US */}
        {currentView === 'know-us' && (
          <section className="py-16 max-w-5xl mx-auto px-6 space-y-16">
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-extrabold text-white">Meet Veridion</h1>
              <p className="text-xs text-[#c29943] font-bold tracking-widest uppercase font-mono">The software engineering team behind the platform</p>
            </div>

            <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-8 sm:p-12 space-y-6 text-center sm:text-left">
              <h3 className="text-xl font-bold text-white">Who We Are</h3>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
                We are a distributed software team focused on designing transaction tracking tools. By pairing secure standards with complete event logs, we enable administrators to manage systems safely.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {['Dynamic Core Team', 'Telemetry Focused', 'Assurance Obsessed'].map((lbl, idx) => (
                  <span key={idx} className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                    {lbl}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-lg font-bold text-white text-center uppercase tracking-widest">Leadership Spotlight</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Object.keys(LEADERSHIP_DATA).map((key) => {
                  const m = LEADERSHIP_DATA[key];
                  return (
                    <div
                      key={key}
                      onClick={() => setActiveModalMember(key)}
                      className="bg-[#121214] border border-zinc-800/80 rounded-2xl p-6 hover:border-[#c29943] transition-all cursor-pointer flex flex-col justify-between group h-full space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="h-12 w-12 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-[#c29943]">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white group-hover:text-[#c29943] transition-all">{m.name}</h4>
                          <p className="text-[10px] text-[#c29943] font-bold tracking-wider uppercase mt-1">{m.role}</p>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {m.bio}
                        </p>
                      </div>
                      <span className="text-xs text-[#c29943] font-bold uppercase tracking-wider flex items-center gap-1">
                        View Profile <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {}
        {/* VIEW 4: CONTACT / SUPPORT PORTAL */}
        {currentView === 'contact' && (
          <section className="py-16 max-w-6xl mx-auto px-6 space-y-12">
            <div className="text-center space-y-3">
              <span className="bg-zinc-900 text-[#c29943] border border-[#c29943]/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                Support Node Desk
              </span>
              <h1 className="text-3xl font-extrabold text-white">Secure Incident Portal</h1>
              <p className="text-xs text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Log regulatory complaints, submit logs for system verification, or track ticket statuses under active databases.
              </p>
            </div>

            {/* Support navigation toggle buttons */}
            <div className="flex justify-center gap-3 border-b border-zinc-900 pb-6">
              <button
                onClick={() => setSupportMode('form')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  supportMode === 'form' ? 'bg-[#c29943] text-black' : 'bg-zinc-900 text-zinc-300'
                }`}
              >
                <PlusCircle className="w-4 h-4" /> Submit Case Payload
              </button>
              <button
                onClick={() => setSupportMode('tracker')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  supportMode === 'tracker' ? 'bg-[#c29943] text-black' : 'bg-zinc-900 text-zinc-300'
                }`}
              >
                <Search className="w-4 h-4" /> Track Incident Status
              </button>
            </div>

            {supportMode === 'form' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Form container */}
                <div className="lg:col-span-2 bg-[#121214] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
                  <h3 className="text-lg font-bold text-white">Record Incident</h3>

                  <form onSubmit={handleComplaintSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2">Registered Identity</label>
                        <input
                          type="text"
                          required
                          value={complaintForm.name}
                          onChange={(e) => setComplaintForm({ ...complaintForm, name: e.target.value })}
                          placeholder="Jane Doe"
                          className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2">Communications Email</label>
                        <input
                          type="email"
                          required
                          value={complaintForm.email}
                          onChange={(e) => setComplaintForm({ ...complaintForm, email: e.target.value })}
                          placeholder="name@domain.com"
                          className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2">Issue Classification</label>
                        <select
                          required
                          value={complaintForm.category}
                          onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
                          className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943] bg-[#0a0a0c]"
                        >
                          <option value="" disabled>Select category...</option>
                          <option value="Transaction issues">Transaction issues (Delays, swaps, ledger balance)</option>
                          <option value="Account access problems">Account access problems (Login lockouts, 2FA errors)</option>
                          <option value="App bugs">App bugs (Simulation, UI state, terminal issues)</option>
                          <option value="Payment/deposit issues">Payment/deposit issues (Mock cash pool, settlements)</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2">Ticket Subject Line</label>
                        <input
                          type="text"
                          required
                          value={complaintForm.subject}
                          onChange={(e) => setComplaintForm({ ...complaintForm, subject: e.target.value })}
                          placeholder="Brief summary of the challenge"
                          className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 relative">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider">Regulated Narrative</label>
                        <button
                          type="button"
                          onClick={polishComplaintText}
                          className="bg-zinc-900 hover:bg-zinc-800 text-[#c29943] border border-[#c29943]/20 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
                        >
                          Polish with AI
                        </button>
                      </div>
                      <textarea
                        required
                        rows="5"
                        value={complaintForm.message}
                        onChange={(e) => setComplaintForm({ ...complaintForm, message: e.target.value })}
                        placeholder="Provide deep details of your challenge or complaint..."
                        className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943] resize-none"
                      />
                      {aiPolishLoading && (
                        <div className="absolute inset-0 bg-[#0a0a0c]/80 rounded-xl flex flex-col items-center justify-center gap-2">
                          <RefreshCw className="w-6 h-6 text-[#c29943] animate-spin" />
                          <span className="text-xs font-mono font-bold text-zinc-300">Evaluating telemetry via Gemini...</span>
                        </div>
                      )}
                    </div>

                    {/* Drag and Drop File Attachments Zone */}
                    <div className="space-y-3">
                      <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider">Diagnostic Attachments</label>
                      <div className="border-2 border-dashed border-zinc-800 hover:border-[#c29943]/30 bg-zinc-950/40 hover:bg-zinc-950 transition-all rounded-2xl p-6 text-center cursor-pointer relative">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="space-y-2 pointer-events-none">
                          <UploadCloud className="w-8 h-8 text-[#c29943] mx-auto" />
                          <p className="text-xs font-bold text-zinc-300">Drag & drop files or click to upload</p>
                          <p className="text-[10px] text-zinc-500">Supported formats: PDF, PNG, JPG, JSON (Max 5MB each)</p>
                        </div>
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {uploadedFiles.map((file, idx) => (
                            <span key={idx} className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-850 px-3 py-1 rounded-lg text-xs font-mono text-zinc-300">
                              <Paperclip className="w-3.5 h-3.5 text-[#c29943]" />
                              <span>{file}</span>
                              <button type="button" onClick={() => removeAttachment(idx)} className="text-zinc-500 hover:text-red-400">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 bg-zinc-950/40 p-4 rounded-xl border border-zinc-900">
                      <input
                        id="notifToggle"
                        type="checkbox"
                        checked={complaintForm.enableNotifications}
                        onChange={(e) => setComplaintForm({ ...complaintForm, enableNotifications: e.target.checked })}
                        className="h-4 w-4 rounded border-zinc-800 text-[#c29943] bg-zinc-950 focus:ring-0"
                      />
                      <label htmlFor="notifToggle" className="text-xs text-zinc-400 select-none cursor-pointer">
                        Enable automated communications telemetry regarding updates of this incident.
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" /> Commit Case Payload
                    </button>
                  </form>
                </div>

                {/* Sidebar details */}
                <div className="space-y-6">
                  <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl space-y-4">
                    <h4 className="font-bold text-white text-sm">Regulatory Policies</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Incident workflows operate inside our certified SOC 2 playground context. Logs will mock standard response protocols.
                    </p>
                    <div className="space-y-2 text-[11px] text-zinc-400 font-mono">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#c29943]" />
                        <span>SLA: Updates in 120 minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#c29943]" />
                        <span>Communications secure endpoint</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
                    <h4 className="font-bold text-white text-xs uppercase tracking-widest text-[#c29943]">Dynamic Search</h4>
                    <p className="text-xs text-zinc-400">
                      Look up existing security tickets dynamically to check logs.
                    </p>
                    <button
                      onClick={() => setSupportMode('tracker')}
                      className="w-full bg-[#c29943] hover:bg-[#aa8032] text-black font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all"
                    >
                      Track Incident Status
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-8">
                {/* Tracker Search Box */}
                <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
                  <h3 className="text-lg font-bold text-white">Track Ticket</h3>
                  <form onSubmit={handleTicketSearch} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      required
                      value={searchTicketId}
                      onChange={(e) => setSearchTicketId(e.target.value)}
                      placeholder="e.g. VRD-TKT-1082"
                      className="flex-grow rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-[#c29943] uppercase"
                    />
                    <button type="submit" className="bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                      <Search className="w-4 h-4" /> Trace Logs
                    </button>
                  </form>
                  <p className="text-xs text-zinc-500 font-mono text-center">
                    Active Demo Codes: <span onClick={() => setSearchTicketId("VRD-TKT-1082")} className="text-[#c29943] font-bold hover:underline cursor-pointer">VRD-TKT-1082</span> or <span onClick={() => setSearchTicketId("VRD-TKT-0941")} className="text-[#c29943] font-bold hover:underline cursor-pointer">VRD-TKT-0941</span>
                  </p>
                </div>

                {/* Display ticket results */}
                {searchedTicketResult ? (
                  <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-zinc-500">{searchedTicketResult.id}</span>
                          <span className={`px-2 py-0.5 text-[9px] font-bold border rounded uppercase ${
                            searchedTicketResult.status === 'RESOLVED' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/50' : 'bg-amber-950/20 text-amber-400 border-amber-900/50'
                          }`}>
                            {searchedTicketResult.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-sm mt-1">{searchedTicketResult.subject}</h4>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">{searchedTicketResult.date}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Description Narrative</span>
                      <p className="text-xs text-zinc-300 bg-zinc-950 p-4 rounded-xl border border-zinc-850 leading-relaxed">
                        {searchedTicketResult.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Analyst Log Entries</span>
                      <div className="space-y-3">
                        {searchedTicketResult.responses.map((resp, idx) => (
                          <div key={idx} className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="font-bold text-white uppercase tracking-wider">{resp.sender}</span>
                              <span className="font-mono text-zinc-500">{resp.date}</span>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed">{resp.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : searchTicketId && (
                  <div className="bg-red-950/10 border border-red-900/30 rounded-3xl p-8 text-center space-y-2">
                    <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
                    <h4 className="font-bold text-white text-sm">Database Sync Mismatch</h4>
                    <p className="text-xs text-red-400">Incident coordinate verification signature was not discovered in directory.</p>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* VIEW 5: LOGIN */}
        {currentView === 'login' && (
          <section className="py-20 max-w-md mx-auto px-4">
            <div className="bg-[#121214] border border-zinc-800 rounded-3xl shadow-2xl p-8 sm:p-10 space-y-6">
              
              {!tempLoginStore ? (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-white">Sign In to Sandbox</h2>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      Credentials Match Code:<br />
                      <strong className="font-mono text-[#c29943] bg-zinc-950 px-2 py-0.5 rounded">user@example.com / password123</strong>
                    </p>
                  </div>

                  <form onSubmit={handleLoginNextStep} className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Email Address</label>
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="name@domain.com"
                        className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="block text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Password</label>
                        <button type="button" onClick={() => setCurrentView('forgot')} className="text-[10px] text-[#c29943] hover:underline font-bold">Forgot Password?</button>
                      </div>
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                      />
                    </div>

                    <button type="submit" className="w-full bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                      <span>Authorize Handshake</span> <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="inline-flex p-3 rounded-full bg-zinc-950 text-[#c29943] border border-zinc-850 mb-2">
                      <ShieldCheck className="w-6 h-6 animate-pulse" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-white">MFA Handshake Code</h2>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      TOTP challenge required. Input simulated passcode:<br />
                      <strong className="font-mono text-[#c29943] bg-zinc-950 px-2 py-0.5 rounded">123456</strong>
                    </p>
                  </div>

                  <form onSubmit={handleLoginFinalSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase text-zinc-400 tracking-widest text-center">Verification Code</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={loginToken2FA}
                        onChange={(e) => setLoginToken2FA(e.target.value)}
                        placeholder="000000"
                        className="w-full text-center font-mono tracking-widest text-lg rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                      />
                    </div>

                    <button type="submit" className="w-full bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                      <CheckSquare className="w-4 h-4" /> Match MFA Parameters
                    </button>
                    <button type="button" onClick={() => setTempLoginStore(null)} className="w-full text-zinc-500 hover:text-zinc-300 text-xs font-semibold">
                      Cancel Checkpoint
                    </button>
                  </form>
                </div>
              )}

              <div className="border-t border-zinc-850 pt-4 text-center">
                <p className="text-xs text-zinc-400">
                  New client registration?{' '}
                  <button onClick={() => setCurrentView('register')} className="text-[#c29943] font-bold hover:underline">Register Account</button>
                </p>
              </div>
            </div>
          </section>
        )}

        {/* VIEW 6: REGISTER */}
        {currentView === 'register' && (
          <section className="py-20 max-w-md mx-auto px-4">
            <div className="bg-[#121214] border border-zinc-800 rounded-3xl shadow-2xl p-8 sm:p-10 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-white">Create Account</h2>
                <p className="text-xs text-zinc-400">Establish cryptographic parameters for sandbox execution</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Email Coordinate</label>
                  <input
                    type="email"
                    required
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Password Parameters</label>
                  <input
                    type="password"
                    required
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Confirm Password Parameters</label>
                  <input
                    type="password"
                    required
                    value={registerForm.confirm}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirm: e.target.value })}
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                  />
                </div>

                <button type="submit" className="w-full bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all">
                  Initialize Client Profile
                </button>
              </form>

              <div className="border-t border-zinc-850 pt-4 text-center">
                <p className="text-xs text-zinc-400">
                  Already mapped account?{' '}
                  <button onClick={() => setCurrentView('login')} className="text-[#c29943] font-bold hover:underline">Sign In</button>
                </p>
              </div>
            </div>
          </section>
        )}

        {/* VIEW 7: FORGOT */}
        {currentView === 'forgot' && (
          <section className="py-20 max-w-md mx-auto px-4">
            <div className="bg-[#121214] border border-zinc-800 rounded-3xl shadow-2xl p-8 sm:p-10 space-y-6">
              
              {forgotStep === 'request' ? (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-white">Reset Credentials</h2>
                    <p className="text-xs text-zinc-400">Verify user coordination directory index to dispatch reset keys.</p>
                  </div>

                  <form onSubmit={handleForgotRequest} className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Email Address</label>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="name@domain.com"
                        className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                      />
                    </div>
                    <button type="submit" className="w-full bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all">
                      Dispatch Authorization Keys
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="inline-flex h-12 w-12 bg-zinc-950 border border-zinc-850 rounded-xl items-center justify-center text-[#c29943]">
                      <Key className="w-5 h-5 animate-pulse" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Override System Keys</h2>
                    <p className="text-[11px] text-zinc-400">
                      Reset token dispatched. Enter token code:<br />
                      <strong className="font-mono text-[#c29943] bg-zinc-950 px-2 py-0.5 rounded">VRD-777</strong>
                    </p>
                  </div>

                  <form onSubmit={handleForgotComplete} className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Override Token</label>
                      <input
                        type="text"
                        required
                        value={forgotTokenInput}
                        onChange={(e) => setForgotTokenInput(e.target.value)}
                        placeholder="VRD-777"
                        className="w-full text-center font-mono rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase text-zinc-400 tracking-wider">New Password Parameters</label>
                      <input
                        type="password"
                        required
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                      />
                    </div>

                    <button type="submit" className="w-full bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all">
                      Override Secrets Mappings
                    </button>
                  </form>
                </div>
              )}

              <div className="text-center">
                <button onClick={() => { setForgotStep('request'); setCurrentView('login'); }} className="text-xs text-zinc-400 hover:text-white transition-all underline">
                  Back to Security Entrance
                </button>
              </div>
            </div>
          </section>
        )}

        {/* VIEW 8: USER PROFILE */}
        {currentView === 'profile' && currentSession && (
          <section className="py-16 max-w-4xl mx-auto px-6 space-y-8">
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentView('dashboard')} className="p-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-750 text-zinc-400 hover:text-white rounded-xl transition-all">
                <X className="w-4 h-4" />
              </button>
              <div>
                <h1 class="text-2xl font-bold text-white leading-none">Security Mappings & Credentials</h1>
                <p className="text-xs text-zinc-400 mt-1">Manage corporate identity profiles and authentication keys</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="bg-[#121214] border border-zinc-800 p-6 rounded-2xl flex flex-col items-center text-center space-y-4 shadow-xl h-fit">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-zinc-950 border-2 border-zinc-850 flex items-center justify-center">
                    <User className="w-12 h-12 text-[#c29943]" />
                  </div>
                  <button onClick={() => showToast("Diagnostic: Profile assets modification locked in sandbox.", "info")} className="absolute bottom-0 right-0 p-2 bg-[#c29943] text-black rounded-full hover:bg-[#aa8032] transition-all">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base">{currentSession.name}</h3>
                  <p className="text-xs font-mono text-zinc-400">{currentSession.email}</p>
                </div>

                <div className="w-full border-t border-zinc-850 my-2"></div>

                <div className="w-full text-left space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Security Index</span>
                    <span className="bg-emerald-950/20 text-emerald-400 border border-emerald-900/50 px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold">VERIFIED COHERENT</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Node Activation</span>
                    <span className="font-mono text-zinc-300 font-bold">{currentSession.createdDate}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Session UUID</span>
                    <span className="font-mono text-zinc-300 select-all truncate max-w-[110px] font-bold">{currentSession.uuid}</span>
                  </div>
                </div>

                <button onClick={logout} className="w-full bg-red-950/20 text-red-400 border border-red-900/40 hover:bg-red-950/40 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5">
                  <LogOut className="w-4 h-4" /> Revoke Session Credentials
                </button>
              </div>

              {/* Security update forms */}
              <div className="md:col-span-2 space-y-8">
                {/* Meta details */}
                <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#c29943]">Credentials Parameters</h3>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider">Full Identity Name</label>
                      <input
                        type="text"
                        required
                        value={profileNameInput}
                        onChange={(e) => setProfileNameInput(e.target.value)}
                        className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase text-zinc-500 tracking-wider">Email Address coordinate (ReadOnly)</label>
                      <input
                        type="email"
                        disabled
                        value={currentSession.email}
                        className="w-full rounded-xl bg-zinc-950/50 border border-zinc-850 px-4 py-3 text-sm text-zinc-500 font-mono cursor-not-allowed"
                      />
                    </div>
                    <button type="submit" className="bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all">
                      Save Mapped Data
                    </button>
                  </form>
                </div>

                {/* Password rotater */}
                <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#c29943]">Rotate Secret Signatures</h3>
                  <form onSubmit={handlePasswordRotate} className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider">Active Password</label>
                      <input
                        type="password"
                        required
                        value={profileCurrentPassword}
                        onChange={(e) => setProfileCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider">New Password Parameters</label>
                      <input
                        type="password"
                        required
                        value={profileNewPassword}
                        onChange={(e) => setProfileNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                      />
                    </div>
                    <button type="submit" className="bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all">
                      Commit Secret Updates
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* VIEW 9: AUTHORIZED CONSOLE HUB */}
        {currentView === 'dashboard' && currentSession && (
          <section className="bg-[#0e0e11] flex flex-col md:flex-row h-full">
            
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-[#121214] border-b md:border-b-0 md:border-r border-zinc-900 flex flex-col p-4 space-y-2">
              <div className="p-3 border-b border-zinc-850 hidden md:block">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Security Control</span>
              </div>
              
              <button
                onClick={() => setDashboardTab('assets')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                  dashboardTab === 'assets' ? 'bg-[#c29943]/20 text-[#c29943]' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Wallet className="w-4.5 h-4.5" /> Portfolio Deck
              </button>

              <button
                onClick={() => setDashboardTab('swap')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                  dashboardTab === 'swap' ? 'bg-[#c29943]/20 text-[#c29943]' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <TrendingUp className="w-4.5 h-4.5" /> Trade Desk
              </button>

              <button
                onClick={() => setDashboardTab('security')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                  dashboardTab === 'security' ? 'bg-[#c29943]/20 text-[#c29943]' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <ShieldCheck className="w-4.5 h-4.5" /> Security Center
              </button>

              <button
                onClick={() => setDashboardTab('support')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                  dashboardTab === 'support' ? 'bg-[#c29943]/20 text-[#c29943]' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <LifeBuoy className="w-4.5 h-4.5" /> Support Desk
              </button>

              <div className="flex-grow hidden md:block"></div>

              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-950/20 transition-all text-left">
                <LogOut className="w-4.5 h-4.5" /> Revoke Session
              </button>
            </aside>

            {/* Dashboard Subviews panel */}
            <div className="flex-grow p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
              
              {/* Header inside dashboard */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
                <div>
                  <span className="px-2.5 py-1 text-[9px] font-bold font-mono tracking-widest text-[#c29943] bg-zinc-900 border border-zinc-800 rounded-lg uppercase">
                    {dashboardTab === 'assets' ? 'PORTFOLIO DECK' : dashboardTab === 'swap' ? 'TRADE DESK' : dashboardTab === 'security' ? 'SECURITY CENTER' : 'SUPPORT DESK'}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2">
                    Compliant Sandbox Environment
                  </h1>
                  <p className="text-xs text-zinc-450 mt-1">Inspecting authenticated transactions, cryptographic variables, and user devices.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={handleManualTickerSync} className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-750 text-xs font-bold uppercase tracking-wider text-zinc-300 rounded-xl transition-all flex items-center gap-2 shadow-sm">
                    <RefreshCw className="w-4 h-4 text-[#c29943]" /> Synchronize Ledger Nodes
                  </button>
                </div>
              </div>

              {/* SUB-VIEW 1: PORTFOLIO & LEDGER LOGS */}
              {dashboardTab === 'assets' && (
                <div className="space-y-8">
                  {/* Ledger Balance Widgets */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-[#121214] border border-zinc-800/80 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                      <div className="flex items-center justify-between text-zinc-400">
                        <span className="text-[10px] font-bold uppercase tracking-wider">NET AGGREGATE WORTH</span>
                        <Banknote className="w-4 h-4 text-[#c29943]" />
                      </div>
                      <div className="mt-4 space-y-1">
                        <p className="text-2xl font-black tracking-tight text-white">${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="text-[9px] text-[#c29943] font-bold tracking-widest uppercase flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span> Real-time active indices
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#121214] border border-zinc-800/80 p-5 rounded-2xl">
                      <div className="flex items-center justify-between text-zinc-400 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider">BITCOIN (BTC)</span>
                        <span className="text-[10px] font-mono text-[#c29943] font-bold">${prices.BTC.toLocaleString()}</span>
                      </div>
                      <p className="text-xl font-bold text-white">{balances.BTC.toFixed(4)} BTC</p>
                      <p className="text-[10px] text-zinc-500 mt-1 font-mono">${btcUSDVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</p>
                    </div>

                    <div className="bg-[#121214] border border-zinc-800/80 p-5 rounded-2xl">
                      <div className="flex items-center justify-between text-zinc-400 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider">ETHEREUM (ETH)</span>
                        <span className="text-[10px] font-mono text-[#c29943] font-bold">${prices.ETH.toLocaleString()}</span>
                      </div>
                      <p className="text-xl font-bold text-white">{balances.ETH.toFixed(4)} ETH</p>
                      <p className="text-[10px] text-zinc-500 mt-1 font-mono">${ethUSDVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</p>
                    </div>

                    <div className="bg-[#121214] border border-zinc-800/80 p-5 rounded-2xl">
                      <div className="flex items-center justify-between text-zinc-400 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider">VERIDION COIN (VRD)</span>
                        <span className="text-[10px] font-mono text-[#c29943] font-bold">${prices.VRD.toLocaleString()}</span>
                      </div>
                      <p className="text-xl font-bold text-white">{balances.VRD.toFixed(2)} VRD</p>
                      <p className="text-[10px] text-zinc-500 mt-1 font-mono">${vrdUSDVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</p>
                    </div>
                  </div>

                  {/* Transaction Logs Table */}
                  <div className="bg-[#121214] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="px-6 py-4 border-b border-zinc-850 flex items-center justify-between">
                      <h3 className="font-bold text-white text-xs uppercase tracking-widest">Recent Sandbox Operations Logs</h3>
                      <span className="bg-zinc-950 text-[#c29943] border border-[#c29943]/20 px-2 py-0.5 rounded text-[9px] font-bold font-mono">LEDGER DESK ONLINE</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[700px] text-left border-collapse text-xs text-zinc-400">
                        <thead className="bg-zinc-950/60 font-mono tracking-wider text-zinc-500 uppercase border-b border-zinc-850">
                          <tr>
                            <th className="px-6 py-3.5 font-bold">Operation Code</th>
                            <th className="px-6 py-3.5 font-bold">Execution Date</th>
                            <th className="px-6 py-3.5 font-bold">Operational Action</th>
                            <th className="px-6 py-3.5 font-bold">Asset Flow Coordinates</th>
                            <th className="px-6 py-3.5 font-bold">Dynamic Hash Signature</th>
                            <th className="px-6 py-3.5 font-bold">MFA Verification Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-850">
                          {transactions.map((tx, idx) => (
                            <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
                              <td className="px-6 py-4 font-mono font-bold text-white">{tx.id}</td>
                              <td className="px-6 py-4 font-mono text-zinc-500">{tx.date}</td>
                              <td className="px-6 py-4 font-bold text-white">{tx.action}</td>
                              <td className="px-6 py-4 font-mono text-zinc-300">{tx.flow}</td>
                              <td className="px-6 py-4 font-mono text-zinc-500">{tx.hash}</td>
                              <td className="px-6 py-4">
                                <span className="bg-emerald-950/20 text-emerald-400 border border-emerald-900/50 px-2 py-0.5 rounded font-mono text-[9px] font-bold">
                                  {tx.verification}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-VIEW 2: QUICK SWAP TERMINAL */}
              {dashboardTab === 'swap' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Exchange controls */}
                  <div className="lg:col-span-2 bg-[#121214] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-white">Execute Sandbox Exchange</h3>
                      <p className="text-xs text-zinc-400 mt-1">Configure asset volume, calculate instant costs, and confirm transaction logs.</p>
                    </div>

                    <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-[#c29943]/10 border border-[#c29943]/20 text-[#c29943] rounded-xl flex items-center justify-center font-bold">
                          $
                        </div>
                        <div>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Simulated Cash Pool (USD)</p>
                          <p className="text-base font-black text-zinc-200 leading-tight">${balances.USD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                      <button onClick={replenishUSD} className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all uppercase tracking-wider">
                        Load Mock cash
                      </button>
                    </div>

                    <form onSubmit={executeTrade} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider">Target Asset</label>
                          <select
                            value={tradeAsset}
                            onChange={(e) => setTradeAsset(e.target.value)}
                            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#c29943] bg-[#0a0a0c] font-bold"
                          >
                            <option value="BTC">Bitcoin (BTC)</option>
                            <option value="ETH">Ethereum (ETH)</option>
                            <option value="VRD">Veridion Coin (VRD)</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider">Trade Action</label>
                          <select
                            value={tradeAction}
                            onChange={(e) => setTradeAction(e.target.value)}
                            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#c29943] bg-[#0a0a0c] font-bold"
                          >
                            <option value="BUY">BUY (Deduct USD cash)</option>
                            <option value="SELL">SELL (Credit USD cash)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider">Asset Amount</label>
                          <button
                            type="button"
                            onClick={() => {
                              if (tradeAction === 'BUY') {
                                setTradeVolume((balances.USD / prices[tradeAsset]).toFixed(6));
                              } else {
                                setTradeVolume(balances[tradeAsset].toString());
                              }
                            }}
                            className="text-[10px] text-[#c29943] font-bold hover:underline"
                          >
                            Use Maximum Limit
                          </button>
                        </div>
                        <input
                          type="number"
                          step="any"
                          required
                          value={tradeVolume}
                          onChange={(e) => setTradeVolume(e.target.value)}
                          placeholder="0.00"
                          className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                        />
                      </div>

                      <div className="bg-zinc-950/60 p-4 border border-zinc-900 rounded-xl space-y-2 text-xs text-zinc-455 font-mono">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Current Index rate</span>
                          <span className="font-bold text-white">${prices[tradeAsset].toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Estimated Slippage</span>
                          <span className="font-bold text-emerald-400">0.05%</span>
                        </div>
                        <div className="border-t border-zinc-850 pt-2 flex justify-between text-sm font-bold">
                          <span className="text-zinc-400">Estimated aggregate Settlement</span>
                          <span className="text-[#c29943] font-bold">
                            ${((parseFloat(tradeVolume) || 0) * prices[tradeAsset]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                          </span>
                        </div>
                      </div>

                      <button type="submit" className="w-full bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md">
                        <Zap className="w-4 h-4" /> Commit Settlement Handshake
                      </button>
                    </form>
                  </div>

                  {/* Market indicators aside */}
                  <div className="space-y-6">
                    <div className="bg-[#121214] border border-zinc-800 p-6 rounded-3xl space-y-4">
                      <h4 className="font-bold text-white text-xs uppercase tracking-widest text-[#c29943]">Live Indices Tickers</h4>
                      <div className="space-y-3 font-mono text-xs">
                        <div className="flex justify-between items-center pb-2 border-b border-zinc-850">
                          <span className="text-zinc-400">BTC / USD</span>
                          <span className="font-bold text-white">${prices.BTC.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-zinc-850">
                          <span className="text-zinc-400">ETH / USD</span>
                          <span className="font-bold text-white">${prices.ETH.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">VRD / USD</span>
                          <span className="font-bold text-[#c29943]">${prices.VRD.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl space-y-3 text-xs leading-relaxed text-zinc-400">
                      <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Settlement Matrix Rules</h4>
                      <p>
                        Assets exchanges execute directly into temporary local storage arrays. Recalculation ticks refresh telemetry every 12 seconds to emulate dynamic market fluctuation structures.
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {}
              {/* SUB-VIEW 3: SECURITY CENTER */}
              {dashboardTab === 'security' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Security configurations */}
                  <div className="lg:col-span-2 bg-[#121214] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-white">Advanced Security Coordinates</h3>
                      <p className="text-xs text-zinc-400 mt-1">Configure MFA state limits, inactivity firewalls, and review verified system sessions.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Multi-Factor Token (2FA)</h4>
                          <p className="text-[10px] text-zinc-500 mt-1 font-mono">Simulated Key: 123456</p>
                        </div>
                        <button
                          onClick={() => {
                            setSecuritySettings(prev => {
                              const toggled = !prev.is2faEnabled;
                              showToast(`Dual factor authentication check ${toggled ? 'enforced' : 'deactivated'}.`, "info");
                              addSecurityAuditLog(`MFA Handshake policy status updated to: ${toggled ? 'ACTIVE' : 'INACTIVE'}`, "SUCCESS");
                              return { ...prev, is2faEnabled: toggled };
                            });
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all ${
                            securitySettings.is2faEnabled ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/50' : 'bg-amber-950/30 text-amber-400 border border-amber-900/50'
                          }`}
                        >
                          {securitySettings.is2faEnabled ? '2FA ACTIVE' : '2FA DISABLED'}
                        </button>
                      </div>

                      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex flex-col justify-between space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Inactivity Auto-Lock</h4>
                          <Clock className="w-4.5 h-4.5 text-zinc-500" />
                        </div>
                        <select
                          value={securitySettings.lockTimeout}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setSecuritySettings(prev => ({ ...prev, lockTimeout: val, lockCounter: val }));
                            showToast(`Inactivity schedule updated to: ${val}s`, "success");
                            addSecurityAuditLog(`Inactivity timeout changed to: ${val} seconds`, "SUCCESS");
                          }}
                          className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none"
                        >
                          <option value={15}>15 Seconds (Debug)</option>
                          <option value={30}>30 Seconds</option>
                          <option value={60}>60 Seconds (Standard)</option>
                          <option value={180}>3 Minutes</option>
                          <option value={300}>5 Minutes</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-white uppercase tracking-widest text-zinc-500">Active System Devices</h4>
                      <div className="border border-zinc-850 rounded-xl divide-y divide-zinc-850 overflow-hidden bg-zinc-950/30">
                        {activeDevices.map((dev) => (
                          <div key={dev.id} className="p-4 flex items-center justify-between text-xs hover:bg-zinc-900/20 transition-all">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-zinc-900 rounded-lg text-[#c29943]">
                                {dev.status === "Primary" ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-white">{dev.name}</p>
                                  <span className="font-mono text-[10px] text-zinc-500">{dev.ip}</span>
                                </div>
                                <p className="text-[10px] text-zinc-450 mt-0.5">{dev.location} — {dev.timestamp}</p>
                              </div>
                            </div>
                            
                            {dev.status !== "Primary" ? (
                              <button
                                onClick={() => {
                                  setActiveDevices(prev => prev.filter(d => d.id !== dev.id));
                                  showToast(`Session code signature ${dev.id} successfully revoked.`, "success");
                                  addSecurityAuditLog(`Revoked secure access signature of device: ${dev.id}`, "SUCCESS");
                                }}
                                className="bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/40 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all"
                              >
                                Revoke Session
                              </button>
                            ) : (
                              <span className="bg-emerald-950/30 text-emerald-400 border border-emerald-900/50 px-2 py-1 rounded-lg text-[9px] font-mono font-bold">PRIMARY ACTIVE</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Audit details tracker */}
                  <div className="bg-[#121214] border border-zinc-800 p-6 rounded-3xl space-y-4 h-fit">
                    <h4 className="font-bold text-white text-xs uppercase tracking-widest text-[#c29943]">Audit Logs Ledger</h4>
                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                      {securityLogs.map((log, idx) => (
                        <div key={idx} className="flex justify-between items-start text-xs border-b border-zinc-850 pb-3 gap-2">
                          <div className="space-y-0.5">
                            <p className="font-bold text-zinc-200">{log.action}</p>
                            <p className="text-[9px] text-zinc-500 font-mono">{log.date}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                            log.status === 'SUCCESS' ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/40' : 'bg-red-950/20 text-red-400 border border-red-900/40'
                          }`}>
                            {log.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* SUB-VIEW 4: PREVIOUS COMPLAINTS / SECURITY TICKETS */}
              {dashboardTab === 'support' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Previous incidents tracking */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-white">Previous Incident History</h3>
                        <p className="text-xs text-zinc-400 mt-0.5">Monitor and query previously lodged compliance tickets.</p>
                      </div>
                      <button
                        onClick={() => handleNavigation('contact')}
                        className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all flex items-center gap-1"
                      >
                        <PlusCircle className="w-4 h-4 text-[#c29943]" /> New Ticket
                      </button>
                    </div>

                    <div className="space-y-4">
                      {tickets.map((t) => (
                        <div key={t.id} className="bg-[#121214] border border-zinc-800 p-5 rounded-2xl hover:border-zinc-700 transition-all space-y-3">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-[#c29943]">{t.id}</span>
                                <span className={`px-2 py-0.5 text-[9px] font-bold border rounded uppercase ${
                                  t.status === 'RESOLVED' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/50' : 'bg-amber-950/20 text-amber-400 border-amber-900/50'
                                }`}>
                                  {t.status}
                                </span>
                              </div>
                              <h4 className="font-bold text-white text-sm mt-1">{t.subject}</h4>
                            </div>
                            <button
                              onClick={() => {
                                setSupportMode('tracker');
                                setSearchTicketId(t.id);
                                setSearchedTicketResult(t);
                                handleNavigation('contact');
                              }}
                              className="text-xs font-bold text-[#c29943] hover:underline"
                            >
                              Track Detail
                            </button>
                          </div>
                          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{t.description}</p>
                          <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono pt-2 border-t border-zinc-850">
                            <span>Diagnostic attachments: {t.attachments.length}</span>
                            <span>SLA Status: Compliant</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Incident desk widgets */}
                  <div className="space-y-6">
                    <div className="bg-[#121214] border border-zinc-800 p-6 rounded-3xl space-y-3 text-xs leading-relaxed text-zinc-400">
                      <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Administrative SLAs</h4>
                      <p>
                        Tickets checked by administrators are evaluated inside sandboxed clusters to identify operational anomalies. Secure notification integrations emit event signals dynamically.
                      </p>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </section>
        )}

      </main>

      {/* Platform Footer */}
      <footer className="bg-[#121214] border-t border-zinc-900 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            
            {/* Logo */}
            <div onClick={() => handleNavigation('home')} className="flex items-center gap-3 cursor-pointer">
              <div className="h-8 w-8">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="46" fill="#18181b" stroke="#c29943" strokeWidth="4.5" />
                  <line x1="4" y1="50" x2="96" y2="50" stroke="#c29943" strokeWidth="1" opacity="0.2" />
                  <path d="M50 4 C 65 25, 65 75, 50 96 C 35 75, 35 25, 50 4 Z" fill="none" stroke="#c29943" strokeWidth="1.5" opacity="0.35" />
                  <path d="M28 32 L50 72 L72 32" fill="none" stroke="#c29943" strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-sm font-black tracking-widest text-white">VERIDION</span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-zinc-500">
              <button onClick={() => showToast("Simulated operational privacy terms policy active.", "info")} className="hover:text-white transition-colors">Privacy Policy</button>
              <button onClick={() => showToast("Sandbox standard operations rules map context loaded.", "info")} className="hover:text-white transition-colors">Terms of Operations</button>
              <button onClick={() => handleNavigation('contact')} className="hover:text-white transition-colors">Support Desk</button>
            </div>
          </div>

          <div className="border-t border-zinc-850 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500 gap-4">
            <p>© 2026 VERIDION. Mapped and compiled under fully compliant single-page React framework standards.</p>
            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-zinc-400 font-bold bg-zinc-950 border border-zinc-850 px-3 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Gateway status: active
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}