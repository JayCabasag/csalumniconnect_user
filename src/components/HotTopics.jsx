import React, { useState } from 'react';

const HotTopics = ({ allTopics}) => {

  let topicRank = 1

  return (
    <div className='w-full h-60 rounded-lg bg-white shadow'>
        <div className='text-slate-500 pl-4 pt-2'>Hot Topics</div>
        <div className='px-8 gap-y-1 h-40 overflow-auto overflow-y-hidden hover:overflow-y-auto'>
          <ul>
          {
             allTopics.map((topic) => {
               return <li key={topicRank = topicRank + 1} className='text-cyan-500 flex flex-col'>
                 {topic[0]}
                  <p className='text-slate-400 text-xs italic'>Discussions: {topic[1]}</p>
                 </li>
             })
          }
          </ul>
        </div>

    </div>
  )
}

export default HotTopics