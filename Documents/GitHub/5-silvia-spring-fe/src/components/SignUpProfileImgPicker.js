// import React, { useState, useEffect } from 'react';
//
// const SignUpProfileImgPicker = ({ userId }) => {
//     const [profileImage, setProfileImage] = useState(null);
//
//     useEffect(() => {
//         const fetchUserData = async () => {
//             try {
//                 const response = await fetch('http://localhost:3001/api/accounts', {
//                     credentials: 'include'
//                 });
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch user data');
//                 }
//                 const data = await response.json();
//                 if (!userId) {
//                     console.error('userId cookie is not set');
//                     return;
//                 }
//                 const user = data.users.find(u => u.userId.toString() === userId);
//                 if (user) {
//                     setProfileImage(user.profileimg);
//                 } else {
//                 }
//             } catch (error) {
//                 console.error('Error fetching user data:', error);
//             }
//         };
//
//         fetchUserData();
//     }, [userId]);
//
//     const handleFileChange = async (e) => {
//         const file = e.target.files[0];
//         if (!file) {
//             console.error("No file selected");
//             return;
//         }
//
//         const formData = new FormData();
//         formData.append('profileimg', file);
//
//         try {
//             const response = await fetch(`http://localhost:3001/api/register`, {
//                 method: 'POST',
//                 body: formData,
//                 credentials: 'include',
//             });
//
//             if (!response.ok) {
//                 const errorText = await response.text();
//                 throw new Error(`Failed to upload image: ${errorText}`);
//             }
//             const result = await response.json();
//             setProfileImage(result.profileimg); // Update the profile image after successful upload
//         } catch (error) {
//             console.error('Error uploading image:', error);
//         }
//     };
//
//     return (
//         <>
//             <div className="profile-img-picker">
//                 <label className="upload-button" style={{backgroundImage: `url(${profileImage})`}}>
//                     <div className="ImgBlackFilter">
//                         <input type="file" onChange={handleFileChange} style={{display: 'none'}}/>
//                         <span className="ProfilePickerLabel" >변경</span>
//                     </div>
//                 </label>
//             </div>
//         </>
//     );
// };
//
// export default SignUpProfileImgPicker;

//
// import React, { useState, useEffect } from 'react';
//
// const SignUpProfileImgPicker = ({ userId }) => {
//     const [profileImage, setProfileImage] = useState(null);
//
//     useEffect(() => {
//         const fetchUserData = async () => {
//             try {
//                 const response = await fetch('http://localhost:3001/api/accounts', {
//                     credentials: 'include'
//                 });
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch user data');
//                 }
//                 const data = await response.json();
//                 if (!userId) {
//                     console.error('userId cookie is not set');
//                     return;
//                 }
//                 const user = data.users.find(u => u.userId.toString() === userId);
//                 if (user) {
//                     setProfileImage(user.profileimg);
//                 } else {
//                     console.error('User not found');
//                 }
//             } catch (error) {
//                 console.error('Error fetching user data:', error);
//             }
//         };
//
//         fetchUserData();
//     }, [userId]);
//
//     const handleFileChange = async (e) => {
//         const file = e.target.files[0];
//         if (file && userId) {
//             const formData = new FormData();
//             formData.append('profileimg', file);
//
//             try {
//                 const response = await fetch(`http://localhost:3001/api/register/image`, {
//                     method: 'POST',
//                     body: formData,
//                     credentials: 'include',
//                 });
//
//                 if (!response.ok) {
//                     const errorText = await response.text();
//                     throw new Error(`Failed to upload image: ${errorText}`);
//                 }
//                 const result = await response.json();
//                 setProfileImage(result.profileimg); // Update the profile image after successful upload
//             } catch (error) {
//                 console.error('Error uploading image:', error);
//             }
//         }
//     };
//
//     return (
//         <>
//             <div className="profile-img-picker">
//                 <label className="upload-button" style={{backgroundImage: `url(${profileImage})`}}>
//                     <div className="ImgBlackFilter">
//                         <input type="file" onChange={handleFileChange} style={{display: 'none'}}/>
//                         <span className="ProfilePickerLabel" >변경</span>
//                     </div>
//                 </label>
//             </div>
//         </>
//     );
// };
//
// export default SignUpProfileImgPicker;

import React, { useState } from 'react';

// const SignUpProfileImgPicker = () => {
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [previewSrc, setPreviewSrc] = useState('');
//     const [uploadError, setUploadError] = useState('');
//
//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         setSelectedFile(file);
//
//         // Display a preview of the selected image
//         const reader = new FileReader();
//         reader.onloadend = () => {
//             setPreviewSrc(reader.result);
//         };
//         reader.readAsDataURL(file);
//     };
//
//     const handleUpload = async () => {
//         if (!selectedFile) {
//             setUploadError('파일을 선택해주세요.');
//             return;
//         }
//
//         const formData = new FormData();
//         formData.append('profileimg', selectedFile);
//
//         try {
//             const response = await fetch('http://localhost:3001/api/register/profileimg', {
//                 method: 'POST',
//                 body: formData,
//             });
//
//             if (response.ok) {
//                 const data = await response.json();
//                 alert(`이미지가 성공적으로 업로드되었습니다: ${data.profileimg}`);
//                 setUploadError('');
//             } else {
//                 const errorText = await response.text();
//                 setUploadError(`이미지 업로드 실패: ${errorText}`);
//             }
//         } catch (error) {
//             console.error('Error uploading the image:', error);
//             setUploadError('이미지 업로드 중 오류가 발생했습니다.');
//         }
//     };

//////////////// 깔깔깔깔
// const SignUpProfileImgPicker = ({ onUploadSuccess }) => {
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [previewSrc, setPreviewSrc] = useState('');
//     const [uploadError, setUploadError] = useState('');
//
//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         setSelectedFile(file);
//
//         // Display a preview of the selected image
//         const reader = new FileReader();
//         reader.onloadend = () => {
//             setPreviewSrc(reader.result);
//         };
//         reader.readAsDataURL(file);
//     };
//
//     const handleUpload = async () => {
//         if (!selectedFile) {
//             setUploadError('파일을 선택해주세요.');
//             return;
//         }
//
//         const formData = new FormData();
//         formData.append('profileimg', selectedFile);
//
//         try {
//             const response = await fetch('http://localhost:3001/api/register', {
//                 method: 'POST',
//                 body: formData,
//             });
//
//             if (response.ok) {
//                 const data = await response.json();
//                 onUploadSuccess(data.profileimg);
//                 alert(`이미지가 성공적으로 업로드되었습니다: ${data.profileimg}`);
//                 setUploadError('');
//             } else {
//                 const errorText = await response.text();
//                 setUploadError(`이미지 업로드 실패: ${errorText}`);
//             }
//         } catch (error) {
//             console.error('Error uploading the image:', error);
//             setUploadError('이미지 업로드 중 오류가 발생했습니다.');
//         }
//     };
//
//
//     return (
//         <div className="SignUpProfileImgPicker">
//             <input type="file" accept="image/*" onChange={handleFileChange} />
//             {previewSrc && <img src={previewSrc} alt="Profile Preview" style={{ width: '100px', height: '100px' }} />}
//             {uploadError && <div style={{ color: 'red' }}>{uploadError}</div>}
//             <button type="button" onClick={handleUpload}>이미지 업로드</button>
//         </div>
//     );
// };
//
// export default SignUpProfileImgPicker;
