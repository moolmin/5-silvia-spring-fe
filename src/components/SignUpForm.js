import React, { useState } from 'react';
import { EmailInputField, PasswordInputField, PasswordConfirmInputField, NicknameInputField } from './InputField';
import ToastMessage from "./ToastMessage";

const API_ENDPOINT = process.env.API_ENDPOINT

const SignUpForm = () => {
    const [successLabel, setSuccessLabel] = useState('');
    const [errorLabel, setErrorLabel] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [profileImg, setProfileImg] = useState(null);

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const [previewSrc, setPreviewSrc] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        validateEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        validatePassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        validateConfirmPassword(password, e.target.value);
    };

    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
        validateNickname(e.target.value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfileImg(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewSrc(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const clearLabels = () => {
        setSuccessLabel('');
        setErrorLabel('');
    };

    const validateEmail = async (email) => {
        if (!email) {
            setEmailError('*이메일을 입력해주세요.');
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('*올바른 이메일 주소 형식을 입력해주세요. (예: 123@example.com)');
        } else {
            try {
                const response = await fetch(`${API_ENDPOINT}/api/accounts/check-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const isDuplicate = await response.json();
                if (isDuplicate) {
                    setEmailError('*중복된 이메일입니다.');
                } else {
                    setEmailError('');
                }
            } catch (error) {
                console.error('Error checking email duplication:', error);
                setEmailError('이메일 중복 확인 중 오류가 발생했습니다.');
            }
        }
    };

    const validatePassword = (password) => {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/;
        if (!password) {
            setPasswordError('*비밀번호를 입력해주세요.');
        } else if (!passwordPattern.test(password)) {
            setPasswordError('*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.');
        } else {
            setPasswordError('');
        }
    };

    const validateConfirmPassword = (password, confirmPassword) => {
        if (!confirmPassword) {
            setConfirmPasswordError('*비밀번호 확인을 입력해주세요.');
        } else if (password !== confirmPassword) {
            setConfirmPasswordError('*비밀번호가 일치하지 않습니다.');
        } else {
            setConfirmPasswordError('');
        }
    };

    const validateNickname = (nickname) => {
        if (!nickname) {
            setNicknameError('*닉네임을 입력해주세요.');
        } else if (/\s/.test(nickname)) {
            setNicknameError('*닉네임에는 띄어쓰기를 포함할 수 없습니다.');
        } else if (nickname.length > 10) {
            setNicknameError('*닉네임은 최대 10자 까지 작성 가능합니다.');
        } else {
            setNicknameError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        clearLabels();

        await validateEmail(email);
        validatePassword(password);
        validateConfirmPassword(password, confirmPassword);
        validateNickname(nickname);

        if (!emailError && !passwordError && !confirmPasswordError && !nicknameError) {
            const formData = new FormData();
            formData.append('file', profileImg);

            const data = {
                email,
                password,
                nickname
            };

            formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

            try {
                const response = await fetch(`${API_ENDPOINT}/api/join`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json',
                    }
                });

                if (response.ok) {
                    setSuccessLabel('🥑 회원가입 성공!');
                } else {
                    setErrorLabel('🥑 모든 정보를 입력해주세요');
                }
            } catch (error) {
                console.error('Error during registration:', error);
                setErrorLabel('🥑 회원가입 중 오류가 발생했습니다.');
            }
        } else {
            setErrorLabel('🥑 입력 정보를 확인해주세요.');
        }
    };

    return (
        <form className="SignupForm" onSubmit={handleSubmit}>
            <div className="Text32" style={{ marginBottom: '51px' }}>Sign Up</div>

            <div className="SignUpProfilePickerContainer">
                <div className="SignUpProfileLabel"><span>프로필 사진</span></div>
                <div className="SignUpProfileImgPicker">
                    <input
                        type="file"
                        accept="image/*"
                        id="profileImgInput"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="profileImgInput" style={{
                        width: '149px',
                        height: '149px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#C4C4C4',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {previewSrc ? (
                            <img
                                src={previewSrc}
                                alt="Profile Preview"
                                style={{
                                    width: '149px',
                                    height: '149px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                }}
                            />
                        ) : (
                            <div style={{ width: '24px', height: '24px', position: 'relative' }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    width: '1.2px',
                                    height: '24px',
                                    backgroundColor: 'black',
                                    transform: 'translate(-50%, -50%)'
                                }}></div>
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    width: '24px',
                                    height: '1.2px',
                                    backgroundColor: 'black',
                                    transform: 'translate(-50%, -50%)'
                                }}></div>
                            </div>
                        )}
                    </label>
                </div>
            </div>

            <EmailInputField
                value={email}
                onChange={handleEmailChange}
                error={emailError}
                labelStyle={{ fontSize: '15px' }}
            />
            <PasswordInputField
                value={password}
                onChange={handlePasswordChange}
                error={passwordError}
                labelStyle={{ fontSize: '15px' }}
            />
            <PasswordConfirmInputField
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={confirmPasswordError}
                labelStyle={{ fontSize: '15px' }}
            />
            <NicknameInputField
                value={nickname}
                onChange={handleNicknameChange}
                error={nicknameError}
                labelStyle={{ fontSize: '15px' }}
            />
            <button className="SubmitBtn">회원가입</button>
            <div className="signUpTextContainer"
                 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '12px' }}>
                <p style={{ margin: 0, fontSize: '14px' }}>이미 계정이 있나요? </p>
                <a href="/login" className="Text14" style={{ marginLeft: '5px', fontWeight: '650' }}> 로그인하기</a>
            </div>
            <ToastMessage
                successLabel={successLabel}
                errorLabel={errorLabel}
                clearLabels={clearLabels}
            />
        </form>
    );
};

export default SignUpForm;
