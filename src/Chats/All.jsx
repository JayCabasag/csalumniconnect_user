import React, { useEffect, useRef, useState } from 'react'
import {doc, serverTimestamp, setDoc, getFirestore, collection, getDocs, orderBy, query, limit, documentId} from "firebase/firestore"
import moment from 'moment'
import ScrollToBottom from 'react-scroll-to-bottom';
import Filter from 'bad-words';


const All = ({currentUser}) => {



    const [allFoulWords, setAllFoulWords] = useState([])

    useEffect(() => {
      getAllFoulWords();
    }, [])
    
    const getAllFoulWords = async () => {
  
      setAllFoulWords([])
  
      const querySnapshot = await getDocs(collection(getFirestore(), "foulwords")); 
      var returnArr = [];
  
      querySnapshot.forEach((doc) => {
        returnArr.push(doc.data().foulword);
      })
  
      setAllFoulWords(returnArr)
    }
  
  
    const filter = new Filter();
    filter.addWords(...allFoulWords);
    
    const [allMessage, setAllMessage] = useState([])

    const displayName = localStorage.getItem('name')
    const photoURL = localStorage.getItem('photoURL')
    const userMessage = useRef()
    const messageBox = useRef(null)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')


    useEffect(() => {
        getAllMessages()
        setInterval(function(){ 
            getAllMessages();
        }, 1000);
    }, [])

    
    const getAllMessages = async () => {

        const messageRef = collection(getFirestore(), 'allchatmessages');
        const q = query(messageRef, orderBy('sentAt', 'asc'), limit(100));
        const querySnapshot = await getDocs(q);

        var returnArr = [];

        querySnapshot.forEach((doc) => {
        var item = doc.data();
        returnArr.push(item);
        })

        setAllMessage(returnArr)
    
    }
  
    const addMessage = async () => {
        const messageData = userMessage.current.value;

        if(messageData === '' || messageData === undefined){
            setError(true)
            setErrorMessage('Please add a message.')
            return
        } 
        if (filter.clean(messageData).includes('***')) { 
            setError(true)
            setErrorMessage('Warning: Detected a foul words, please refrain from using on this platform.')
            return
        }         
          const docRef = doc(collection(getFirestore(), "allchatmessages"))
          const payload = {
              message: messageData,
              sentAt: serverTimestamp(),
              sentBy: currentUser,
              name: displayName,
              userProfile: photoURL
          }
          await setDoc(docRef, payload).then(
            getAllMessages()
          )
          userMessage.current.value = ''
          setError(false)
          setErrorMessage('')
    }

    return (
    <div className='w-full h-screen p-2'>
        {/* Messages COntainer */}
        
        <ScrollToBottom  id="messageBox" className='h-4/6 bg-slate-200 shadow rounded-md w-full p-2 space-y-2 overflow-hidden'>
                
                {
                    allMessage.map((message) => {

                        return   <div className=' flex w-full pt-1' key={message.id}>
                                    {
                                        message.sentBy === currentUser?
                                        <div className='ml-auto mr-0 flex items-center w-auto bg-transparent gap-x-2'>
                                            <div className='rounded-md w-auto bg-white px-2 text-right'>
                                                <p>{message.message}</p>
                                                {
                                                    message.sentAt === null? 
                                                    <i className='text-xs'>just now ...</i>
                                                     :
                                                    <i className='text-xs'>{moment(message.sentAt.toDate()).fromNow()}</i>
                                                }
                                            </div>
                                            <img src={message.userProfile} width={50} alt="" className='rounded-full'/>
                                        </div>
                                        : 
                                        <div>
                                            <p className='text-xs ml-14 pl-1'>{message.name}</p>
                                            <div className='flex items-center w-auto bg-transparent gap-x-2'>
                                                <img src={message.userProfile} width={50} alt="" className='rounded-full'/>
                                                <div className='rounded-md w-auto bg-slate-100 px-2'>
                                                    <p>{message.message}</p>
                                                    {
                                                        message.sentAt === null? 
                                                        <i className='text-xs'>Added just now ...</i>
                                                        :
                                                        <i className='text-xs'>{moment(message.sentAt.toDate()).fromNow()}</i>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        
                                    }
                                </div>
                    })
                }

        </ScrollToBottom >
        
        <div className='flex gap-1 pt-2 flex-col'>
           <div className='w-full'>
           {
                error?
                <p className='text-sm text-rose-500'>{errorMessage}</p>
                :
                null
            }
           </div>
           <div className='w-full flex gap-x-1'>
            <textarea name="" id="" className='w-full outline-none border shadow rounded-md p-1 text-slate-500' rows="2" ref={userMessage}>
                </textarea>
                <button className='bg-fuchsia-700 text-white rounded-md' onClick={() => addMessage()}>
                    Send Message
                </button>
           </div>
          
        </div>
        
    </div>
  )
}

export default All