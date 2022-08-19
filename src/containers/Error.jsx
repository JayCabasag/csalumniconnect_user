import React, {useState} from 'react'

const Error = () => {
  
  const [interests, setinterests] = useState(['#tcuhub','#thesis' ,'#games', '#games', '#programming'])

  const filteredInterests = [...new Set(interests)]

  return (
    <div className='flex justify-center items-center text-lg'>
    {
      filteredInterests.reverse().map((data)=>{
        return <p key={data}> {data} </p>
      })
    }
    
    Your Lost make sure to go back to previous page!..</div>
  )
}

export default Error