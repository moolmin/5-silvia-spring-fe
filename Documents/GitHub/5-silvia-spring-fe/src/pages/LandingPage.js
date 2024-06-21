import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="LandingPage">
            <div className="LandingWelcome">
                <div className="LandingText">
                    <img src='https://lh3.google.com/u/0/d/152azbN1sQMWe0HAN_osfFvUfzHABUfFU=w3024-h1714-iv1'
                         alt="Landing"/>
                </div>
                <div className="BlobImg">
                    <img src='https://lh3.google.com/u/0/d/1L7NkqzWDg0HpchM8e4fN0i-idGSvYAzM=w2652-h1714-iv1'
                         alt="Blob"/>
                </div>
            </div>


            <div className="LandingNavigation">
                <nav>
                    <Link to="/login" className="nav-link">로그인</Link>
                    <Link to="/main" className="nav-link" >아보월드 둘러보기</Link>
                    <Link to="/register" className="nav-link">회원가입</Link>
                </nav>
            </div>
            {/*</div>*/}
            {/*<div className="NaviBackground">*/}
            {/*<img src='https://lh3.google.com/u/0/d/1oxpEV_WJ30edrPYy__dvFI4Pt8oZiAze=w3024-h1714-iv3' alt="Navi"/>*/}
            {/*<img src='https://lh3.google.com/u/0/d/1oxpEV_WJ30edrPYy__dvFI4Pt8oZiAze=w3024-h1714-iv3' alt="Navi"/>*/}

        </div>
    );
};

export default LandingPage;

