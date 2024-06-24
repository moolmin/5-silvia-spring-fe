import React from 'react';
import ProfileEditForm from "../components/ProfileEditForm";


const ProfileEditPage = () => {
    return (
        <div className="ProfileChangePage">
            <div className="ProfileEditFormContainer">
                <div className="Text32">My Profile</div>
                <ProfileEditForm/>
            </div>

        </div>
    );
};

export default ProfileEditPage;