import React, { useState, useEffect } from 'react';

const ProfileImgPicker = ({ userId, onImageUrlChange }) => {
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/accounts', {
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                if (!userId) {
                    console.error('userId is not set');
                    return;
                }
                const user = data.users.find(u => u.user_id.toString() === userId);
                if (user) {
                    const profileImageUrl = user.profile_picture ? encodeURI(user.profile_picture) : null;
                    setProfileImage(profileImageUrl);
                    onImageUrlChange(profileImageUrl); // Notify parent component
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userId, onImageUrlChange]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file && userId) {
            const formData = new FormData();
            formData.append('profileimg', file);

            try {
                const response = await fetch(`http://localhost:3001/api/accounts/${userId}/profileimg`, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to upload image');
                }
                const result = await response.json();
                const imageUrl = encodeURI(result.profileimg); // Assuming the backend sends the full URL
                setProfileImage(imageUrl); // Update the profile image after successful upload
                onImageUrlChange(imageUrl); // Notify parent component
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    return (
        <div className="profile-img-picker">
            <label className="upload-button" style={{ backgroundImage: `url(${profileImage})` }}>
                <div className="ImgBlackFilter">
                    <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                    <span className="ProfilePickerLabel">변경</span>
                </div>
            </label>
        </div>
    );
};

export default ProfileImgPicker;
