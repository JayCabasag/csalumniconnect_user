import React, { useRef, useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'firebase/auth'
import { auth } from '../firebase-config'
import { setDoc, db,  doc, getFirestore, collection, serverTimestamp, getDoc} from "firebase/firestore"

const Register = () => {

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmpasswordRef = useRef();
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false)
  const navigate = useNavigate()

  const [user, setUser] = useState({})
    onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  })
  const handleSubmit = async  (e) => {
    e.preventDefault()
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const name = nameRef.current.value;

    if(password !== confirmpasswordRef.current.value) {
      setErrorMessage('Password dont match!');
      setError(true);
      setSuccess(false)
      return;
    }
    if(email === '' || name === '' || password === '') {
      setErrorMessage('Some fields are Empty');
      setError(true);
      setSuccess(false)
      return;
    }
    try{
      await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(auth.currentUser, {
        displayName: nameRef.current.value, 
        photoURL: 'https://brighterwriting.com/wp-content/uploads/icon-user-default.png'   
       })

      addNewUser(auth.currentUser.uid, auth.currentUser.email, auth.currentUser.displayName, auth.currentUser.photoURL)
      setSuccess(true)
      setSuccessMessage('Account Created Successfully!')
      setErrorMessage('');
      setError(false);
      
    } catch (error) {
      setErrorMessage(error.code)
      setError(true)
      setSuccess(false)
      setSuccessMessage('')
    }

  }

  const addNewUser = async (uid, userEmail, name, photoUrl) => {
    const docRef = doc(getFirestore(), 'users',  `${uid}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      
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
        role: ''
      })
      nameRef.current.value = ''
      emailRef.current.value = ''
      passwordRef.current.value = ''
      confirmpasswordRef.current.value = ''
    }
  }

  return (

    <div className='px-4 flex w-screen h-screen justify-center items-center bg-white'>
    <div className='pb-10 p-5 h-auto w-screen md:w-2/5 lg:w-1/4 border rounded-md bg-white shadow'>
      <form
        onSubmit={handleSubmit} 
        className='space-y-5 w-full h-full flex flex-col justify-center items-center'>
        <h1 className='text-xl text-slate-500'>Register</h1>
        {
          error && <p className='text-fuchsia-500'>{errorMessage}</p>
        }
        {
           success && <p className='text-green-700'>{successMessage}</p>
        }
        <input type="text" placeholder="Fullname" ref={nameRef} className='text-slate-400 px-2 text-16 leading-10 w-full border outline-none rounded'/>
        <input type="email" placeholder="E-mail" ref={emailRef} className='text-slate-400 px-2 text-16 leading-10 w-full border outline-none rounded'/>
        <input type="password" placeholder="Password"ref={passwordRef} className='text-slate-400 text-gray px-2 text-16 leading-10 w-full border outline-none rounded'/>
        <input type="password" placeholder="Confirm password" ref={confirmpasswordRef} className='text-slate-400 text-gray px-2 text-16 leading-10 w-full border outline-none rounded'/>
        <button
          disabled={loading}
          className='w-full bg-fuchsia-700 rounded py-3 text-white '
          type='submit'
        >Sign Up</button>
        <Link to={"/login"} className='text-slate-500'> 
         Already have an account?
        </Link>
      </form>
    </div>
  </div>
  )
}

export default Register