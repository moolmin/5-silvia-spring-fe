import React, { useState, useEffect } from 'react';
import HelperMessage from './HelperMessage';
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { BiRename } from "react-icons/bi";

// Common InputField component
const InputField = ({ type, value, onChange, placeholder }) => {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="InputField"
        />
    );
};

const getFieldStyle = (error, helperText) => {
    return { marginBottom: error || helperText ? '0px' : '22px' };
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const createInputField = (type, defaultLabel, defaultPlaceholder, defaultHelperText, additionalValidation, IconComponent) => {
    return ({ label = defaultLabel, error, labelStyle, ...rest }) => {
        const [helperText, setHelperText] = useState(defaultHelperText);

        useEffect(() => {
            if (!rest.value) {
                setHelperText(defaultHelperText);
            } else if (additionalValidation) {
                const validationMessage = additionalValidation(rest.value);
                if (validationMessage) {
                    setHelperText(validationMessage);
                } else {
                    setHelperText('');
                }
            } else {
                setHelperText('');
            }
        }, [rest.value]);

        const fieldStyle = getFieldStyle(error, helperText);

        return (
            <div className="FormInpuFormInputGrouptGroup" style={fieldStyle}>
                <div className="Text18" style={labelStyle}>{label}</div>
                <div className="InputWithIcon">
                    {IconComponent && <IconComponent className="Icon" />}
                    <InputField
                        type={type}
                        placeholder={defaultPlaceholder}
                        {...rest}
                        style={{ paddingLeft: '8px' }}
                    />
                </div>
                {(error || helperText) && <HelperMessage text={error || helperText}/>}
            </div>
        );
    };
};

// Creating input field components
const EmailInputField = createInputField("email", "", "이메일을 입력하세요.", "*이메일을 입력해주세요.", (value) => !isValidEmail(value) && "*올바른 이메일 주소 형식을 입력해주세요", FaUser);
const PasswordInputField = createInputField("password", "", "비밀번호를 입력하세요.","*비밀번호를 입력해주세요.", null, RiLockPasswordFill);
const PasswordConfirmInputField = createInputField("password", "", "비밀번호 확인을 입력하세요.","*비밀번호 확인을 입력해주세요.", null, RiLockPasswordFill);
const NicknameInputField = createInputField("text", "", "닉네임을 입력하세요.", "*닉네임을 입력해주세요.", (value) => value.length > 10 ? "*닉네임은 최대 10자까지 작성 가능합니다." : "", BiRename);

// ProfileInputField component is created separately due to the file upload nature
const ProfileInputField = ({ profileImageError, profileImagePreview, handleProfileImageChange, label = "프로필 사진", labelStyle }) => {
    const [helperText, setHelperText] = useState('*프로필 사진을 추가해주세요.');

    useEffect(() => {
        if (profileImageError) {
            setHelperText(profileImageError);
        } else if (profileImagePreview) {
            setHelperText('');
        } else {
            setHelperText('*프로필 사진을 추가해주세요.');
        }
    }, [profileImageError, profileImagePreview]);

    const fieldStyle = getFieldStyle(profileImageError, helperText);

    return (
        <div className="FormInputGroup" style={fieldStyle}>
            {/*<div className="Text18" style={labelStyle}>{label}</div>*/}
            {(profileImageError || helperText) && <HelperMessage text={profileImageError || helperText} style={{marginLeft: '10px'}}/>}
            <label htmlFor="file-upload" id="upload-btn" style={{ backgroundImage: `url(${profileImagePreview})` }}>
                {!profileImagePreview && <div id="cross-shape"></div>}
                <input type="file" id="file-upload" onChange={handleProfileImageChange} />
            </label>
        </div>
    );
};

export { EmailInputField, PasswordInputField, PasswordConfirmInputField, NicknameInputField, ProfileInputField };
