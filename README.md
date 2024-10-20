## 🥑 AvoWorld 🥑
![readme-003](https://github.com/user-attachments/assets/c2dcfe37-c622-41f0-894f-0714424829e7)

## 📖 Description
아보월드는 아보카도 정보 공유를 위한 커뮤니티입니다.<br />
* [React 프론트엔드 레포지토리](https://github.com/moolmin/avoworld-fe)
* [Spring 백엔드 레포지토리](https://github.com/moolmin/avoworld-be)

## 🕹️ Main Feature
### 랜딩 - 메인 페이지 
 ![랜딩](https://github.com/user-attachments/assets/48a52f16-8b2e-4567-ac14-617b6aede913) |![메인](https://github.com/user-attachments/assets/705ca46f-1abd-4c02-843b-8b9e0cc2bddc)
--- | --- | 


### 로그인 - 회원가입 페이지 
 ![Image 8-26-24 at 3 49 PM](https://github.com/user-attachments/assets/65466ee4-6ff4-4c60-8c85-71beb9df0f79) |![screencapture-d1jlocd3s0jxr6-cloudfront-net-register-2024-08-26-15_50_04](https://github.com/user-attachments/assets/7e349d7f-bad1-4cd7-8be6-deedb3f6f6d5)
--- | --- | 


### 게시물 작성 - 댓글 작성
 ![게시물 작성](https://github.com/user-attachments/assets/8df0b6b2-9c3c-4b74-bb43-dc65d6a9c5c3) |![댓글](https://github.com/user-attachments/assets/4446a3c5-88c8-4aba-9687-d1c94268d641)
--- | --- | 




## 🔧 Stack
### Frontend
![React](https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white)
![React](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=white)

### Backend
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F.svg?&style=for-the-badge&logo=Spring%20Boot&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

### CI/CD & Infra Tools
![AWS EC2](https://img.shields.io/badge/Amazon%20EC2-FF9900?style=for-the-badge&logo=Amazon%20EC2&logoColor=white)
![Amazon S3](https://img.shields.io/badge/amazons3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)
![GitHubAction](https://img.shields.io/badge/GitHubAction-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED.svg?&style=for-the-badge&logo=Docker&logoColor=white) <br />



## 🌐 Architecture
![image](https://github.com/user-attachments/assets/f92563a5-a420-4bcc-93bb-488ca6985524)
* `Github actions`를 활용한 배포 자동화 파이프라인 구축
* **BE**: `deploy`브랜치에서 push 발생시 Spring boot 애플리케이션을 Dockerfile을 사용해 `Docker image`빌드
* **FE**: `deploy`브랜치에서 push 발생시 React 애플리케이션을 `AWS S3`버킷에 배포



