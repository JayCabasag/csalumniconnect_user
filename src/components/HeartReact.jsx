import React, {useEffect, useState} from 'react'
import {AiOutlineHeart} from 'react-icons/ai'
import {doc, getFirestore, where, collection, increment, getDocs, getDoc, orderBy, query, limit, documentId, exists, updateDoc, setDoc, serverTimestamp} from "firebase/firestore"
import { async } from '@firebase/util'

const HeartReact = ({totalHearts, postId, postTags, postUserHandle} ) => {

const [postData, setPostData] = useState([])

  const [loveArrays, setLoveArrays] = useState(totalHearts);
  const [currentTotalHeart, setCurrentTotalHeart] = useState(loveArrays.length)
  const [actualTotalHearts, setActualTotalHearts] = useState(currentTotalHeart);
  const uid = localStorage.getItem('uid');
  const [loved, setLoved] = useState(false)

  const [currentLoves, setCurrentLoves] = useState([])

  useEffect(async () => {
    if(loveArrays.includes(uid)){
        setLoved(true)
    } else {
        setLoved(false)
    }

  }, [])

  const removeHeart = async () => {

    const heartRef = doc(getFirestore(), "posts", `${postId}`);
    const docSnap = await getDoc(heartRef);

    if (docSnap.exists()) {
        const loveArray = docSnap.data().loves;
        var index = loveArray.indexOf(uid)
        if (index !== -1) {
            loveArray.splice(index, 1);
            setCurrentLoves(loveArray)
            await updateDoc(heartRef, {
                         loves: loveArray
                     });
         setLoved(false)
         setCurrentTotalHeart(currentTotalHeart - 1)
         removeTicks()
        }

      } else {
        console.log("No such document!");
      }
  }

  const removeTicks = async () => {
    const ticksRef = doc(getFirestore(), "posts", `${postId}`);
    const docSnap = await getDoc(ticksRef);

    if(docSnap.exists()){  
      await updateDoc(ticksRef, {
        ticks: increment(-1)
      });
    } else {
      console.log('Docs does not exists')
    }

}


  const addHeart = async () => {

    const heartRef = doc(getFirestore(), "posts", `${postId}`);
    const docSnap = await getDoc(heartRef);

    if (docSnap.exists()) {
        const loveArray = docSnap.data().loves;
        const AddedLove = [...loveArray, uid];

        await updateDoc(heartRef, {
            loves: AddedLove
        });
        
        setLoved(true)
        setCurrentTotalHeart(currentTotalHeart + 1)

        addNewInterests()
        addTicks()
        addNotification()

      } else {
        console.log("No such document!");
      }

  }

  const addNotification = async () => {

    const docRef = doc(collection(getFirestore(), "notifications"))
    const payload = {
      notificationId: docRef.id,
      notificationFor: 'post',
      postId: postId,
      trigerredByName: localStorage.getItem('name'),
      trigerredByUid: localStorage.getItem('uid'),
      trigerredByUserProfile: localStorage.getItem('photoURL'),
      notificationAbout: ' Love your post',
      userHandle: postUserHandle,
      createdAt: serverTimestamp(),
      viewed: false
    }
    await setDoc(docRef, payload).then(
      
    )

  }

  const addTicks = async () => {
    const ticksRef = doc(getFirestore(), "posts", `${postId}`);
    const docSnap = await getDoc(ticksRef);

    if(docSnap.exists()){  
      await updateDoc(ticksRef, {
        ticks: increment(1)
      });
    } else {
      console.log('Docs does not exists')
    }
  }

  

  const addNewInterests = async () =>{
    const userRef = doc(getFirestore(), "users", `${uid}`);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
        const interestsArray = docSnap.data().interests;
        var combinedInterests = [...interestsArray, ...postTags];

        await updateDoc(userRef, {
          interests: combinedInterests
       });

    } else {
       console.log("No such document!");
    }

  }


  return (
    <div className='flex p-3 cursor-pointer'
            >  
            {
                loved?
                <div onClick={() => removeHeart()}>
                    <div className='text-fuchsia-400 flex text-sm  items-center gap-x-2 pr-2'>
                    <AiOutlineHeart className='w-6 h-6 items-center' />{currentTotalHeart} 
                </div>
                
                </div>
                
                :
                <div onClick={() => addHeart()}>
                    <div className='text-slate-400 flex text-sm items-center gap-x-2 pr-2'>
                    <AiOutlineHeart className='w-6 h-6 items-center' />{currentTotalHeart} 
                </div>
                </div>
                
       
            }
            
    </div>
  )
}

export default HeartReact