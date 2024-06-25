import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import useUserProfile from '../hooks/useUserProfile';
import ToastMessage from './ToastMessage';

const api_endpoint = process.env.REACT_APP_API_ENDPOINT

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
    const { userId } = useParams();
    const userEmail = localStorage.getItem('email');
    const { profileImage, error } = useUserProfile(userEmail);
    const [localProfileImage, setLocalProfileImage] = useState(profileImage);
    const [successLabel, setSuccessLabel] = useState('');
    const [errorLabel, setErrorLabel] = useState('');

    useEffect(() => {
        if (profileImage) {
            setLocalProfileImage(profileImage);
            onImageUrlChange(profileImage);
        }
    }, [profileImage, onImageUrlChange]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file && userId) {
            const formData = new FormData();
            const token = localStorage.getItem('token');
            formData.append('profileimg', file);

            try {
                const response = await fetch(`${api_endpoint}/api/accounts/${userId}/profileimg`, {
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

                // Refresh user profile to get the updated image
                const updatedUser = await fetchWithToken(`${api_endpoint}/api/accounts/${userId}`);
                const profileImageUrl = updatedUser.profilePicture;

                setLocalProfileImage(profileImageUrl);
                onImageUrlChange(profileImageUrl);
                setSuccessLabel('🥑 프로필 이미지가 변경되었습니다!');
            } catch (error) {
                setErrorLabel('🥑 이미지 업로드 중 오류가 발생했습니다.');
                console.error('Error uploading image:', error);
            }
        }
    };

    const clearLabels = useCallback(() => {
        setSuccessLabel('');
        setErrorLabel('');
    }, []);

    if (error) {
        return <div>Error loading user profile: {error.message}</div>;
    }

    return (
        <div className="profile-img-picker">
            <label className="upload-button" style={{ backgroundImage: `url(${localProfileImage})` }}>
                <div className="ImgBlackFilter">
                    <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                    <span className="ProfilePickerLabel">변경</span>
                </div>
            </label>
            <ToastMessage successLabel={successLabel} errorLabel={errorLabel} clearLabels={clearLabels} />
        </div>
    );
};

export default ProfileImgPicker;
