import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Pagination = ({ postsPerPage, totalPosts, currentPage, paginate }) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const visiblePages = (pageNumbers) => {
        if (totalPages <= 3) return pageNumbers;
        if (currentPage <= 3) return [1, 2, 3, '...', totalPages];
        if (currentPage >= totalPages - 2) return [1, '...', totalPages - 2, totalPages - 1, totalPages];
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    };

    const renderedPages = visiblePages(pageNumbers);

    return (
        <div className="pagination-container">
            <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-arrow"
            >
                <FaArrowLeft />
            </button>
            <ul className="pagination">
                {renderedPages.map((number, index) => (
                    <li key={index} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        {number === '...' ? (
                            <span className="dots">...</span>
                        ) : (
                            <button onClick={() => paginate(number)} className="page-link">
                                {number}
                            </button>
                        )}
                    </li>
                ))}
            </ul>
            <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-arrow"
            >
                <FaArrowRight />
            </button>
        </div>
    );
};

export default Pagination;
