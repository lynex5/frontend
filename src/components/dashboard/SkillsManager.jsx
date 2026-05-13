import React, { useState, useEffect } from 'react';
import { authGet, authPost, authDelete } from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';

export default function SkillsManager() {
    const [skills, setSkills] = useState([]);
    const [name, setName] = useState('');
    const { showToast } = useToast();

    useEffect(() => { fetchSkills(); }, []);

    const fetchSkills = async () => {
        try {
            const data = await authGet('/skills');
            setSkills(data || []);
        } catch(e) { }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await authPost('/skills', { name });
            showToast('SKILL ADDED_', 'success');
            setName('');
            fetchSkills();
        } catch(e) { showToast('OPERATION FAILED_', 'error'); }
    };

    const handleDelete = async (id) => {
        try {
            await authDelete(`/skills/${id}`);
            showToast('SKILL REMOVED_', 'success');
            fetchSkills();
        } catch(e) { showToast('OPERATION FAILED_', 'error'); }
    };

    return (
        <div>
            <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                <input className="dash-input" style={{flex: 1}} placeholder="SKILL NAME" value={name} onChange={e=>setName(e.target.value)} required />
                <button type="submit" className="dash-btn">+ ADD SKILL</button>
            </form>
            <div>
                {skills.map(s => (
                    <div key={s.id} className="skill-tag">
                        {s.name} <button onClick={() => handleDelete(s.id)}>×</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
