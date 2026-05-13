import React, { useState, useEffect } from 'react';
import { authGet, authPost, authPut, authDelete } from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';

export default function ProjectsManager() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    // Form state
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [year, setYear] = useState('');
    const [description, setDescription] = useState('');
    const [techStack, setTechStack] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [liveLink, setLiveLink] = useState('');

    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const data = await authGet('/projects');
            setProjects(data || []);
        } catch (error) {
            showToast('FAILED TO LOAD PROJECTS_', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const payload = { code, name, year, description, techStack, githubLink, liveLink };
            if (editingId) {
                await authPut(`/projects/${editingId}`, payload);
                showToast('PROJECT UPDATED_', 'success');
            } else {
                await authPost('/projects', payload);
                showToast('PROJECT ADDED_', 'success');
            }
            fetchProjects();
            // Reset form
            setEditingId(null);
            setCode(''); setName(''); setYear(''); setDescription(''); setTechStack(''); setGithubLink(''); setLiveLink('');
        } catch (error) {
            showToast('OPERATION FAILED_', 'error');
        }
    };

    const handleEdit = (p) => {
        setEditingId(p.id);
        setCode(p.code || '');
        setName(p.name || '');
        setYear(p.year || '');
        setDescription(p.description || '');
        setTechStack(p.techStack || '');
        setGithubLink(p.githubLink || '');
        setLiveLink(p.liveLink || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id, pCode) => {
        if (!window.confirm(`DELETE ${pCode}? THIS CANNOT BE UNDONE.`)) return;
        try {
            await authDelete(`/projects/${id}`);
            showToast('PROJECT DELETED_', 'success');
            fetchProjects();
        } catch (error) {
            showToast('OPERATION FAILED_', 'error');
        }
    };

    // Edit logic simplified for brevity (inline save). We'll set the row to edit mode.
    return (
        <div>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '16px' }}>ADD NEW PROJECT</h3>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '48px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input className="dash-input" style={{flex: 1}} placeholder="PRJ CODE" value={code} onChange={e => setCode(e.target.value)} required />
                    <input className="dash-input" style={{flex: 3}} placeholder="PROJECT NAME" value={name} onChange={e => setName(e.target.value)} required />
                    <input className="dash-input" style={{flex: 1}} placeholder="YEAR" value={year} onChange={e => setYear(e.target.value)} />
                </div>
                <textarea className="dash-textarea" placeholder="DESCRIPTION" value={description} onChange={e => setDescription(e.target.value)} required rows={3}></textarea>
                <input className="dash-input" placeholder="TECH STACK (comma separated)" value={techStack} onChange={e => setTechStack(e.target.value)} />
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input className="dash-input" style={{flex: 1}} placeholder="GITHUB LINK" value={githubLink} onChange={e => setGithubLink(e.target.value)} />
                    <input className="dash-input" style={{flex: 1}} placeholder="LIVE LINK" value={liveLink} onChange={e => setLiveLink(e.target.value)} />
                </div>
                <button type="submit" className="dash-btn" style={{ alignSelf: 'flex-start' }}>{editingId ? 'UPDATE PROJECT' : '+ ADD PROJECT'}</button>
            </form>

            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '16px' }}>CURRENT PROJECTS</h3>
            {loading ? <div style={{ color: '#555' }}>LOADING_<span className="cursor">_</span></div> : (
                <table className="dash-table">
                    <thead>
                        <tr>
                            <th>CODE</th>
                            <th>NAME</th>
                            <th>YEAR</th>
                            <th>TECH TAGS</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(p => (
                            <tr key={p.id}>
                                <td>{p.code}</td>
                                <td>{p.name}</td>
                                <td>{p.year}</td>
                                <td>{p.techStack}</td>
                                <td>
                                    <button type="button" className="dash-btn" style={{ padding: '4px 8px', fontSize: '12px', marginRight: '8px' }} onClick={() => handleEdit(p)}>EDIT</button>
                                    <button className="dash-btn dash-btn-delete" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => handleDelete(p.id, p.code)}>DELETE</button>
                                </td>
                            </tr>
                        ))}
                        {projects.length === 0 && (
                            <tr><td colSpan="5" style={{ color: '#555', textAlign: 'center', padding: '24px' }}>NO PROJECTS YET_</td></tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}
