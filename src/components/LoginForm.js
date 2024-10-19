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

    const navigate = useNavigate(); 

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

        validateEmail(email);
        validatePassword(password);

        if (!emailError && !passwordError) {
            login(email, password);
        } else {
            toast.error('올바른 이메일과 비밀번호를 입력해주세요.');
        }
    };

    const login = (email, password) => {
        const options = {
            method: 'POST',
            credentials: 'include', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        };

        fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/login`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('email', email);
                    navigate('/main');
                } else {
                    toast.error(`Authentication failed: ${data.error}`);
                }
            })
            .catch(error => {
                console.error('Login error:', error);
                toast.error('An error occurred during login.');
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

            <button className="SubmitBtn" style={{marginTop: '25px'}}>로그인</button>

            <div className="signUpTextContainer"
                 style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '12px'}}>
                {/* <p style={{margin: 0, fontSize: '14px'}}>아직 계정이 없나요?</p> */}
                <a href="/register" className="Text14" style={{ fontWeight: '800'}}>회원가입</a><span style={{margin: '8px'}}>|</span>
                <a href="/main" className="Text14" style={{ fontWeight: '800'}}>게스트 접속</a>
            </div>
            
            <ToastContainer />
        </form>
    );
};

export default LoginForm;
