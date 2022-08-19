import React, { useEffect, useState } from 'react'
import HotTopics from '../components/HotTopics'
import {query, getFirestore, collection, getDocs, orderBy} from "firebase/firestore"


const Sidebanner = () => {

  const [allHotTopics, setAllHotTopics] = useState([])
 

  useEffect(() => {
    getHotTopics()
  }, [])
  
  const getHotTopics = async () => {
    
    setAllHotTopics([])
    
    const queryToOrder = query(collection(getFirestore(), "tags"), orderBy('discussion', 'desc'));

    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "tags"));
        querySnapshot.forEach((doc) => {
        setAllHotTopics((prev) => {
          return[...prev, [doc.data().tag, doc.data().discussion]]
        });
        })
  }

  return (
    <div className='hidden lg:flex flex-col w-2/5 pl-2 pr-32 gap-y-2 mt-1'>
            <HotTopics allTopics={allHotTopics} />
    </div>
  )
}

export default Sidebanner