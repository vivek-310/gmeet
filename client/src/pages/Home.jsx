import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import{v4 as uuid} from 'uuid';

function Home() {
  const navigate=useNavigate();

  const handlecreateRoom=()=>{
    const id=uuid();
    navigate(`/room/${id}`)
  }

  return (
    <div>
      <div className='h-screen flex flex-col items-center justify-center'>
        <h1 className='font-bold text-2xl'>welcome to google meet</h1>
        <button onClick={handlecreateRoom} className='bg-blue-500 text-white p-4 mt-4 rounded-2xl text-xl font-medium'>create and start the meet</button>
      </div>
    </div>
  )
}

export default Home