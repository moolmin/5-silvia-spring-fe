import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit, FaKey, FaSignOutAlt } from 'react-icons/fa';

const fetchWithToken = async (url) => {
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Network response was not ok for ${url}`);
    }

    return response.json();
};

function Header({ showBackButton, showUserProfile }) {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [nickname, setNickname] = useState('Guest');
    const userEmail = localStorage.getItem('email');
    const navigate = useNavigate();
    const defaultProfileImage = "https://lh3.google.com/u/0/d/1ra2p2F4dl1ITC1r3M2ORKyqjt-O00EgE=w3024-h1714-iv2";

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const usersData = await fetchWithToken('http://localhost:8080/api/accounts');
                const currentUser = usersData.find(user => user.email === userEmail);

                if (currentUser) {
                    setProfileImage(currentUser.profilePicture);
                    setNickname(currentUser.nickname);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUser();
    }, [userEmail]); // Added userEmail as a dependency

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!event.target.closest('.UserProfile')) {
                setIsDropdownVisible(false);
            }
        };
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    const handleBackButtonClick = () => {
        navigate(-1);
    };

    const goToMainPage = () => {
        navigate('/main');
    };

    const handleLogout = async () => {
        try {
            const response = await fetchWithToken('http://localhost:8080/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                console.log('Logout successful');
                localStorage.clear();
                console.log('localStorage cleared');
                window.location.href = '/';
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const iconStyle = {
        margin: '0px 10px 0px 5px',
        fontSize: '14px',
    };

    return (
        <div className="Header">
            <div className="HeaderContent">
                <div className="HeaderEmptyBox">
                    {showBackButton && <button className="BackBtn" onClick={handleBackButtonClick}>〈</button>}
                </div>
                <div className="HeaderText" onClick={goToMainPage}>
                    <span role="img" aria-label="avocado">🥑</span> AvoWorld
                </div>
                <div className="HeaderProfile">
                    {showUserProfile && (
                        <div className="UserProfile" onClick={toggleDropdown}>
                            <img src={profileImage || defaultProfileImage} alt="User Profile" className="UserProfile"/>
                            <div id="myDropdown" className={`dropdown-content ${isDropdownVisible ? 'show' : ''}`}>
                                <a href={userEmail ? `/profile/edit/${userEmail}` : '#'} className="dropboxUserInfo">
                                    <div className="dropboxUserInfoTop">
                                        <span className="UserNickname">{nickname}</span>
                                    </div>

                                    <div className="dropboxUserInfoBottom">
                                        <FaUserEdit style={iconStyle} /> <span>회원정보 수정</span>
                                    </div>
                                </a>
                                <a href={userEmail ? `/users/${userEmail}/password` : '#'} style={{ borderTop: '1.5px solid #ccc', paddingTop: '10px'}} >
                                    <FaKey style={iconStyle}/>  <span>비밀번호 수정</span>
                                </a>
                                <a href="/" onClick={handleLogout} style={{ borderTop: '1.5px solid #ccc', paddingTop: '10px'}} >
                                    <FaSignOutAlt style={iconStyle}/>  <span>로그아웃</span>
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Header;
