import React, {useState, useEffect} from 'react';
import {BsFileEarmarkPost, BsCardImage, BsCameraVideo} from 'react-icons/bs'
import {BiImageAdd} from 'react-icons/bi'
import '../index.css'
import { useNavigate } from 'react-router-dom';
import { storage } from '../firebase-config';
import {  getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage';
import { setDoc, doc, getFirestore, collection, serverTimestamp, updateDoc, increment, getDoc, getDocs} from "firebase/firestore"
import Modal from 'react-modal/lib/components/Modal';
import Filter from 'bad-words';


const CreatePost = () => {

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

  const navigate = useNavigate();

  const [isOpportunity, setIsOpportunity] = useState(false)
  const [collectionName, setCollectionName] = useState('posts')
  const [postType, setPostType] = useState('post');
  const [progress, setProgress] = useState(0)
  const [urls, setUrls] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [links, setLinks] = useState('')
  const [tags, setTags] = useState('')
  const [video, setVideo] = useState('')
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const uid = localStorage.getItem('uid');

  const [modalIsOpen, setModalIsOpen] = React.useState(false);

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };


  const closeModal = () => {
    setModalIsOpen(false);
    navigate('/')
  }

   const onImageChange = (e) => {
      const image = e.target.files[0] 
      if(!image){
        return
      }
      const storageRef = ref(storage, `/files/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
            
            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on('state_changed',
              (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progress)
                switch (snapshot.state) {
                  case 'paused':
                    break;
                  case 'running':
                    break;
                }
              }, 
              (error) => {
                switch (error.code) {
                  case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                  case 'storage/canceled':
                    // User canceled the upload
                    break;
            
                  // ...
            
                  case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
                }
              }, 
              async () => {
                // Upload completed successfully, now we can get the download URL
                await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  setUrls([...urls, downloadURL])
                });
              }
            );

   }

   const removeImage = (e) => {
      const imageToDelete = e.target.src;
      const newArray = urls.filter((item) => item !== imageToDelete)
      setUrls(newArray)
   }

   const handleSetTitle = (e) => {
      setTitle(e.target.value)
 
   }

   const handleSetDescription = (e) =>{
      setDescription(e.target.value)
   
   }

   const handleSetLinks = (e) => {
     setLinks(e.target.value)
  
   }

   const handleSetTags = (e) => {
      setTags(e.target.value)
      
   }

   const handleSetVideo = (e) => {
      setVideo(e.target.value)
   }
   
   const handleSubmit = () => {

     if(postType === 'post'){
        
          if(title === '' || description === '' || tags === ''){
            setError(true)
            setErrorMessage('Some fields are Empty!')
            return
          }

          if (filter.clean(title).includes('***') || filter.clean(description).includes('***')) { 
            setError(true)
            setErrorMessage('Detected a foul words, please refrain from using on this platform.')
            return
          }
    
            uploadPostWithText()
            setError(false)
            setErrorMessage('')
            return
      }
 
      if(postType === 'image'){
        if(title === '' || description === '' || tags === '' || urls.length === 0){
          setError(true)
          setErrorMessage('Some fields are Empty!')
          return
        }
        if (filter.clean(title).includes('***') || filter.clean(description).includes('***')) { 
          setError(true)
          setErrorMessage('Detected a foul words, please refrain from using on this platform.')
          return
        }
        uploadPostWithImage()
        setError(false)
       return
      }
 
      if(postType === 'video'){
        if(title === '' || description === '' || tags === '' || video === ''){
          setError(true)
          setErrorMessage('Some fields are Empty!')
          return
        }

        if (filter.clean(title).includes('***') || filter.clean(description).includes('***')) { 
          setError(true)
          setErrorMessage('Detected a foul words, please refrain from using on this platform.')
          return
        }
        uploadPostWithVideo()
        setError(false)
        return
      }

   } 

  const uploadPostWithText = async  () => {

    const newTags = tags.split(' ')
    const newLinks = links.split(' ')

    const docRef = doc(collection(getFirestore(), `${collectionName}`))
    const payload = {
      docId: docRef.id,
      userHandle: uid,
      title: title,
      description: description,
      links: newLinks,
      tags: newTags,
      createdAt: serverTimestamp(),
      ticks: 0,
      loves: [],
      comments: [],
      reviewed: false
    }
    await setDoc(docRef, payload).then(
    )
    addNewInterests()
    setModalIsOpen(true)
  }

  const uploadPostWithVideo = async () => {

    const newTags = tags.split(' ')
    const newLinks = links.split(' ')

    const docRef = doc(collection(getFirestore(), `${collectionName}`))
    const payload = {
      docId: docRef.id,
      userHandle: uid,
      title: title,
      description: description,
      links: newLinks,
      video: video,
      tags: newTags,
      createdAt: serverTimestamp(),
      ticks: 0,
      loves: [],
      comments: [],
      reviewed: false
    }
    await setDoc(docRef, payload).then(
      //console.log(docRef.id)
    )
    addNewInterests()
    setModalIsOpen(true)
  }

  const uploadPostWithImage = async () => {
    {

      const newTags = tags.split(' ')
      const newLinks = links.split(' ')
  
      const docRef = doc(collection(getFirestore(), `${collectionName}`))
      const payload = {
        docId: docRef.id,
        userHandle: uid,
        title: title,
        description: description,
        links: newLinks,
        images: urls,
        tags: newTags,
        createdAt: serverTimestamp(),
        ticks: 0,
        loves: [],
        comments: [],
        reviewed: false
      }
      await setDoc(docRef, payload).then(
      )
      addNewInterests()
      setModalIsOpen(true)
    }
  }

  const addNewInterests = async () =>{
    const newTags = tags.split(' ')
    const userRef = doc(getFirestore(), "users", `${uid}`);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
        const interestsArray = docSnap.data().interests;
        var combinedInterests = [...interestsArray, ...newTags];

        await updateDoc(userRef, {
          interests: combinedInterests
       });

    } else {
       console.log("No such document!");
    }

  }



  return (
   <div className='w-full h-auto'> 
     <div className='w-full bg-white shadow rounded border h-auto'>
       <h1 className='text-md text-slate-500 font-bold pl-2 pt-2 pb-2'>
         Post - 
       </h1>
        <div className='text-slate-400 w-full grid grid-cols-3 items-center justify-center gap-1 px-1 pb-1'>
         {
           postType === 'post'?
           <div id='post__post' className='flex items-center justify-center p-3 cursor-pointer gap-x-2 bg-fuchsia-700 text-white rounded shadow' onClick={()=>setPostType("post")}>
           <BsFileEarmarkPost/> Post
           </div> 
           :
           <div id='post__post' className='flex items-center justify-center p-3 cursor-pointer gap-x-2 hover:bg-fuchsia-700 hover:text-white rounded shadow' onClick={()=>setPostType("post")}>
           <BsFileEarmarkPost/> Post
           </div> 
         }

         {
          postType === 'image'?
          <div id='image__post' className='flex items-center justify-center p-3 cursor-pointer gap-x-2 bg-fuchsia-700 text-white rounded shadow'  onClick={()=>setPostType("image")}>
          <BsCardImage/> Image
          </div>:
          <div id='image__post' className='flex items-center justify-center p-3 cursor-pointer gap-x-2 hover:bg-fuchsia-700 hover:text-white rounded shadow'  onClick={()=>setPostType("image")}>
          <BsCardImage/> Image
          </div>
         }
          {
          postType === 'video'? 
          <div id='video__post' className='flex items-center justify-center p-3 cursor-pointer gap-x-2 bg-fuchsia-700 text-white rounded shadow'  onClick={()=>setPostType("video")}>
          <BsCameraVideo/> Video
          </div>
          :
          <div id='video__post' className='flex items-center justify-center p-3 cursor-pointer gap-x-2 hover:bg-fuchsia-700 hover:text-white rounded shadow'  onClick={()=>setPostType("video")}>
          <BsCameraVideo/> Video
          </div>
          }
        </div>
       </div>

       <div className='bg-white w-full p-4'>
          <div className='w-full font-semibold'>
          <p className='text-slate-500 p-2'>Title</p>
          <input type="text" placeholder='Title' className='w-full outline-none text-slate-400 border p-2 rounded' onChange={handleSetTitle}/>
          </div>
          <div className='w-full font-semibold'>
          <p className='text-slate-500 p-2'>Content</p>
          <input type="text" placeholder='Post caption' className='w-full outline-none text-slate-400 border p-2 rounded'  onChange={handleSetDescription}/>
          </div>

          <div className='w-full font-semibold'>
          <p className='text-slate-500 p-2'>Links (optional)</p>
          <input type="text" placeholder='Links' className='w-full outline-none text-slate-400 border p-2 rounded'  onChange={handleSetLinks}/>
          </div>

          {
            postType === 'post'? null:null
          }

          {
            postType === 'image'? 
            <div className='w-full font-semibold'>
            
            <p className='text-slate-500 p-2'>Upload Image:</p>

            <div className='w-full '>
                              
                <div className='w-full h-auto grid grid-cols-4 gap-y-1 md:grid-cols-7 md:gap-y-2 justify-center items-center'>

                {
                   urls.length !== 0?
                   urls.map((url) =>{
                     return <img src={url} key={url} alt="url"className="h-16 w-16 border-2 border-rose-400 rounded" onClick={removeImage}/>
                   })
                   :
                   null
                }
        
                <label htmlFor="file"><BiImageAdd className='h-20 w-20 text-fuchsia-600'/></label>
                <input type="file" id='file' className='hidden'  onChange={onImageChange} multiple="multiple" accept='image/png, image/jpeg, image/jpg, image/gif'/>
                </div>
                {
                  <p className='text-xs text-slate-500'>Upload: {progress} %</p>
                }
        
            </div>
            </div>  
            :null
          }

          {
            postType === 'video'? 
            <div className='w-full font-semibold'>
            <p className='text-slate-500 p-2'>Add Video:</p>
            <input type='text' placeholder='Add Link' className='w-full outline-none text-slate-400 border p-2 rounded' onChange={handleSetVideo}/>
            </div>
            :null
          }

          <div className='w-full font-semibold'>
          <p className='text-slate-500 p-2'>Tags(Make sure that tags have '#' followed by the tags you want ):</p>
          <input type="text" placeholder='tags' className='w-full outline-none text-slate-400 border p-2 rounded' onChange={handleSetTags}/>
          </div>


          <div className='w-full flex items-center'>
            <input type="Checkbox" className='cursor-pointer' checked={isOpportunity} onChange={() => {setIsOpportunity(!isOpportunity);setCollectionName(isOpportunity?"posts": "opportunities")} }/>
            <p className='text-slate-500 p-2'>This is a career post</p>
          </div>

          {
            error?<p className='text-rose-500 w-full text-xs text-center py-2'>{errorMessage}</p>:null
          }
          <div className='flex w-full justify-center mt-2'>
              <button className='border bg-fuchsia-700 text-slate-200 text-lg font-bold w-80 py-2 shadow rounded hover:bg-fuchsia-500 hover:text-white' onClick={handleSubmit}>Post</button>
          </div>
       </div>
          
      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
      >
        <div className='flex flex-col items-center'>
          <div  className='flex items-center justify-center py-5'><h1 className='font-bold'>Your post is now pending and waitng for admins approval!</h1></div>
          <button className='flex items-center justify-center px-10 py-2 rounded bg-fuchsia-700 hover:bg-fuchsia-600 hover:text-white text-white' onClick={() => {closeModal()}}>Ok</button>
        </div>
        
      </Modal>
   


   </div>
  )
}

export default CreatePost