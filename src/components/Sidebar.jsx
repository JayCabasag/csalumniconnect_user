import React, {useEffect, useState} from 'react'
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';

const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';

const Sidebar = ({ user, closeToggle }) => {

  const [userFullname, setUserFullname] = useState('')
  const [userProfile, setUserProfile] = useState('')

  useEffect(() => {
    setUserFullname(localStorage.getItem('name'))
    setUserProfile(localStorage.getItem('photoURL'))
  }, [])
  

  const logo = 'https://firebasestorage.googleapis.com/v0/b/tcuhub-cf9e1.appspot.com/o/images%2Fcs_allumni_logo.2.png?alt=media&token=7f0e6012-7b96-416e-a73a-3ba10c6d78ea';

  const handleCloseSidebar = () => {
    if(closeToggle) closeToggle(false);
  }

  const categories = [
    { name: 'Announcements' },
    { name: 'Events' },
    { name: 'Webinars' },
    { name: 'Ojts-&-Hirings' },
    { name: 'Careers' },
    { name: 'All-Chat' },

  ]

  return (
    <div className='flex flex-col justify-between bg-whiteh-full overflow-y-scroll min-w-210 hide-scrollbar h-auto'>
        <div className='flex flex-col'>
          <Link
          to='/'
          className='flex px-5 gap-2 my-6 pt-1 w-190 items-center'
          onClick={handleCloseSidebar}
          >
            <img src={logo} alt="logo" className='w-full flex '/>
          </Link>

          <div className='flex flex-col gap-5'>
          <NavLink
              to="/"
              className={({ isActive }) => (isActive ? isActiveStyle: isNotActiveStyle)}
              onClick={handleCloseSidebar}
            >
              <RiHomeFill />
              Home
            </NavLink>
            <h3 className='mt-3 px-5 text-base 2xl:text-xl'>Explore Categories</h3>
              {categories.map((category) => (
              <NavLink
                to={`/category/${category.name}`}
                className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
                onClick={handleCloseSidebar}
                key={category.name}
              >
                
                {category.name}
              </NavLink>
            ))}
          </div>
        </div>
         { user && (
           <Link
            to={`user-profile/${localStorage.getItem('uid')}`}
            className="flex mt-3 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3 "
            onClick={handleCloseSidebar}
           >
             <img src={userProfile} alt='user' className="w-10 h-10 rounded-full"/>
             <p>{userFullname}</p>
           </Link>
         )}
    </div>
  )
}

export default Sidebar