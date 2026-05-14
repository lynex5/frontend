import React, { useState, useEffect } from 'react';
import { authGet, authPost, authPut, authDelete } from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';

export default function TimelineManager() {
    const [items, setItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ year: '', event: '', sortOrder: 0 });
    const { showToast } = useToast();

    const fetchItems = () => {
        authGet('/timeline').then(data => setItems(data || [])).catch(e => console.error(e));
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            if (editingItem) {
                await authPut(`/timeline/${editingItem.id}`, formData);
                showToast('ITEM UPDATED_', 'success');
            } else {
                await authPost('/timeline', formData);
                showToast('ITEM CREATED_', 'success');
            }
            setEditingItem(null);
            setFormData({ year: '', event: '', sortOrder: 0 });
            fetchItems();
        } catch(e) {
            showToast('OPERATION FAILED_', 'error');
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({ year: item.year, event: item.event, sortOrder: item.sortOrder });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('DELETE ITEM?')) return;
        try {
            await authDelete(`/timeline/${id}`);
            showToast('ITEM DELETED_', 'success');
            fetchItems();
        } catch(e) {
            showToast('OPERATION FAILED_', 'error');
        }
    };

    const handleCancel = () => {
        setEditingItem(null);
        setFormData({ year: '', event: '', sortOrder: 0 });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: '#111', padding: '16px', border: '1px solid var(--border)' }}>
                <h3 style={{ color: 'var(--accent)', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
                    {editingItem ? 'EDIT_ITEM' : 'NEW_ITEM'}
                </h3>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontFamily: 'var(--font-display)', color: '#555', display: 'block', marginBottom: '8px' }}>YEAR</label>
                        <input className="dash-input" name="year" value={formData.year} onChange={handleChange} placeholder="e.g. 2026" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontFamily: 'var(--font-display)', color: '#555', display: 'block', marginBottom: '8px' }}>SORT ORDER</label>
                        <input className="dash-input" type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange} />
                    </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontFamily: 'var(--font-display)', color: '#555', display: 'block', marginBottom: '8px' }}>EVENT</label>
                    <input className="dash-input" name="event" value={formData.event} onChange={handleChange} placeholder="e.g. Launched version 2.0" />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="dash-btn" onClick={handleSave}>{editingItem ? 'UPDATE' : 'CREATE'}</button>
                    {editingItem && <button className="dash-btn" style={{ borderColor: '#666', color: '#666' }} onClick={handleCancel}>CANCEL</button>}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {items.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', padding: '12px 16px', border: '1px solid #333' }}>
                        <div>
                            <span style={{ color: 'var(--accent)', marginRight: '16px', fontFamily: 'var(--font-mono)' }}>[{item.year}]</span>
                            <span style={{ color: '#EEE' }}>{item.event}</span>
                            <span style={{ color: '#666', marginLeft: '16px', fontSize: '12px' }}>Order: {item.sortOrder}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="dash-btn" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => handleEdit(item)}>EDIT</button>
                            <button className="dash-btn" style={{ padding: '4px 8px', fontSize: '12px', borderColor: '#FF3333', color: '#FF3333' }} onClick={() => handleDelete(item.id)}>DEL</button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && <div style={{ color: '#666', fontStyle: 'italic' }}>No timeline items found.</div>}
            </div>
        </div>
    );
}
