import React from 'react'


const PostTitle = ({postTitle}) => {
    return (
        <div className="Text24">{postTitle}</div>
    );
};

const AuthorIcon = ({AuthorImg}) => {
    return (
        <img src={AuthorImg} alt="Author" className="AuthorIcon" />
    );
};


const AuthorName = ({AuthorName}) => {
    return (
        <div className="AuthorName">{AuthorName}</div>
    );
};

const Date = ({date = "2021-01-01 00:00:00"}) => {
    return (
        <p className="Date">{date}</p>
    );
}

const PostImage = ({PostImg}) => {
    return (
        <img src={PostImg} alt="Img" className="PostImage"/>
)
    ;
};

const PostContent = ({label}) => {
    return (
        <div className="PostContent">{label}</div>
    );
};

const PostCount = ({num, label}) => {
    return (
        <div className="PostCount">
            <div className="PostCountNum">
                {num}
            </div>
            <div className="PostCountLabel">
                {label}
            </div>

        </div>
    );
};


// const Comment = ({ CommentAuthorImg, CommentText, CommentAuthor, CommentDate }) => {
//
//     return (
//         <div className="Comment">
//             <div className="CommentTopArea">
//                 <div className="CommentAuthor">
//                     <img src={CommentAuthorImg} alt="Author" className="AuthorIcon" />
//                     <div className="CommenterName">{CommentAuthor}</div>
//                     <div className="CommentDateContainer">{CommentDate}</div>
//                 </div>
//                     <div className="CommentBtn">
//                         <Buttons.PostBtn label="수정" />
//                         <Buttons.PostBtn label="삭제" />
//                     </div>
//             </div>
//             <div className="CommentContent">{CommentText}</div>
//         </div>
//     );
// };


export {PostTitle, AuthorIcon, AuthorName, Date, PostImage, PostContent, PostCount };