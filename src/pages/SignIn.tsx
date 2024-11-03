import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, BookOpen, MoonIcon } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from '../config/firebaseConfig';
import { provider } from '../config/firebaseConfig';
import { FcGoogle } from "react-icons/fc";


export default function SignIn() {

  // local states to hold the email and password
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [Loading, setLoading] = useState(false)
  const [theme, settheme] = useState(true)
  const [showPassword, setshowPassword] = useState(false)

  // for the navigation purpose
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            localStorage.setItem('user', JSON.stringify({
              uid: user.uid,
              email: user.email,
              profile: user.photoURL
              // Add any other user data you want to store
            }));

            // Get the JWT token
            const token = await user.getIdToken();

            // Store the token in local storage
            localStorage.setItem('token', token);

            navigate('/');
          })
          .catch((error) => {
            // const errorCode = error.code;
            setLoading(false);
            console.log(error.message);
          });
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }, 3000);
  };

  // sign in with google popups
  const handleToSignInWithGoogle = async () => {
    try {
      signInWithPopup(auth, provider)
        .then( async (result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
<<<<<<< HEAD
          const tokens = credential?.accessToken;
          console.log(tokens);
=======
          const token = credential?.accessToken;
          console.log(token);
>>>>>>> def8d41e043aa3cbfae728626b7065e7fa64b9cb
          // The signed-in user info.
          const user = result.user;
          // Save the user login data into local storage
          localStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            profile: user.photoURL
            // Add any other user data you want to store
          }));
<<<<<<< HEAD
          // Get the JWT token
          const token = await user.getIdToken();

          // Store the token in local storage
          localStorage.setItem('token', token);
=======
          localStorage.setItem("auth" , "t");
>>>>>>> def8d41e043aa3cbfae728626b7065e7fa64b9cb
          navigate('/');
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        }).catch((error) => {
          // Handle Errors here.
          // const errorCode = error.code;
          console.log(error.message);
          // The email of the user's account used.
          // const email = error.customData.email;
          // The AuthCredential type that was used.
          // const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {/* header */}
      <div className='flex items-center justify-between px-10 pt-10 bg-gray-50 dark:bg-gray-900'
        style={{ backgroundColor: theme ? "rgb(18,25,40)" : 'white' }}
      >
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-500" />
          <span className="text-xl font-bold text-gray-800 dark:text-white"
            style={{ color: theme ? "white" : "grey" }}
          >EthioLearn</span>
        </Link>
        <button onClick={() => settheme(!theme)}>
          <MoonIcon className="h-6 w-6 text-blue-600 dark:text-blue-500" />
          {/* <CloudLightning /> */}
        </button>
      </div>

      <div className="min-h-screen pt-4 pb-16 flex items-center justify-center bg-gray-50 dark:bg-gray-900"
        style={{ backgroundColor: theme ? "rgb(18,25,40)" : 'white' }}
      >
        <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
          style={{ backgroundColor: theme ? "rgb(25,33,48)" : '' }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Sign in to your account</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
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
                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
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
                <div className='flex mt-4 gap-2 items-center justify-start'>
                  <input type="checkbox" className='h-4 w-4 bg-gray-200' onClick={() => setshowPassword(!showPassword)} />
                  <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>show password</p>
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
            )
              :
              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
              </button>
            }

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
          {/* sign in with google */}
          <p className='text-center'>OR</p>
          <button className='flex items-center text-md justify-center gap-4 text-center w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-gray-600 bg-white hover:bg-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            onClick={() => handleToSignInWithGoogle()}
          >
            <span className='text-2xl'><FcGoogle /></span>
            Sign In with google
          </button>
        </div>
      </div>
    </>
  );
}