import React, { useEffect, useCallback } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastMessage = ({ successLabel, errorLabel, clearLabels }) => {
    const notifySuccess = useCallback((message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
        clearLabels();
    }, [clearLabels]);

    const notifyError = useCallback((message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
        clearLabels();
    }, [clearLabels]);

    useEffect(() => {
        if (successLabel) {
            notifySuccess(successLabel);
        }
    }, [successLabel, notifySuccess]);

    useEffect(() => {
        if (errorLabel) {
            notifyError(errorLabel);
        }
    }, [errorLabel, notifyError]);

    return <ToastContainer />;
};

export default ToastMessage;
