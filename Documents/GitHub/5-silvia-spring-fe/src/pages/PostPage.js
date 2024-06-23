import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as PostComponents from '../components/PostComponents';
import * as Buttons from '../components/Buttons';
import Modal from '../components/Modal';
import axios from 'axios';
import ToastMessage from "../components/ToastMessage";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };

    let formattedDate = date.toLocaleString('ko-KR', options);

    formattedDate = formattedDate.replace(/\./g, '/').replace(/ /g, '').replace('오후', 'PM ').replace('오전', 'AM ');

    return formattedDate;
};

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

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postResponse = await fetchWithToken(`http://localhost:8080/api/posts/${postId}`);
                setPost(postResponse);

                const usersResponse = await fetchWithToken('http://localhost:8080/api/accounts');
                setUsers(usersResponse || []);

                const commentsResponse = await fetchWithToken(`http://localhost:8080/api/posts/${postId}/comments?include_edited=true`);
                setComments(commentsResponse);
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
            const response = await axios.get(`http://localhost:8080/api/posts/${postId}/checkEditPermission`, {
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
                await fetchWithToken(`http://localhost:8080/api/posts/${postId}/comments/${commentToDelete}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                setComments(prevComments => prevComments.filter(comment => comment.id !== commentToDelete));
                setSuccessLabel('🥑 댓글이 삭제되었습니다.');
            } else {
                await fetchWithToken(`http://localhost:8080/api/posts/${postId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                setSuccessLabel('🥑 게시글이 삭제되었습니다.');
                navigate('/main');
            }
        } catch (error) {
            if (error.message.includes('403')) {
                setErrorLabel(commentToDelete ? '🥑 댓글 삭제 권한이 없습니다' : '🥑 게시글 삭제 권한이 없습니다');
            } else {
                console.error('삭제 중 오류 발생:', error);
                alert('삭제 중 오류가 발생했습니다.');
            }
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
                const response = await axios.put(
                    `http://localhost:8080/api/posts/${postId}/comments/${editingCommentId}`,
                    { comment_content: commentText },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true
                    }
                );

                if (response.status === 200) {
                    const commentsResponse = await fetchWithToken(`http://localhost:8080/api/posts/${postId}/comments?include_edited=true`);
                    setComments(commentsResponse);
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
                const response = await axios.post(
                    `http://localhost:8080/api/posts/${postId}/comments`,
                    { comment_content: commentText, userId: post.userId },
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

    const author = users.find(user => user.userId === post.userId);

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
                                        <PostComponents.AuthorIcon AuthorImg={author.profilePicture} />
                                        <PostComponents.AuthorName AuthorName={author.nickname} />
                                    </>
                                )}
                                <div className="PostDateContainer">
                                    <PostComponents.Date date={post.createAt} />
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
                    <PostComponents.PostImage PostImg={post.postPicture} />
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
                {comments.map((comment) => {
                    const commentAuthor = users.find(user => user.userId === comment.userId);
                    return (
                        <div key={comment.id} className="Comment">
                            <div className="CommentTopArea">
                                <div className="CommentAuthor">
                                    {commentAuthor && (
                                        <>
                                            <img src={commentAuthor.profilePicture} alt="Author" className="AuthorIcon" />
                                            <div className="CommenterName">{commentAuthor.nickname}</div>
                                        </>
                                    )}
                                    <div className="CommentDateContainer">{comment.createAt}</div>
                                </div>
                                {comment.userId && comment.userId.toString() === post.userId.toString() && (
                                    <div className="CommentBtn">
                                        <Buttons.PostBtn label="수정"
                                                         onClick={() => handleCommentEdit(comment.id, comment.commentContent)} />
                                        <Buttons.PostBtn label="삭제" onClick={() => showModal(comment.id)} />
                                    </div>
                                )}
                            </div>
                            <div className="CommentContent">{comment.commentContent}</div>
                        </div>
                    );
                })}
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
