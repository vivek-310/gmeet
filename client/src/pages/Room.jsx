import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { createAvatar } from '@dicebear/core'
import { initials } from '@dicebear/collection'

function Room() {
    const id = useParams().id
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOff, setIsVideoOff] = useState(false)
    const [isScreenSharing, setIsScreenSharing] = useState(false)
    const [avatar, setAvatar] = useState('')
    const videoRef=useRef(null);

    useEffect(()=>{
        navigator.mediaDevices.getUserMedia({video:true,audio:true})
        .then((stream)=>{
            if(videoRef.current){
                videoRef.current.srcObject = stream;
            }
        })
        .catch((error)=>{
            console.log(error)
        })

    },[])

    useEffect(() => {
        // Generate a random avatar for the user
        const avatarSvg = createAvatar(initials, {
            seed: 'user-' + id, // Use room ID as seed for consistency
            size: 80,
            backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
            radius: 50,
            fontSize: 40,
        }).toString()

        setAvatar(avatarSvg)
    }, [id])

    return (
        <div className="h-screen flex flex-col bg-gray-900 text-white">
            {/* Main Content Area */}
            <div className="flex-1 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Video Grid - Placeholder for now */}
                    <div className="bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
                       <video
                       ref={videoRef}
                       autoPlay
                       muted
                       
                       >

                       </video>
                    </div>
                    {/* Add more video grid items as needed */}
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-gray-800 py-4 px-6">
                <div className="flex justify-between items-center max-w-4xl mx-auto">
                    {/* Room Info */}
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400">Room ID:</span>
                        <span className="font-medium">{id}</span>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex space-x-4">
                        <div className="relative group">
                            <button 
                                onClick={() => setIsMuted(!isMuted)}
                                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                            >
                                {isMuted ? '🔇' : '🎤'}
                            </button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {isMuted ? "Unmute" : "Mute"}
                            </div>
                        </div>

                        <div className="relative group">
                            <button 
                                onClick={() => setIsVideoOff(!isVideoOff)}
                                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                            >
                                {isVideoOff ? '📹' : '📷'}
                            </button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {isVideoOff ? "Turn on camera" : "Turn off camera"}
                            </div>
                        </div>

                        <div className="relative group">
                            <button 
                                onClick={() => setIsScreenSharing(!isScreenSharing)}
                                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                            >
                                {isScreenSharing ? '🖥️' : '🖥️'}
                            </button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {isScreenSharing ? "Stop sharing" : "Share screen"}
                            </div>
                        </div>
                    </div>

                    {/* End Call Button */}
                    <div className="relative group">
                        <button 
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors"
                        >
                            End Call
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Leave meeting
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Room