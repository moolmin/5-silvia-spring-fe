import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #ccc',
        borderRadius: '15px',
        padding: '0px 10px',
        width: '400px',
        backgroundColor: 'white',
    };

    const iconStyle = {
        marginRight: '10px',
        color: '#aaa',
    };

    const inputStyle = {
        border: 'none',
        outline: 'none',
        width: '100%',
        padding: '10px',
        borderRadius: '15px',
    };

    return (
        <div style={containerStyle}>
            <FaSearch style={iconStyle} />
            <input
                type="text"
                placeholder="검색어를 입력해주세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={inputStyle}
            />
        </div>
    );
};

export default SearchBar;
