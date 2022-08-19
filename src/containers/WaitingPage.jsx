import React, {useEffect, useState} from 'react';
import { setDoc, doc, getFirestore, collection, query, where, orderBy, getDocs, getDoc, addDoc, updateDoc} from "firebase/firestore"
import {onAuthStateChanged, signOut, updateProfile  } from 'firebase/auth'
import { auth } from '../firebase-config'
import { useNavigate } from 'react-router-dom';
import UserEmployment from '../components/UserEmployment';

const LandingPage = () => {

  const navigate = useNavigate()
  const [username, setUsername] = useState(localStorage.getItem('name'));
  const [uid, setUid] = useState(localStorage.getItem('uid'))

  const [isChecked, setIsChecked] = useState('Alumni')
  const [company, setCompany] = useState('')
  const [faculty, setFaculty] = useState('')
  const [yearSection, setYearSection] = useState('')

  const logout = async () => {
    await signOut(auth)
    localStorage.clear()
    navigate('/login')
  }


  return (
    <div className='flex w-full h-screen justify-center items-center p-2'>
        <div className='flex w-full justify-center items-center flex-col space-y-3'>
            <h1 className='text-2xl font-bold text-fuchsia-700 text-center'>Thank you for filling out all data we need {username}.</h1>
            <p className='text-center'>Please wait for the admin to approve your request.</p>

            <button className='px-5 border text-fuchsia-700 border-fuchsia-700 py-2 rounded-md' onClick={() => {logout()}}>log out</button>
           
        </div>
    </div>
  )
}

export default LandingPage