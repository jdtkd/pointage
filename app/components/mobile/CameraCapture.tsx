"use client";
import { useState, useRef } from 'react';

export default function CameraCapture() {
  const [showCamera, setShowCamera] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setShowCamera(true);
    } catch (err) {
      console.error("Erreur d'accès à la caméra:", err);
    }
  };

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const photo = canvas.toDataURL('image/jpeg');
        setPhotoUrl(photo);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const retakePhoto = () => {
    setPhotoUrl(null);
    startCamera();
  };

  return (
    <div className="w-full">
      {showCamera ? (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-[300px] object-cover rounded-lg"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <button 
              onClick={stopCamera}
              className="btn btn-circle btn-error"
            >
              ✕
            </button>
            <button 
              onClick={takePhoto}
              className="btn btn-circle btn-primary"
            >
              📸
            </button>
          </div>
        </div>
      ) : photoUrl ? (
        <div className="relative">
          <img 
            src={photoUrl} 
            alt="Photo capturée" 
            className="w-full h-[300px] object-cover rounded-lg"
          />
          <button 
            onClick={retakePhoto}
            className="btn btn-sm btn-secondary mt-2"
          >
            📸 Reprendre la photo
          </button>
        </div>
      ) : (
        <button 
          onClick={startCamera}
          className="btn btn-primary w-full"
        >
          📸 Prendre une photo
        </button>
      )}
    </div>
  );
} 