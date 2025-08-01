import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface props{
  src:string,
}


const VideoPlayerHLS: React.FC<props> = ({src}) => {
  // Khai báo ref với kiểu HTMLVideoElement
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');

  // Effect này được dùng để thiết lập URL cho video từ API của Spring Boot
  useEffect(() => {
    setVideoUrl(`http://localhost:8080/videos/video/${src}`);
  }, []);

  useEffect(() => {
    // Nếu videoUrl chưa được set thì không thực hiện gì
    if (!videoUrl) return;

    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Nếu trình duyệt hỗ trợ Hls.js
    if (Hls.isSupported()) {
      const hls = new Hls({
        startLevel: 0, // Mức độ đầu tiên của stream (bắt đầu với chất lượng thấp nhất)
        maxMaxBufferLength: 30, // Giới hạn tổng thời gian tải các segment
        maxBufferLength: 3,  // Số lượng segment tải tối đa vào bộ đệm
        maxBufferSize: 60 * 1000 * 1000,  // Giới hạn tổng dung lượng bộ đệm
        maxBufferHole: 0.5,  // Tối đa độ trễ của bộ đệm
      });
      hls.loadSource(videoUrl);
      hls.attachMedia(videoElement);

      return () => {
        hls.destroy();
      };
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = videoUrl;
    }
  }, [videoUrl]);

  return (
    <div style={{maxHeight:300}}>
      <video style={{maxHeight:300}} ref={videoRef} controls width="100%"></video>
    </div>
  );
};

export default VideoPlayerHLS;
