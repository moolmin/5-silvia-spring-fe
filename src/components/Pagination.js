import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Pagination = ({ postsPerPage, totalPosts, currentPage, paginate }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // visiblePages 함수를 제거하고 pageNumbers를 직접 사용합니다.
  const renderedPages = pageNumbers;

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
        {renderedPages.map((number) => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
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
