import React from 'react';


const Modal = ({ isVisible, ModalLabel, ModalContent, onClose, onConfirm }) => {
    if (!isVisible) return null;

    return (
        <div className="post_modal">
            <div className="modal_overlay" onClick={onClose}></div>
            <div className="modal_content">
                <h3>{ModalLabel}</h3>
                <p>{ModalContent}</p>
                <div className="modal-buttons">
                    <button id="post-modal-cancel" onClick={onClose}>취소</button>
                    <button id="post-modal-submit" onClick={onConfirm}>확인</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
