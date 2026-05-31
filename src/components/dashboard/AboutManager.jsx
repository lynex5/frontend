import React, { useState, useEffect } from 'react';
import { authGet, authPut } from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';

export default function AboutManager() {
    const [statement, setStatement] = useState('');
    const [bio, setBio] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        authGet('/about').then(data => {
            if(data && data.length > 0) {
                setStatement(data[0].boldStatement || '');
                setBio(data[0].shortBio || '');
            }
        }).catch(e=>{});
    }, []);

    const handleSave = async () => {
        try {
            await authPut('/about', { id: 1, boldStatement: statement, shortBio: bio });
            showToast('ABOUT UPDATED_', 'success');
        } catch(e) {
            showToast('OPERATION FAILED_', 'error');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontFamily: 'var(--font-display)', color: '#555' }}>BOLD STATEMENT</label>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: statement.length > 150 ? '#FF3333' : '#555' }}>
                        {statement.length}/150
                    </span>
                </div>
                <textarea className="dash-textarea" rows={3} value={statement} onChange={e=>setStatement(e.target.value)} maxLength={150} />
            </div>
            <div>
                <label style={{ fontFamily: 'var(--font-display)', color: '#555', display: 'block', marginBottom: '8px' }}>SHORT BIO</label>
                <textarea className="dash-textarea" rows={6} value={bio} onChange={e=>setBio(e.target.value)} />
            </div>
            <button className="dash-btn" style={{ alignSelf: 'flex-start' }} onClick={handleSave}>SAVE CHANGES</button>
        </div>
    );
}
