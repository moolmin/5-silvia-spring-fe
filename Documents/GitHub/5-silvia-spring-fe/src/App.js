// App.js
import { Routes, Route, useLocation } from 'react-router-dom';
import LANDING from "./pages/LandingPage";
import Home from "./pages/MainPage";
import Board from "./pages/PostPage";
import Login from "./pages/LoginPage";
import SignUp from "./pages/SignUpPage";
import Password from "./pages/PasswordChangePage";
import Profile from "./pages/ProfileEditPage";
import Edit from "./pages/PostEditPage";
import Create from "./pages/PostCreatePage";
import Header from "./components/Header";
import './App.css';
import React from 'react';
import { ROUTES } from './config/routes';

function App() {
  const location = useLocation();

  const headerConfig = {
    '/': { showBackButton: false, showUserProfile: false },
    '/main': { showBackButton: false, showUserProfile: true },
    '/post': { showBackButton: true, showUserProfile: true },
    '/login': { showBackButton: false, showUserProfile: false },
    '/register': { showBackButton: true, showUserProfile: false },
    '/password-change': { showBackButton: false, showUserProfile: true },
    '/profile-edit': { showBackButton: false, showUserProfile: true },
    '/post/edit': { showBackButton: true, showUserProfile: true },
    '/post/create': { showBackButton: true, showUserProfile: true },
  };

  const getCurrentHeaderConfig = (pathname) => {
    if (pathname.startsWith('/post/edit')) return headerConfig['/post/edit'];
    if (pathname.startsWith('/post/create')) return headerConfig['/post/create'];
    if (pathname.startsWith('/post')) return headerConfig['/post'];
    return headerConfig[pathname] || { showBackButton: false, showUserProfile: true };
  };

  const currentHeaderConfig = getCurrentHeaderConfig(location.pathname);

  const getBackgroundClass = (pathname) => {
    if (pathname === ROUTES.LANDING) return 'landing-background';
    if (pathname === ROUTES.BOARD_EDIT || pathname === ROUTES.BOARD_CREATE) return 'default-background';
    return 'main-background';
  };

  const backgroundClass = getBackgroundClass(location.pathname);

  return (
      <div className={`App ${backgroundClass} custom-cursor`}>
        <Header showBackButton={currentHeaderConfig.showBackButton} showUserProfile={currentHeaderConfig.showUserProfile} />
        <div className="CenteredContent" style={{marginBottom: '50px'}}>
          <Routes>
            <Route path={ROUTES.LANDING} element={<LANDING />} />
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.POST} element={<Board />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<SignUp />} />
            <Route path={ROUTES.PASSWORD_CHANGE} element={<Password />} />
            <Route path={ROUTES.PROFILE_EDIT} element={<Profile />} />
            <Route path={ROUTES.BOARD_EDIT} element={<Edit />} />
            <Route path={ROUTES.BOARD_CREATE} element={<Create />} />
          </Routes>
        </div>
      </div>
  );
}

export default App;
