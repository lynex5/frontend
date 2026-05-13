import React, { useState, useEffect, useRef } from 'react';
import { get, authDelete, authUpload } from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';

export default function ResumeManager() {
    const [resumeExists, setResumeExists] = useState(false);
    const [fileName, setFileName] = useState('');
    const [uploadDate, setUploadDate] = useState('');
    const [uploading, setUpload] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const { showToast } = useToast();

    useEffect(() => { checkResume(); }, []);

    const checkResume = () => {
        get('/resume/status').then((data) => {
            setResumeExists(data.exists);
            if (data.exists) {
                setFileName(data.filename);
                const d = new Date(data.uploadedAt);
                setUploadDate(`Uploaded: ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`);
            } else {
                setFileName('');
                setUploadDate('');
            }
        }).catch(() => {
            setResumeExists(false);
            setFileName('');
            setUploadDate('');
        });
    };

    const handleDrag = (e) => { e.preventDefault(); e.stopPropagation(); if (e.type === "dragenter" || e.type === "dragover") { setDragActive(true); } else if (e.type === "dragleave") { setDragActive(false); } };
    const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files && e.dataTransfer.files[0]) { handleFile(e.dataTransfer.files[0]); } };
    const handleChange = (e) => { e.preventDefault(); if (e.target.files && e.target.files[0]) { handleFile(e.target.files[0]); } };

    const handleFile = (file) => {
        if (file.type !== "application/pdf") return showToast('ONLY PDF FILES ALLOWED_', 'error');
        if (file.size > 10 * 1024 * 1024) return showToast('MAX 10MB LIMIT EXCEEDED_', 'error');
        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append("file", selectedFile);
        setUpload(true);
        try {
            await authUpload('/resume/upload', formData);
            showToast('RESUME UPLOADED_', 'success');
            setSelectedFile(null);
            checkResume();
        } catch(e) { showToast('OPERATION FAILED_', 'error'); }
        finally { setUpload(false); }
    };

    const handleDelete = async () => {
        if(!window.confirm('DELETE RESUME? THIS CANNOT BE UNDONE.')) return;
        try {
            await authDelete('/resume');
            showToast('RESUME DELETED_', 'success');
            setResumeExists(false);
            setFileName('');
        } catch(e) { showToast('OPERATION FAILED_', 'error'); }
    };

    return (
        <div>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '16px', color: '#555' }}>CURRENT RESUME</h3>
            <div style={{ padding: '16px', background: '#0D0D0D', border: '1px solid #333', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {resumeExists ? (
                    <>
                        <span style={{ fontFamily: 'var(--font-mono)' }}>📄 {fileName} <span style={{ color: '#555', marginLeft: '16px', fontSize: '11px' }}>{uploadDate}</span></span>
                        <div>
                            <a href="http://localhost:8080/api/resume/download" target="_blank" rel="noreferrer" className="dash-btn" style={{ textDecoration: 'none', marginRight: '8px' }}>DOWNLOAD</a>
                            <button className="dash-btn dash-btn-delete" onClick={handleDelete}>DELETE</button>
                        </div>
                    </>
                ) : (
                    <span style={{ color: '#555', fontFamily: 'var(--font-mono)' }}>NO RESUME UPLOADED_</span>
                )}
            </div>

            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '16px', color: '#555' }}>UPLOAD NEW RESUME</h3>
            <div 
                className={`drop-zone ${dragActive ? 'active' : ''}`}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
            >
                {selectedFile ? selectedFile.name : 'Drag & drop zone OR click to browse\nOnly PDF files · Max 10MB'}
                <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleChange} style={{ display: 'none' }} />
            </div>
            
            {uploading && <div style={{ height: '4px', background: '#111', marginTop: '16px' }}><div style={{ height: '100%', width: '50%', background: '#00FF41' }} /></div>}
            
            <button className="dash-btn" style={{ marginTop: '16px', opacity: selectedFile ? 1 : 0.5, pointerEvents: selectedFile ? 'auto' : 'none' }} onClick={handleUpload}>
                UPLOAD
            </button>
        </div>
    );
}
