import { useState, useEffect } from 'react';

const useUserProfile = (userEmail) => {
    const [profileImage, setProfileImage] = useState(null);
    const [nickname, setNickname] = useState(null);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/accounts', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const usersData = await response.json();
                const currentUser = usersData.find(user => user.email === userEmail);

                if (currentUser) {
                    setProfileImage(currentUser.profilePicture);
                    setNickname(currentUser.nickname);
                    setUserId(currentUser.userId);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setError(error);
            }
        };
        fetchUser();
    }, [userEmail]);

    return { profileImage, nickname, userId, error };
};

export default useUserProfile;
