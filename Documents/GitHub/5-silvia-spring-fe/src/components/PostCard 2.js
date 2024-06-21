import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as PostComponents from './PostComponents';
import SearchBar from './SearchBar';
import * as Buttons from '../components/Buttons';
import Pagination from './Pagination';

const PostCard = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 3;

    const navigate = useNavigate();
    const createClick = () => {
        navigate('/post/create');
    };

    useEffect(() => {
        // Fetch posts data
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/posts');
                const postsData = await response.json();
                const postsArray = Object.keys(postsData).map(key => ({
                    postId: key,
                    ...postsData[key]
                }));
                setPosts(postsArray);
                setFilteredPosts(postsArray); // Initially show all posts
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        // Fetch users data
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/accounts');
                const usersData = await response.json();
                setUsers(usersData.users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchPosts();
        fetchUsers();
    }, []);

    useEffect(() => {
        // Filter posts based on search term
        const filtered = posts.filter(post =>
            post.postTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPosts(filtered);
        setCurrentPage(1); // Reset to first page on new search
    }, [searchTerm, posts]);

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    // Handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const navigateToPost = (postId) => {
        navigate(`/post/${postId}`);
    };

    return (
        <div>
            <div className="SearchContainer">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <Buttons.CreateBtn
                    label="게시글 작성"
                    onClick={createClick}
                />
            </div>
            <div className="PostCardsContainer" style={{ cursor: 'pointer' }}>
                {currentPosts.map((post) => {
                    const { postId, authorId, postTitle, views, likes, comments, date } = post;
                    const commentCount = comments.length;
                    const likeCommentViewsStr = `좋아요 ${likes} 댓글 ${commentCount} 조회수 ${views}`;

                    const author = users.find(user => user.userId === authorId);
                    const authorName = author ? author.nickname : 'Unknown';
                    const authorImage = author ? author.profileimg : 'default-image-url'; // default image URL

                    return (
                        <div key={postId} className="PostCard" onClick={() => navigateToPost(postId)}>
                            <div className="PostCardTopArea">
                                <PostComponents.PostTitle postTitle={postTitle} />
                                <div className="PostCardMeta">
                                    <p className="PostCardDetail">{likeCommentViewsStr}</p>
                                    <PostComponents.Date date={date} />
                                </div>
                            </div>
                            <div className="PostCardLine"></div>
                            <div className="PostCardBottomArea">
                                <PostComponents.AuthorIcon AuthorImg={authorImage} />
                                <PostComponents.AuthorName AuthorName={authorName} />
                            </div>
                        </div>
                    );
                })}
            </div>
            <Pagination
                postsPerPage={postsPerPage}
                totalPosts={filteredPosts.length}
                currentPage={currentPage}
                paginate={paginate}
            />
        </div>
    );
};

export default PostCard;
