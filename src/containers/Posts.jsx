import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Feed from '../components/Feed';
import PostDetail from '../components/PostDetail';
import Search from '../components/Search';
import Sidebanner from './Sidebanner';
import CreatePost from '../components/CreatePost ';
import AllChat from '../components/AllChat'
import Announcements from '../components/Announcements'
import Notifications from '../components/Notifications'
import AnnouncementDetail from '../components/AnnouncementDetail'
import Opportunities from '../components/Opportunities';
import OpportunityDetails from '../components/OpportunityDetails';


const Posts = ({ user }) => {

  return (
    <div className='px-2 md:px-5'>
        <div className='bg-gray-50 w-full'>
            <Navbar />
        </div>
        <div className='flex w-full h-full'>
        <div className='h-full w-full md:w-3/5'>
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/category/:categoryId" element={<Announcements />} />

            <Route path="/post-detail/:postId" element={<PostDetail />} />
            <Route path="/announcement-detail/:postId" element={<AnnouncementDetail />} />
            <Route path="/opportunity-details/:postId" element={<OpportunityDetails />} />
            
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/category/all-chat" element={<AllChat />} />
            <Route path="/category/Careers" element={<Opportunities />} />
            <Route path="/category/notifications" element={<Notifications />} />
            <Route path="/search/:searchTerm" element={<Search />} />  
          </Routes>
        </div>
        <Sidebanner/>
        </div>
        
    </div>
  )
}

export default Posts