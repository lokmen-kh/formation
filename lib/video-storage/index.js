import { BunnyStrategy } from './bunnyStrategy';

const strategy = new BunnyStrategy();

export const VideoStorage = {
  upload: (fileBuffer, title) => strategy.uploadVideo(fileBuffer, title),
  getPlaybackUrl: (videoId) => strategy.generatePlaybackUrl(videoId)
};