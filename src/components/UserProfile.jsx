import React, { useEffect, useRef } from 'react'
import {onAuthStateChanged, signOut, updateProfile  } from 'firebase/auth'
import { auth } from '../firebase-config'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {FaArrowLeft} from 'react-icons/fa'
import { setDoc, doc, getFirestore, collection, query, where, orderBy, getDocs, getDoc, addDoc, updateDoc} from "firebase/firestore"
import {  getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage';
import { storage } from '../firebase-config';
import {AiOutlineCaretDown, AiOutlineCaretUp} from 'react-icons/ai'
import UserProfilePosts from './UserProfilePosts'
import Modal from 'react-modal/lib/components/Modal'
import { BiImageAdd } from 'react-icons/bi'
import {GoVerified} from 'react-icons/go'
import UserEmployment from './UserEmployment'


const UserProfile = () => {

  const [posts, setPosts] = useState([])
  const navigate = useNavigate()
  const currenUserUid = localStorage.getItem('uid')
  const { uid } = useParams();
  
  const [user, setUser] = useState({})
  const [allUserData, setAllUserData] = useState(null)
  
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  })

  
  const [userProfileImage, setUserProfileImage] = useState('http://cdn.onlinewebfonts.com/svg/img_24787.png')
  const [userProfileName, setUserProfileName] = useState('Name')
  const [userProfileCourse, setUserProfileCourse] = useState('Course')
  const [userProfileYear, setUserProfileYear] = useState('Year Level')
  const [userStudentId, setUserStudentId] = useState('')

  const [allSettings, setAllSettings] = useState([])


  const [showEmailInput, setShowEmailInput] = useState(false)
  const [errorForEmail, setErrorForEmail] = useState(false)
  const [errorForEmailMessage, setErrorForEmailMessage] = useState('')
  const [successForEmail, setSuccessForEmail] = useState(false)
  const [emailValue, setEmailValue] = useState('')
  const [phoneValue, setPhoneValue] = useState('')
  const [verified, setVerified] = useState(false)

  const [role, setRole] = useState('CS Student')
  const [batch, setBatch] = useState('')
  const [yearSection, setYearSection] = useState('')
  const [faculty, setFaculty] = useState('')


  const [showPhoneInput, setShowPhoneInput] = useState(false)
  const [errorForPhone, setErrorForPhone] = useState(false)
  const [errorForPhoneMessage, setErrorForPhoneMessage] = useState('')
  const [successForPhone, setSuccessForPhone] = useState(false)

  const emailCheckboxRef = useRef()
  const phoneCheckboxRef = useRef()

  const [usersTotalPosts, setusersTotalPosts] = useState(0)
  const [openPostsLists, setOpenPostsLists] = useState(false)

  const [selectedNameCard, setSelectedNameCard] = useState("https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif")


  const [openChangeProfileModal, setOpenChangeProfileModal] = useState(false)

  const [progress, setProgress] = useState(0)
  const [url, setUrl] = useState('')


  useEffect(() => {
    getUserDetails()
    getUserSettings()
    getAllPosts()
    getNamecard()
  }, [])


  const getUserSettings = async () =>{
    const ticksRef = doc(getFirestore(), "notificationsettings", `notif_${uid}`);
    const docSnap = await getDoc(ticksRef);

    if(docSnap.exists()){  
      
      setShowEmailInput(docSnap.data().emailStatus)
      setShowPhoneInput(docSnap.data().phoneStatus)
      setEmailValue(docSnap.data().email)
      setPhoneValue(docSnap.data().phone)

    } else {
      setDoc(doc(getFirestore(), 'notificationsettings', `notif_${uid}`), {
        docId: 'notif_'+uid,
        userHandle: uid,
        email: '',
        emailStatus: false,
        phone: '',
        phoneStatus: false
      })

      setShowEmailInput(false)
      setShowPhoneInput(false)
    }

  }

  const getUserDetails = async () => {
    
    const docRef = doc(getFirestore(), "users", `${uid}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        setUserProfileImage(docSnap.data().image)
        setUserProfileName(docSnap.data().displayName)
        setUserProfileYear(docSnap.data().year)
        setUserProfileCourse(docSnap.data().course)
        setUserStudentId(docSnap.data().studentId)
        setRole(docSnap.data().role)
        setVerified(docSnap.data().verified)
        setBatch(docSnap.data().batch)
        setYearSection(docSnap.data().yearSection)
        setFaculty(docSnap.data().faculty)

        setAllUserData(docSnap.data())

    } else {
        console.log('User does not exist')
    }
     getUsersTotalPost()
  }


  const [openNamecardsModal, setOpenNamecardsModal] = React.useState(false);

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


  const getUsersTotalPost = async () => {
    const queryToOrder = query(collection(getFirestore(), "posts"), where("userHandle", "==", `${uid}`), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "posts"));

    var returnArr = [];
    querySnapshot.forEach((doc) => {
      var item = doc.data();
      returnArr.push(item);
    })

    setusersTotalPosts(returnArr.length)

  }
  
  const emailTextRef = useRef()
  const phoneTextRef = useRef()

  const switchForEmail = async (choice) => {
    if(choice === 'Yes'){
      const emailRef = doc(getFirestore(), "notificationsettings", `notif_${uid}`);
      await updateDoc(emailRef, {
        emailStatus: true
      });
      
      setShowEmailInput(true)
    }
    if(choice === 'No'){
      const emailRef = doc(getFirestore(), "notificationsettings", `notif_${uid}`);
      await updateDoc(emailRef, {
        emailStatus: false
      });
      setShowEmailInput(false)
    }
  }

  const switchForPhone = async (choice) => {
    if(choice === 'Yes'){
    
      const phoneRef = doc(getFirestore(), "notificationsettings", `notif_${uid}`);
      await updateDoc(phoneRef, {
        phoneStatus: true
      });

      setShowPhoneInput(true)
    }
    if(choice === 'No'){

      const phoneRef = doc(getFirestore(), "notificationsettings", `notif_${uid}`);
      await updateDoc(phoneRef, {
        phoneStatus: false
      });

      setShowPhoneInput(false)
    }
  }

  const confirmEmail = async () => {
    const email = emailTextRef.current.value
 
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if ( re.test(email) ) {
      
      const emailRef = doc(getFirestore(), "notificationsettings", `notif_${uid}`);
      await updateDoc(emailRef, {
        email: email
      });
            
      setErrorForEmail(false)
      setErrorForEmailMessage('')
      setSuccessForEmail(true)
    }
    else {
      setErrorForEmail(true)
      setErrorForEmailMessage('Input email is not Valid')
      setSuccessForEmail(false)
    }

  }

  const confirmPhone = async () => {
    const phone = phoneTextRef.current.value

    if(phone.length !== 10){
      setErrorForPhone(true)
      setErrorForPhoneMessage('Input Phone is not Valid')
      setSuccessForPhone(false)


    } else if (isNaN(+phone)) {
      setErrorForPhone(true)
      setErrorForPhoneMessage('Input Phone is not Valid')
      setSuccessForPhone(false)
    }else {
      
      const phoneRef = doc(getFirestore(), "notificationsettings", `notif_${uid}`);
      await updateDoc(phoneRef, {
        phone: phone
      });

      setErrorForPhone(false)
      setErrorForPhoneMessage('')
      setSuccessForPhone(true)

    }
  }

  const logout = async () => {
    await signOut(auth)
    localStorage.clear()
    navigate('/login')
  }

  const goBack = () => {
    navigate('/')
  }

  const getAllPosts = async () => {

    const queryToOrder = query(collection(getFirestore(), "posts"), where("userHandle", "==", `${uid}`), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "posts"));

    var returnArr = [];
    querySnapshot.forEach((doc) => {
      var item = doc.data();
      returnArr.push(item);
    })

    setPosts(returnArr)
    setOpenPostsLists(false)
  }

  const closeAllPost = () => {
    setOpenPostsLists(true)
  }

  const getNamecard = async () => {
    const ticksRef = doc(getFirestore(), "namecardsettings", `nc_${uid}`);
    const docSnap = await getDoc(ticksRef);

    if(docSnap.exists()){  
      setSelectedNameCard(docSnap.data().image)
    } else {
      setDoc(doc(getFirestore(), 'namecardsettings', `nc_${uid}`), {
        docId: 'nc_'+uid,
        userHandle: uid,
        image: 'https://cdnb.artstation.com/p/assets/images/images/024/538/827/original/pixel-jeff-clipa-s.gif?1582740711'
      })

      setSelectedNameCard('https://cdnb.artstation.com/p/assets/images/images/024/538/827/original/pixel-jeff-clipa-s.gif?1582740711')  
      
    }
  }

  const saveNameCard = async (image) => {
    
    const namecardRef = doc(getFirestore(), "namecardsettings", `nc_${uid}`);
    await updateDoc(namecardRef, {
      image: image
    });
    getNamecard()
    setOpenNamecardsModal(false)
  }
  
  const closeNameCardsModal = () => {
    setOpenNamecardsModal(false)
  }

  const saveUpdateProfile = async () => {
    await updateProfile(auth.currentUser, { 
      photoURL: userProfileImage
    })
    
    const docRef = doc(getFirestore(), 'users',  `${uid}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        image: userProfileImage
      });
    } else {
      console.log('User does not exists')  
    }  


    setOpenChangeProfileModal(false)
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
                  setUserProfileImage(downloadURL)
                });
              }
            );
  }

  const cancelUpdateProfile = () => {
    getUserDetails()
    setOpenChangeProfileModal(false)
  }

  return (
    <div className='flex flex-col w-full gap-y-1 p-2'>

            <div className='w-full bg-white h-auto p-3 flex items-center rounded-sm shadow'>
              <span><FaArrowLeft  className='h-4 w-4 mr-2 text-slate-500 cursor-pointer' onClick={()=>{goBack()}}/></span> <p className='font-bold text-slate-500'>Account Details</p>
            </div>

      <div className='flex flex-col bg-white w-full  md:w-3/5 gap-y-1 rounded-sm shadow'>
            {
              uid === currenUserUid?
              <div className='flex w-full justify-end'>
              <button className='bg-fuchsia-700 text-white p-2 cursor-pointer rounded shadow mr-2 md:mr-6  italic text-xs mt-2' onClick={() => {setOpenNamecardsModal(true)}}>Change name card</button>
            </div>
            :
            null
            }
            <div className='flex w-full h-96 p-2 rounded justify-center'>
              <img src={selectedNameCard} alt="wall" className='rounded shadow-fuchsia-700'/>
            </div>
            
            <div className=' flex items-center w-50 h-50  ml-5 md:ml-16 -md:mt-16 -mt-20 p-2 bg-transparent'>
              <img 
              src={userProfileImage}
              width={120}
              height={120}
              alt="profile"
              className='rounded-full border-2 border-fuchsia-700 shadow-sm'
              />

              <div className='flex flex-col mt-9 ml-2 font-bold text-slate-500'>
                <div className='mt-6'>
                  <p>{userProfileName}</p>
                </div>
                <div className='flex'>
                 
                  
                  <p className='italic font-mono text-xs'>{role}</p>
                  
                  {
                  role === 'Alumni'?
                  <p className='italic font-mono text-xs'> - {batch}</p>
                  :
                  null
                  }

                  {
                  role === 'CS Student'?
                  <p className='italic font-mono text-xs'> - {yearSection}</p>
                  :
                  null
                  }

{
                  role === 'Professor'?
                  <p className='italic font-mono text-xs'> - {faculty}</p>
                  :
                  null
                  }
                  
                            
                  
              
                </div>

                <div className='flex'>
                    {
                      uid === currenUserUid?
                      <button className='text-xs bg-fuchsia-700 text-white p-1 rounded-md' onClick={() => {setOpenChangeProfileModal(true)}}>Change Photo</button>
                      :
                      null
                    }
                      <div className='flex mr-0 text-xs items-center ml-1'>
                          {
                            verified?
                            <p className='flex items-center gap-1'>Verified<GoVerified className='text-fuchsia-700'/></p>
                            :
                            <p>Not verified</p>
                          }
                      </div>
                  
                </div> 
              </div>
            </div>
                          
            {
              role === 'Alumni' &&  uid === localStorage.getItem('uid')?
              <UserEmployment data={allUserData} userId={uid}/>
              :
              null
             }
            

            <div className='w-full bg-white border p-2 text-slate-500 font-bold: flex'>
                <div className='text-sm'>
                Total Posts ({usersTotalPosts})
                </div>
                
              {
                openPostsLists?<div className='ml-auto mr-0 cursor-pointer flex items-center space-x-2' onClick={() => {getAllPosts()}}>
                                <p className='text-sm'>Hide All Posts</p>
                                <AiOutlineCaretUp/>
                              </div>
                              :
                              <div className='ml-auto mr-0 cursor-pointer flex items-center space-x-2' onClick={() => {closeAllPost()}}>
                                <p className='text-sm'>Show All Posts</p>
                                <AiOutlineCaretDown />
                              </div>
              }

           </div>

           {
                openPostsLists?
                <UserProfilePosts uid={uid} posts={posts}/>
                :
                null
           }


           {
             uid === currenUserUid?
             <button className=' rounded border p-1 bg-fuchsia-700 py-2 hover:bg-fuchsia-700 text-white cursor-pointer shadow ' onClick={logout}>Log Out</button>
             :
             null
           }
      </div>


      {/* Namecards modal */}

      <Modal
        isOpen={openNamecardsModal}
        style={customStyles}
          >
            <div className='flex flex-col space-y-2'>
              <p className='text-slate-500 text-sm'>Please select a namecard: </p>
              <div className='w-full flex flex-col md:flex-row items-center justify-center gap-1 overflow-auto'>
                  <img src="https://www.muycomputer.com/wp-content/uploads/2021/06/Monterey-1.jpg" alt="nature" width={100} className="cursor-pointer" onClick={()=>{saveNameCard('https://www.muycomputer.com/wp-content/uploads/2021/06/Monterey-1.jpg')}}/>
                  <img src="https://wallpapercave.com/wp/wp4676576.jpg" alt="clouds" width={100} className="cursor-pointer" onClick={()=>{saveNameCard('https://wallpapercave.com/wp/wp4676576.jpg')}}/>
                  <img src="https://blog.hootsuite.com/wp-content/uploads/2019/05/mobile-wallpapers-940x470.jpg" alt="leaves" width={100} className="cursor-pointer" onClick={()=>{saveNameCard('https://blog.hootsuite.com/wp-content/uploads/2019/05/mobile-wallpapers-940x470.jpg')}}/>
                  <img src="https://eskipaper.com/images/wall-paper-2.jpg" alt="monter" width={100} className="cursor-pointer" onClick={()=>{saveNameCard('https://eskipaper.com/images/wall-paper-2.jpg')}}/>
                  <img src="https://www.androidguys.com/wp-content/uploads/2015/12/Wave-Wallpapers-1.jpg" alt="waves" width={100} className="cursor-pointer" onClick={()=>{saveNameCard('https://www.androidguys.com/wp-content/uploads/2015/12/Wave-Wallpapers-1.jpg')}}/>
              </div>
              <div className='flex gap-2'>
                <button className='w-full p-2 bg-fuchsia-700 text-white rounded cursor-pointer' onClick={()=>{closeNameCardsModal()}}>Cancel</button>
              </div>
            </div>
        </Modal>



           {/*Modal for Update Profile*/}


        <Modal
        isOpen={openChangeProfileModal}
        style={customStyles}
          >
            <div className='flex flex-col space-y-2'>


              <div className='flex'>
                <img src={userProfileImage} alt="" width={150} />
                <div className='mt-auto mb-0 pl-1'>
                <label htmlFor="file" ><BiImageAdd className='h-6 w-6 text-fuchsia-700'/></label>
                <input type="file" id='file' className='hidden'  onChange={onImageChange} accept='image/png, image/jpeg, image/jpg, image/gif'/>
                </div>
              </div>

              {
                  progress <= 0 ?
                  null
                  :
                  <p className='text-xs text-slate-500'>Upload: {progress} %</p>
              }
        

              <button className='w-full bg-fuchsia-700 text-white rounded-md hover:bg-fuchsia-600' onClick={()=>{saveUpdateProfile()}}>Save</button>
              <button className='w-full bg-fuchsia-700 text-white rounded-md hover:bg-fuchsia-600' onClick={()=>{cancelUpdateProfile()}}>Cancel</button>

            </div>
            
        </Modal>

    </div>
    
  )
}

export default UserProfile