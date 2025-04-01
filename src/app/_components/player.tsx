// src/components/MusicPlayer.tsx
import React, { useState, useRef, useEffect } from "react";
import type { Song } from "~/server/db/schema";

type MusicPlayerProps = {
  songs: Song[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
};

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  songs, 
  currentIndex, 
  setCurrentIndex 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSong = songs[currentIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        void audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    setCurrentIndex(currentIndex === 0 ? songs.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % songs.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg">
      <audio
        ref={audioRef}
        src={currentSong?.cloudinaryUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        onLoadedMetadata={handleTimeUpdate}
      />
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gray-700 rounded mr-4">
            {currentSong?.coverArtUrl && (
              <img 
                src={currentSong.coverArtUrl} 
                alt={`${currentSong.title} cover`} 
                className="w-full h-full object-cover rounded" 
              />
            )}
          </div>
          <div>
            <h3 className="font-bold">{currentSong?.title || "No song selected"}</h3>
            <p className="text-gray-400">{currentSong?.artist || "Unknown artist"}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={handlePrevious}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="19 20 9 12 19 4 19 20"></polygon>
              <line x1="5" y1="19" x2="5" y2="5"></line>
            </svg>
          </button>
          
          <button 
            onClick={handlePlayPause}
            className="p-3 bg-white text-black rounded-full hover:bg-gray-200"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </button>
          
          <button 
            onClick={handleNext}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 4 15 12 5 20 5 4"></polygon>
              <line x1="19" y1="5" x2="19" y2="19"></line>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="text-sm">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="flex-grow h-2 rounded-full appearance-none bg-gray-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
        />
        <span className="text-sm">{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default MusicPlayer;