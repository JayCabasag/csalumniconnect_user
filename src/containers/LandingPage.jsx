import React, {useEffect, useState} from 'react';
import { doc, getFirestore, getDoc, updateDoc} from "firebase/firestore"
import { signOut,  } from 'firebase/auth'
import { auth } from '../firebase-config'
import { useNavigate } from 'react-router-dom';
import UserEmploymentLandingPage from '../components/UserEmploymentLandingPage';

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

  useEffect(async () => {
    const userRef = doc(getFirestore(), "users", `${uid}`);
    const docSnap = await getDoc(userRef);

    if(docSnap.exists()){  
      await updateDoc(userRef, {
        faculty: faculty,
        yearSection: yearSection
      });
    } else {
      console.log('Docs does not exists')
    }
  }, [faculty, yearSection])

  useEffect(async () => {
    const userRef = doc(getFirestore(), "users", `${uid}`);
    const docSnap = await getDoc(userRef);

    if(docSnap.exists()){  
      await updateDoc(userRef, {
        role: isChecked
      });
    } else {
      console.log('Docs does not exists')
    }
  }, [isChecked])
  
  const next = () => {
    navigate('/waitingpage')
  }

  return (
    <div className='flex w-full h-screen justify-center items-center p-2'>
        <div className='flex w-full justify-center items-center flex-col space-y-3'>
            <h1 className='text-2xl font-bold text-fuchsia-700 text-center'>Welcome to TCU CS Alumni connect</h1>
            <p className='text-center'>Hello {username}, please select your role.</p>
            <div>
                <div className='w-full'>
                    <div className='flex justify-center items-center space-x-4 p-2 text-fuchsia-700'>
                        <div className='flex justify-center items-center space-x-1'>
                        <input type="radio" value="Alumni" checked={isChecked === 'Alumni'?true:false} onClick={() => setIsChecked('Alumni')} className="cursor-pointer"/> <p>Alumni</p>
                        </div>
                        <div className='flex justify-center items-center space-x-1'>
                        <input type="radio" value="CS Student" checked={isChecked === 'CS Student'?true:false} onClick={() => setIsChecked('CS Student')} className="cursor-pointer"/> <p>CS Student</p> 
                        </div>
                        <div className='flex justify-center items-center space-x-1'>
                        <input type="radio" value="Professor" checked={isChecked === 'Professor'?true:false} onClick={() => setIsChecked('Professor')} className="cursor-pointer"/> <p>Professor</p> 
                        </div>
                    </div>

                    {
                        isChecked === 'Alumni'?
                        <UserEmploymentLandingPage userId={uid} />
                        :
                        null
                    }

                    {
                        isChecked == 'CS Student'?
                        <div className='flex justify-center items-center space-x-4 p-2 text-fuchsia-700'>
                        <p>Year and Section</p>
                        <input type="text" placeholder='Year and Section' className='border outline-none p-2 rounded' onChange={(e) => setYearSection(e.target.value)}/>
                        </div>
                        :
                        null

                    }

                    {  
                        isChecked == 'Professor'?
                        <div className='flex justify-center items-center space-x-4 p-2 text-fuchsia-700'>
                        <p>Faculty/Department</p>
                        <input type="text" placeholder='Faculty/Department' className='border outline-none p-2 rounded' onChange={(e) => setFaculty(e.target.value)}/>
                        </div>
                        :
                        null

                    }
                </div>
            </div>
            <div className='flex pt-12 w-1/2'>
            <button className='px-5 border text-fuchsia-700 border-fuchsia-700 py-2 rounded-md ml-0  mr-auto' onClick={() => {logout()}}>log out</button>
            <button className='px-5 border  text-white bg-fuchsia-700 border-fuchsia-700 py-2 rounded-md ml-auto mr-0' onClick={() => {next()}}>Next</button>
            </div>

            <div className='flex'>
                    <p className='text-rose-400 text-xs'>Note: All information you'll provide will not be shown by other users in this platform.</p>
            </div>
        </div>
    </div>
  )
}

export default LandingPage