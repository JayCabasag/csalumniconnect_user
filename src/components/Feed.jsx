import React, {useState, useEffect, useRef} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from './Spinner';
import MasonryLayout from './MasonryLayout';
import {doc, getFirestore, collection, getDocs, getDoc, orderBy, query, limit, updateDoc, where} from "firebase/firestore"

const Feed = () => {
  
  const [uid, setUid] = useState(localStorage.getItem('uid'))
  const [usersInterests, setUsersInterests] = useState([])
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentLimit, setCurrentLimit] = useState(100)

  const navigate = useNavigate();

useEffect(() => {
  setPosts([]);
  getAllPosts();
  getUsersInterests();
}, [])


  
  if(loading) return <Spinner message="We are adding Posts to your feed!"/>

  const getAllPosts = async () => {
    setLoading(true)
    const queryToOrder = query(collection(getFirestore(), "posts"), where('reviewed', "==",true),orderBy('ticks', 'desc'), limit(`${currentLimit}`));

    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "posts"), orderBy("ticks"), orderBy("ticks", "desc"));
        querySnapshot.forEach((doc) => {
          setPosts((prev) => {
          return[...prev, doc.data()]
        });
        })
    setLoading(false)
  }

  const getUsersInterests = async () => {
    setLoading(true)
    const docRef = doc(getFirestore(), "users", `${uid}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const checkIfInterestIsPresent = docSnap.data().interests;

      if(checkIfInterestIsPresent.length > 0){
        setUsersInterests(docSnap.data().interests);
      } else {
        
        const queryToOrder = query(collection(getFirestore(), "tags"), orderBy('discussion', 'desc'),  limit(10));
        const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "tags"));
        
        const interestArray = [];

        querySnapshot.forEach((doc) => {
          interestArray.push(doc.data().tag);
        });
        
        setUsersInterests(interestArray)
      }    
    } else {
      
    }
    setLoading(false) 
  }



  return (
    <div>  
        <MasonryLayout posts={posts} interests={usersInterests}/>
    </div>
  )
}

export default Feed
