import React, {useState} from 'react'
import {FaArrowLeft} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Admin from '../Chats/Admin';
import All from '../Chats/All';

const AllChat = () => {

  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState('All')

  return (
    <div className='bg-white h-auto'>

        <div className='w-full bg-white text-slate-500 font-bold flex items-center p-2 shadow-sm rounded-sm cursor-pointer' onClick={() => navigate('/')}> <FaArrowLeft className='mr-2 cursor-pointer'/> <p>All Chat</p> </div>

        <div className='grid grid-cols-2 gap-x-2 w-full bg-white p-2 justify-center'>

          {
            !(selectedChat === 'All')? <button className='py-3 border px-3 text-slate-500 cursor-pointer rounded shadow' onClick={()=>setSelectedChat('All')}>All</button>:
                                    <button className='border px-3 text-white cursor-pointer rounded shadow bg-fuchsia-700' onClick={()=>setSelectedChat('All')}>All</button>
          }

          {
             !(selectedChat === 'Admin')?<button className='py-3  border px-3 text-slate-500 cursor-pointer rounded shadow' onClick={()=>setSelectedChat('Admin')}>Admin</button>:
                                        <button className='border px-3 text-white cursor-pointer bg-fuchsia-700 rounded shadow' onClick={()=>setSelectedChat('Admin')}>Admin</button>
          }
        </div>

        <div className='bg-white w-full'>
              {
                selectedChat === 'All'? <All currentUser={localStorage.getItem('uid')}/>: null
              }
           
              {
                selectedChat === 'Admin'? <Admin currentUser={localStorage.getItem('uid')}/>: null
              }
        </div>
    </div>
  )
}

export default AllChat