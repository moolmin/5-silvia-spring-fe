import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import axios from 'axios';
import ToastMessage from '../components/ToastMessage';

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

const PostEditPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [successLabel, setSuccessLabel] = useState('');
    const [errorLabel, setErrorLabel] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/posts/${postId}`);
                setPost(response.data);
                setTitle(response.data.title);
                setContent(response.data.article);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const clearLabels = () => {
        setSuccessLabel('');
        setErrorLabel('');
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearLabels();

        if (!title || !content) {
            setErrorLabel('🥑 제목과 내용을 모두 입력해주세요.');
            return;
        }

        const token = localStorage.getItem('token');
        const updateData = {
            title: title,
            article: content,
        };

        setUploading(true);

        try {
            let response;
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('data', new Blob([JSON.stringify(updateData)], { type: 'application/json' }));

                response = await axios.put(`http://localhost:8080/api/posts/${postId}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                response = await axios.put(`http://localhost:8080/api/posts/${postId}`, JSON.stringify({ ...updateData, postPicture: post.postPicture }), {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }

            if (response.status === 200) {
                setSuccessLabel('🥑 게시글이 업데이트되었습니다.');
                setTimeout(() => {
                    navigate(`/post/${postId}`);
                }, 2000);
            } else {
                setErrorLabel(`🥑 게시글 업데이트 실패: ${response.data}`);
            }
        } catch (error) {
            console.error('Error updating post:', error);
            setErrorLabel('게시글 업데이트 중 오류가 발생했습니다.');
        } finally {
            setUploading(false);
        }
    };



    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!post) {
        return <p>Post not found</p>;
    }

    return (
        <div className="PostEditPage">
            <div className="Text24">게시글 수정</div>
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

export default PostEditPage;
