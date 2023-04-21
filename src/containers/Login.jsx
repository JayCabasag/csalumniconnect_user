import React, {useRef, useState} from 'react'
import {FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import {  Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider} from 'firebase/auth';
import { auth } from '../firebase-config';
import { getFirestore, setDoc, doc, getDoc} from 'firebase/firestore';

const Login = () => {

  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const logo = "https://firebasestorage.googleapis.com/v0/b/cs-alumni-connect.appspot.com/o/images%2Fcs_allumni_logo.2.png?alt=media&token=7a7fca12-0eeb-4182-9340-7563123b9ffd"

  
  const [user, setUser] = useState({})
  
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  })

  const login = async (e) => {
    e.preventDefault()
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if(email === '' || password === '') {
      setErrorMessage('Some fields are Empty');
      setError(true);
      setSuccess(false)
      return;
    }
    try{
      
      const user = await signInWithEmailAndPassword(auth, email, password)
      setSuccess(true)
      setSuccessMessage('Signed in Successfully!')
      navigate('/')
      setErrorMessage('');
      setError(false);

      localStorage.setItem('name', auth.currentUser.displayName)
      localStorage.setItem('email', auth.currentUser.email)
      localStorage.setItem('uid', auth.currentUser.uid)
      localStorage.setItem('displayName', auth.currentUser.uid)
      localStorage.setItem('photoURL', auth.currentUser.photoURL)

      addNewUserFromSocialMedia(auth.currentUser.uid, auth.currentUser.email, auth.currentUser.displayName, auth.currentUser.photoURL)

    } catch (error) {
      setErrorMessage(error.code)
      setError(true)
    }
  }

  
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
    .then((response) => {
      localStorage.setItem('name', response.user.displayName)
      localStorage.setItem('email', response.user.email)
      localStorage.setItem('uid', response.user.uid)
      localStorage.setItem('displayName', response.user.uid)
      localStorage.setItem('photoURL', response.user.photoURL)
      navigate('/')
      addNewUserFromSocialMedia(response.user.uid,response.user.email, response.user.displayName, response.user.photoURL)  
    }).catch((error) => {
      console.log(error)
    })
  }

  const signInWithFacebook = () => {
    const provider = new FacebookAuthProvider();

    signInWithPopup(auth, provider)
    .then((response) => {
      
      localStorage.setItem('name', response.user.displayName)
      localStorage.setItem('email', response.user.email)
      localStorage.setItem('uid', response.user.uid)
      localStorage.setItem('displayName', response.user.uid)
      localStorage.setItem('photoURL', response.user.photoURL)
      navigate('/')
      
      addNewUserFromSocialMedia(response.user.uid,response.user.email, response.user.displayName, response.user.photoURL)

    }).catch((error) => {
      console.log(error)
    })
  }
  

  const addNewUserFromSocialMedia = async (uid, userEmail, name, photoUrl) => {

    const docRef = doc(getFirestore(), 'users',  `${uid}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      
      console.log(docSnap.data().verified)

    } else {
      setDoc(doc(getFirestore(), 'users', `${uid}`), {
        displayName: name,
        email: userEmail,
        image: photoUrl,
        interests: [],
        studentId: '',
        course: '',
        year: '',
        verified: false,
        employmentStatus: 'Rather not say'
      })

      navigate('/landingpage')
    }
  }
  return (
    <div className='px-4 flex w-screen h-screen justify-center items-center'>
      <div className='pb-10 p-5 h-auto w-screen md:w-2/5 lg:w-1/4 border-2 rounded-md bg-white pt-10'>
         
        <form className='space-y-5 w-full h-full flex flex-col justify-center items-center'
          onSubmit={login}
          >
            <img src={logo} alt='tcuhub' width={180}/>      
            {
              error && <p className='text-fuchsia-700'>{errorMessage}</p>
            }
          <input type="email" placeholder="E-mail" ref={emailRef} className='text-slate-400 px-2 text-16 leading-10 w-full border outline-none'/>
          <input type="password" placeholder="Password" ref={passwordRef} className='text-slate-400 text-gray px-2 text-16 leading-10 w-full border outline-none'/>
          <button 
            className='w-full bg-fuchsia-700 rounded py-3 text-white '
            disabled={loading}
            type="submit"
            >Login</button>
            <div className='flex w-full'>
              <Link to={"/forgot-password"} className='text-slate-500 text-sm mr-auto pl-2 ml-0'>Forgot Password</Link>
              <Link to={"/register"} className='text-slate-500 text-sm mr-2 pr-2 ml-auto'>Register Now</Link>
            </div>
          <p className='text-slate-400'>or login using social media</p>
          <div className='flex gap-3'>
            <FaFacebook className='text-blue-600 h-7 w-7 cursor-pointer' onClick={signInWithFacebook}/>
            <FcGoogle  className='h-7 w-7 cursor-pointer' onClick={signInWithGoogle}/>
          </div>
        </form>
      </div>
    </div>
    
  )
}

export default Login