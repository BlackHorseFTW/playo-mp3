// src/components/SongUpload.tsx
import { useState } from "react";
import type { Song } from "~/server/db/schema";

type SongUploadProps = {
  onSongAdded: (song: Song) => void;
};

export default function SongUpload({ onSongAdded }: SongUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user makes changes
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Validate file size (max 10MB)
    const audioFile = formData.get("audioFile") as File;
    if (audioFile && audioFile.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit");
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      // Simulate upload progress
      const intervalId = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(intervalId);
            return 90;
          }
          return prev + 10;
        });
      }, 500);
      
      const response = await fetch("/api/songs", {
        method: "POST",
        body: formData,
      });
      
      clearInterval(intervalId);
      setUploadProgress(100);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Upload error:", errorData);
        throw new Error(errorData.error || "Failed to upload song");
      }
      
      const data = await response.json();
      if (!data.song) {
        throw new Error("Invalid response from server");
      }
      
      onSongAdded(data.song);
      
      // Reset form
      form.reset();
      setFormData({
        title: "",
        artist: "",
        album: "",
        genre: "",
      });
    } catch (error) {
      console.error("Error uploading song:", error);
      setError(error instanceof Error ? error.message : "Failed to upload song. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold mb-4">Upload New Song</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Song Title*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-1">
              Artist
            </label>
            <input
              type="text"
              id="artist"
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="album" className="block text-sm font-medium text-gray-700 mb-1">
              Album
            </label>
            <input
              type="text"
              id="album"
              name="album"
              value={formData.album}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="audioFile" className="block text-sm font-medium text-gray-700 mb-1">
            Audio File* (MP3)
          </label>
          <input
            type="file"
            id="audioFile"
            name="audioFile"
            accept="audio/mp3,audio/mpeg"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={() => { if (error) setError(null); }}
          />
          <p className="mt-1 text-sm text-gray-500">Max file size: 10MB</p>
        </div>
        
        {isUploading && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">Uploading: {uploadProgress}%</p>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isUploading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Upload Song"}
        </button>
      </form>
    </div>
  );
}