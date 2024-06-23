import React, { useState, useEffect } from 'react';

const fetchWithToken = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Network response was not ok for ${url}`);
    }

    return response.json();
};

const ProfileImgPicker = ({ userId, onImageUrlChange }) => {
    const [profileImage, setProfileImage] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const usersResponse = await fetchWithToken('http://localhost:8080/api/accounts');
                setUsers(usersResponse || []);

                const email = localStorage.getItem('email');
                const user = users.find(user => user.email === email);

                if (user) {
                    const profileImageUrl = user.profilePicture ? encodeURI(user.profilePicture) : null;
                    setProfileImage(profileImageUrl);
                    onImageUrlChange(profileImageUrl); // Notify parent component
                } else {
                    console.error('Logged in user not found');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [onImageUrlChange]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file && userId) {
            const formData = new FormData();
            formData.append('profileimg', file);

            try {
                const response = await fetch(`http://localhost:8080/api/accounts/${userId}/profileimg`, {
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
