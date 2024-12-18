import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, LogIn } from "lucide-react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendSignInLinkToEmail
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { provider } from "../config/firebaseConfig";
import { FcGoogle } from "react-icons/fc";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignIn() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [Loading, setLoading] = useState(false);
  const [theme, settheme] = useState(true);
  const [showPassword, setshowPassword] = useState(false);
  const [LoadingForGoogle, setLoadingForGoogle] = useState(false);
  const [passwordLenError, setpasswordLenError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length >= 8) {
      setpasswordLenError(false);
      setLoading(true);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          setLoading(false);
          localStorage.setItem("user_info", JSON.stringify({
            uid: user.uid,
            email: user.email,
            profile: user.photoURL,
          }));
          toast.success("Login successfully!", { position: "top-center" });
          navigate("/on-boarding");
        })
        .catch((error) => {
          setLoading(false);
          toast.error("Failed to Login. Please try again.", { position: "top-center" });
        });
    } else {
      setpasswordLenError(true);
    }
  };

  const handleToSignInWithGoogle = async () => {
    setLoadingForGoogle(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        localStorage.setItem('user_info', JSON.stringify({
          uid: user.uid,
          email: user.email,
          profile: user.photoURL
        }));
        setLoadingForGoogle(false);
        navigate("/on-boarding");
      })
      .catch((error) => {
        setLoadingForGoogle(false);
        alert("Failed to sign in with Google. Please try again.");
      });
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8 p-8 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Sign in to your account</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-500 dark:text-gray-300">Email</label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    className="pl-10 w-full px-4 py-2 border border-gray-300 bg-gray-100 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your email"
                    onChange={(e) => setemail(e.target.value)}
                    value={email}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-500 dark:text-gray-300">Password</label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="pl-10 w-full px-4 py-2 border border-gray-300 bg-gray-100 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your password"
                    onChange={(e) => setpassword(e.target.value)}
                    value={password}
                  />
                </div>
                {passwordLenError && (
                  <p className="text-red-600 font-normal">Error: password must be at least 8 characters!</p>
                )}
                <div className="flex mt-4 gap-2 items-center justify-start">
                  <input
                    type="checkbox"
                    className="h-4 w-4 bg-gray-200"
                    onClick={() => setshowPassword(!showPassword)}
                  />
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Show password</p>
                </div>
              </div>
            </div>

            {Loading ? (
              <div className="flex justify-center items-center">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              </div>
            ) : (
              <button
                type="submit"
                className="flex items-center justify-center gap-2 text-center w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
                <LogIn className="w-5 h-5" />
              </button>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">Sign up</Link>
              </p>
            </div>
          </form>

          <p className="text-center">OR</p>
          <button
            className="flex items-center text-md justify-center gap-4 text-center w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-gray-600 bg-blue-100 hover:bg-blue-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleToSignInWithGoogle}
          >
            {LoadingForGoogle ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <FcGoogle className="text-2xl" />
                <span>Sign In with Google</span>
              </>
            )}
          </button>
        </div>
      </div>
      <ToastContainer draggable pauseOnHover={true} autoClose={5000} transition={Bounce} />
    </>
  );
}