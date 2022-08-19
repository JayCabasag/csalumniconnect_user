import React, { useState, useEffect} from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { AiOutlineHeart} from 'react-icons/ai';
import {FaRegCommentDots } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import moment from 'moment';
import { getFirestore, getDoc, doc, where, getDocs, query, collection} from 'firebase/firestore';
import ReactPlayer from "react-player"
import HeartReact from './HeartReact';

const Announcement = ({announcement, category}) => {

  const [uid, setUid] = useState(localStorage.getItem('uid'))
  const navigate = useNavigate();
  const [images, setimages] = useState(announcement.images)
  const [video, setVideo] = useState(announcement.video)
  const [postedBy, setPostedBy] = useState(announcement.userHandle)
  const [displayName, setDisplayName] = useState('')
  const [links, setLinks] = useState(announcement.links)
  const [course, setCourse] = useState(announcement.course)
  const [yearLevel, setYearLevel] = useState(announcement.year)
  const [admin, setAdmin] = useState('')
  const [profileImage, setProfileImage] = useState('https://i.pinimg.com/originals/38/77/67/38776748a5a77acb5d2621d936489865.gif')
  const [studentId, setStudentId] = useState('')
  const [createdAt, setCreatedAt] = useState(moment(announcement.createdAt.toDate()).fromNow())
  const [loading, setLoading] = useState(false)

  const [totalHearts, setTotalHearts] = useState(announcement.loves)
  const [totalComments, setTotalComments] = useState(0)

  useEffect(() => {
    getTotalComments()
    getUserDetails()
  }, [])

  const getTotalComments = async () => {
    
    const commentsRef = collection(getFirestore(), 'comments');
    const q = query(commentsRef, where("commentFor", "==", `${announcement.docId}`));
    const querySnapshot = await getDocs(q);

    var returnArr = [];

    querySnapshot.forEach((doc) => {
      var item = doc.id;
      returnArr.push(item);
    })

    setTotalComments(returnArr.length)

  }

  const getUserDetails = async () => {     
        const docRef = doc(getFirestore(), "admins", `${announcement.userHandle}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
        setDisplayName(docSnap.data().name);
        setProfileImage(docSnap.data().profileURL);
        setAdmin('Admin')

        } else {
        console.log("No such document!");
        }
  }

  const copyExternalLink = (currentLink) =>{
    navigator.clipboard.writeText(currentLink)
    alert('link copied')
  }


  const updateHeart = () => {
    alert('Clicked update Hear')
  }

  const updateComment = () => {
    navigate(`post-details/${announcement.docId}`)
  }

    return (        
        <div className='pb-5 bg-white rounded shadow mt-1 items-center justify-center px-4 md:px-8'>
        <div className='flex h-auto w-auto pt-3 place-content-end px-2'>
                    <div className='cursor-pointer '>
                        <Link to={`/announcement-detail/${announcement.docId}`}>
                            <BsThreeDots className='text-slate-500 text-lg md:text-xl hover:text-fuchsia-700 cursor-pointer'/>
                        </Link>
                    </div>
         </div>

        <Link to={''}>
            <div className='flex flex-cols-3 pt-3 pl-0 w-auto'>
                <img src={profileImage} width={55} height={55} className='rounded-full'/>
                <div className='flex flex-col pl-2 w-4/5'>
                    <p className='font-semibold'>{displayName}</p>
                    <p className='font-thin text-sm'>{createdAt} - {admin}</p>
                </div>
            
            </div>
        </Link>
       
        
        <div className='py-2' >
                {
                    <p>{announcement.description}</p>
                }
        </div>
        <div className='py-1 w-auto'>
            <p>Links:</p>
           <ul className='flex space-x-2 text-blue-500 overflow-hidden hover:overflow-auto'>
                {
                    links.map((link)=>{
                        return <li key={link}><a onClick={() => copyExternalLink(link)}>{link}</a></li> 
                    })
                }
           </ul>
        </div>
        
        <div className='w-full h-auto'
            onClick={()=>navigate(`/post-detail/${announcement.docId}`)}
        >
           
            {
                announcement.images === undefined? null :  <img className='rounded w-full' alt='user-post' src={images}/>

            }

            {
                announcement.video === undefined? null :  <ReactPlayer
                url={video}
                controls
                width='100%'
                height={420}
              />
        
            }


        </div>
        <div className='pt-2 grid grid-cols-3 items-center justify-center'>
            <Link to={`/announcement-detail/${announcement.docId}`}>
                <div className='flex p-3 cursor-pointer'>
                        
                            <div className='text-gray-400 flex text-sm hover:text-gray-600 items-center gap-x-2'>
                                    <FaRegCommentDots className='w-6 h-6 items-center' />
                                {totalComments} 
                            </div>
                </div>
            </Link>

        </div>
    </div>
  )
}

export default Announcement