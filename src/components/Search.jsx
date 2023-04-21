import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {IoMdSearch} from 'react-icons/io'
import { getFirestore, where, collection, getDocs, orderBy, query, limit } from "firebase/firestore"
import Masonry from 'react-masonry-css';
import { useDebounce, useDebouncedCallback } from 'use-debounce';

const Search = () => {
  
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [finalSearchTerm, setFinalSearchTerm] = useState([])
  const [totalResults, setTotalResults] = useState(0)


  const breakpointColumnsObj = {
    default: 1,
  };

  useEffect(() => {
    const getInitialResult = async () => {

      setSearchResults([])
      
      const arrayOfTerm = searchTerm.split(" ")
      
      for(var i=0;i<arrayOfTerm.length;i++){
        arrayOfTerm[i]="#"+arrayOfTerm[i];
      }
  
      setFinalSearchTerm(arrayOfTerm)
  
      const queryToOrder = query(collection(getFirestore(), "posts"), where('reviewed', '==', true), orderBy('ticks', 'desc'));
      const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "posts"), orderBy("ticks"), orderBy("ticks", "desc"), limit(250));
      var returnArr = [];
      querySnapshot.forEach((doc) => {
        var item = doc.data();
        returnArr.push(item);
      })  
  
      setSearchResults(returnArr)
      setTotalResults(returnArr.length)
    }
  
    getInitialResult()
  }, [searchTerm])
  
  const getResult = async () => {
    setSearchResults([])
    
    const arrayOfTerm = searchTerm.split(" ")
    
    for(var i=0;i<arrayOfTerm.length;i++){
      arrayOfTerm[i]="#"+arrayOfTerm[i];
    }

    setFinalSearchTerm(arrayOfTerm)

    const queryToOrder = query(collection(getFirestore(), "posts"), where('reviewed', '==', true), orderBy('ticks', 'desc'));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "posts"), orderBy("ticks"), orderBy("ticks", "desc"), limit(250));
    var returnArr = [];
    querySnapshot.forEach((doc) => {
      var item = doc.data();
      returnArr.push(item);
    })  

    setSearchResults(returnArr)
    setTotalResults(returnArr.length)
  }
  
  const debouncedSearch = useDebouncedCallback(
    (value) => {
      setSearchTerm(value)
    },
    1500
  );
  const changeValue = (e) => {
    debouncedSearch(e)
  }

  searchResults.map((post) => {
    for(let i = 0; i < finalSearchTerm.length; i++) {
      for(let j = 0; j < post.tags.length; j++) {
              if(finalSearchTerm[i] === post.tags[j]) {
                  return post["show"] = true;
              } 
          }
      }
      return post["show"] = false;
  })


  return (
    <div className='w-full pt-5 px-5 text-slate-500 flex flex-col'>
      <div className='w-full flex items-center'>
      <div className='flex justify-start items-center w-full px-2 rounded-l-md bg-white border border-fuchsia-700 outline-none focus-within:shadow-small py-0.5'>
        <IoMdSearch fontSize={21} className="text-black ml-1"/>
          <input 
          type="text" 
          autoFocus={true}
          placeholder="Search tags"
          defaultValue={searchTerm}
          onChange={(e)=>{changeValue(e.target.value)}}
          className='p-2 w-full bg-white outline-none'
          />
      </div>
      <button className='bg-fuchsia-700 text-white py-2.5 px-5 border rounded-r-md' onClick={() => {getResult()}}>Search</button>
      </div>


      <div>
            <div>

                <p className='p-2'>
                  Results for tags (case sensitive) "{searchTerm}"
                </p>

                <div className='w-full md:w-3/5'>
                  <Masonry className="flex animate-slide-fwd" breakpointCols={breakpointColumnsObj}>
                  {
                     searchResults.map((post)=>{
                          return <div className='flex' key={post.docId}>
                                  {
                                    post.show === true?
                                      <div className='w-full bg-white p-2 border rounded-md gap-y-4'>
                                        <p className='font-bold p-1'>Title: {post.title}</p>
                                        <div className='flex'>
                                              <p className='italic text-xs p-1'> Involved: ({post.ticks})</p>
                                              <p className='italic text-xs p-1'> tags: ({post.tags})</p>
                                              
                                        </div>
                                        <Link to={`../post-detail/${post.docId}`}  className='bg-fuchsia-700 hover:bg-fuchsia-600 text-white px-5 p-1 rounded'>Check this post</Link>
                                      </div>
                                    :
                                    null
                                  }
                                 </div>
                     })

                  }

                  </Masonry>


                </div>


                <p className='p-2'>
                  Hot Topics ({totalResults})
                </p>

                <div className='w-full md:w-3/5'>
                  <Masonry className="flex animate-slide-fwd" breakpointCols={breakpointColumnsObj}>
                  {
                     searchResults.map((post)=>{
                          return <div className='flex' key={post.docId}>
                                 
                                      <div className='w-full bg-white p-2 border rounded-md gap-y-4'>
                                        <p className='font-bold p-1'>Title: {post.title}</p>
                                        <div className='flex'>
                                              <p className='italic text-xs p-1'> Involved: ({post.ticks})</p>
                                              <p className='italic text-xs p-1'> tags: ({post.tags})</p>
                                              
                                        </div>
                                        <Link to={`../post-detail/${post.docId}`}  className='bg-fuchsia-700 hover:bg-fuchsia-600 text-white px-5 p-1 rounded'>Check this post</Link>
                                      </div>
                                
                                 </div>
                     })

                  }

                  </Masonry>


                </div>

                </div>
            </div>
    </div>
  )
}
export default Search