"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X } from "lucide-react";

interface PhotoUploadProps {
  appointmentId: string;
  type: "BEFORE" | "AFTER";
  onPhotoUploaded: (photo: any) => void;
}

export default function PhotoUpload({ appointmentId, type, onPhotoUploaded }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    await uploadPhoto(file);
  };

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    try {
      // First upload the file
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      const { url } = await uploadResponse.json();

      // Then create the photo record
      const photoResponse = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId,
          type,
          url,
        }),
      });

      if (!photoResponse.ok) {
        throw new Error('Failed to create photo record');
      }

      const photo = await photoResponse.json();
      onPhotoUploaded(photo);
    } catch (error) {
      console.error('Photo upload error:', error);
      alert('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Prefer back camera on mobile
        audio: false,
      });
      
      setStream(mediaStream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
            uploadPhoto(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  if (showCamera) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="flex-1 relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Camera Controls */}
          <div className="absolute top-4 left-4">
            <button
              onClick={stopCamera}
              className="p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <button
              onClick={capturePhoto}
              disabled={uploading}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
          dragOver
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
          </div>
          <div>
            <p className="text-sm sm:text-base font-medium text-gray-900">
              Upload {type.toLowerCase()} photo
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Drag and drop or click to select
            </p>
          </div>
        </div>
      </div>

      {/* Camera Button */}
      <button
        onClick={startCamera}
        disabled={uploading}
        className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-3 sm:py-4 px-4 rounded-xl font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="text-sm sm:text-base">Take Photo with Camera</span>
      </button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileSelect(file);
          }
        }}
        className="hidden"
      />

      {/* Upload Progress */}
      {uploading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Uploading photo...</p>
        </div>
      )}
    </div>
  );
}
