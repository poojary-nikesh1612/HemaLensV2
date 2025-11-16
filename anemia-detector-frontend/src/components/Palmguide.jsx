import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

const palmGuide = () => {
  return (
    <Card className="w-full mt-8 bg-[#f5fafd]">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Palm Positioning Guide</CardTitle>
        <CardDescription>
          Follow these guidelines for the most accurate anemia detection results
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sample Images Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="text-center space-y-3">
            <Badge
              variant="default"
              className="bg-green-100 text-green-800 border-green-200"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Good Image
            </Badge>
            <div className="aspect-square bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center border-2 border-green-200">
              <div>
                <Image
                  width={300}
                  height={300}
                  src="/good_image.png"
                  alt="good palm image example"
                />
              </div>
            </div>
            <ul className="text-sm text-gray-600 text-left space-y-1">
              <li>• Well-lit, natural lighting</li>
              <li>• Palm fully visible</li>
              <li>• No shadows or glare</li>
              <li>• Proper distance from camera</li>
            </ul>
          </div>

          <div className="text-center space-y-3">
            <Badge
              variant="destructive"
              className="bg-red-100 text-red-800 border-red-200"
            >
              <XCircle className="w-3 h-3 mr-1" />
              Poor Image
            </Badge>
            <div className="aspect-square bg-gradient-to-br from-red-50 to-red-100 rounded-lg flex items-center justify-center border-2 border-red-200">
              <div>
                <Image
                  width={250}
                  height={250}
                  src="/bad_image.jpg"
                  alt="bad palm image example"
                />
              </div>
            </div>
            <ul className="text-sm text-gray-600 text-left space-y-1">
              <li>• Too dark or shadowy</li>
              <li>• Partial palm visibility</li>
              <li>• Flash causing glare</li>
              <li>• Incorrect positioning</li>
            </ul>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-[#e9f7ff] rounded-lg p-4">
          <h4 className="font-semibold  mb-3">Pro Tips for Best Results:</h4>
          <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
            <div>
              <strong className="text-black">Lighting:</strong>
              <ul className="mt-1 space-y-1">
                <li>• Use natural daylight when possible</li>
                <li>• Avoid direct sunlight or harsh shadows</li>
                <li>• Turn off camera flash</li>
              </ul>
            </div>
            <div>
              <strong className="text-black">Positioning:</strong>
              <ul className="mt-1 space-y-1">
                <li>• Hold palm flat and steady</li>
                <li>• Keep 6-8 inches from camera</li>
                <li>• Ensure entire palm is visible</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default palmGuide;
