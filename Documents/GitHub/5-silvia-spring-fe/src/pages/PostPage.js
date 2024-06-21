import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as PostComponents from '../components/PostComponents';
import * as Buttons from '../components/Buttons';
import Modal from '../components/Modal';
import axios from 'axios';
import ToastMessage from "../components/ToastMessage";

const getCookieValue = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

const formatDate = (date) => {
    return new Date(date).toLocaleString();
};

const PostPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [users, setUsers] = useState([]);
    const [successLabel, setSuccessLabel] = useState('');
    const [errorLabel, setErrorLabel] = useState('');

    const userId = getCookieValue('userId');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postResponse = await fetch(`http://localhost:3001/api/posts/${postId}`);
                if (!postResponse.ok) {
                    throw new Error('Failed to fetch post data');
                }
                const postData = await postResponse.json();
                setPost(postData);

                const usersResponse = await fetch('http://localhost:3001/api/accounts');
                if (!usersResponse.ok) {
                    throw new Error('Failed to fetch users data');
                }
                const usersData = await usersResponse.json();
                setUsers(usersData.users);

                const commentsResponse = await fetch(`http://localhost:3001/api/posts/${postId}/comments?include_edited=true`);
                if (!commentsResponse.ok) {
                    throw new Error('Failed to fetch comments data');
                }
                const commentsData = await commentsResponse.json();
                setComments(commentsData);

                await axios.put(`http://localhost:3001/api/posts/${postId}/views`);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!post) {
        return <p>Post not found</p>;
    }

    const handleEdit = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/posts/${postId}/checkEditPermission`, {
                withCredentials: true
            });

            if (response.status === 200) {
                navigate(`/post/edit/${postId}`);
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setErrorLabel('🥑 수정 권한이 없습니다');
            } else {
                console.error('Error checking edit permission:', error);
                alert('권한 확인 중 오류가 발생했습니다.');
            }
        }
    };

    const showModal = (commentId = null) => {
        setIsModalVisible(true);
        document.body.style.overflow = 'hidden';
        setCommentToDelete(commentId);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        document.body.style.overflow = 'auto';
        setCommentToDelete(null);
    };

    const confirmDelete = async () => {
        try {
            if (commentToDelete) {
                const response = await fetch(`http://localhost:3001/api/posts/${postId}/comments/${commentToDelete}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                if (!response.ok) {
                    if (response.status === 403) {
                        setErrorLabel('🥑 댓글 삭제 권한이 없습니다');
                    } else {
                        throw new Error('Failed to delete comment');
                    }
                } else {
                    setComments(prevComments => prevComments.filter(comment => comment.id !== commentToDelete));
                    setSuccessLabel('🥑 댓글이 삭제되었습니다.');
                }
            } else {
                const response = await fetch(`http://localhost:3001/api/posts/${postId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                if (!response.ok) {
                    if (response.status === 403) {
                        setErrorLabel('🥑 게시글 삭제 권한이 없습니다');
                    } else {
                        throw new Error('Failed to delete post');
                    }
                } else {
                    setSuccessLabel('🥑 게시글이 삭제되었습니다.');
                    window.location.href = '/main';
                }
            }
        } catch (error) {
            console.error('삭제 중 오류 발생:', error);
            alert('삭제 중 오류가 발생했습니다.');
        } finally {
            closeModal();
        }
    };

    const clearLabels = () => {
        setSuccessLabel('');
        setErrorLabel('');
    };

    const handleCommentInputChange = (e) => {
        setCommentText(e.target.value);
    };

    const handleCommentEdit = (commentId, commentText) => {
        setEditingCommentId(commentId);
        setCommentText(commentText);
    };

    const handleCommentRegister = async () => {
        if (editingCommentId) {
            // Update existing comment
            try {
                console.log('Updating comment:', { postId, editingCommentId, commentText });
                const response = await axios.put(
                    `http://localhost:3001/api/posts/${postId}/comments/${editingCommentId}`,
                    { comment_content: commentText },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true
                    }
                );

                if (response.status === 200) {
                    // Re-fetch comments with include_edited=true
                    const commentsResponse = await fetch(`http://localhost:3001/api/posts/${postId}/comments?include_edited=true`);
                    if (!commentsResponse.ok) {
                        throw new Error('Failed to fetch comments data');
                    }
                    const commentsData = await commentsResponse.json();
                    setComments(commentsData);
                } else {
                    throw new Error('Failed to update comment');
                }
            } catch (error) {
                console.error('Error updating comment:', error.response?.data || error.message);
                alert('An error occurred while updating the comment. Please try again later.');
            } finally {
                setEditingCommentId(null);
                setCommentText('');
            }
        } else {
            // Add new comment
            try {
                console.log('Adding new comment:', { postId, commentText, userId });
                const response = await axios.post(
                    `http://localhost:3001/api/posts/${postId}/comments`,
                    { comment_content: commentText, user_id: userId },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true
                    }
                );

                if (response.status === 201) {
                    const newComment = response.data;
                    setComments(prevComments => [...prevComments, newComment]);
                    setCommentText('');
                } else {
                    throw new Error('Failed to add comment');
                }
            } catch (error) {
                console.error('Error adding comment:', error.response?.data || error.message);
                alert('An error occurred while adding the comment. Please try again later.');
            }
        }
    };

    function formatViews(views) {
        if (views >= 1000000) {
            return (views / 1000000).toFixed(1) + "M";
        } else if (views >= 100000) {
            return (views / 1000).toFixed(0) + "k";
        } else if (views >= 10000) {
            return (views / 1000).toFixed(1) + "k";
        } else if (views >= 1000) {
            return (views / 1000).toFixed(1) + "k";
        } else {
            return views.toString();
        }
    }

    const author = users.find(user => user.user_id === post.user_id);

    return (
        <div className="PostPage">
            <div className="Post">
                <div className="PostMetaData">
                    <div className="PostMetaDataInner">
                        <PostComponents.PostTitle postTitle={post.title} />
                        <div className="PostSubContainer">
                            <div className="PostSubContainerLeft">
                                {author && (
                                    <>
                                        <PostComponents.AuthorIcon AuthorImg={author.profile_picture} />
                                        <PostComponents.AuthorName AuthorName={author.nickname} />
                                    </>
                                )}
                                <div className="PostDateContainer">
                                    <PostComponents.Date date={post.create_at} />
                                </div>
                            </div>
                            <div className="PostBtnContainer">
                                <Buttons.PostBtn label="수정" onClick={handleEdit} />
                                <Buttons.PostBtn label="삭제" onClick={() => showModal()} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="PostBody">
                    <PostComponents.PostImage PostImg={post.post_picture} />
                    <PostComponents.PostContent label={post.article} />
                </div>
                <div className="PostCountContainer">
                    <PostComponents.PostCount num={formatViews(post.views)} label="조회수" />
                    <PostComponents.PostCount num={formatViews(comments.length)} label="댓글" />
                </div>
            </div>
            <div className="CommentForm">
                <div className="CommentInputContainer">
                    <textarea
                        type="text"
                        className="CommentInput"
                        placeholder="댓글을 남겨주세요!"
                        value={commentText}
                        onChange={handleCommentInputChange}
                    ></textarea>
                </div>
                <hr />
                <div className="CommentBtnContainer">
                    <Buttons.CreateBtn
                        label={editingCommentId ? "댓글 수정" : "댓글 등록"}
                        style={{ marginRight: '18px' }}
                        onClick={handleCommentRegister}
                    />
                </div>
            </div>
            <div className="CommentsArea">
                {comments.map((comment) => (
                    <div key={comment.id} className="Comment">
                        <div className="CommentTopArea">
                            <div className="CommentAuthor">
                                <img src={comment.profile_picture} alt="Author" className="AuthorIcon" />
                                <div className="CommenterName">{comment.nickname}</div>
                                <div className="CommentDateContainer">{formatDate(comment.create_at)}</div>
                            </div>
                            {comment.user_id && comment.user_id.toString() === userId && (
                                <div className="CommentBtn">
                                    <Buttons.PostBtn label="수정"
                                                     onClick={() => handleCommentEdit(comment.id, comment.comment_content)} />
                                    <Buttons.PostBtn label="삭제" onClick={() => showModal(comment.id)} />
                                </div>
                            )}
                        </div>
                        <div className="CommentContent">{comment.comment_content}</div>
                    </div>
                ))}
            </div>
            <Modal
                isVisible={isModalVisible}
                ModalLabel={commentToDelete ? "댓글을 삭제하시겠습니까?" : "게시글을 삭제하시겠습니까?"}
                ModalContent={commentToDelete ? "삭제한 댓글은 복구할 수 없습니다." : "삭제한 게시글은 복구할 수 없습니다."}
                onClose={closeModal}
                onConfirm={confirmDelete}
            />
            <ToastMessage successLabel={successLabel} errorLabel={errorLabel} clearLabels={clearLabels} />
        </div>
    );
};

export default PostPage;
