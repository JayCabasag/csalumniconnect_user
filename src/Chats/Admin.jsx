import React, {useEffect, useState, useRef} from 'react'
import {doc, serverTimestamp, setDoc, getFirestore, collection, getDocs, orderBy, query,getDoc, where, updateDoc, limit} from "firebase/firestore"
import Modal from 'react-modal/lib/components/Modal'
import moment from 'moment'
import {AiOutlineArrowLeft} from 'react-icons/ai'
import AdminMessages from './AdminMessages'

const Admin = () => {

  const [adminLists, setAdminLists] = useState([])
  const [userMessagesChannel, setUserMessagesChannel] = useState([])
  const [allMessages, setAllMessages] = useState([])
  const [totalMessages, setTotalMessages] = useState(0)
  
  const uid = localStorage.getItem('uid')
  const [openMessageDialog, setOpenMessageDialog] = useState(false)
  const [adminSelected, setAdminSelected] = useState('')
  const [adminName, setAdminName] = useState('')
  const [adminDepartment, setAdminDepartment] = useState('')
  const [showMessageBox, setShowMessageBox] = useState(false)

  const [selectedChatChannel, setSelectedChatChannel] = useState('')


  const [messagesWithChatChannel, setMessagesWithChatChannel] = useState([])


  const usermessagetext = useRef()
  const messageBoxTextRef = useRef()

  
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  useEffect(() => {

    getAllAdmins()
    setInterval(function(){ 
      getUserMessages()
    }, 1000);

  }, [])

  const getAllAdmins = async () => {

    const messageRef = collection(getFirestore(), 'admins');
        const q = query(messageRef, orderBy('name', 'asc'));
        const querySnapshot = await getDocs(q);
        var returnArr = [];
        querySnapshot.forEach((doc) => {
        var item = doc.data();
        returnArr.push(item);
        })
        
    setAdminLists(returnArr)
    
  }

  const getUserMessages = async () => {

    const queryToOrder = query(collection(getFirestore(), "adminchannelmessages"), where("userId", "==", `${uid}`), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "adminchannelmessages"));

    var returnArr = [];
    querySnapshot.forEach((doc) => {
      var item = doc.data();
      returnArr.push(item);
    })

    setUserMessagesChannel(returnArr);
    setTotalMessages(returnArr.length)
  }


  const messageAnAdmin = (adminId, adminName, department) => {
    setAdminSelected(adminId)
    setAdminName(adminName)
    setAdminDepartment(department)

    setOpenMessageDialog(true)
  }

  const sendMessage = async () => {
    
    const channelId = localStorage.getItem('uid')+adminSelected 

    const docRef = doc(getFirestore(), "adminchannelmessages", `${channelId}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      
      //insert to adminchatmessages
      const textmessage = usermessagetext.current.value

      const docRef = doc(collection(getFirestore(), "adminchatmessages"))
      const payload = {
        docId: docRef.id,
        createdAt: serverTimestamp(),
        message: textmessage,
        messageChannel: channelId,
        name: localStorage.getItem('name'),
        profileImage: localStorage.getItem('photoURL'),
        sentBy: localStorage.getItem('uid')
      }
      await setDoc(docRef, payload).then(
      )

      usermessagetext.current.value = ''


    } else {
      await setDoc(doc(getFirestore(), "adminchannelmessages", `${channelId}`), {
        messageChannel: channelId,
        createdAt: serverTimestamp(),
        adminName: adminName,
        adminId: adminSelected,
        userName: localStorage.getItem('name'),
        userId: localStorage.getItem('uid')
      })

      const textmessage = usermessagetext.current.value

      const docRef = doc(collection(getFirestore(), "adminchatmessages"))
      const payload = {
        createdAt: serverTimestamp(),
        message: textmessage,
        messageChannel: channelId,
        name: localStorage.getItem('name'),
        profileImage: localStorage.getItem('photoURL'),
        sentBy: localStorage.getItem('uid')
      }
      await setDoc(docRef, payload).then(
      )

    }

    setAdminSelected('')
    setAdminName('')
    setAdminDepartment('')
    setOpenMessageDialog(false)
    updateChannelCreateAt(channelId)
  }

  const closeModal = () => {
    setAdminSelected('')
    setAdminName('')
    setAdminDepartment('')
    setOpenMessageDialog(false)
  }

  const openMessage = (chatChannel) => {
    setSelectedChatChannel(chatChannel)
    getMessagesWithChannel(chatChannel)
    setShowMessageBox(true)
  }


  const getMessagesWithChannel = async (currentChannel) => {

      const queryToOrder = query(collection(getFirestore(), "adminchatmessages"), where("messageChannel", "==", `${currentChannel}`), orderBy('createdAt', 'asc'));
      const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "adminchatmessages"));

      var returnArr = [];
      querySnapshot.forEach((doc) => {
        var item = doc.data();
        returnArr.push(item);
      })

      setMessagesWithChatChannel(returnArr)
  }


  const updateChannelCreateAt = async (currentChannel) => {
      const channelRef = doc(getFirestore(), "adminchannelmessages", `${currentChannel}`);
      const docSnap = await getDoc(channelRef);

      if(docSnap.exists()){  
        await updateDoc(channelRef, {
          createdAt: serverTimestamp()
        });
      } else {
        console.log('Docs does not exists')
      }

      getUserMessages()
  }

  const closeMessageBox = () => {
    setSelectedChatChannel('')
    setShowMessageBox(false)
  }

  const sendMessageWithChannel = async (currentChannel) => {
    // var selectedChatChannel

    const textmessage  = messageBoxTextRef.current.value

      const docRef = doc(collection(getFirestore(), "adminchatmessages"))
      const payload = {
        docId: docRef.id,
        createdAt: serverTimestamp(),
        message: textmessage,
        messageChannel: currentChannel,
        name: localStorage.getItem('name'),
        profileImage: localStorage.getItem('photoURL'),
        sentBy: localStorage.getItem('uid')
      }
      await setDoc(docRef, payload).then(
      )

      getMessagesWithChannel(currentChannel)
      updateChannelCreateAt(currentChannel)

      messageBoxTextRef.current.value = ''
  }

  return (
    <div className='w-full bg-white'>
       {
         showMessageBox?null:
         <div className='w-full p-2'>
          <p className='text-slate-500 p-2'>Available Admins : </p>

          {
            adminLists.map((admin) => {
              return  <div key={admin.docId} className='w-full flex shadow p-2 rounded-md'>
                          <div>
                            <p className='text-slate-500 font-bold'>{admin.name}</p>
                            <i className='text-slate-500 text-xs'>Department/Course : <p className='font-bold'>{admin.department}</p></i>
                          </div>
                          <button className='bg-fuchsia-700 rounded text-white px-2 hover:bg-fuchsia-600 ml-auto mr-0' onClick={() => messageAnAdmin(admin.docId, admin.name, admin.department)}>Message</button>
                      </div>
            })
          }
        </div>
       }

       {
         showMessageBox? 
            <div className='w-full p-2 h-screen'> 
              <div className="cursor-pointer flex items-center text-slate-500 font-normal gap-1 p-2 hover:text-fuchsia-600" onClick={()=> {closeMessageBox()}}><AiOutlineArrowLeft className='font-bold'/> Go Back</div>
              
                {/* Messages Container something */}

                <AdminMessages messagesWithChatChannel={messagesWithChatChannel} uid={uid} selectedChatChannel={selectedChatChannel} selectedChannel={selectedChatChannel}/>
              
              <div className='flex mt-1 gap-1'>
                <textarea name="" id="" className='w-full outline-none border rounded p-1 text-slate-500' rows="2" ref={messageBoxTextRef}></textarea>
                <button className='px-5 bg-fuchsia-700 rounded text-white' onClick={()=>{sendMessageWithChannel(selectedChatChannel)}}>Send</button>
              </div>
            </div> 
         :
         <div className='w-full p-2'>
          
         <p className='text-slate-500 p-2'>Messages ({totalMessages})</p>

           {
             userMessagesChannel.map((channel) => {
               return <div key={channel.messageChannel} className='w-full flex shadow p-2 rounded-md cursor-pointer hover:bg-slate-100' onClick={()=>{openMessage(channel.messageChannel)}}>
                         <div>
                           <p className='text-slate-500 font-bold'>{channel.adminName}</p>
                           <i className='text-slate-500 text-xs'>Message sent <p className='font-bold'>{
                             
                             channel.createdAt === null?
                             'just now'
                              :
                             moment(channel.createdAt.toDate()).fromNow()
                           }</p></i>
                         </div>
                     </div>
             })
           }

       </div>
       }

        {/* Message Modal Here */}

        <Modal
        isOpen={openMessageDialog}
        style={customStyles}
          >
            <div className='flex flex-col space-y-2'>
                <p className='bg-fuchsia-700 text-white p-2 rounded'>New Message</p>
                <div className='flex w-full items-center gap-2'>
                  <p>To: </p>
                  <input type="text" className='border p-1 outline-none rounded shadow w-full' disabled={true} defaultValue={adminName}/>
                </div>
                <div className='flex w-full items-center gap-2'>
                  <p>Department: </p>
                  <input type="text" className='border p-1 outline-none rounded shadow w-full' disabled={true} defaultValue={adminDepartment}/>
                </div>
                <div className='w-full'>
                  <p>Message: </p>
                  <textarea className='border p-1 outline-none rounded shadow w-60 md:w-80' name=""  ref={usermessagetext} id="" rows="5">

                  </textarea>
                </div>
                <button className='bg-fuchsia-700 text-white p-2' onClick={()=>{sendMessage()}}> Send Message </button>
                <button onClick={()=>{closeModal()}}> Cancel </button>
            </div>
        </Modal>



    </div>
  )

}

export default Admin
