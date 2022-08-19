import React, { useRef, useState } from 'react'
import { auth } from '../firebase-config';
import { signInWithEmailAndPassword, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, sendPasswordResetEmail} from 'firebase/auth'
import Logo from '../assets/Logo.png';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {

const emailRef = useRef()
const [error, setError] = useState(false)
const [errorMessage, setErrorMessage] = useState('')

const sendLink = async () => {

    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if ( re.test(emailRef.current.value) ) {
        try {
            await sendPasswordResetEmail(auth, emailRef.current.value)
            setError(false)
            setErrorMessage('')
        } catch (e) {
            setError(true)
            setErrorMessage('Unable to send a link to this email')
        }
    }
    else {
            setError(true)
            setErrorMessage('Please provide a valid Email.')
    }
}

  return (
    <div className='px-4 flex w-screen h-screen justify-center items-center'>
    <div className='pb-10 p-5 h-auto w-screen md:w-2/5 lg:w-1/4 border-2 rounded-md bg-white pt-10'>
       
      <form className='space-y-5 w-full h-full flex flex-col justify-center items-center'
        onSubmit={sendLink}
        >
          <img src={"https://firebasestorage.googleapis.com/v0/b/cs-alumni-connect.appspot.com/o/images%2Fcs_allumni_logo.2.png?alt=media&token=7a7fca12-0eeb-4182-9340-7563123b9ffd"} alt='tcuhub' width={160}/>  
          <p className='text-slate-500'>Reset Password</p>   
          {
            error && <p className='text-fuchsia-700'>Error while sending a link to this email</p>
          }
        <input type="email" placeholder="E-mail" ref={emailRef} className='text-slate-400 px-2 text-16 leading-10 w-full border outline-none'/>
        <button 
          className='w-full bg-fuchsia-700 rounded py-3 text-white'
          type="submit"
          >Send a link</button>
          <Link to={'/login'} className='text-slate-500 cursor-pointer text-sm hover:text-rose-500'>Return to Login</Link>
      </form>
    </div>
  </div>
  )
}

export default ForgotPassword