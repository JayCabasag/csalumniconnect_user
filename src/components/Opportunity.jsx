import React, { useState, useEffect} from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { AiOutlineHeart} from 'react-icons/ai';
import {FaRegCommentDots } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import moment from 'moment';
import { getFirestore, getDoc, doc, where, getDocs, query, collection} from 'firebase/firestore';
import ReactPlayer from "react-player"
import OpportunityHeartReact from './OpportunityHeartReact';


const Opportunity = ({post, interests}) => {

  const [uid, setUid] = useState(localStorage.getItem('uid'))
  const navigate = useNavigate();
  const [images, setimages] = useState(post.images)
  const [video, setVideo] = useState(post.video)
  const [postedBy, setPostedBy] = useState(post.userHandle)
  const [displayName, setDisplayName] = useState('')
  const [links, setLinks] = useState(post.links)
  const [course, setCourse] = useState(post.course)
  const [yearLevel, setYearLevel] = useState(post.year)
  const [profileImage, setProfileImage] = useState('https://i.pinimg.com/originals/38/77/67/38776748a5a77acb5d2621d936489865.gif')
  const [studentId, setStudentId] = useState('')
  const [tags, setTags] = useState(post.tags)
  const [createdAt, setCreatedAt] = useState(moment(post.createdAt.toDate()).fromNow())
  const [loading, setLoading] = useState(false)

  const [totalHearts, setTotalHearts] = useState(post.loves)
  const [totalComments, setTotalComments] = useState(0)

  const [role, setRole] = useState('')
  const [yearSection, setYearSection] = useState('')
  const [batch, setBatch] = useState('')
  const [faculty, setFaculty] = useState('')

  const [show, setShow] = useState(post.show)

  useEffect(() => {
    getTotalComments()
    getUserDetails()
  }, [])

  const getTotalComments = async () => {
    
    const commentsRef = collection(getFirestore(), 'comments');
    const q = query(commentsRef, where("commentFor", "==", `${post.docId}`));
    const querySnapshot = await getDocs(q);

    var returnArr = [];

    querySnapshot.forEach((doc) => {
      var item = doc.id;
      returnArr.push(item);
    })

    setTotalComments(returnArr.length)

  }

  const getUserDetails = async () => {

        
        const docRef = doc(getFirestore(), "users", `${postedBy}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
        setDisplayName(docSnap.data().displayName);
        setProfileImage(docSnap.data().image);
        setCourse(docSnap.data().course)
        setYearLevel(docSnap.data().year)
        setStudentId(docSnap.data().studentId)
        setRole(docSnap.data().role)
        setBatch(docSnap.data().batch)
        setYearSection(docSnap.data().yearSection)
        setFaculty(docSnap.data().faculty)

        } else {
        console.log("No such document!");
        }
  }

  const copyExternalLink = (currentLink) =>{
    navigator.clipboard.writeText(currentLink)
    alert('link copied')
  }

  return (        
        <div className='pb-5 bg-white rounded shadow mt-1 items-center justify-center px-4 md:px-8'>
        <div className='flex h-auto w-auto pt-3 place-content-end px-2'>
                    <div className='cursor-pointer '>
                        <Link to={`../opportunity-details/${post.docId}`}>
                            <BsThreeDots className='text-slate-500 text-lg md:text-xl hover:text-rose-500 cursor-pointer'/>
                        </Link>
                    </div>
         </div>

        <Link to={`../user-profile/${postedBy}`}>
            <div className='flex flex-cols-3 pt-3 pl-0 w-auto'>
                <img src={profileImage} width={55} height={55} className='rounded-full'/>
                <div className='flex flex-col pl-2 w-4/5'>
                    <p className='font-semibold'>{displayName}</p>

                    {
                      role === 'Alumni'?
                      <p className='italic font-mono text-xs'> {createdAt} - {role} - {batch}</p>
                      :
                      null
                      }

                      {
                      role === 'CS Student'?
                      <p className='italic font-mono text-xs'> {createdAt} - {role} - {yearSection}</p>
                      :
                      null
                      }

                      {
                      role === 'Professor'?
                      <p className='italic font-mono text-xs'> {createdAt} - {role} - {faculty}</p>
                      :
                      null
                      }
                </div>
            
            </div>
        </Link>
       
        
        <div className='py-2' >
                {
                    <p>{post.description}</p>
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
        
        <div className='py-1 '>
           <ul className='flex space-x-2 text-blue-500'>
                {
                    tags.map((tag)=>{
                        return <li key={tag}><a>{tag}</a></li> 
                    })
                }
           </ul>
        </div>
        <div className='w-full h-auto'
            onClick={()=>navigate(`../opportunity-details/${post.docId}`)}
        >
           
            {
                post.images === undefined? null :  <img className='rounded w-full' alt='user-post' src={images}/>

            }

            {
                post.video === undefined? null :  <ReactPlayer
                url={video}
                controls
                width='100%'
                height={420}
              />
            }


        </div>
        <div className='pt-2 grid grid-cols-3 items-center justify-center'>
            <OpportunityHeartReact totalHearts={totalHearts} postId={post.docId} postTags={tags}/>

            <Link to={`/opportunity-details/${post.docId}`}>
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

export default Opportunity;