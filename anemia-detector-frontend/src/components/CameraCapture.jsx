"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const CameraCapture = ({ onCapture, onCancel }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isStarting, setIsStarting] = useState(true);

  useEffect(() => {
    const startCamera = async () => {
      setIsStarting(true);
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          try {
            await videoRef.current.play();
          } catch (error) {
            if (error.name !== "AbortError") {
              console.log("Error playing video:", error);
            }
          }
        }
        setIsStarting(false);
      } catch (err) {
        console.log("Error accessing camera:", err);
        alert(
          "Could not access the camera. Please ensure you have given permission in your browser settings."
        );
        onCancel();
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.92);
      onCapture(imageDataUrl);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white w-auto h-auto p-6 border-2 border-gray-700 rounded-lg">
        <div className="w-full max-w-xl text-left mb-4 ">
          <h2 className="text-xl font-bold text-black">
            Align your palm within the frame
          </h2>
        </div>
        <div className="relative w-full max-w-xl aspect-video overflow-hidden rounded-lg bg-black border border-black">
          {isStarting && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <Loader2 className="w-8 h-8 animate-spin mr-2" />
              Starting camera...
            </div>
          )}
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            muted
            playsInline
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <div className="flex w-full  justify-end items-center mt-6 gap-8">
          <Button
            variant="ghost"
            className="bg-gray-300 text-white hover:bg-gray-400 hover:text-white cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="p-5 rounded-lg bg-[#079eff] hover:bg-[#0384d4] cursor-pointer "
            onClick={handleCapture}
            disabled={isStarting}
          >
            Capture
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
