import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostForm from '../components/PostForm';
import { useNavigate } from 'react-router-dom';
import ToastMessage from "../components/ToastMessage";

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

const PostCreatePage = () => {
    const [successLabel, setSuccessLabel] = useState('');
    const [errorLabel, setErrorLabel] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const usersResponse = await fetchWithToken('http://localhost:8080/api/accounts');
                setUsers(usersResponse || []);
            } catch (error) {
                setErrorLabel(`Error fetching users: ${error.message}`);
            }
        };
        fetchAccount();
    }, []);

    const getLoggedInUserId = (users) => {
        const email = localStorage.getItem('email');
        const user = users.find(user => user.email === email);
        return user ? user.userId : null;
    };

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleContentChange = (e) => setContent(e.target.value);
    const handleFileChange = (e) => setFile(e.target.files[0]);

    const clearLabels = () => {
        setSuccessLabel('');
        setErrorLabel('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        clearLabels();

        if (!title || !content) {
            setErrorLabel('🥑 제목과 내용을 모두 입력해주세요.');
            return;
        }

        if (!file) {
            setErrorLabel('🥑 이미지를 선택해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const data = {
            title: title,
            article: content,
            userId: getLoggedInUserId(users),
            createAt: new Date().toISOString(),
            views: 0,
            likes: 0
        };

        formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

        setUploading(true);

        try {
            const response = await axios.post('http://localhost:8080/api/posts', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                setSuccessLabel('🥑 게시글이 작성되었습니다.');
                setTimeout(() => {
                    navigate('/main');
                }, 2000);
            } else {
                setErrorLabel(`🥑 게시글 작성 실패: ${response.data}`);
            }
        } catch (error) {
            console.error('Error creating post:', error);
            setErrorLabel('게시글 작성 중 오류가 발생했습니다.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="PostCreatePage">
            <div className="Text24">게시글 작성</div>
            <PostForm
                TitleValue={title}
                ContentValue={content}
                onTitleChange={handleTitleChange}
                onContentChange={handleContentChange}
                onImageUpload={handleFileChange}
                onSubmit={handleSubmit}
                isUploading={uploading}
            />
            {uploading && <div>Uploading...</div>}
            <ToastMessage successLabel={successLabel} errorLabel={errorLabel} clearLabels={clearLabels} />
        </div>
    );
};

export default PostCreatePage;
