import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit, FaKey, FaSignOutAlt } from 'react-icons/fa';
import useUserProfile from "../hooks/useUserProfile";
const api_endpoint = process.env.REACT_APP_API_ENDPOINT

const fetchWithToken = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
        ...options,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`Network response was not ok for ${url}`);
    }

    return response.json();
};

function Header({ showBackButton, showUserProfile }) {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const userEmail = localStorage.getItem('email');
    const { profileImage, nickname, userId } = useUserProfile(userEmail);
    const navigate = useNavigate();
    const defaultProfileImage = "https://lh3.google.com/u/0/d/1ra2p2F4dl1ITC1r3M2ORKyqjt-O00EgE=w3024-h1714-iv2";

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

    const handleLogout = async (event) => {
        event.preventDefault();
        try {
            await fetchWithToken(`${api_endpoint}/api/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            // console.log('Logout successful');
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            window.location.href = '/';
        } catch (error) {
            console.error('Error during logout:', error);
            window.location.href = '/';
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
                </div>
            </div>
        </div>
    );
}

export default Header;
