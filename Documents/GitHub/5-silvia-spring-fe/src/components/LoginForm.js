import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { EmailInputField, PasswordInputField } from './InputField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const navigate = useNavigate(); // Define navigate

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        validateEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        validatePassword(e.target.value);
    };

    const validateEmail = (email) => {
        if (!email) {
            setEmailError('*이메일을 입력해주세요.');
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('*올바른 이메일 주소 형식을 입력해주세요. (예: 123@example.com)');
        } else {
            setEmailError('');
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

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate email and password
        validateEmail(email);
        validatePassword(password);

        // Proceed with login if there are no errors
        if (!emailError && !passwordError) {
            login(email, password);
        } else {
            toast.error('올바른 이메일과 비밀번호를 입력해주세요.');
        }
    };

    const login = (email, password) => {
        const options = {
            method: 'POST',
            credentials: 'include', // Include cookies
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        };

        console.log('Sending login request with email:', email);
        console.log('Sending login request with password:', password);

        fetch('http://localhost:3001/login', options)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('nickname', data.nickname);
                    navigate('/main');

                } else {
                    toast.error(`인증 실패: ${data.message}`);
                }
            })
            .catch(error => {
                console.error('로그인 오류:', error);
                toast.error('로그인 중 오류가 발생했습니다.');
            });
    };

    return (
        <form className="LoginForm" onSubmit={handleSubmit}>
            <div className="Text32" style={{marginBottom: '51px'}}>Login</div>
            <EmailInputField
                value={email}
                onChange={handleEmailChange}
                placeholder="이메일을 입력하세요"
                error={emailError}
            />
            <PasswordInputField
                value={password}
                onChange={handlePasswordChange}
                placeholder="비밀번호를 입력하세요"
                error={passwordError}
            />

            <button className="SubmitBtn" style={{marginTop: '5px'}}>로그인</button>

            <div className="signUpTextContainer"
                 style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '12px'}}>
                <p style={{margin: 0, fontSize: '14px'}}>아직 계정이 없나요?</p>
                <a href="/register" className="Text14" style={{marginLeft: '8px', fontWeight: '800'}}>회원가입</a>
            </div>
            <ToastContainer />
        </form>
    );
};

export default LoginForm;
