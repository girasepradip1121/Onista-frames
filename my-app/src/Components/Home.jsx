import React, { useEffect, useState } from "react";
import Items from "./Items";
import WallArtIntro from "./WallArtIntro";
import Frame from "./Frame";
import InteriorDesign from "./InteriorDesign";
import Login from "./Login";
import Signup from "./Signup";
import { userToken } from "./Variable";
import BestSeller from "./Best-Seller";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const userData = userToken();

  useEffect(() => {
    if (userData?.token) {
      setShowLogin(false);
      return;
    }

    const handleBeforeUnload = () => {
      sessionStorage.removeItem("popupClosed");
    };

    // window.addEventListener("beforeunload", handleBeforeUnload)

    // Check if popup should be shown
    const popupClosedThisSession = sessionStorage.getItem("popupClosed");
    setShowLogin(!popupClosedThisSession);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleCloseLogin = () => {
    sessionStorage.setItem("popupClosed", "true");
    setShowLogin(false);
  };

  const toggleSignupPopup = () => {
    sessionStorage.setItem("popupClosed", "true");
    setShowLogin(false);
    setShowSignup(true);
  };

  return (
    <>
      {showLogin && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 backdrop-blur-sm z-40"></div>
      )}

      <div>
        {showLogin && (
          <Login
            onClose={handleCloseLogin}
            toggSigupPopup={toggleSignupPopup}
          />
        )}

        {/* Add your Signup component here */}
        {showSignup && (
          <>
            <div className="fixed inset-0 bg-black/80 bg-opacity-50 backdrop-blur-sm z-40"></div>
            <Signup onClose={() => setShowSignup(false)} />
          </>
        )}
      </div>
      {/* <Header/> */}
      <div
        className={
          showLogin
            ? " pointer-events-none select-none transition duration-300"
            : ""
        }
      >
        <InteriorDesign />
      </div>
      <Items />
      <WallArtIntro />
      <BestSeller />
      <Frame />
    </>
  );
}
