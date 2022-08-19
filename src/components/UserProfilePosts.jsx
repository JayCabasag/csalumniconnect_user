import React, { useEffect } from 'react'
import moment from 'moment'
import {Link} from 'react-router-dom'


function UserProfilePosts({uid, posts}) {
  
    const allPosts = posts
  
    return ( 
    <div className='flex flex-col m-1 rounded gap-y-1'>
           {
                allPosts.length === 0?
                <p className='text-center w-full text-slate-500 text-sm'>No posts to show</p>
                :
                allPosts.map((post)=>{
                    return <div className='flex w-full bg-slate-100 p-2 text-slate-500 items-center'>
                                <div className='text-sm'>
                                    <p className='font-bold'>{post.title}</p>
                                    <p className='text-xs'>{post.description}</p>
                                    <i className='text-xs'>Posted : {moment(post.createdAt.toDate()).fromNow()}</i>
                                </div>
                                <Link to={`../post-detail/${post.docId}`} className='bg-fuchsia-700 text-white px-2 rounded ml-auto mr-0 items-center text-center flex h-8 '>View Post</Link>
                            </div>
                })
            }
        



        </div>
  )
}

export default UserProfilePosts