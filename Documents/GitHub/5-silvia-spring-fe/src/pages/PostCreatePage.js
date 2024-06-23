import React, { useState } from 'react';
import axios from 'axios';
import PostForm from '../components/PostForm';
import { useNavigate } from 'react-router-dom';
import ToastMessage from "../components/ToastMessage";

const PostCreatePage = () => {
    const [successLabel, setSuccessLabel] = useState('');
    const [errorLabel, setErrorLabel] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleContentChange = (e) => setContent(e.target.value);
    const handleFileChange = (e) => setFile(e.target.files[0]);

    const clearLabels = () => {
        setSuccessLabel('');
        setErrorLabel('');
    };

    const token = localStorage.getItem('token');
    // const userId = localStorage.getItem('userId');

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
        formData.append('file', file); // 이미지 파일 추가

        const data = {
            title: title,
            article: content,
            userId: 1, // userId 동적으로 설정
            createAt: new Date().toISOString(),
            views: 0,
            likes: 0
        };

        formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

        // FormData entries 출력
        for (let pair of formData.entries()) {
            console.log(pair[0] + ', ' + (pair[1] instanceof Blob ? 'Blob' : pair[1]));
        }

        try {
            const response = await axios.post('http://localhost:8080/api/posts', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                setSuccessLabel('게시글이 작성되었습니다.');
                setTimeout(() => {
                    navigate('/main');
                }, 2000);
            } else {
                const errorText = response.data;
                setErrorLabel(`🥑 게시글 작성 실패: ${errorText}`);
            }
        } catch (error) {
            console.error('Error creating post:', error);
            setErrorLabel('게시글 작성 중 오류가 발생했습니다.');
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
                onImageUpload={handleFileChange} // 파일 변경 핸들러 추가
                onSubmit={handleSubmit}
                isUploading={uploading}
            />
            <ToastMessage successLabel={successLabel} errorLabel={errorLabel} clearLabels={clearLabels} />
        </div>
    );
};

export default PostCreatePage;
