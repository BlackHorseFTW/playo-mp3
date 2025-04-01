// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import MusicPlayer from "../app/_components/player";
import SongUpload from "../app/_components/upload";
import type { Song } from "~/server/db/schema";

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch("/api/songs");
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch songs");
        }
        
        const data = await response.json();
        setSongs(data);
      } catch (error) {
        console.error("Error fetching songs:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch songs");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchSongs();
  }, []);

  const handleSongAdded = (newSong: Song) => {
    setSongs((prevSongs) => [...prevSongs, newSong]);
    // Auto-select the new song if it's the first one
    if (songs.length === 0) {
      setCurrentSongIndex(0);
    }
  };

  const handleSongSelect = (index: number) => {
    setCurrentSongIndex(index);
  };

  const retryFetchSongs = () => {
    // Reset error state and trigger re-fetch
    setError(null);
    setIsLoading(true);
    void (async () => {
      try {
        const response = await fetch("/api/songs");
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch songs");
        }
        
        const data = await response.json();
        setSongs(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching songs:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch songs");
      } finally {
        setIsLoading(false);
      }
    })();
  };

  return (
    <main className="container mx-auto px-4 py-8 mb-32">
      <h1 className="text-4xl font-bold mb-6">Playo</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SongUpload onSongAdded={handleSongAdded} />
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Your Library</h2>
            
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p className="font-bold">Error: {error}</p>
                <p className="mt-2">Check your database and API configuration.</p>
                <button 
                  onClick={retryFetchSongs}
                  className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            )}
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : !error && songs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No songs in your library yet.</p>
                <p>Upload your first song to get started!</p>
              </div>
            ) : !error && (
              <div className="overflow-auto max-h-[500px]">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left">#</th>
                      <th className="py-3 px-4 text-left">Title</th>
                      <th className="py-3 px-4 text-left">Artist</th>
                      <th className="py-3 px-4 text-left">Album</th>
                      <th className="py-3 px-4 text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {songs.map((song, index) => (
                      <tr 
                        key={song.id} 
                        className={`border-b hover:bg-gray-50 cursor-pointer ${
                          index === currentSongIndex ? "bg-blue-50" : ""
                        }`}
                        onClick={() => handleSongSelect(index)}
                      >
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4 font-medium">{song.title}</td>
                        <td className="py-3 px-4">{song.artist || "Unknown"}</td>
                        <td className="py-3 px-4">{song.album || "Unknown"}</td>
                        <td className="py-3 px-4">
                          {song.duration 
                            ? `${Math.floor(Number(song.duration) / 60)}:${String(Math.floor(Number(song.duration) % 60)).padStart(2, "0")}`
                            : "--:--"
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {songs.length > 0 && (
        <MusicPlayer
          songs={songs}
          currentIndex={currentSongIndex}
          setCurrentIndex={setCurrentSongIndex}
        />
      )}
    </main>
  );
}