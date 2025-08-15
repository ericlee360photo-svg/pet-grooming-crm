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
    <div className="space-y-6 p-4 sm:p-6">
      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedPhoto.url}
              alt="Full size photo"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
            >
              <X size={24} />
            </button>
            <div className="absolute bottom-4 left-4 flex space-x-2">
              <button
                onClick={() => downloadPhoto(selectedPhoto.url, `${selectedPhoto.type.toLowerCase()}-${selectedPhoto.id}.jpg`)}
                className="p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
              >
                <Download size={20} />
              </button>
              {isGroomer && (
                <button
                  onClick={() => {
                    handleDeletePhoto(selectedPhoto.id);
                    setSelectedPhoto(null);
                  }}
                  className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Before Photos */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Before Photos</h3>
          
          {isGroomer && (
            <div className="mb-4">
              <PhotoUpload
                appointmentId={appointmentId}
                type="BEFORE"
                onPhotoUploaded={handlePhotoUploaded}
              />
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : beforePhotos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {beforePhotos.map((photo) => (
                <div key={photo.id} className="relative group aspect-square">
                  <img
                    src={photo.url}
                    alt="Before photo"
                    className="w-full h-full object-cover rounded-lg cursor-pointer transition-transform hover:scale-105"
                    onClick={() => setSelectedPhoto(photo)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadPhoto(photo.url, `before-${photo.id}.jpg`);
                        }}
                        className="p-2 bg-white rounded-full text-gray-600 hover:text-gray-800 shadow-lg"
                      >
                        <Download size={16} />
                      </button>
                      {isGroomer && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePhoto(photo.id);
                          }}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm sm:text-base">No before photos yet</p>
            </div>
          )}
        </div>

        {/* After Photos */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">After Photos</h3>
          
          {isGroomer && (
            <div className="mb-4">
              <PhotoUpload
                appointmentId={appointmentId}
                type="AFTER"
                onPhotoUploaded={handlePhotoUploaded}
              />
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : afterPhotos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {afterPhotos.map((photo) => (
                <div key={photo.id} className="relative group aspect-square">
                  <img
                    src={photo.url}
                    alt="After photo"
                    className="w-full h-full object-cover rounded-lg cursor-pointer transition-transform hover:scale-105"
                    onClick={() => setSelectedPhoto(photo)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadPhoto(photo.url, `after-${photo.id}.jpg`);
                        }}
                        className="p-2 bg-white rounded-full text-gray-600 hover:text-gray-800 shadow-lg"
                      >
                        <Download size={16} />
                      </button>
                      {isGroomer && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePhoto(photo.id);
                          }}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm sm:text-base">No after photos yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Photo Stats */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Photo Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary-600">{beforePhotos.length}</div>
            <div className="text-sm text-gray-600">Before Photos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary-600">{afterPhotos.length}</div>
            <div className="text-sm text-gray-600">After Photos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary-600">{photos.length}</div>
            <div className="text-sm text-gray-600">Total Photos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary-600">
              {photos.length > 0 ? Math.round((afterPhotos.length / photos.length) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
