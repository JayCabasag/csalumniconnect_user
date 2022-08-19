import React, {useEffect, useState} from 'react'
import Masonry from 'react-masonry-css';
import Announcement from './Announcement'
import {getFirestore, collection, getDocs, orderBy, query, where} from "firebase/firestore"
import Spinner from './Spinner';

const MasonryLayout  = ({category}) => {
  
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
          {
            allAnnouncements.length === 0?
            <p className='text-center text-sm text-slate-500 '>Nothing to Show try again later</p>
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

