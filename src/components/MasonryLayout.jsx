import React, {useEffect, useState} from 'react'
import Masonry from 'react-masonry-css';
import Post from './Post';
import Modal from 'react-modal/lib/components/Modal';


const MasonryLayout  = ({posts, interests}) => {
  
  const breakpointColumnsObj = {
    default: 1,
  };

 
  // const filteredInterests = [...new Set(interests)].reverse();  

  // posts.map((post)=>{
    
  //       // Loop for first array
  //     for(let i = 0; i < filteredInterests.length; i++) {
  //           // Loop for array2
  //           for(let j = 0; j < post.tags.length; j++) {
  //               // Compare the element of each and
  //               // every element from both of the
  //               // arrays
  //               if(filteredInterests[i] === post.tags[j]) {
  //                   // Return if common element found
  //                   return post["show"] = true;
  //               } 
  //           }
  //       }
  //       // Return if no common element exist
  //       post["show"] = false;

  // })
  
  return (
    
    <Masonry className="flex animate-slide-fwd" breakpointCols={breakpointColumnsObj}>
  
      {
          posts.map((post)=>{
            return <Post key={post.docId} post={post}/>
          })
      }

      
    </Masonry>
  )

}

export default MasonryLayout 

