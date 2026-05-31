import React, { createContext, useContext, useState, useCallback } from 'react';
import { playSuccess, playError } from '../utils/sound';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        if (type === 'success') playSuccess();
        if (type === 'error') playError();
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <div className={`toast ${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </ToastContext.Provider>
    );
};
