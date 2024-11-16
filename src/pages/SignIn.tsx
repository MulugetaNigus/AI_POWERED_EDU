import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, BookOpen, MoonIcon } from "lucide-react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { provider } from "../config/firebaseConfig";
import { FcGoogle } from "react-icons/fc";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignIn() {
  // local states to hold the email and password
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [Loading, setLoading] = useState(false);
  const [theme, settheme] = useState(true);
  const [showPassword, setshowPassword] = useState(false);
  const [LoadingForGoogle, setLoadingForGoogle] = useState(false);
  const [passwordLenError, setpasswordLenError] = useState(false);

  // functions to check the len
  const checkLength = (len: number) => {
    if (len < 8) {
      return false;
    }
    return true;
  };

  // for the navigation purpose
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // first things first check the len of the password
    if (checkLength(password.length)) {
      setpasswordLenError(false);
      setLoading(true);
      setTimeout(() => {
        try {
          signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
              // Signed in
              const user = userCredential.user;
              setLoading(false);
              console.log(user);
              // Save the user login data into local storage
              // localStorage.setItem(
              //   "user",
              //   JSON.stringify({
              //     uid: user.uid,
              //     email: user.email,
              //     profile: user.photoURL,
              //     // Add any other user data you want to store
              //   })
              // );

              // // Get the JWT token
              // const token = await user.getIdToken();

              // // Store the token in local storage
              // localStorage.setItem("token", token);

              // Show a success notification
              toast.success("Login successfully!", {
                position: "top-center",
              });

              navigate("/on-boarding");
            })
            .catch((error) => {
              // const errorCode = error.code;
              setLoading(false);
              // Show an error notification
              toast.error("Failed to Login. Please try again.", {
                position: "top-center",
              });
              console.log(error.message);
            });
        } catch (error) {
          setLoading(false);
          console.log(error);
        }
      }, 3000);
    } else {
      setpasswordLenError(true);
    }
  };

  // filter the firebase error
  const handleFirebaseError = (ErrorCode: string) => {
    let ErrorType = "";
    switch (ErrorCode) {
      case "auth/internal-error":
        ErrorType = "Failed, check your internet connection and try again !";
        break;
      default:
        ErrorType = "Something went wrong, try again !";
        break;
    }

    // return the types of the error cames in switch case
    return ErrorType;
  };

  // sign in with google popups
  const handleToSignInWithGoogle = async () => {
    setLoadingForGoogle(true);
    try {
      signInWithPopup(auth, provider)
        .then(async (result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const tokens = credential?.accessToken;
          console.log(tokens);
          // The signed-in user info.

          // const user = result.user;
          // // Save the user login data into local storage
          // localStorage.setItem('user', JSON.stringify({
          //   uid: user.uid,
          //   email: user.email,
          //   profile: user.photoURL
          //   // Add any other user data you want to store
          // }));
          // // Get the JWT token
          // const token = await user.getIdToken();

          // // Store the token in local storage
          // localStorage.setItem('token', token);
          // localStorage.setItem("auth", "t");

          setLoadingForGoogle(false);
          navigate("/on-boarding");
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          // const errorCode = error.code;
          setLoadingForGoogle(false);
          console.log(error.message);
          alert(handleFirebaseError(error.code));
          // The email of the user's account used.
          // const email = error.customData.email;
          // The AuthCredential type that was used.
          // const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    } catch (error) {
      setLoadingForGoogle(false);
      console.log(error);
    }
  };

  return (
    <>
      {/* header */}
      <div
        className="flex items-center justify-between px-10 pt-10 bg-gray-50 dark:bg-gray-900"
        style={{ backgroundColor: theme ? "rgb(18,25,40)" : "white" }}
      >
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-500" />
          <span
            className="text-xl font-bold text-gray-800 dark:text-white"
            style={{ color: theme ? "white" : "grey" }}
          >
            ExtreamX
          </span>
        </Link>
        <button onClick={() => settheme(!theme)}>
          <MoonIcon className="h-6 w-6 text-blue-600 dark:text-blue-500" />
          {/* <CloudLightning /> */}
        </button>
      </div>

      <div
        className="min-h-screen pt-4 pb-16 flex items-center justify-center bg-gray-50 dark:bg-gray-900"
        style={{ backgroundColor: theme ? "rgb(18,25,40)" : "white" }}
      >
        <div
          className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
          style={{ backgroundColor: theme ? "rgb(25,33,48)" : "" }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Sign in to your account
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your email"
                    onChange={(e) => setemail(e.target.value)}
                    value={email}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your password"
                    onChange={(e) => setpassword(e.target.value)}
                    value={password}
                  />
                </div>
                {passwordLenError && (
                  <p className="text-red-600 font-normal">
                    Error: password must be atleast 8 character !
                  </p>
                )}
                {/* <p>ksjdnfsdjknfsdjkf</p> */}
                <div className="flex mt-4 gap-2 items-center justify-start">
                  <input
                    type="checkbox"
                    className="h-4 w-4 bg-gray-200"
                    onClick={() => setshowPassword(!showPassword)}
                  />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    show password
                  </p>
                </div>
              </div>
            </div>

            {Loading ? (
              <div className="flex justify-center items-center">
                <div className="mx-auto p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
              </button>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
          {/* sign in with google */}
          <p className="text-center">OR</p>
          <button
            className="flex items-center text-md justify-center gap-4 text-center w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-gray-600 bg-white hover:bg-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => handleToSignInWithGoogle()}
          >
            {LoadingForGoogle ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <span className="text-2xl">
                  <FcGoogle />
                </span>
                <span>Sign In with google</span>
              </>
            )}
          </button>
        </div>
      </div>
      <ToastContainer
        draggable
        pauseOnHover={true}
        autoClose={5000}
        transition={Bounce}
      />
    </>
  );
}
