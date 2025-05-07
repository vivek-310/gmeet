import React, { useEffect, useRef, useState } from 'react';
import { BsMicMuteFill,BsFillCameraVideoOffFill,BsFillCameraVideoFill } from "react-icons/bs";
import { BsFillMicFill,BsDisplayFill } from "react-icons/bs";

function Room() {
    const cameraRef = useRef(null);
    const screenRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [stream, setStream] = useState(null);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    useEffect(() => {
        const getMedia = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(mediaStream);
                if (cameraRef.current) {
                    cameraRef.current.srcObject = mediaStream;
                }
            } catch (error) {
                console.error('Failed to access media devices:', error);
            }
        };

        getMedia();
    }, []);

    const toggleMic = () => {
        if (stream) {
            stream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
                setIsMuted(!track.enabled);
            });
        }
    };

    const toggleCamera = () => {
        if (stream) {
            stream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
                setIsVideoOff(!track.enabled);
            });
        }
    };

    const toggleScreenShare = async () => {
        if (!isScreenSharing) {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                const screenTrack = screenStream.getVideoTracks()[0];

                if (screenRef.current && screenTrack) {
                    screenRef.current.srcObject = screenStream;
                    await screenRef.current.play();
                }

                screenTrack.onended = () => {
                    setIsScreenSharing(false);
                    if (screenRef.current) screenRef.current.srcObject = null;
                };

                setIsScreenSharing(true);
            } catch (err) {
                console.error('Screen sharing failed:', err);
            }
        } else {
            setIsScreenSharing(false);
            if (screenRef.current) {
                screenRef.current.srcObject = null;
            }
        }
    };

    return (
        <div className="w-screen h-screen bg-gray-900 flex items-center justify-center relative">
            {/* Always mounted screen sharing video, hidden when not sharing */}
            <video
                ref={screenRef}
                autoPlay
                muted
                className={`w-5/6 h-5/6 object-contain rounded-xl shadow-xl z-10 transition-opacity duration-300 ${isScreenSharing ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />

            {/* Camera Preview (bottom-right if screen sharing) */}
            <div className={`rounded-xl overflow-hidden shadow-lg ${isScreenSharing ? 'w-[250px] h-[150px] absolute bottom-6 right-6 z-20' : 'w-[400px] h-[300px] z-10 flex justify items-center'}`}>
                <video
                    ref={cameraRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Controls */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 mt-6 bg-[#1f1f1f] bg-opacity-80 rounded-full px-8 py-4 flex space-x-6 shadow-2xl backdrop-blur-md z-30">
                <button
                    onClick={toggleMic}
                    className="text-white text-2xl p-3 rounded-full bg-gray-700 hover:bg-red-600 transition hover:scale-105"
                >
                    {isMuted ?  <BsMicMuteFill /> :<BsFillMicFill/>}
                    {/* {isMuted ? '🔇' : '🎤'} */}
                </button>

                <button
                    onClick={toggleCamera}
                    className="text-white text-2xl p-3 rounded-full bg-gray-700 hover:bg-red-600 transition hover:scale-105"
                >
                    {isVideoOff ? <BsFillCameraVideoOffFill /> :<BsFillCameraVideoFill /> }
                </button>

                <button
                    onClick={toggleScreenShare}
                    className="text-white text-2xl p-3 rounded-full bg-gray-700 hover:bg-blue-600 transition hover:scale-105"
                >
                    <BsDisplayFill />
                </button>
            </div>
        </div>
    );
}

export default Room;
