"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import Palmguide from "@/components/Palmguide";
import Footer from "@/components/Footer";
import ImagePreview from "@/components/ImagePreview";
import CameraCapture from "@/components/CameraCapture";
import AnalysisScreen from "@/components/AnalysisScreen";
import ResultScreen from "@/components/ResultScreen";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { decode } from "js-base64";
import Navbar from "@/components/Navbar";

const page = () => {
  const searchParams = useSearchParams();
  const encodedId = searchParams.get("campaignId");
  const campaignId = decode(encodedId);

  const fileInputRef = useRef(null);
  const [scanMode, setScanMode] = useState("upload");
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const [appState, setAppState] = useState("Capture");
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleOpenCamera = () => {
    setScanMode("camera");
  };

  const analyzeUploadedImage = useCallback((imageUrl) => {
    setIsAnalyzing(true);
    setImageAnalysis(null);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        setIsAnalyzing(false);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);

      try {
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const data = imageData.data;

        let totalBrightness = 0,
          pixelCount = 0,
          skinTonePixels = 0,
          darkPixels = 0,
          overexposedPixels = 0;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const sampleRadius = Math.min(canvas.width, canvas.height) * 0.3;

        for (
          let y = Math.floor(centerY - sampleRadius);
          y < Math.floor(centerY + sampleRadius);
          y += 8
        ) {
          for (
            let x = Math.floor(centerX - sampleRadius);
            x < Math.floor(centerX + sampleRadius);
            x += 8
          ) {
            if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
              const index = (y * canvas.width + x) * 4;
              const r = data[index],
                g = data[index + 1],
                b = data[index + 2];
              const brightness = (r + g + b) / 3;
              totalBrightness += brightness;
              pixelCount++;

              if (r > 95 && g > 40 && b > 20 && r > g && r > b)
                skinTonePixels++;
              if (brightness < 60) darkPixels++;
              if (brightness > 230) overexposedPixels++;
            }
          }
        }

        const avgBrightness = totalBrightness / pixelCount;
        const skinToneRatio = skinTonePixels / pixelCount;
        const darkRatio = darkPixels / pixelCount;
        const overexposedRatio = overexposedPixels / pixelCount;

        const issues = [];
        const suggestions = [];
        let status = "success";

        // Issue Check 1: Darkness
        if (avgBrightness < 80 || darkRatio > 0.5) {
          issues.push("Image appears too dark");
          suggestions.push("Try taking a photo in better lighting.");
          status = "error";
        }

        // Issue Check 2: Overexposure
        if (overexposedRatio > 0.3) {
          issues.push("Image is overexposed or has flash glare");
          suggestions.push("Avoid using flash and direct bright lights.");
          status = "error";
        }

        // Issue Check 3: Palm not visible
        if (skinToneRatio < 0.1) {
          issues.push("Palm may not be clearly visible");
          suggestions.push(
            "Ensure your entire palm is in the frame and well-lit."
          );
          status = "error";
        }

        const isImageValidForAnalysis = status === "success";

        let finalSuggestions;
        if (status === "success") {
          finalSuggestions = ["Image looks good for analysis!"];
        } else {
          finalSuggestions = suggestions;
        }

        const analysis = {
          status: status,
          isValid: isImageValidForAnalysis,
          issues: issues,
          suggestions: finalSuggestions,
        };

        setImageAnalysis(analysis);
      } catch (error) {
        console.error("Error analyzing image:", error);
        setImageAnalysis({
          status: "error",
          isValid: false,
          issues: ["Error analyzing image quality."],
          suggestions: ["Please try again or use a different image."],
        });
      }
      setIsAnalyzing(false);
    };

    img.onerror = () => {
      setIsAnalyzing(false);
      setImageAnalysis({
        status: "error",
        isValid: false,
        issues: ["Unable to load image"],
        suggestions: ["Please try a different image file"],
      });
    };

    img.src = imageUrl;
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File size too large. Please select an image under 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      setCapturedImage(result);
      setScanMode("preview");
      analyzeUploadedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleCapture = (imageDataUrl) => {
    setCapturedImage(imageDataUrl);
    setScanMode("preview");
    analyzeUploadedImage(imageDataUrl);
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const handleAnalyse = async () => {
    if (!capturedImage) {
      console.error("No image has been captured.");
      toast.warning("Please capture or upload an image first.");
      return;
    }

    const imageFile = dataURLtoFile(capturedImage, "palm-image.jpg");

    const formData = new FormData();
    formData.append("image", imageFile);

    setAppState("analyzing");

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/predict`;
      const fetchPromise = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });
      const delayPromise = new Promise((resolve) => setTimeout(resolve, 3000));

      const [response] = await Promise.all([fetchPromise, delayPromise]);

      if (!response.ok) {
        toast.error("Analysis Failed", {
          description:
            "The server could not process the image. Please try again.",
        });
        console.log("Server response was not OK:", response);
        setAppState("capture");
      } else {
        try {
          await fetch(`/api/campaigns/${campaignId}/stats`, {
            method: "PUT",
          });
        } catch (statError) {
          console.error("Failed to update scan count:", statError);
        }
        toast.success("Analysis Complete!", {
          description: "Displaying your results now.",
        });
        const data = await response.json();
        setAnalysisResult(data);
        setAppState("results");
      }
    } catch (e) {
      toast.error("Upload Failed", {
        description:
          "Could not connect to the server. Please check your internet connection.",
      });
      console.log("Prediction failed:", e);
      setAppState("capture");
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setImageAnalysis(null);
    setAppState("capture");
    setScanMode("upload");
  };

  if (appState === "analyzing" && capturedImage) {
    return <AnalysisScreen image={capturedImage} />;
  }

  if (appState === "results" && capturedImage) {
    return (
      <ResultScreen
        image={capturedImage}
        onRetake={handleRetake}
        result={analysisResult}
        campaignId={campaignId}
        onPatientSaved={handleRetake}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-black ">
      <Navbar />
      {scanMode === "upload" && (
        <div className="container mx-auto px-4 py-8 max-w-5xl mb-8">
          <div className="space-y-8 flex flex-col items-center">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold  mb-4">
                Scan Your Palm
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload a photo of your palm or capture one with your camera.
              </p>
            </div>
            <Card className="w-full max-w-xl border-2 border-dashed border-gray-300">
              <CardContent>
                <div className="flex flex-col items-center justify-center p-8  rounded-lg text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <UploadCloud className="w-8 h-8 text-gray-500" />
                  </div>
                  <div
                    className="text-blue-600 font-semibold cursor-pointer hover:underline mb-1"
                    onClick={handleFileUpload}
                  >
                    Tap to upload photo
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    PNG, JPG or WebP up to 10MB
                  </p>
                  <div className="flex items-center w-full mb-4">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-xs text-gray-400 font-medium">
                      OR
                    </span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>
                  <Button
                    className="w-full bg-[#079eff] hover:bg-[#0384d4] cursor-pointer "
                    onClick={handleOpenCamera}
                  >
                    Open camera
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <Palmguide />
        </div>
      )}
      {scanMode === "camera" && (
        <CameraCapture onCapture={handleCapture} onCancel={handleRetake} />
      )}

      {scanMode === "preview" && (
        <ImagePreview
          imageSrc={capturedImage}
          handleAnalyse={handleAnalyse}
          handleRetake={handleRetake}
          isAnalyzing={isAnalyzing}
          imageAnalysis={imageAnalysis}
        />
      )}

      <Footer />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default page;
