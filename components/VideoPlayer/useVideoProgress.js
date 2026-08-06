"use client";

import { useEffect, useRef } from 'react';

export function useVideoProgress({ lessonId, onCompleted }) {
  const progressInterval = useRef(null);

  const saveProgress = async (currentTime, duration, isCompleted) => {
    if (!lessonId) return;
    const percentage = duration ? (currentTime / duration) * 100 : 0;
    
    try {
      await fetch('/api/student/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          progress: percentage,
          completed: isCompleted || percentage >= 90
        })
      });
      
      if (isCompleted || percentage >= 90) {
        if (onCompleted) onCompleted();
      }
    } catch (err) {
      console.error('Échec d’auto-enregistrement :', err);
    }
  };

  const handlePlay = (videoElement) => {
    progressInterval.current = setInterval(() => {
      if (videoElement) {
        saveProgress(videoElement.currentTime, videoElement.duration, false);
      }
    }, 10000); // Déclenchement toutes les 10 secondes
  };

  const handlePause = (videoElement) => {
    clearInterval(progressInterval.current);
    if (videoElement) {
      saveProgress(videoElement.currentTime, videoElement.duration, false);
    }
  };

  const handleEnded = (videoElement) => {
    clearInterval(progressInterval.current);
    if (videoElement) {
      saveProgress(videoElement.currentTime, videoElement.duration, true);
    }
  };

  useEffect(() => {
    return () => clearInterval(progressInterval.current);
  }, []);

  return { handlePlay, handlePause, handleEnded };
}