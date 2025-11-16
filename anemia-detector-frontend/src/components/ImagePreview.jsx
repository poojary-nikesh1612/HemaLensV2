"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Info, RotateCcw, X } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

const ImagePreview = ({
  imageSrc,
  handleAnalyse,
  handleRetake,
  imageAnalysis,
  isAnalyzing,
}) => {
  // Determine if the "Analyze Image" button should be disabled.
  const isAnalyzeButtonDisabled =
    isAnalyzing || (imageAnalysis && !imageAnalysis.isValid);

  let alertIcon = null;
  let alertClass = "";

  if (imageAnalysis) {
    switch (imageAnalysis.status) {
      case "success":
        alertClass = "border-green-200 bg-green-50";
        alertIcon = <CheckCircle className="h-4 w-4 text-green-600" />;
        break;
      case "warning":
        alertClass = "border-orange-200 bg-orange-50";
        alertIcon = <AlertTriangle className="h-4 w-4 text-orange-600" />;
        break;
      case "error":
        alertClass = "border-red-200 bg-red-50";
        alertIcon = <AlertTriangle className="h-4 w-4 text-red-600" />;
        break;
      default:
        alertClass = "border-gray-200 bg-gray-50";
        alertIcon = <Info className="h-4 w-4 text-gray-600" />;
    }
  }

  return (
    <div className="w-full space-y-8 flex justify-center">
      <div className="my-10 w-[95%] sm:w-[70%]">
        <div className="text-center mb-5">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Image Captured Successfully
          </h2>
          <p className="text-gray-600">
            Review your palm image before proceeding with analysis.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="aspect-square max-w-md mx-auto bg-[#e9f7ff] rounded-lg overflow-hidden">
              <img
                src={imageSrc || "/placeholder.svg"}
                alt="Captured palm"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-8 w-full md:w-[80%]">
              {isAnalyzing && (
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    Analyzing image quality...
                  </AlertDescription>
                </Alert>
              )}

              {imageAnalysis && !isAnalyzing && (
                <Alert className={alertClass}>
                  {alertIcon}
                  <AlertDescription>
                    <div className="space-y-2">
                      {imageAnalysis.issues.length > 0 && (
                        <div>
                          <strong>
                            {imageAnalysis.status === "error"
                              ? "Major Issue Detected:"
                              : "Issues:"}
                          </strong>
                          <ul className="list-disc list-inside text-sm mt-1">
                            {imageAnalysis.issues.map((issue, index) => (
                              <li key={index}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {imageAnalysis.suggestions.length > 0 && (
                        <div>
                          <strong>
                            {imageAnalysis.status === "success"
                              ? "Suggestion:"
                              : "Suggestions:"}
                          </strong>
                          <ul className="list-disc list-inside text-sm mt-1">
                            {imageAnalysis.suggestions.map(
                              (suggestion, index) => (
                                <li key={index}>{suggestion}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="my-8 flex flex-col sm:flex-row gap-6 justify-center w-full">
          <Button
            size="lg"
            className="md:w-[40%] text-lg px-8 bg-[#079eff] hover:bg-[#0384d4] cursor-pointer "
            onClick={handleAnalyse}
            disabled={isAnalyzeButtonDisabled}
          >
            Analyze Image
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="md:w-[40%] cursor-pointer"
            onClick={handleRetake}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Retake Photo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
