import React, { useState, useEffect } from 'react'
import {FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import {doc, getFirestore, collection, getDocs, getDoc, orderBy, query, limit, updateDoc, where} from "firebase/firestore"
import Spinner from './Spinner';
import OpportunitiesMasonry from './OpportunitiesMasonry';



const Opportunities = () => {

  const [allOpportunities, setAllOpportunities] = useState([])
  const [loading, setLoading] = useState(false)

    useEffect(() => {
      GetAllOpportunities();
    }, [])
    
  const GetAllOpportunities = async () => {
    setLoading(true)
    setAllOpportunities([])
    const queryToOrder = query(collection(getFirestore(), "opportunities"), where('reviewed', '==', true), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "opportunities"));
        querySnapshot.forEach((doc) => {
          setAllOpportunities((prev) => {
          return[...prev, doc.data()]
        });
    })
    setLoading(false)
  }

    const navigate = useNavigate();
  
    return (
      <div className='w-full flex flex-col gap-y-1'>
      <div className='bg-white p-4 flex items-center gap-x-2 rounded-md shadow'>
          <span>
            <FaArrowLeft className='text-slate-500 cursor-pointer' onClick={()=>navigate('/')}/>
          </span>
          <p className='font-bold text-slate-500'>
            Careers
          </p>
     </div>
     
     {
        loading === true?
        <Spinner />
        :
          <div className='flex w-full justify-center items-center py-2 text-sm text-slate-500'>
          {
            allOpportunities.length === 0?
            <p>No pending posts request. Please check later</p>
            :
            <OpportunitiesMasonry posts={allOpportunities} />
          }
          </div>
      }



    </div>
    )
  
}

export default Opportunities