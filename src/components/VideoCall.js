import React, { useEffect, useRef, useState, useContext } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";  

const VideoCall = ({ userName, userId }) => {
    const { orderId } = useParams(); 
    const { token } = useContext(AuthContext);  
    const [users, setUsers] = useState([]); 
    const [callHistory, setCallHistory] = useState([]); 
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const connectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const callTimerRef = useRef(null);

    useEffect(() => {
        if (!orderId) {
            console.error("Order ID is undefined or invalid");
            return;
        }
        startConnection();
        fetchCallHistory(); 

        return () => cleanUp();
    }, [orderId]); 

    const startConnection = async () => {
        if (connectionRef.current) return;

        const connection = new HubConnectionBuilder()
            .withUrl("http://localhost:5289/videoCallHub")
            .withAutomaticReconnect()
            .build();

        connectionRef.current = connection;

        try {
            await connection.start();
            console.log("SignalR Connected");
            await connection.invoke("JoinCall", orderId.toString(), userName);
        } catch (err) {
            console.error("SignalR Connection Error:", err);
            return;
        }

        connection.on("ReceiveCall", async ({ offer }) => handleIncomingCall(offer));
        connection.on("CallAccepted", async ({ answer }) => {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        });

        connection.on("UpdateParticipants", (participantList) => setUsers(participantList)); // Update active participants

        connection.on("ReceiveICECandidate", async (candidate) => {
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        startLocalStream();
        startCallTimer();
    };

    const startLocalStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
            setupPeerConnection(stream);
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    };

    const setupPeerConnection = (stream) => {
        const peerConnection = new RTCPeerConnection();
        peerConnectionRef.current = peerConnection;

        stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

        peerConnection.ontrack = (event) => {
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
        };

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                connectionRef.current.invoke("SendICECandidate", orderId.toString(), event.candidate);
            }
        };
    };

    const startCall = async () => {
        if (!peerConnectionRef.current) return;

        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        connectionRef.current.invoke("StartCall", orderId.toString(), offer);
    };

    const handleIncomingCall = async (offer) => {
        if (!peerConnectionRef.current) return;

        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        connectionRef.current.invoke("AcceptCall", orderId.toString(), answer);
    };

    const toggleMute = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach((track) => (track.enabled = !isMuted));
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach((track) => (track.enabled = !isVideoOff));
            setIsVideoOff(!isVideoOff);
        }
    };

    const endCall = () => {
        connectionRef.current.invoke("LeaveCall", orderId.toString(), userName);
        cleanUp();
    };

    const startCallTimer = () => {
        callTimerRef.current = setInterval(() => {
            setCallDuration((prev) => prev + 1);
        }, 1000);
    };

    const cleanUp = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
        }
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }
        setUsers([]);
        setCallDuration(0);
        setIsMuted(false);
        setIsVideoOff(false);
        if (callTimerRef.current) clearInterval(callTimerRef.current);
    };

    const fetchCallHistory = async () => {
        try {
            const response = await fetch(`http://localhost:5289/api/video-call/history/${orderId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch call history");
            }
            const data = await response.json();
            if (Array.isArray(data)) {
                setCallHistory(data);
            } else {
                setCallHistory([]); 
            }
        } catch (error) {
            console.error("Error fetching call history:", error);
            setCallHistory([]);
        }
    };
    
    return (
        <div>
            <h2>Video Call</h2>
            <video ref={localVideoRef} autoPlay muted playsInline></video>
            <video ref={remoteVideoRef} autoPlay playsInline></video>
            <button onClick={toggleMute}>{isMuted ? "Unmute" : "Mute"}</button>
            <button onClick={toggleVideo}>{isVideoOff ? "Turn Video On" : "Turn Video Off"}</button>
            <button onClick={endCall}>End Call</button>
            <h3>Call Duration: {callDuration}s</h3>

            <h3>🟢 Active Participants</h3>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>{user}</li>
                ))}
            </ul>

            <h3>📜 Past Video Calls</h3>
            <ul>
                {callHistory.map((call, index) => (
                    <li key={index}>
                        Order ID: {call.orderId}, Ended: {call.callEndTime}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VideoCall;
