import React, {useEffect, useState} from 'react'
import {doc, getFirestore, where, collection, increment, getDocs, getDoc, orderBy, query, limit, documentId, exists, updateDoc, setDoc, serverTimestamp} from "firebase/firestore"

const UserEmploymentLandingPage = ({userId}) => {

  const [isChecked, setIsChecked] = useState('Rather not say')
  const [allJobs, setAllJobs] = useState([])
  const [selectedField, setSelectedField] = useState('')
  const [employmentField, setEmploymentField] = useState('Others')
  const [batch, setBatch] = useState('')

  useEffect(async () => {
    const docRef = doc(getFirestore(), "users", `${userId}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setEmploymentField(docSnap.data().employmentField)
      if(docSnap.data().employmentStatus === undefined){
        setIsChecked("Rather not say")
      } else {
        setIsChecked(docSnap.data().employmentStatus)
      }
  
    } else {
      setIsChecked('Rather not say')
    }

    getAllJobs();
  }, [])

  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const getAllJobs = async () => {
    setAllJobs([])
    const queryToOrder = query(collection(getFirestore(), "employmentcategories"), orderBy('category', 'asc'));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "employmentcategories"));
        querySnapshot.forEach((doc) => {
          setAllJobs((prev) => {
          return[...prev, doc.data()]
        });
    })
  }

  const saveEmploymentData = async () => {
    
    if(batch === ''){
      setError(true)
      setErrorMessage('Please add your batch!')
      return
    }
    

    const userRef = doc(getFirestore(), "users", `${userId}`);
      const docSnap = await getDoc(userRef);
  
      if(docSnap.exists()){  
        await updateDoc(userRef, {
          employmentStatus: isChecked,
          employmentField: selectedField.toString(),
          batch: batch

        }).then(res => {
          setError(false)
          setSuccess(true)
          setErrorMessage('Updated successfully!')
          
        });
      } else {
        console.log('Docs does not exists')
        setError(true)
        setSuccess(false)
        setErrorMessage('Failed updating your information')
      }
      setError(false)
      setSuccess(true)
      setErrorMessage('Updated successfully!')

      setTimeout(() => {
        setSuccess(false)
        setError(false)
        setErrorMessage('')
      }, 3000);
    
  }
  


  return (
    <div className='w-full px-3 flex flex-col'>

        <div className='flex items-center justify-center gap-x-1'>
          <p className='text-fuchsia-700'>Batch</p>
          <input type="text" className='border p-2 outline-none text-slate-500 rounded-md' placeholder='e.g 2019-2020' onChange={e => {setBatch(e.target.value)}}/>
        </div>
        <p className='text-slate-500 pt-5'>Employment details ({isChecked})</p>
        <div className='w-full'>
        <div className='flex justify-center items-center space-x-4 p-2 text-fuchsia-700'>
            <div className='flex justify-center items-center space-x-1'>
            <input type="radio" value="Employed" checked={isChecked === 'Employed'?true:false} onClick={() => setIsChecked('Employed')} className="cursor-pointer"/> <p>Employed</p>
            </div>
            <div className='flex justify-center items-center space-x-1'>
            <input type="radio" value="Unemployed" checked={isChecked === 'Unemployed'?true:false} onClick={() => setIsChecked('Unemployed')} className="cursor-pointer"/> <p>Unemployed</p> 
            </div>
            <div className='flex justify-center items-center space-x-1'>
            <input type="radio" value="Unemployed" checked={isChecked === 'Rather not say'?true:false} onClick={() => setIsChecked('Rather not say')} className="cursor-pointer"/> <p>Rather not say</p> 
            </div>
        </div>

        {
            isChecked === 'Employed' || isChecked === 'Underemployed'?
            <div className='flex justify-center items-center space-x-4 p-2 text-fuchsia-700'>
            <p>Carrier Field</p>
            <select id="jobs" className='p-1 outline-none border rounded-md' value={employmentField} onChange={(e) => {setSelectedField(e.target.value); setEmploymentField(e.target.value)}}>
              {
                allJobs.map((field) => {
                  return <option key={field.docId} defaultValue={field.category}>{field.category}</option>
                })
              }
              <option value="Others">Others</option>
            </select>
            </div>
            :
            null
        }
        <div className='flex justify-center items-center flex-col'>
        {
          success?
          <p className='text-green-600 text-sm'>{errorMessage}</p>
          :
          null
        }

        {
          error?
          <p className='text-rose-600 text-sm'>{errorMessage}</p>
          :
          null
        }
        <button className='px-8 py-2 bg-fuchsia-700 text-white rounded-md hover:bg-fuchsia-600 mt-1' onClick={() => {saveEmploymentData()}}>Save</button>
        </div>
        </div>
    </div>
  )
}

export default UserEmploymentLandingPage