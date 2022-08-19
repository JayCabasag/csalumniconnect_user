import React, { useState, useEffect } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import moment from 'moment'
import {doc, serverTimestamp, setDoc, getFirestore, collection, getDocs, orderBy, query,getDoc, where, updateDoc, limit} from "firebase/firestore"

const AdminMessages = ({messagesWithChatChannel, uid, selectedChannel}) => {

    const [chatMessages, setChatMessages] = useState(messagesWithChatChannel)

    useEffect(() => {
      setInterval(() => {
        getMessagesWithChannel(selectedChannel)
      }, 1000);
    }, [])
    

    const getMessagesWithChannel = async (currentChannel) => {

        const queryToOrder = query(collection(getFirestore(), "adminchatmessages"), where("messageChannel", "==", `${currentChannel}`), orderBy('createdAt', 'asc'));
        const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "adminchatmessages"));
  
        var returnArr = [];
        querySnapshot.forEach((doc) => {
          var item = doc.data();
          returnArr.push(item);
        })
  
        setChatMessages(returnArr)
    }

  return (
    <ScrollToBottom className='h-4/6 bg-slate-200 shadow rounded-md w-full p-2 space-y-2 overflow-hidden'>
                    {
                      chatMessages.map((message) => {
                        return <div className=' flex w-full pt-1' key={message.docId}>
                                    {
                                        message.sentBy === uid?
                                        <div className='ml-auto mr-0 flex items-center w-auto bg-transparent gap-x-2'>
                                            <div className='rounded-md w-auto bg-white px-2 text-right'>
                                                <p>{message.message}</p>
                                                {
                                                    message.createdAt === null? 
                                                    <i className='text-xs'>just now ...</i>
                                                    :
                                                    <i className='text-xs'>{moment(message.createdAt.toDate()).fromNow()}</i>
                                                }
                                            </div>
                                            <img src={message.profileImage} width={50} alt="" className='rounded-full'/>
                                        </div>
                                        : 
                                        <div>
                                            <p className='text-xs ml-14 pl-1'>{message.name}</p>
                                            <div className='flex items-center w-auto bg-transparent gap-x-2'>
                                                <img src={message.profileImage} width={50} alt="" className='rounded-full'/>
                                                <div className='rounded-md w-auto bg-slate-100 px-2'>
                                                    <p>{message.message}</p>
                                                    {
                                                        message.createdAt === null? 
                                                        <i className='text-xs'>just now ...</i>
                                                        :
                                                        <i className='text-xs'>{moment(message.createdAt.toDate()).fromNow()}</i>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        
                                    }
                                </div>
                      })
                    }
              </ScrollToBottom>

  )
}

export default AdminMessages