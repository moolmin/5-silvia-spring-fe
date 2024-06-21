import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import axios from "axios";

const PostEditPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/posts/${postId}`);
                setPost(response.data);
                setTitle(response.data.title);
                setContent(response.data.article);
                setImageUrl(response.data.post_picture);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:3001/api/posts/${postId}`, {
                postTitle: title,
                postContents: content,
                postImage: imageUrl
            }, {
                withCredentials: true,
            });

            if (response.status !== 200) {
                throw new Error('Failed to update post');
            }

            alert('게시글이 업데이트되었습니다.');
            navigate(`/post/${postId}`);
        } catch (error) {
            console.error('Error updating post:', error);
            alert('게시글 업데이트 중 오류가 발생했습니다.');
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file && postId) {
            const formData = new FormData();
            formData.append('postImage', file);

            setUploading(true);
            try {
                const response = await axios.put(`http://localhost:3001/api/posts/${postId}/image`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                });

                if (response.status !== 200) {
                    throw new Error('Failed to upload image');
                }
                setImageUrl(response.data.post_picture);
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('이미지 업로드 중 오류가 발생했습니다.');
            } finally {
                setUploading(false);
            }
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
            <PostForm
                postId={postId}
                TitleValue={title}
                ContentValue={content}
                ImageUrlValue={imageUrl}
                onTitleChange={handleTitleChange}
                onContentChange={handleContentChange}
                onSubmit={handleSubmit}
                onImageUpload={handleImageUpload}
                isUploading={uploading}
            />
        </div>
    );
};

export default PostEditPage;
