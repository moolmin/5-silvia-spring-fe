import React from 'react'


const CreateBtn = ({label, onClick}) => {
    return (
        <button
            className="CreateBtn"
            onClick={onClick}
        >
            {label}
        </button>
    );
};

const PostBtn = ({label, onClick}) => {
    return (
        <button className="PostBtn" onClick={onClick}>{label}</button>
    );
};


const SubmitBtn = ({label}) => {
    return (
        <button className="SubmitBtn">
            {label}
        </button>
    );
};



export {CreateBtn, PostBtn, SubmitBtn};