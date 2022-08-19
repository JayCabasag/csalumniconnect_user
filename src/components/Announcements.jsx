import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import AnnouncementMasonry from './AnnouncementMasonryLayout'

const Announcements = () => {

  const { categoryId } = useParams()

  return (

        <AnnouncementMasonry category={categoryId}/>        
  );

}

export default Announcements