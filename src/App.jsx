import React, { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, CheckCircle, TrendingUp, Activity, 
  Clock, MapPin, CreditCard, Bell, Search, ArrowRight,
  ShieldCheck, Smartphone, User, LayoutDashboard, Send, 
  LogOut, Settings, History, Info
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { generateTransaction, analyzeRisk } from './utils/engine';

// --- Reusable Components ---
const Badge = ({ variant, children }) => (
  <span className={`badge badge-${variant}`}>{children}</span>
);

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ padding: '0.5rem', borderRadius: '10px', background: `${color}15`, color }}>
        <Icon size={20} />
      </div>
      {trend && <span style={{ color: trend > 0 ? 'var(--accent-success)' : 'var(--accent-danger)', fontSize: '0.8rem', fontWeight: 600 }}>{trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>}
    </div>
    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{title}</span>
    <span style={{ fontSize: '1.75rem', fontWeight: 700 }}>{value}</span>
  </div>
);

// --- Sections ---

const LandingPage = ({ onNavigate }) => (
  <div className="hero animate-fade-in">
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50px', marginBottom: '2rem', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.1)' }}>
      <Shield size={16} color="var(--accent-success)" />
      <span>Trusted by 5M+ UPI Users across India</span>
    </div>
    <h1>Protect Your <br/><span style={{ color: 'var(--accent-primary)' }}>UPI Transactions</span></h1>
    <p>Advanced real-time fraud detection system powered by AI to identify suspicious activity, scams, and fraudulent requests before you pay.</p>
    <div className="button-group">
      <button className="btn btn-primary" onClick={() => onNavigate('user')}>Check Transaction <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} /></button>
      <button className="btn btn-outline" onClick={() => onNavigate('admin')}>View Analytics</button>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '6rem', width: '100%' }}>
      {[
        { icon: Activity, title: 'Real-time Analysis', desc: 'Instant fraud detection using neural network algorithms.' },
        { icon: ShieldCheck, title: 'Secure Payment', desc: 'Verify merchant credibility before authorizing UPI payment.' },
        { icon: Smartphone, title: 'Device Guard', desc: 'Protects against remote access and screen mirroring scams.' }
      ].map((feature, i) => (
        <div key={i} className="glass-card" style={{ padding: '2rem', textAlign: 'left' }}>
          <feature.icon size={32} color="var(--accent-primary)" style={{ marginBottom: '1.5rem' }} />
          <h3 style={{ marginBottom: '0.75rem' }}>{feature.title}</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{feature.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const UserPortal = ({ transactions, onNewTransaction }) => {
  const [formData, setFormData] = useState({ 
    transactionId: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    recipientUpiId: '',
    amount: '', 
    recipientName: '',
    description: '' 
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null); // Clear previous results

    setTimeout(() => {
      const analysis = analyzeRisk({ ...formData, upiId: formData.recipientUpiId, amount: Number(formData.amount) });
      const newTxn = {
        ...formData,
        id: formData.transactionId,
        upiId: formData.recipientUpiId,
        amount: Number(formData.amount),
        timestamp: new Date().toLocaleTimeString(),
        status: analysis.status,
        fraudScore: analysis.fraudScore,
        indicators: analysis.indicators,
        merchant: formData.description || formData.recipientName
      };

      if (analysis.status === 'safe') {
        // Sequential process for safe transactions: Safe -> Processing -> Approved
        setResult({ ...newTxn, status: 'safe' });
        
        setTimeout(() => {
          setResult(prev => ({ ...prev, status: 'processing' }));
          
          setTimeout(() => {
            setResult(prev => ({ ...prev, status: 'approved' }));
            onNewTransaction({ ...newTxn, status: 'approved' });
            setLoading(false);
          }, 1500);
        }, 2000); // 2s delay as requested
      } else {
        setResult(newTxn);
        onNewTransaction(newTxn);
        setLoading(false);
      }

      // Generate new ID for next one
      setFormData(prev => ({
        ...prev,
        transactionId: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        recipientUpiId: '',
        amount: '',
        recipientName: '',
        description: ''
      }));
    }, 1500);
  };

  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Check Transaction</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Transaction ID</label>
              <input className="form-input" required placeholder="TXN..." value={formData.transactionId} onChange={e => setFormData({...formData, transactionId: e.target.value})} />
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="form-group" style={{ flex: 1 }}><label>Recipient UPI ID</label><input className="form-input" required placeholder="e.g. user@okaxis" value={formData.recipientUpiId} onChange={e => setFormData({...formData, recipientUpiId: e.target.value})} /></div>
              <div className="form-group" style={{ flex: 1 }}><label>Amount (₹)</label><input type="number" className="form-input" required placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} /></div>
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="form-group" style={{ flex: 1 }}><label>Recipient Name</label><input className="form-input" required placeholder="Name as per bank" value={formData.recipientName} onChange={e => setFormData({...formData, recipientName: e.target.value})} /></div>
              <div className="form-group" style={{ flex: 1 }}><label>Description (Optional)</label><input className="form-input" placeholder="What is this for?" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'var(--accent-primary)', color: '#000', fontWeight: 'bold' }} disabled={loading}>
              {loading ? 'Analyzing Risks...' : 'Validate Transaction'}
            </button>
          </form>
          
          {result && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              style={{ 
                marginTop: '2.5rem', 
                padding: '1.5rem', 
                borderRadius: '12px', 
                background: result.status === 'fraud-blocked' || result.status === 'fraud' 
                  ? 'rgba(255,77,77,0.1)' 
                  : result.status === 'suspicious' 
                    ? 'rgba(255,184,0,0.1)' 
                    : 'rgba(0,255,157,0.1)', 
                border: `1px solid ${
                  result.status === 'fraud-blocked' || result.status === 'fraud' 
                    ? 'var(--accent-danger)' 
                    : result.status === 'suspicious' 
                      ? 'var(--accent-warning)' 
                      : 'var(--accent-success)'
                }` 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 600 }}>Safety Assessment</span>
                <Badge variant={result.status}>{result.status.replace('-', ' ').toUpperCase()}</Badge>
              </div>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Our AI models calculated a fraud score of <strong>{result.fraudScore}%</strong> for transaction <strong>{result.id}</strong>.</p>
              {result.indicators?.map((ind, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  {result.status === 'approved' || result.status === 'safe' 
                    ? <CheckCircle size={14} color="var(--accent-success)" /> 
                    : <AlertTriangle size={14} color={result.status === 'fraud-blocked' || result.status === 'fraud' ? 'var(--accent-danger)' : 'var(--accent-warning)'} />
                  } {ind}
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};







// --- Profile Settings Section ---
const ProfileSettings = ({ onBack }) => {
  const [banks, setBanks] = useState(['HDFC Bank - 4521', 'SBI Savings - 8890']);
  
  const addBank = () => {
    const newBank = prompt("Enter Bank Name and Last 4 Digits (e.g., ICICI Bank - 1234):");
    if (newBank) setBanks([...banks, newBank]);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 0' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button 
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontWeight: 600 }}
        >
          <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /> Back to Dashboard
        </button>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', height: 'fit-content' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--accent-primary), var(--accent-secondary))', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, color: '#000' }}>JD</div>
            <h2 style={{ marginBottom: '0.5rem' }}>John Doe</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Premium Security Member</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', fontSize: '0.85rem' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Risk Profile</div>
                <div style={{ color: 'var(--accent-success)', fontWeight: 600 }}>ULTRA SECURE</div>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', fontSize: '0.85rem' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Last Login</div>
                <div>Today, 10:45 AM</div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ marginBottom: '2rem' }}>Personal Information</h3>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div className="form-row" style={{ display: 'flex', gap: '1.5rem' }}>
                <div className="form-group" style={{ flex: 1 }}><label>Full Name</label><input className="form-input" defaultValue="John Doe" /></div>
                <div className="form-group" style={{ flex: 1 }}><label>Phone Number</label><input className="form-input" defaultValue="+91 98765 43210" /></div>
              </div>
              <div className="form-group"><label>Email Address</label><input className="form-input" defaultValue="john.doe@sentinel.ai" /></div>
              <div className="form-group"><label>Primary UPI ID</label><input className="form-input" defaultValue="jdoe@okaxis" /></div>
              
              <div style={{ height: '1px', background: 'var(--border-color)', margin: '1rem 0' }} />
              
              <h3 style={{ marginBottom: '1rem' }}>Linked Bank Accounts</h3>
              {banks.map((bank, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CreditCard size={20} color="var(--accent-primary)" />
                    </div>
                    <span style={{ fontWeight: 500 }}>{bank}</span>
                  </div>
                  <Badge variant="safe">Active</Badge>
                </div>
              ))}
              <button 
                onClick={addBank}
                className="btn btn-outline" 
                style={{ marginTop: '1rem', borderStyle: 'dashed', width: '100%' }}
              >
                + Link New Account
              </button>
              <button className="btn btn-primary" style={{ marginTop: '1.5rem', background: 'var(--accent-primary)', color: '#000', width: '100%' }}>Save All Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Security Center Section ---
const SecurityCenter = ({ onBack }) => (
  <div className="container animate-fade-in" style={{ padding: '3rem 0' }}>
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <button 
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontWeight: 600 }}
      >
        <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /> Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--accent-success)', marginBottom: '0.5rem' }}><ShieldCheck size={24} /></div>
          <h4 style={{ marginBottom: '0.25rem' }}>Core Engine</h4>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>ACTIVE</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Neural Model v4.2</div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--accent-secondary)', marginBottom: '0.5rem' }}><Activity size={24} /></div>
          <h4 style={{ marginBottom: '0.25rem' }}>Monitoring</h4>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>24/7</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Real-time scan enabled</div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}><Smartphone size={24} /></div>
          <h4 style={{ marginBottom: '0.25rem' }}>Device Safety</h4>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>OPTIMAL</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>No vulnerabilities found</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Security Controls</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { title: 'Biometric Locking', desc: 'Secure payment authorization using fingerprint/FaceID', icon: Smartphone },
              { title: 'Remote Access Guard', desc: 'Blocks suspicious remote desktop/screen mirroring sessions', icon: Shield },
              { title: 'Smart App Shield', desc: 'Auto-scan apps for malicious UPI-monitoring code', icon: Activity },
              { title: 'Global Block-list', desc: 'Automatic block of 50,000+ known fraud UPI IDs', icon: ShieldCheck }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                  <div style={{ padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                    <item.icon size={20} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
                  </div>
                </div>
                <div style={{ width: '40px', height: '22px', background: 'var(--accent-success)', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(124,77,255,0.1), transparent)' }}>
            <h4 style={{ marginBottom: '1rem' }}>AI Logic Health</h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Current system confidence score across Bharat network.</div>
            <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', marginBottom: '0.5rem' }}>
              <div style={{ height: '100%', width: '94%', background: 'var(--accent-primary)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>Reliability</span>
              <span>94.2%</span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Security Tips</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.8rem', padding: '0.5rem', background: 'rgba(255,77,77,0.1)', borderRadius: '8px', color: 'var(--accent-danger)' }}>
                Never share your UPI PIN on call or over screen sharing.
              </div>
              <div style={{ fontSize: '0.8rem', padding: '0.5rem', background: 'rgba(0,209,255,0.1)', borderRadius: '8px', color: 'var(--accent-secondary)' }}>
                Verify merchant names twice before clicking 'Pay'.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
const AdminDashboard = ({ transactions, stats, chartData }) => (
  <div className="container" style={{ padding: '2rem 0' }}>
    <div className="stats-container">
      <StatCard title="Total Volume" value={stats.total} icon={Activity} trend={12} color="var(--accent-secondary)" />
      <StatCard title="Blocked Fraud" value={stats.fraud} icon={Shield} trend={-4} color="var(--accent-danger)" />
      <StatCard title="Avg Amount" value={`₹${Math.floor(stats.volume / (stats.total || 1))}`} icon={TrendingUp} color="var(--accent-success)" />
      <StatCard title="System Load" value="Optimal" icon={CheckCircle} color="var(--accent-primary)" />
    </div>

    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Recent Transaction History</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        <AnimatePresence>
          {transactions.slice(0, 8).map(txn => (
            <motion.div key={txn.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{txn.merchant || txn.upiId}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{txn.timestamp} • {txn.id}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700 }}>₹{txn.amount.toLocaleString()}</div>
                <Badge variant={txn.status}>{txn.status.replace('-', ' ')}</Badge>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Live Threat Map</h2>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <XAxis dataKey="time" hide />
              <YAxis hide domain={[0, 100]} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: 'none', borderRadius: '10px' }} />
              <Area type="monotone" dataKey="value" stroke="var(--accent-primary)" fill="var(--accent-primary)" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h2 style={{ marginBottom: '1.25rem', fontSize: '1.1rem' }}>Manual Overrides</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {transactions.filter(t => t.status === 'fraud-blocked').slice(0, 4).map(t => (
            <div key={t.id} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600 }}>{t.id}</span>
                <span style={{ color: 'var(--accent-danger)' }}>₹{t.amount}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Detected: {t.timestamp}</div>
              <button style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}>Review</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);




// --- Main App ---

export default function App() {
  const [view, setView] = useState('landing');
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ total: 0, fraud: 0, volume: 0 });
  const [chartData, setChartData] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const notifications = [
    { id: 1, title: 'Fraud Blocked', message: 'A ₹1.5L transaction was flagged as critical.', time: '2m ago', type: 'fraud' },
    { id: 2, title: 'New Login', message: 'Signed in from Chrome on Windows - Mumbai.', time: '15m ago', type: 'info' },
    { id: 3, title: 'Alert Profile Updated', message: 'Security settings have been synchronized.', time: '1h ago', type: 'success' },
  ];

  const addTransactionWithFlow = (txn) => {
    let initialStatus = txn.status;
    if (txn.status === 'safe') initialStatus = 'safe';
    else if (txn.status === 'suspicious') initialStatus = 'suspicious';
    
    const initialTxn = { ...txn, status: initialStatus };
    setTransactions(prev => [initialTxn, ...prev.slice(0, 19)]);

    if (txn.status === 'safe') {
      setTimeout(() => {
        setTransactions(prev => prev.map(t => t.id === txn.id ? { ...t, status: 'approved' } : t));
      }, 2000); 
    } else if (txn.status === 'suspicious') {
      // Flow: SUSPICIOUS (2s) -> OTP VERIFICATION (2s) -> PROCESSING (1s) -> APPROVED
      setTimeout(() => {
        setTransactions(prev => prev.map(t => t.id === txn.id ? { ...t, status: 'otp-verification' } : t));
        
        setTimeout(() => {
          setTransactions(prev => prev.map(t => t.id === txn.id ? { ...t, status: 'processing' } : t));
          
          setTimeout(() => {
            setTransactions(prev => prev.map(t => t.id === txn.id ? { ...t, status: 'approved' } : t));
          }, 1000);
        }, 2000);
      }, 2000); // Wait 2s on "Suspicious"
    }
  };

  useEffect(() => {
    const initial = Array.from({ length: 15 }, () => generateTransaction());
    setTransactions(initial);
    setStats({
      total: 1240,
      fraud: 42,
      volume: 850000
    });

    const interval = setInterval(() => {
      const newTxn = generateTransaction();
      addTransactionWithFlow(newTxn);
      setStats(prev => ({
        total: prev.total + 1,
        fraud: prev.fraud + (newTxn.status === 'fraud-blocked' ? 1 : 0),
        volume: prev.volume + newTxn.amount
      }));
      setChartData(prev => [...prev.slice(-19), { time: new Date().toLocaleTimeString(), value: Math.floor(Math.random() * 60) + 20 }]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <header>
        <div className="container nav-content">
          <div className="logo" onClick={() => setView('landing')} style={{ cursor: 'pointer' }}>
            <Shield size={24} color="var(--accent-primary)" />
            UPI Sentinel
          </div>
          <nav className="nav-links">
            <span className={`nav-link ${view === 'user' ? 'active' : ''}`} onClick={() => setView('user')}>User Portal</span>
            <span className={`nav-link ${view === 'admin' ? 'active' : ''}`} onClick={() => setView('admin')}>Admin Dashboard</span>
          </nav>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div className="dropdown-container">
              <div 
                style={{ cursor: 'pointer', position: 'relative', padding: '0.5rem', borderRadius: '50%', transition: 'background 0.2s' }}
                onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); setUnreadCount(0); }}
                className={showNotifications ? 'glass-bg' : ''}
              >
                <Bell size={20} color="var(--text-secondary)" />
                {unreadCount > 0 && <span className="notification-dot" />}
              </div>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="dropdown-menu"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Notifications</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', cursor: 'pointer' }}>Mark all as read</span>
                    </div>
                    {notifications.map(n => (
                      <div key={n.id} className="notification-item">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{n.title}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{n.time}</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{n.message}</p>
                      </div>
                    ))}
                    <button 
                      onClick={() => { setView('admin'); setShowNotifications(false); }}
                      style={{ width: '100%', marginTop: '1rem', padding: '0.6rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      View All Activity
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="dropdown-container">
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', fontSize: '0.85rem' }}>JD</div>
              </div>

              <AnimatePresence>
                {showProfile && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="dropdown-menu" 
                    style={{ width: '280px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '0.5rem' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', fontSize: '1.1rem' }}>JD</div>
                      <div>
                        <div style={{ fontWeight: 700 }}>John Doe</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Premium Member</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div className="profile-menu-item" onClick={() => { setView('profile'); setShowProfile(false); }}><User size={18} /> Account Settings</div>
                      <div className="profile-menu-item" onClick={() => { setView('security'); setShowProfile(false); }}><Shield size={18} /> Security Center</div>
                      <div className="profile-menu-item" onClick={() => { setView('admin'); setShowProfile(false); }}><History size={18} /> Transaction History</div>
                      <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }} />
                      <div className="profile-menu-item danger" onClick={() => { setView('landing'); setShowProfile(false); }}><LogOut size={18} /> Logout</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          {view === 'landing' && <LandingPage key="landing" onNavigate={setView} />}
          {view === 'user' && <UserPortal key="user" transactions={transactions} onNewTransaction={addTransactionWithFlow} />}
          {view === 'admin' && <AdminDashboard key="admin" transactions={transactions} stats={stats} chartData={chartData} />}
          {view === 'security' && <SecurityCenter key="security" onBack={() => setView('landing')} />}
          {view === 'profile' && <ProfileSettings key="profile" onBack={() => setView('landing')} />}
        </AnimatePresence>
      </main>

      <footer style={{ padding: '2rem', borderTop: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
        &copy; 2024 UPI Sentinel AI. Protecting Bharat's Digital Economy.
      </footer>
    </div>
  );
}


