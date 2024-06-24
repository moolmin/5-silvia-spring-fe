import React from 'react';
import PasswordChangeForm from "../components/PasswordChangeForm";

const PasswordChangePage = () => {
    return (
        <div className="PasswordChangePage">
            <div className="PasswordChangeContainer">
                <div className="Text32" style={{marginBottom: '30px'}}>Change Password</div>
                <PasswordChangeForm/>
            </div>
        </div>
    );
};

export default PasswordChangePage;