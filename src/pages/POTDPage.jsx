import React, { useEffect, useState } from 'react';

const POTDPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [stats, setStats] = useState({
    currentStreak: 0,
    longestStreak: 0,
    correctSubmissions: 0,
    attemptedProblems: 0,
    lastCorrectSubmission: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { BASE_URL } = await import('../api/apiClient');
        const res = await fetch(`${BASE_URL}/gfg/streak`);
        if (!res.ok) {
           setError(true);
           setLoading(false);
           return;
        }
        const response = await res.json();
        
        if (response && !response.error) {
          setStats({
            currentStreak: response.currentStreak,
            longestStreak: response.longestStreak,
            correctSubmissions: response.correctSubmissions,
            attemptedProblems: response.attemptedProblems,
            lastCorrectSubmission: response.lastCorrectSubmission
          });
          setLoading(false);
          setData([]); // no commit details
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#00FF41', fontFamily: '"JetBrains Mono", monospace' }}>
        <h2>&gt; fetching streak data...<span className="blinking-cursor" style={{ animation: 'blink 1s step-end infinite' }}>|</span></h2>
        <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#ff4444', fontFamily: '"JetBrains Mono", monospace' }}>
        <h2>&gt; ERROR: could not reach gfg api</h2>
      </div>
    );
  }

  // Heatmap generation
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);
  // align to Sunday
  sixMonthsAgo.setDate(sixMonthsAgo.getDate() - sixMonthsAgo.getDay());

  // Using UTC to accurately count days
  const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const sixMonthsAgoUTC = Date.UTC(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth(), sixMonthsAgo.getDate());
  const daysDiff = Math.floor((todayUTC - sixMonthsAgoUTC) / (1000 * 60 * 60 * 24));
  
  const heatmapDays = [];
  
  for(let i=0; i <= daysDiff; i++) {
    let d = new Date(sixMonthsAgo);
    d.setDate(d.getDate() + i);
    
    let dStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    let commit = data.find(c => c.date === dStr);
    heatmapDays.push({
      date: dStr,
      hasCommit: !!commit,
      problem: commit ? commit.problem : null,
      month: d.toLocaleString('default', { month: 'short' })
    });
  }

  // split into weeks for grid
  const weeks = [];
  let currentWeek = [];
  heatmapDays.forEach(day => {
    currentWeek.push(day);
    if(currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if(currentWeek.length > 0) weeks.push(currentWeek);

  const getDifficultyColor = (diff) => {
    if(diff === 'Easy') return '#00FF41';
    if(diff === 'Medium') return '#ffaa00';
    if(diff === 'Hard') return '#ff5555';
    return '#00FF41';
  };

  const getMonthName = (dateStr) => {
    const parts = dateStr.split('-');
    const m = parseInt(parts[1], 10);
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return months[m-1];
  };
  
  const getYear = (dateStr) => dateStr.split('-')[0];

  return (
    <div style={{ padding: '120px 20px 60px', maxWidth: '1000px', margin: '0 auto', fontFamily: '"JetBrains Mono", monospace', minHeight: '100vh' }}>
      <style>
        {`
          .blinking-cursor { animation: blink 1s step-end infinite; }
          @keyframes blink { 50% { opacity: 0; } }
          .stat-card {
            border: 1px solid #00FF4130;
            background: #0f0f0f;
            color: #00FF41;
            padding: 20px;
            border-radius: 10px;
            flex: 1;
            min-width: 200px;
            text-align: center;
            box-shadow: 0 0 8px rgba(0,255,65,0.2);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 6px;
          }
          .heatmap-cell {
            width: 14px;
            height: 14px;
            border-radius: 3px;
            position: relative;
          }
          .heatmap-cell:hover .tooltip {
            display: block;
          }
          .tooltip {
            display: none;
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: #00FF41;
            color: #0f0f0f;
            padding: 4px 8px;
            white-space: nowrap;
            font-size: 12px;
            margin-bottom: 5px;
            border-radius: 2px;
            z-index: 10;
          }
          .table-row {
            transition: all 0.2s;
          }
          .table-row td:first-child {
            border-left: 2px solid transparent;
            transition: padding-left 0.2s, border-left 0.2s;
          }
          .table-row:hover {
            background: #00FF410a;
          }
          .table-row:hover td:first-child {
            border-left: 2px solid #00FF41;
            padding-left: 26px !important;
          }
        `}
      </style>

      <h1 style={{ color: '#00FF41', marginBottom: '40px' }}>&gt; GFG_POTD_STREAK<span className="blinking-cursor">|</span></h1>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', width: '100%' }}>
          <span style={{ fontSize: '9px', letterSpacing: '3px', color: '#00FF4144' }}>STATS</span>
          <div style={{ flex: 1, height: '1px', background: '#00FF4118' }}></div>
        </div>
        <div className="stat-card">
          <div style={{ opacity: 0.8, fontSize: '14px' }}>🔥 CURRENT STREAK</div>
          <div style={{ fontSize: '40px', fontWeight: 'bold', display: 'flex', alignItems: 'baseline', gap: '6px' }}>{stats.currentStreak} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>days</span></div>
        </div>
        <div className="stat-card">
          <div style={{ opacity: 0.8, fontSize: '14px' }}>⚡ MAX STREAK</div>
          <div style={{ fontSize: '40px', fontWeight: 'bold', display: 'flex', alignItems: 'baseline', gap: '6px' }}>{stats.longestStreak} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>days</span></div>
        </div>
        <div className="stat-card">
          <div style={{ opacity: 0.8, fontSize: '14px' }}>✅ TOTAL SOLVED</div>
          <div style={{ fontSize: '40px', fontWeight: 'bold', display: 'flex', alignItems: 'baseline', gap: '6px' }}>{stats.correctSubmissions} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>problems</span></div>
        </div>
        <div className="stat-card">
          <div style={{ opacity: 0.8, fontSize: '14px' }}>🎯 ATTEMPTED</div>
          <div style={{ fontSize: '40px', fontWeight: 'bold', display: 'flex', alignItems: 'baseline', gap: '6px' }}>{stats.attemptedProblems} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>problems</span></div>
        </div>
      </div>

      <div style={{ marginTop: '20px', color: '#00FF4166', fontSize: '12px' }}>
        &gt; LAST SOLVED: {stats.lastCorrectSubmission}
      </div>

    </div>
  );
};

export default POTDPage;
