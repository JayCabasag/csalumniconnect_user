import React, {useState, useEffect}from 'react';
import {Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch, IoIosNotificationsOutline } from 'react-icons/io';
import {BsDot} from 'react-icons/bs'
import {doc, serverTimestamp, setDoc, getFirestore, collection, getDocs, orderBy, query,getDoc, where, updateDoc, limit, Firestore} from "firebase/firestore"


const Navbar = ({searchTerm, setSearchTerm, user }) => {
  
  const navigate = useNavigate({ user });
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userProfile, setUserProfile] = useState(localStorage.getItem('photoURL'))
  const [userNotifications, setUserNotifications] = useState([])

  useEffect(() => {
    getUSersNotificationDetails()
  }, [])

  const getUSersNotificationDetails = async () => {
    const uid = localStorage.getItem('uid')

    const queryToOrder = query(collection(getFirestore(), "notifications"), where("userHandle", "==", `${uid}`),where("viewed", "==", false), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "notifications"));

    var returnArr = [];
    querySnapshot.forEach((doc) => {
      var item = doc.data();
      returnArr.push(item);
    })

    setUserNotifications(returnArr)
  
  }

  const goToNotificationPage = async () => {
    const uid = localStorage.getItem('uid')

    const queryToOrder = query(collection(getFirestore(), "notifications"), where("userHandle", "==", `${uid}`),where("viewed", "==", false), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "notifications"));

    
    querySnapshot.forEach( async (singleDoc) => {

      const notifRef = doc(getFirestore(), "notifications", `${singleDoc.data().notificationId}`);
      const docSnap = await getDoc(notifRef);
  
      if(docSnap.exists()){  
        await updateDoc(notifRef, {
          viewed: true
        });
         } else {
        console.log('Docs does not exists')
      }

      setUserNotifications([])

      })

    navigate('category/Notifications')
  }
  
  
  return (
    <div className='flex gap-2 md:gap-5 w-full mt-5 pb-7'>
      <div className='flex justify-start items-center w-full px-2 rounded-md bg-white border outline-none focus-within:shadow-small'>
        <IoMdSearch fontSize={21} className="ml-1"/>
          <input 
          type="text" 
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          value={searchTerm}
          onFocus={() => navigate('/search')}
          className='p-2 w-full bg-white outline-none'
          />
      </div>

      <div className='flex gap-3'>
          <Link
            to={`user-profile/${localStorage.getItem('uid')}`}
            className="hidden md:block"
          >
            <img src={userProfile} alt="user" className='w-14 h-12 rounded-lg'/>
          </Link>

          <div
            onClick={()=>{goToNotificationPage()}}
            className="cursor-pointer bg-white hover:bg-fuchsia-700 text-slate-500 hover:text-white border hover:border-white rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center "
          >
            
            <div className='flex flex-col justify-center items-center'>
              <IoIosNotificationsOutline className='w-6 h-6 z-0 text-center'/>

              {
                userNotifications.length === 0?
                null
                :
                <BsDot className=' text-fuchsia-700 w-10 h-10 z-10 -mt-10 sticky -mr-5'/>
              }
              
            </div>
          </div>

          <Link
            to={`create-post`}
            className="bg-fuchsia-700 hover:bg-fuchsia-600 text-white rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center "
          >
            <IoMdAdd onClick={()=> setIsModalOpen(true)}/>
            
          </Link>

      </div>

      


    </div>
  )
}

export default Navbar