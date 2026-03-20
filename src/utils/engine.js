export const generateTransaction = () => {
  const names = [
    'Aarav', 'KAVIN', 'Meena', 'ARJUN', 'Nila', 'SURESH', 'Divya', 'KARTHIKEYAN', 'Hari', 'LATHA', 
    'Vignesh', 'PRIYA', 'Sanjay', 'ANBU', 'Kavya', 'RAVI', 'Dharani', 'GOPAL', 'Mani', 'SINDHU', 
    'Prakash', 'ARUNA', 'Bala', 'KIRAN', 'Revathi', 'MURUGAN', 'Ajith', 'DEEPA', 'Naveen', 'SARANYA', 
    'Karthik', 'SELVI', 'Rahul', 'GANESH', 'Yamuna', 'KUMAR', 'Ranjani', 'ARAVIND', 'Dinesh', 'MALAR', 
    'Saravanan', 'ANITHA', 'Kishore', 'SATHISH', 'Keerthi', 'VELMURUGAN', 'Gokul', 'RAMYA', 'Siva', 'MAHESH', 
    'Indhu', 'RAJESH', 'Prabhu', 'KALPANA', 'Vijay', 'MUTHU', 'Shalini', 'LOGESH', 'Arun', 'DEVI', 
    'Naren', 'VIJAYA', 'Kavinraj', 'POORNIMA', 'Senthil', 'DHANUSH', 'Lavanya', 'SIVAKUMAR', 'Ashwin', 'GEETHA', 
    'Vasanth', 'NAGARAJ', 'Anu', 'BALAJI', 'Ramesh', 'KAVITHA', 'Jeeva', 'KALAI', 'Tharun', 'CHANDRA', 
    'Suganya', 'PRASANTH', 'Ezhil', 'REKHA', 'Mohan', 'SUDHA', 'Iniyan', 'ARUL', 'Vinod', 'SUMATHI', 
    'Boopathy', 'ANAND', 'Dharshini', 'JAGAN', 'Raghu', 'PAVITHRA', 'Surya', 'BHARATH', 'Keerthana', 'SELVAM', 
    'Yuvan', 'NITHYA', 'Ilango', 'KUMARI', 'Praveen', 'AMUTHA', 'Vicky', 'KARUNA', 'Santhosh', 'PRIYANKA', 
    'Baskar', 'RADHA', 'Naveena', 'DHARMAN', 'Usha', 'KANNAN', 'Divakar', 'SANTHI', 'Rithika', 'VETRI', 
    'Chandru', 'KAMALA', 'Sriram', 'RUPA', 'Velan', 'SINDHURA', 'Pradeep', 'ARASI', 'Ashok', 'MALA', 
    'Karthika', 'GANAPATHY', 'Murali', 'KOKILA', 'Selvaraj', 'JYOTHI', 'Rajkumar', 'ANJALI', 'Vimal', 'NANDHINI', 
    'Suresh', 'THILAGA', 'Elango', 'HEMA', 'Jayakumar', 'KANIMOZHI', 'Devan', 'VENNILA', 'Sarath', 'AMBIKA', 
    'Prasanth', 'KARPAGAM', 'Arulraj', 'NIRMALA', 'Vinay', 'BHUVANA', 'Madhan', 'RANI', 'Jothi', 'SANGEETHA', 
    'Karthivel', 'KAVERI', 'Ilamaran', 'UMA', 'Sasi', 'LALITHA', 'Rajendran', 'POONGODI', 'Gopi', 'SHOBANA', 
    'Anandhi', 'VEERAN', 'Kumaran', 'THAMARAI', 'Dhamu', 'VALLI', 'Balu', 'PARVATHI', 'Thiru', 'MEENAKSHI', 
    'Devraj', 'KALYANI', 'Naveenkumar', 'THENMOZHI', 'Siva Kumar', 'ANUSHA', 'Harini', 'MANOJ', 'Ganesan', 
    'SARASWATHI', 'Sudhakar', 'VASANTHI', 'Vijayakumar', 'RATHIKA', 'Santhiya', 'KUMARESAN', 'Arvind', 'MAHALAKSHMI', 
    'Kousalya', 'THANGARAJ'
  ];

  const categories = ['Shopping', 'Food', 'Travel', 'Utilities', 'Finance', 'Entertainment', 'Personal Transfer'];
  const merchants = ['Amazon Pay', 'Paytm', 'PhonePe', 'Zomato', 'Swiggy', 'Lottery Prize', 'Win Cash', 'Unknown Wallet', 'Overseas Transfer'];

  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Randomize distribution to hit user's cases - Increased variety
  const roll = Math.random();
  let amount;
  let status = 'safe';
  let fraudScore = 5;

  if (roll > 0.85) {
    // Fraud Blocked case (Increased probability to 15%)
    amount = Math.floor(Math.random() * 50000) + 150000;
    status = 'fraud-blocked';
    fraudScore = 90 + Math.floor(Math.random() * 10);
  } else if (roll > 0.65) {
    // Suspicious case (Increased probability to 20%)
    amount = Math.floor(Math.random() * 49999) + 80000;
    status = 'suspicious';
    fraudScore = 65 + Math.floor(Math.random() * 25);
  } else if (roll > 0.30) {
    // Mid range - with chance of being suspicious
    amount = Math.floor(Math.random() * 79900) + 100;
    if (Math.random() > 0.7) {
      status = 'suspicious';
      fraudScore = 45 + Math.floor(Math.random() * 20);
    } else {
      status = 'safe';
      fraudScore = 15 + Math.floor(Math.random() * 20);
    }
  } else {
    // Small safe transactions
    amount = Math.floor(Math.random() * 99) + 1;
    status = 'safe';
    fraudScore = Math.floor(Math.random() * 10);
  }

  let merchant = roll > 0.9 ? getRandomItem(merchants.slice(5)) : getRandomItem(names);
  let category = getRandomItem(categories);

  return {
    id: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    timestamp: new Date().toLocaleTimeString(),
    merchant,
    category,
    amount,
    status,
    fraudScore,
    location: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Overseas', 'Unknown'][Math.floor(Math.random() * 8)]
  };
};

export const analyzeRisk = (txn) => {
  let score = 0;
  const indicators = [];

  const amount = Number(txn.amount);
  const merchant = (txn.merchant || txn.recipientName || '').toLowerCase();
  const upiId = (txn.upiId || txn.recipientUpiId || '').toLowerCase();

  // Amount checks
  if (amount >= 150000) {
    score += 85;
    indicators.push('Transaction amount exceeds maximum safety limit (>= ₹1.5L)');
  } else if (amount >= 80000) {
    score += 60;
    indicators.push('High value transaction alert (>= ₹80k)');
  } else if (amount > 20000) {
    score += 25;
    indicators.push('Significant amount transfer (> ₹20k)');
  }

  // UPI ID / Merchant checks
  const suspiciousKeywords = ['lottery', 'win', 'prize', 'gift', 'reward', 'cashback', 'bonus', 'wallet', 'crypto', 'proxy'];
  if (suspiciousKeywords.some(kw => merchant.includes(kw) || upiId.includes(kw))) {
    score += 40;
    indicators.push('Suspicious keywords detected in recipient name or UPI ID');
  }

  if (upiId && !upiId.includes('@')) {
    score += 35;
    indicators.push('Invalid or unverified UPI ID format');
  }

  if (amount > 0 && amount % 10000 === 0 && amount > 40000) {
    score += 20;
    indicators.push('Unusual round-number pattern detected');
  }

  // Randomized risk factor to simulate behavioral analysis
  if (Math.random() > 0.8) {
    score += 15;
    indicators.push('Unusual timing/behavioral pattern detected');
  }

  let status = 'safe';
  if (score >= 80) status = 'fraud-blocked';
  else if (score >= 45) status = 'suspicious';
  else if (score >= 30 && Math.random() > 0.5) status = 'suspicious';

  return {
    fraudScore: Math.min(score + Math.floor(Math.random() * 10), 99),
    status,
    indicators: indicators.length > 0 ? indicators : ['Transaction baseline looks normal']
  };
};


