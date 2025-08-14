"use client";

import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import PhotoUpload from "./PhotoUpload";

interface PhotoGalleryProps {
  appointmentId: string;
  isGroomer?: boolean;
}

export default function PhotoGallery({ appointmentId, isGroomer = false }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  useEffect(() => {
    fetchPhotos();
  }, [appointmentId]);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/photos?appointmentId=${appointmentId}`);
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error("Failed to fetch photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUploaded = (newPhoto: any) => {
    setPhotos(prev => [newPhoto, ...prev]);
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (confirm("Are you sure you want to delete this photo?")) {
      try {
        const response = await fetch(`/api/photos?id=${photoId}`, {
          method: "DELETE",
        });
        
        if (response.ok) {
          setPhotos(prev => prev.filter(photo => photo.id !== photoId));
        } else {
          alert("Failed to delete photo");
        }
      } catch (error) {
        console.error("Delete photo error:", error);
        alert("Failed to delete photo");
      }
    }
  };

  const downloadPhoto = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  const beforePhotos = photos.filter(photo => photo.type === "BEFORE");
  const afterPhotos = photos.filter(photo => photo.type === "AFTER");

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Before Photos */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Before Photos</h3>
          
          {isGroomer && (
            <div className="mb-4">
              <PhotoUpload
                appointmentId={appointmentId}
                type="BEFORE"
                onPhotoUploaded={handlePhotoUploaded}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {beforePhotos.map((photo) => (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.url}
                  alt="Before photo"
                  className="w-full h-32 object-cover rounded-lg cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                    <button
                      onClick={() => downloadPhoto(photo.url, `before-${photo.id}.jpg`)}
                      className="p-2 bg-white rounded-full text-gray-600 hover:text-gray-800"
                    >
                      <Download size={16} />
                    </button>
                    {isGroomer && (
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="p-2 bg-white rounded-full text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {beforePhotos.length === 0 && !isGroomer && (
            <div className="text-gray-500 text-center py-8">
              No before photos yet
            </div>
          )}
        </div>

        {/* After Photos */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">After Photos</h3>
          
          {isGroomer && (
            <div className="mb-4">
              <PhotoUpload
                appointmentId={appointmentId}
                type="AFTER"
                onPhotoUploaded={handlePhotoUploaded}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {afterPhotos.map((photo) => (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.url}
                  alt="After photo"
                  className="w-full h-32 object-cover rounded-lg cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                    <button
                      onClick={() => downloadPhoto(photo.url, `after-${photo.id}.jpg`)}
                      className="p-2 bg-white rounded-full text-gray-600 hover:text-gray-800"
                    >
                      <Download size={16} />
                    </button>
                    {isGroomer && (
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="p-2 bg-white rounded-full text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {afterPhotos.length === 0 && !isGroomer && (
            <div className="text-gray-500 text-center py-8">
              No after photos yet
            </div>
          )}
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-[90vh] m-4">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full text-gray-600 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <img
              src={selectedPhoto.url}
              alt={`${selectedPhoto.type} photo`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
              {selectedPhoto.type} - {new Date(selectedPhoto.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
