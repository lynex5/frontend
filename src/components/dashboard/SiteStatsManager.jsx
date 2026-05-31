import React, { useState, useEffect } from 'react';
import { get, authPut } from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';

export default function SiteStatsManager() {
    const [stats, setStats] = useState({
        nodeName: '',
        buildDate: '',
        techSummary: '',
        lastCommit: '',
        semesters: 0
    });
    const { showToast } = useToast();

    useEffect(() => {
        get('/stats').then(data => {
            if(data) {
                setStats(data);
            }
        }).catch(e => console.error(e));
    }, []);

    const handleChange = (e) => {
        setStats({ ...stats, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            await authPut('/stats', stats);
            showToast('STATS UPDATED_', 'success');
        } catch(e) {
            showToast('OPERATION FAILED_', 'error');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
                <label style={{ fontFamily: 'var(--font-display)', color: '#555', display: 'block', marginBottom: '8px' }}>NODE NAME</label>
                <input className="dash-input" name="nodeName" value={stats.nodeName || ''} onChange={handleChange} />
            </div>
            <div>
                <label style={{ fontFamily: 'var(--font-display)', color: '#555', display: 'block', marginBottom: '8px' }}>BUILD DATE</label>
                <input className="dash-input" name="buildDate" value={stats.buildDate || ''} onChange={handleChange} />
            </div>
            <div>
                <label style={{ fontFamily: 'var(--font-display)', color: '#555', display: 'block', marginBottom: '8px' }}>TECH SUMMARY</label>
                <input className="dash-input" name="techSummary" value={stats.techSummary || ''} onChange={handleChange} />
            </div>
            <div>
                <label style={{ fontFamily: 'var(--font-display)', color: '#555', display: 'block', marginBottom: '8px' }}>LAST COMMIT</label>
                <input className="dash-input" name="lastCommit" value={stats.lastCommit || ''} onChange={handleChange} />
            </div>
            <div>
                <label style={{ fontFamily: 'var(--font-display)', color: '#555', display: 'block', marginBottom: '8px' }}>SEMESTERS (NUMBER)</label>
                <input className="dash-input" type="number" name="semesters" value={stats.semesters || 0} onChange={handleChange} />
            </div>
            <button className="dash-btn" style={{ alignSelf: 'flex-start', marginTop: '8px' }} onClick={handleSave}>SAVE CHANGES</button>
        </div>
    );
}
