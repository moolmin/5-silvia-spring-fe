import { useState, useMemo } from 'react';

const useUserData = (userId) => {
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [showToast, setShowToast] = useState(false);

    useMemo(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/accounts/${userId}`, {
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                const user = data.user;
                if (user) {
                    setNickname(user.nickname);
                    setEmail(user.email);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userId]);

    const updateNickname = async (newNickname) => {
        try {
            const response = await fetch(`http://localhost:3001/api/accounts/${userId}/nickname`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nickname: newNickname }),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                if (response.status === 409) {
                    throw new Error('중복된 닉네임입니다.');
                } else {
                    throw new Error(errorMessage);
                }
            }

            setNickname(newNickname);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        } catch (error) {
            console.error('Error updating user data:', error);
            throw new Error(error.message);
        }
    };

    return {
        nickname,
        email,
        showToast,
        setNickname,
        updateNickname,
        setShowToast
    };
};

export default useUserData;
