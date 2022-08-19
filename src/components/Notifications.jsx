import React, {useState, useEffect} from 'react'
import {FaArrowLeft} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import {doc, serverTimestamp, setDoc, getFirestore, collection, getDocs, orderBy, query, limit, documentId, where} from "firebase/firestore"
import moment from 'moment'

const AllChat = () => {

  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([])
  const uid = localStorage.getItem('uid')
  const [totalNotifications, setTotalNotifications] = useState(0)


  useEffect(() => {
    getUsersNotification()
    
  }, [])

  const getUsersNotification = async () =>{

    const queryToOrder = query(collection(getFirestore(), "notifications"), where("userHandle", "==", `${uid}`), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "notifications"));

    var returnArr = [];
    querySnapshot.forEach((doc) => {
      var item = doc.data();
      returnArr.push(item);
    })

    setNotifications(returnArr)
    setTotalNotifications(returnArr.length)

  }

  const goTo = (id, notifFor) => {
    if(notifFor === "post"){
      navigate(`../post-detail/${id}`)
    } else if (notifFor === "Announcements"){
      navigate('../category/Announcements')
    } else if (notifFor === "Webinars"){
      navigate('../category/Webinars')
    } else if (notifFor === "Events"){
      navigate('../category/Events')
    } else if (notifFor === "Ojts-&-Hirings"){
      navigate('../category/Ojts-&-Hirings')
    } else if (notifFor === "message"){
      navigate('../category/All-Chat')
    } else if (notifFor === "message"){
      navigate(`../opportunity-details/${id}`)
    }
  }


  return (
    <div className='bg-white h-auto gap-1'>

        <div className='w-full bg-white text-slate-500 font-bold flex items-center p-2 shadow-sm rounded-sm mb-1 cursor-pointer' onClick={() => navigate('/')}> <FaArrowLeft className='mr-2 cursor-pointer'/> <p>Notifications</p> </div>

       {
         notifications.map((notification) => {
          return  <div key={notification.notificationId} className='flex w-full p-1 border cursor-pointer hover:bg-slate-100 rounded-md' onClick={() => {goTo(notification.postId, notification.notificationFor)}}>
                      <img src={notification.trigerredByUserProfile} width={60} alt="profile" className='border rounded-full'/>
                      <div className='p-1 gap-1'>
                        <div className='flex gap-1 '>
                          <div className='flex'>
                            <p className='font-bold'>
                            {
                              notification.trigerredByUid === uid?
                              "You "
                              :
                              notification.trigerredByName
                            }
                            <span className='font-normal'>{notification.notificationAbout}</span>
                            </p>
                           </div> 
                        </div>
                        <div>
                          <i className='text-sm text-slate-500'>{moment(notification.createdAt.toDate()).fromNow()}</i>
                        </div>
                      </div>
                    </div>
         })
       }

       {
         totalNotifications === 0?
         <p className='flex justify-center text-slate-500 text-center items-center p-2'>No notifications to show, check it later</p>
         :
         null
       }

    </div>
  )
}

export default AllChat