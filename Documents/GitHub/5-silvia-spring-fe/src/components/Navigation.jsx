import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.css';

const Navigation = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [bgColor, setBgColor] = useState('crimson');

    const menuItems = [
        { title: '로그인', icon: 'fa-user', color: '#dc143c' },
        { title: '메인', icon: 'fa-home', color: '#3c40c6' },
        { title: '회원가입', icon: 'fa-user-plus', color: '#05c46b' },
    ];

    const handleItemClick = (index, color) => {
        setActiveIndex(index);
        setBgColor(color);
    };

    return (
        <div className="navigation" style={{ backgroundColor: bgColor }}>
            <ul>
                {menuItems.map((item, index) => (
                    <li
                        key={index}
                        className={`list ${activeIndex === index ? 'active' : ''}`}
                        data-color={item.color}
                        onClick={() => handleItemClick(index, item.color)}
                    >
                        <a href="#">
                            <span className="icon"><i className={`far ${item.icon}`}></i></span>
                            <span className="title">{item.title}</span>
                        </a>
                    </li>
                ))}
                <div className="indicator" style={{ transform: `translateX(calc(70px * ${activeIndex}))`, backgroundColor: menuItems[activeIndex].color }}></div>
            </ul>
        </div>
    );
};

export default Navigation;
