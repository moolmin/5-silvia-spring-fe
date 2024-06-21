import React, { useState } from 'react';
import { EmailInputField, PasswordInputField, PasswordConfirmInputField, NicknameInputField } from './InputField';
import ToastMessage from "./ToastMessage";

const SignUpForm = () => {
    const [successLabel, setSuccessLabel] = useState('');
    const [errorLabel, setErrorLabel] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [profileImg, setProfileImg] = useState('');

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const [uploadError, setUploadError] = useState('');
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

    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        // Display a preview of the selected image
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewSrc(reader.result);
        };
        reader.readAsDataURL(file);

        // Automatically upload the image
        await handleUpload(file);
    };

    const clearLabels = () => {
        setSuccessLabel('');
        setErrorLabel('');
    }

    const handleUpload = async (file) => {
        if (!file) {
            setUploadError('파일을 선택해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('profileimg', file);

        try {
            const response = await fetch('http://localhost:3001/api/register/profileimg', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setProfileImg(data.profileimg);
                setUploadError('');
            } else {
                const errorText = await response.text();
                setUploadError(`이미지 업로드 실패: ${errorText}`);
            }
        } catch (error) {
            console.error('Error uploading the image:', error);
            setUploadError('이미지 업로드 중 오류가 발생했습니다.');
        }
    };

    const validateEmail = async (email) => {
        if (!email) {
            setEmailError('*이메일을 입력해주세요.');
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('*올바른 이메일 주소 형식을 입력해주세요. (예: 123@example.com)');
        } else {
            // Check for duplicate email
            try {
                const response = await fetch('http://localhost:3001/api/accounts');
                const data = await response.json();
                const isDuplicate = data.users.some(user => user.email === email);
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

        await validateEmail(email);
        validatePassword(password);
        validateConfirmPassword(password, confirmPassword);
        validateNickname(nickname);

        if (!emailError && !passwordError && !confirmPasswordError && !nicknameError) {
            try {
                const response = await fetch('http://localhost:3001/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password, nickname, profileimg: profileImg }),
                });

                if (response.ok) {
                    setSuccessLabel('🥑 회원가입 성공!');
                    // alert('회원가입 성공!');
                } else {
                    // const errorText = await response.text();
                    setErrorLabel(`🥑 회원가입 실패`);
                    // alert(`회원가입 실패: ${errorText}`);
                }
            } catch (error) {
                console.error('Error during registration:', error);
                alert('회원가입 중 오류가 발생했습니다.');
            }
        } else {
            alert('입력 정보를 확인해주세요.');
        }
    };

    return (
        <form className="SignupForm" onSubmit={handleSubmit}>
            <div className="Text32" style={{marginBottom: '51px'}}>Sign Up</div>

            <div className="SignUpProfilePickerContainer">
                <div className="SignUpProfileLabel"><span>프로필 사진</span></div>
                <div className="SignUpProfileImgPicker">
                    <input
                        type="file"
                        accept="image/*"
                        id="profileImgInput"
                        onChange={handleFileChange}
                        style={{display: 'none'}}
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
                            <div style={{width: '24px', height: '24px', position: 'relative'}}>
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
                    {uploadError && <div style={{color: 'red', marginTop: '10px'}}>{uploadError}</div>}
                </div>
            </div>

            <EmailInputField
                // label="이메일*"
                value={email}
                onChange={handleEmailChange}
                error={emailError}
                labelStyle={{fontSize: '15px'}}
            />
            <PasswordInputField
                // label="비밀번호*"
                value={password}
                onChange={handlePasswordChange}
                error={passwordError}
                labelStyle={{fontSize: '15px'}}
            />
            <PasswordConfirmInputField
                // label="비밀번호 확인*"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={confirmPasswordError}
                labelStyle={{fontSize: '15px'}}
            />
            <NicknameInputField
                // label="닉네임*"
                value={nickname}
                onChange={handleNicknameChange}
                error={nicknameError}
                labelStyle={{fontSize: '15px'}}
            />
            <button className="SubmitBtn">회원가입</button>
            <div className="signUpTextContainer"
                 style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '12px'}}>
                <p style={{margin: 0, fontSize: '14px'}}>이미 계정이 있나요? </p>
                <a href="/login" className="Text14" style={{marginLeft: '5px', fontWeight: '650'}}> 로그인하기</a>
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
