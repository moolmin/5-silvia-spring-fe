import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const fetchWithToken = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Network response was not ok for ${url}`);
    }

    return response.json();
};

const ProfileImgPicker = ({ onImageUrlChange }) => {
    const [profileImage, setProfileImage] = useState(null);
    const { userId } = useParams();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const usersResponse = await fetchWithToken('http://localhost:8080/api/accounts');
                const email = localStorage.getItem('email');
                const user = usersResponse.find(user => user.email === email);

                if (user) {
                    const profileImageUrl = user.profilePicture;
                    setProfileImage(profileImageUrl);
                    onImageUrlChange(profileImageUrl);
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
            const token = localStorage.getItem('token');
            formData.append('profileimg', file);

            try {
                const response = await fetch(`http://localhost:8080/api/accounts/${userId}/profileimg`, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to upload image');
                }

                // const result = await response.json();
                // const updatedUserResponse = await fetchWithToken(`http://localhost:8080/api/accounts/${userId}`);
                // const updatedUser = await updatedUserResponse.json();
                // const profileImageUrl = updatedUser.profilePicture;
                //
                //
                // setProfileImage(profileImageUrl);
                // onImageUrlChange(profileImageUrl);
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
