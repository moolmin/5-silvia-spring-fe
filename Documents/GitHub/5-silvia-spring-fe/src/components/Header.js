import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FaUserEdit, FaKey, FaSignOutAlt } from 'react-icons/fa';

function Header({ showBackButton, showUserProfile }) {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [nickname, setNickname] = useState('Guest');
    const userId = Cookies.get('userId');
    const navigate = useNavigate();
    const defaultProfileImage = "https://lh3.google.com/u/0/d/1ra2p2F4dl1ITC1r3M2ORKyqjt-O00EgE=w3024-h1714-iv2";

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
                if (!data.users || !Array.isArray(data.users)) {
                    console.error('Invalid or missing user data');
                    return;
                }
                if (!userId) {
                    console.error('userId cookie is not set');
                    return;
                }
                const user = data.users.find(u => u.user_id.toString() === userId);
                if (user) {
                    setProfileImage(user.profile_picture || defaultProfileImage);
                    setNickname(user.nickname || 'Guest');
                } else {
                    setProfileImage(defaultProfileImage);
                    setNickname('Guest');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setProfileImage(defaultProfileImage);
                setNickname('Guest');
            }
        };

        fetchUserData();
    }, [userId]);

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
        navigate('/');
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3001/logout', {
                method: 'POST',
                credentials: 'include'
            });
            if (response.ok) {
                console.log('Logout successful');
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
                                <a href={userId ? `/profile/edit/${userId}` : '#'} className="dropboxUserInfo">
                                    <div className="dropboxUserInfoTop">
                                        <span className="UserNickname">{nickname}</span>
                                    </div>

                                    <div className="dropboxUserInfoBottom">
                                        <FaUserEdit style={iconStyle} /> <span>회원정보 수정</span>
                                    </div>
                                </a>
                                <a href={userId ? `/users/${userId}/password` : '#'} style={{ borderTop: '1.5px solid #ccc', paddingTop: '10px'}} >
                                    <FaKey style={iconStyle}/>  <span>비밀번호 수정</span>
                                </a>
                                <a href="/" onClick={handleLogout} style={{ borderTop: '1.5px solid #ccc', paddingTop: '10px'}} >
                                    <FaSignOutAlt style={iconStyle}/>  <span>로그아웃</span>
                                </a>
                            </div>

                        </div>
                    )}
                    {/*<span className="UserNickname">{nickname}</span>*/}
                </div>
            </div>
        </div>
    );
}

export default Header;
