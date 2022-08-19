import React, { useState, useRef, useEffect } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from  'react-icons/ai';
import {Link, Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UserProfile from '../components/UserProfile'
import Posts from './Posts'
import defaultProfile from '../assets/defaultimg.png'
import Search from '../components/Search';
import { setDoc, doc, getFirestore, collection, query, where, orderBy, getDocs, getDoc, addDoc, updateDoc} from "firebase/firestore"


const Home = () => {
  
  const [toggleSideBar, setToggleSideBar] = useState(false);
  const [user, setUser] = useState('')
  const navigate = useNavigate()
  const [userProfile, setUserProfile] = useState(localStorage.getItem('photoURL'))
  const [uid, setUid] = useState(localStorage.getItem('uid'))
  const logo = 'https://firebasestorage.googleapis.com/v0/b/tcuhub-cf9e1.appspot.com/o/images%2Fcs_allumni_logo.png?alt=media&token=53c943cb-7aed-449e-b370-fc294bd29f84';
  const [role, setRole] = useState(null)

  useEffect(async () => {
    const docRef = doc(getFirestore(), "users", `${localStorage.getItem('uid')}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        setRole(docSnap.data().role)
        if(docSnap.data().verified === false || docSnap.data().verified === undefined || docSnap.data().verified === ''){
          navigate('/landingpage')
        }
    } else {
        console.log('User does not exist')
    }
  }, [])
  

  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
    setUser(localStorage.getItem('uid'))

    if(userProfile === null || userProfile === ''){
      setUserProfile(defaultProfile)
    }
  }, [])

  if(user === null || user === undefined || user === '') {
    navigate('/login')
  }


  return (
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out '>
        
        <div className='hidden md:flex h-screen flex-initial'>
          <Sidebar user={user && user}/>
        </div>

        <div className='flex md:hidden flex-row' onClick={()=> setToggleSideBar(true)}>

          <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
            <HiMenu fontSize={30} className='cursor-pointer'/>
            <Link to='/'>
              <img src={logo} alt="logo" className='w-32' />
            </Link>
            <Link to={`user-profile/${localStorage.getItem('uid')}`}>
              <img src={userProfile} alt="logo" className='w-16' />
            </Link>
          </div>

        </div>
        {toggleSideBar && (
              <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
                <div className='absolute w-full flex justify-end items-center p-2'>
                  <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={()=> setToggleSideBar(false)}/>
                </div>
                <Sidebar user={user && user} closeToggle={setToggleSideBar} />
              </div>
        )}

        <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef} >
          <Routes>
            <Route path='/user-profile/:uid' element={<UserProfile />}/>
            <Route path='/*' element={<Posts/>}/>
            <Route path='/search' element={<Search />}/>
            
          </Routes>
        </div>      
      
    </div>
  )
}


export default Home