"use client";

import React, { useEffect, useRef } from 'react';

export default function VideoPlayer({ playbackUrl, posterUrl, onPlay, onPause, onEnded }) {
  const videoRef = useRef(null);
  const maxTimeReached = useRef(0); // Garde en mémoire le point le plus éloigné visionné réellement

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Réinitialisation du suivi si l'URL de la vidéo change
    maxTimeReached.current = 0;

    // Relais des événements natifs HTML5
    const handlePlay = () => onPlay && onPlay(videoElement);
    const handlePause = () => onPause && onPause(videoElement);
    const handleEnded = () => onEnded && onEnded(videoElement);

    // Système de sécurité anti-avance rapide (Anti-Seeking)
    const handleTimeUpdate = () => {
      // Si l'utilisateur tente d'avancer de plus de 1,5 seconde au-delà de son max visionné
      if (videoElement.currentTime > maxTimeReached.current + 1.5) {
        // Bloquer l'avance et forcer le retour au point maximal autorisé
        videoElement.currentTime = maxTimeReached.current;
      } else {
        // Enregistrer la progression réelle uniquement si elle augmente
        maxTimeReached.current = Math.max(maxTimeReached.current, videoElement.currentTime);
      }
    };

    const handleSeeking = () => {
      // Bloquer le saut vers l'avant lors de l'action de glissement (seeking)
      if (videoElement.currentTime > maxTimeReached.current) {
        videoElement.currentTime = maxTimeReached.current;
      }
    };

    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('seeking', handleSeeking);

    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('seeking', handleSeeking);
    };
  }, [playbackUrl, onPlay, onPause, onEnded]);

  if (!playbackUrl) {
    return (
      <div className="aspect-video w-full bg-slate-900 rounded-btn flex items-center justify-center text-white text-xs">
        Aucune source active de vidéo.
      </div>
    );
  }

  // Détection du type de média
  const isLocalVideo = playbackUrl.startsWith('/') || playbackUrl.includes('.mp4') || playbackUrl.includes('.webm');

  if (isLocalVideo) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-btn bg-black shadow-md border border-gray-150 dark:border-gray-850">
        <video
          ref={videoRef}
          src={playbackUrl}
          poster={posterUrl || "/uploads/video-placeholder.jpg"} // Image d'aperçu du cours [1]
          controls
          controlsList="nodownload" // Désactiver l'option de téléchargement natif
          disablePictureInPicture // Éviter l'accès PiP qui contournerait le blocage de saut
          className="w-full h-full object-contain focus:outline-none"
        />
      </div>
    );
  }

  // Intégration iframe externe (Bunny/Youtube)
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-btn bg-black shadow-md border border-gray-150 dark:border-gray-850">
      <iframe
        src={playbackUrl}
        loading="lazy"
        className="absolute top-0 left-0 w-full h-full border-none"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen={true}
      />
    </div>
  );
}