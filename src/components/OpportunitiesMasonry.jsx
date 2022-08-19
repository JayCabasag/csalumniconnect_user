import React, {useEffect, useState} from 'react'
import Masonry from 'react-masonry-css';
import Opportunity from './Opportunity';

const OpportunitiesMasonry = ({posts}) => {
  
  const breakpointColumnsObj = {
    default: 1,
  };

  
  return (
    
    <Masonry className="flex animate-slide-fwd w-full" breakpointCols={breakpointColumnsObj}>
  
      {
          posts.map((post)=>{
            return <Opportunity key={post.docId} post={post}/>
          })
      }
      
    </Masonry>
  )

}

export default OpportunitiesMasonry;

