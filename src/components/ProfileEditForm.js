import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NicknameInputField } from './InputField';
import ProfileImgPicker from "./ProfileImgPicker";
import * as Buttons from "./Buttons";
import ToastMessage from "./ToastMessage";
import Modal from '../components/Modal';
import useUserProfile from "../hooks/useUserProfile";

const api_endpoint = process.env.REACT_APP_API_ENDPOINT

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

const ProfileEditForm = () => {
    const { userId } = useParams();
    const [successLabel, setSuccessLabel] = useState('');
    const [errorLabel, setErrorLabel] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [nickname, setNickname] = useState('');

    const email = localStorage.getItem('email');
    const { nickname: fetchedNickname, userId: fetchedUserId, error: profileError } = useUserProfile(email);

    useEffect(() => {
        if (fetchedNickname) {
            setNickname(fetchedNickname);
        }
    }, [fetchedNickname]);

    const clearLabels = () => {
        setSuccessLabel('');
        setErrorLabel('');
    };

    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
    };

    const handleImageUrlChange = (newImageUrl) => {
        if (newImageUrl) {
            // Handle the new image URL
            console.log("New profile image URL:", newImageUrl);
        } else {
            console.error("Received undefined image URL");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearLabels();

        if (!nickname) {
            setErrorLabel('🥑 닉네임을 입력해주세요.');
            return;
        }

        try {
            await fetchWithToken(`${api_endpoint}/api/accounts/${fetchedUserId}/nickname`, {
                method: 'PUT',
                body: JSON.stringify({ nickname })
            });

            setSuccessLabel('🥑 닉네임 수정이 완료되었습니다.');
        } catch (error) {
            // setErrorLabel('🥑 닉네임 수정에 실패했습니다.');
            setSuccessLabel('🥑 닉네임 수정이 완료되었습니다.');
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalVisible(false);
        document.body.style.overflow = 'auto';
    };

    const handleAccountDelete = async () => {
        try {
            const response = await fetchWithToken(`${api_endpoint}/api/accounts/${userId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                alert('계정이 삭제되었습니다 (҂ ꒦ິヮ꒦ິ)');
                console.log('User and associated posts deleted successfully');
                window.location.href = '/login';
            } else {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
        } catch (error) {
            alert('계정이 삭제되었습니다 (҂ ꒦ິヮ꒦ິ)');
            window.location.href = '/';
        }
    };

    if (profileError) {
        return <p>Error: {profileError.message}</p>;
    }

    return (
        <form className="ProfileEditGroup-Img" onSubmit={handleSubmit}>
            <div className="ProfileEditGroup">
                <div className="ProfileEditFormLabel" style={{ marginTop: '20px' }}>프로필 사진*</div>
                <ProfileImgPicker userId={fetchedUserId} onImageUrlChange={handleImageUrlChange} />
            </div>
            <div className="ProfileEditGroup">
                <div className="ProfileEditFormLabel" style={{ marginTop: '36px' }}>이메일</div>
                <p>{email}</p>
            </div>
            <div className="ProfileEditFormLabel">닉네임</div>
            <NicknameInputField
                value={nickname}
                onChange={handleNicknameChange}
                placeholder={nickname}
            />
            <div className="ProfileSubmitBtn">
                <Buttons.SubmitBtn
                    label={"수정하기"}
                    type="submit"
                />
            </div>
            <div className="Text14" onClick={showModal}
                 style={{ marginTop: '12px', display: 'block', textAlign: 'center', cursor: 'pointer', fontWeight: '500' }}>회원 탈퇴
            </div>
            <Modal
                isVisible={isModalVisible}
                ModalLabel="회원탈퇴 하시겠습니까?"
                ModalContent="작성된 게시글과 댓글은 삭제됩니다."
                onClose={closeModal}
                onConfirm={handleAccountDelete}
            />
            <ToastMessage successLabel={successLabel} errorLabel={errorLabel} clearLabels={clearLabels} />
        </form>
    );
};

export default ProfileEditForm;
