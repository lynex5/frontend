import React, { useState, useEffect } from 'react';
import { authGet, authPut } from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';

export default function ContactManager() {
    const [contact, setContact] = useState({ email: '', linkedinUrl: '', githubUrl: '', youtubeUrl: '' });
    const { showToast } = useToast();

    useEffect(() => {
        authGet('/contact').then(data => {
            if(data && data.length > 0) setContact(data[0]);
        }).catch(e=>{});
    }, []);

    const handleChange = (field) => (e) => setContact({...contact, [field]: e.target.value});

    const handleSave = async () => {
        // Simple URL check for demonstration
        if (contact.linkedinUrl && !contact.linkedinUrl.startsWith('http')) return showToast('INVALID URL FORMAT_', 'error');
        try {
            await authPut('/contact', { id: 1, ...contact });
            showToast('CONTACT UPDATED_', 'success');
        } catch(e) {
            showToast('OPERATION FAILED_', 'error');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {['email', 'linkedinUrl', 'githubUrl', 'youtubeUrl'].map((field) => (
                <div key={field}>
                    <label style={{ fontFamily: 'var(--font-display)', color: '#555', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                        {field.replace('Url', ' URL')}
                    </label>
                    <input className="dash-input" value={contact[field] || ''} onChange={handleChange(field)} type={field==='email'?'email':'url'} />
                </div>
            ))}
            <button className="dash-btn" style={{ alignSelf: 'flex-start' }} onClick={handleSave}>SAVE CHANGES</button>
        </div>
    );
}
