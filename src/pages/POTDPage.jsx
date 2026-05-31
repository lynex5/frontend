import React, { useEffect, useState } from 'react';

const POTDPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [stats, setStats] = useState({
    currentStreak: 0,
    maxStreak: 0,
    totalSolved: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/sairahul5/GFG-POTD/commits?per_page=100');
        if (!response.ok) throw new Error('Failed to fetch');
        const commits = await response.json();

        // regex to match: Day NNN | Problem Name | Difficulty ✅
        const regex = /Day\s+(\d+)\s+\|\s+(.*?)\s+\|\s+(Easy|Medium|Hard)\s*✅/i;

        const parsedCommits = [];

        commits.forEach(item => {
          const msg = item.commit.message;
          // Extract date correctly without timezone shift
          const dateStr = item.commit.author.date.split('T')[0]; 
          const match = msg.match(regex);
          if (match) {
            parsedCommits.push({
              date: dateStr,
              day: match[1],
              problem: match[2].trim(),
              difficulty: match[3],
              sha: item.sha
            });
          }
        });

        // Compute streaks
        // grouping by date (to handle multiple commits on same day if any)
        const dateSet = new Set(parsedCommits.map(c => c.date));
        const activeDates = Array.from(dateSet).sort((a, b) => new Date(b) - new Date(a));

        // Start checking from today backwards
        const today = new Date();
        // zero out time
        today.setHours(0,0,0,0);
        
        let activeDateStrs = new Set(activeDates);

        // compute current streak
        let cStreak = 0;
        let todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
        
        let yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        let yesterdayStr = yesterday.getFullYear() + '-' + String(yesterday.getMonth() + 1).padStart(2, '0') + '-' + String(yesterday.getDate()).padStart(2, '0');

        let startingDate = todayStr;
        if (!activeDateStrs.has(todayStr) && activeDateStrs.has(yesterdayStr)) {
          startingDate = yesterdayStr;
        }

        if (activeDateStrs.has(startingDate)) {
           let loopDate = new Date(startingDate);
           while(true) {
             let curStr = loopDate.getFullYear() + '-' + String(loopDate.getMonth() + 1).padStart(2, '0') + '-' + String(loopDate.getDate()).padStart(2, '0');
             if(activeDateStrs.has(curStr)) {
               cStreak++;
               loopDate.setDate(loopDate.getDate() - 1);
             } else {
               break;
             }
           }
        }
        
        // compute max streak
        let tempStreak = 0;
        let maxStreak = 0;
        const ascDates = [...activeDates].sort((a, b) => new Date(a) - new Date(b));
        if (ascDates.length > 0) {
          tempStreak = 1;
          maxStreak = 1;
          for (let i = 1; i < ascDates.length; i++) {
             // using UTC to avoid DST jumps
             let cur = new Date(ascDates[i] + 'T00:00:00Z');
             let prev = new Date(ascDates[i-1] + 'T00:00:00Z');
             let diffTime = Math.abs(cur - prev);
             let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
             if (diffDays === 1) {
               tempStreak++;
             } else {
               tempStreak = 1;
            }
            if(tempStreak > maxStreak) maxStreak = tempStreak;
          }
        }

        setStats({
          currentStreak: cStreak,
          maxStreak: maxStreak,
          totalSolved: parsedCommits.length
        });
        
        setData(parsedCommits);
        setLoading(false);
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
        <h2>&gt; ERROR: could not reach github api</h2>
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
          <div style={{ fontSize: '40px', fontWeight: 'bold', display: 'flex', alignItems: 'baseline', gap: '6px' }}>{stats.maxStreak} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>days</span></div>
        </div>
        <div className="stat-card">
          <div style={{ opacity: 0.8, fontSize: '14px' }}>✅ TOTAL SOLVED</div>
          <div style={{ fontSize: '40px', fontWeight: 'bold', display: 'flex', alignItems: 'baseline', gap: '6px' }}>{stats.totalSolved} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>problems</span></div>
        </div>
      </div>

      <div style={{ marginTop: '60px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{ fontSize: '9px', letterSpacing: '3px', color: '#00FF4144' }}>ACTIVITY — LAST 6 MONTHS</span>
          <div style={{ flex: 1, height: '1px', background: '#00FF4118' }}></div>
        </div>
        <div style={{ display: 'flex', gap: '4px', paddingBottom: '20px' }}>
          {weeks.map((week, wIdx) => {
            const firstDay = week[0];
            const isFirstWeekOfMonth = firstDay.date.endsWith('-01') || (wIdx === 0) || (week[0].month !== (weeks[wIdx-1]?.[0]?.month));
            
            return (
              <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ height: '20px', fontSize: '9px', color: '#00FF4144', marginBottom: '4px', textTransform: 'uppercase' }}>
                  {isFirstWeekOfMonth ? firstDay.month : ''}
                </div>
                {week.map((day, dIdx) => (
                  <div key={dIdx} className="heatmap-cell" style={{ background: day.hasCommit ? '#00FF41' : '#161616' }}>
                    <div className="tooltip">
                      {day.date} {day.hasCommit ? ` - ${day.problem}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{ fontSize: '9px', letterSpacing: '3px', color: '#00FF4144' }}>SOLUTIONS LOG</span>
          <div style={{ flex: 1, height: '1px', background: '#00FF4118' }}></div>
        </div>
        <div style={{ overflowX: 'auto', background: '#0a0a0a', border: '1px solid #00FF4120', borderRadius: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#00FF41', minWidth: '600px' }}>
            <thead>
              <tr style={{ textTransform: 'uppercase', fontSize: '9px', letterSpacing: '3px', color: '#00FF4155', borderBottom: '1px solid #00FF4120', background: '#0f0f0f' }}>
                <th style={{ padding: '15px 20px', textAlign: 'left' }}>Day</th>
                <th style={{ padding: '15px 20px', textAlign: 'left' }}>Problem</th>
                <th style={{ padding: '15px 20px', textAlign: 'left' }}>Difficulty</th>
                <th style={{ padding: '15px 20px', textAlign: 'left' }}>Solution</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className="table-row" style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <td style={{ padding: '15px 20px' }}>{item.day.padStart(3, '0')}</td>
                  <td style={{ padding: '15px 20px' }}>{item.problem}</td>
                  <td style={{ padding: '15px 20px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      background: `${getDifficultyColor(item.difficulty)}15`,
                      color: getDifficultyColor(item.difficulty),
                      border: `1px solid ${getDifficultyColor(item.difficulty)}50`,
                      fontSize: '11px',
                      letterSpacing: '1px'
                    }}>
                      {item.difficulty}
                    </span>
                  </td>
                  <td style={{ padding: '15px 20px' }}>
                    <a 
                      href={`https://github.com/sairahul5/GFG-POTD/tree/main/GFG/${getYear(item.date)}/${getMonthName(item.date)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        padding: '6px 12px',
                        background: 'transparent',
                        border: '1px solid #00FF41',
                        color: '#00FF41',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'inline-block',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={e => {
                        e.target.style.background = '#00FF41';
                        e.target.style.color = '#0a0a0a';
                      }}
                      onMouseOut={e => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#00FF41';
                      }}
                    >
                      [VIEW →]
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default POTDPage;
