import React from 'react';
import LoginForm from "../components/LoginForm";
// import Lottie from 'react-lottie'
// import animationData from "../lottie/avocado.json"


const LandingPage = () => {
    // const defaultOptions = {
    //     loop: true,
    //     autoplay: true,
    //     animationData: animationData,
    //     rendererSettings: {
    //         preserveAspectRatio: 'xMidYMid slice'
    //     }
    // };

    return (
        <div className="LandingPage">


            <div className="LandingWelcome">

                <div className="LandingText">
                    <img
                        src='https://lh3.google.com/u/0/d/1jSfFTwagmPqakfSujwHKPiT-COrCJBSs=w3024-h1714-iv1'
                        alt="Landing"
                    />
                    {/*<div className="LandingAnimation">*/}
                    {/*    <Lottie options={defaultOptions} height={200} width={200}/>*/}
                    {/*</div>*/}
                </div>


                <div className="LandingLoginContainer">

                    <LoginForm/>
                </div>

            </div>


        </div>
    );
};

export default LandingPage;

