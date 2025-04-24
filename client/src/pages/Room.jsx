import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { createAvatar } from '@dicebear/core'
import { initials } from '@dicebear/collection'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')

function Room() {
    const { id } = useParams()
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOff, setIsVideoOff] = useState(false)
    const [isScreenSharing, setIsScreenSharing] = useState(false)
    const [avatar, setAvatar] = useState('')
    const videoRef = useRef(null)
    const [screenStream, setScreenStream] = useState(null)
    const localStream = useRef(null)

    useEffect(() => {
        socket.emit('join-room', id)

        socket.on('user-joined', (userId) => {
            console.log("added new one", userId)
        })

        socket.on('screen-share', ({ userId, isSharing }) => {
            console.log(`${userId} is ${isSharing ? 'sharing screen' : 'stopped sharing'}`)
        })

        socket.on('toggle-mic', ({ userId, isMuted }) => {
            console.log(`${userId} has ${isMuted ? 'muted' : 'unmuted'} their mic`)
        })

        socket.on('toggle-camera', ({ userId, isVideoOff }) => {
            console.log(`${userId} has ${isVideoOff ? 'turned off' : 'turned on'} their camera`)
        })

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                localStream.current = stream
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                }
            })
            .catch((error) => {
                console.log(error)
            })

        return () => {
            socket.off("user-joined")
            console.log("disconnected")
        }
    }, [id])

    useEffect(() => {
        const avatarSvg = createAvatar(initials, {
            seed: 'user-' + id,
            size: 80,
            backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
            radius: 50,
            fontSize: 40,
        }).toString()

        setAvatar(avatarSvg)
    }, [id])

    return (
        <div className="h-screen flex flex-col bg-gray-900 text-white">
            {/* Main Content */}
            <div className="flex-1 p-4 relative">
                {/* Screen Sharing Video (Full) */}
                {isScreenSharing && screenStream ? (
    <div className="flex justify-center items-center h-full">
        <video
            className="w-2/3 h-3/4 object-contain rounded-lg shadow-lg"
            autoPlay
            playsInline
            ref={(el) => {
                if (el && screenStream) {
                    el.srcObject = screenStream
                }
            }}
        />
        </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    </div>
                )}

                {/* Mini Webcam View During Screen Sharing */}
                {isScreenSharing && (
                    <div className="absolute bottom-4 right-4 w-48 h-32 border-2 border-white rounded-lg overflow-hidden shadow-lg">
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="bg-gray-800 py-4 px-6">
                <div className="flex justify-between items-center max-w-4xl mx-auto">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400">Room ID:</span>
                        <span className="font-medium">{id}</span>
                    </div>

                    <div className="flex space-x-4">
                        {/* Mic Toggle */}
                        <div className="relative group">
                            <button
                                onClick={() => {
                                    const newMuteState = !isMuted
                                    setIsMuted(newMuteState)
                                    socket.emit('toggle-mic', { roomId: id, isMuted: newMuteState })
                                }}
                                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                            >
                                {isMuted ? '🔇' : '🎤'}
                            </button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {isMuted ? "Unmute" : "Mute"}
                            </div>
                        </div>

                        {/* Camera Toggle */}
                        <div className="relative group">
                            <button
                                onClick={() => {
                                    const newVideoState = !isVideoOff
                                    setIsVideoOff(newVideoState)
                                    socket.emit('toggle-camera', { roomId: id, isVideoOff: newVideoState })
                                    localStream.current?.getVideoTracks().forEach(track => track.enabled = !newVideoState)
                                }}
                                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                            >
                                {isVideoOff ? '📹' : '📷'}
                            </button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {isVideoOff ? "Turn on camera" : "Turn off camera"}
                            </div>
                        </div>

                        {/* Screen Share */}
                        <div className="relative group">
                            <button
                                onClick={async () => {
                                    const newSharingState = !isScreenSharing
                                    setIsScreenSharing(newSharingState)
                                    socket.emit('screen-share', { roomId: id, isSharing: newSharingState })

                                    if (newSharingState) {
                                        try {
                                            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
                                            setScreenStream(stream)
                                        } catch (error) {
                                            console.error('Error starting screen share:', error)
                                        }
                                    } else {
                                        screenStream?.getTracks().forEach(track => track.stop())
                                        setScreenStream(null)
                                    }
                                }}
                                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                            >
                                🖥️
                            </button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {isScreenSharing ? "Stop sharing" : "Share screen"}
                            </div>
                        </div>
                    </div>

                    {/* End Call */}
                    <div className="relative group">
                        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors">
                            End Call
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            Leave meeting
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Room
