import React, {useEffect, useState} from 'react'
import Masonry from 'react-masonry-css';
import Announcement from './Announcement'
import {getFirestore, collection, getDocs, orderBy, query, where} from "firebase/firestore"
import Spinner from './Spinner';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const MasonryLayout  = ({category}) => {

  const navigate = useNavigate()
  
  const breakpointColumnsObj = {
    default: 1,
  };

  
  const [loading, setLoading] = useState(false);
  const [allAnnouncements, setAllAnnouncements] = useState([])

  useEffect(() => {
    GetAnnouncements(category);
  }, [category])

  if(loading) return <Spinner message="We are adding Posts to your feed!"/>

  const GetAnnouncements = async (category) => {
    setLoading(true)

    const queryToOrder = query(collection(getFirestore(), "announcements"), where('category', '==', `${category}`),orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "announcements"));
    var returnArr = [];
    querySnapshot.forEach((doc) => {
      var item = doc.data();
      returnArr.push(item);
    })  
    setAllAnnouncements(returnArr)
    setLoading(false)
  }

  
  return (
    
    <Masonry className="flex animate-slide-fwd" breakpointCols={breakpointColumnsObj}>
            <div className='bg-white p-4 flex items-center gap-x-2 rounded-md shadow'>
                <span>
                  <FaArrowLeft className='text-slate-500 cursor-pointer' onClick={()=>navigate('/')}/>
                </span>
                <p className='font-bold text-slate-500'>
                  {category}
                </p>
          </div>
          {
            allAnnouncements.length === 0?
            <p className='text-center text-sm text-slate-500 pt-5'>Nothing to Show try again later</p>
            :
            <>
                        {
              allAnnouncements.map((announcement) => {
                return <Announcement announcement={announcement} category={category}/>
              })
            }
            </>
          }
          
    </Masonry>
  )

}

export default MasonryLayout 

