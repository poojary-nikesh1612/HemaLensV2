import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import {
  AlertTriangle,
  BookOpen,
  Camera,
  CheckCircle,
  Heart,
  Upload,
} from "lucide-react";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { signIn } from "next-auth/react";

const HomeBody = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4 text-blue-500 bg-blue-50">
            AI-Powered Health Screening
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold  mb-6 text-balance">
            Anemia Detection Using
            <span className="text-[#079eff]"> Palm</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty max-w-2xl mx-auto">
            Our AI technology analyzes palmar images to detect signs of anemia
            in seconds. A quick, non-invasive, and accessible tool for health
            screenings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 bg-[#079eff] hover:bg-[#0384d4] cursor-pointer"
              onClick={() => signIn("google")}
            >
              <Camera className="w-5 h-5 mr-2" />
              Start a Screening
            </Button>
            <Link
              href="https://ieeexplore.ieee.org/document/10912163"
              target="_blank"
            >
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 bg-transparent hover:bg-[#079eff] hover:text-white cursor-pointer"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Educational Cards Section */}
      <section id="about" className="py-16 px-4 bg-[#f7fcff]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Understanding Anemia
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Learn about anemia, its symptoms, and why early detection matters
              for public health.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-[#daf0fd] rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-[#079eff]" />
                </div>
                <CardTitle>What is Anemia?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Anemia occurs when your blood lacks enough healthy red blood
                  cells or hemoglobin. This reduces oxygen flow to your body's
                  organs, causing fatigue and weakness.
                </CardDescription>
                <Link
                  href="https://www.nhlbi.nih.gov/health/anemia"
                  target="_blank"
                  className="inline-flex items-center text-[#079eff] hover:underline mt-4"
                >
                  Read more about anemia →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-[#daf0fd] rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-[#079eff]" />
                </div>
                <CardTitle>Common Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Fatigue, weakness, pale skin, shortness of breath, dizziness,
                  cold hands and feet, and brittle nails are common signs that
                  may indicate anemia.
                </CardDescription>
                <Link
                  href="https://www.mayoclinic.org/diseases-conditions/anemia/symptoms-causes/syc-20351360"
                  target="_blank"
                  className="inline-flex items-center text-[#079eff] hover:underline mt-4"
                >
                  Learn about symptoms →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-[#daf0fd] rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-[#079eff]" />
                </div>
                <CardTitle>Why Early Detection?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Early detection allows for timely treatment, preventing
                  complications and improving quality of life. Regular screening
                  is especially important for at-risk groups.
                </CardDescription>
                <Link
                  href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8499500/"
                  target="_blank"
                  className="inline-flex items-center text-[#079eff] hover:underline mt-4"
                >
                  Prevention tips →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Palm Scanning Works
            </h2>
            <p className="text-lg text-gray-600">
              Our AI analyzes the color and patterns in palmar image to detect
              potential signs of anemia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-[#079eff] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold  mb-2">Take or Upload Photo</h3>
                  <p className="text-gray-600">
                    Use the mobile's camera or upload an existing photo of the
                    patient's palm in good lighting.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-[#079eff] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold  mb-2">AI Analysis</h3>
                  <p className="text-gray-600">
                    Our advanced AI analyzes color patterns and skin tone to
                    detect anemia indicators.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-[#079eff] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold  mb-2">Get Results</h3>
                  <p className="text-gray-600">
                    See an easy-to-understand screening result immediately after
                    the analysis is complete.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#f1faff]  rounded-2xl p-8 text-center">
              <div className="w-32 h-32 bg-[#daf0fd] rounded-full mx-auto mb-6 flex items-center justify-center">
                <Camera className="w-16 h-16 text-[#006aab]" />
              </div>
              <p className="text-gray-600 mb-6">
                Position the patient's palm clearly in the camera frame for best
                results.
              </p>
              <Button
                className="w-full bg-[#079eff] hover:bg-[#0384d4] cursor-pointer"
                onClick={() => signIn("google")}
              >
                <Upload className="w-4 h-4 mr-2" />
                Start Scanning
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-[#f7fcff]">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Screening?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Equip your team with our AI-powered anemia detection tool for
            efficient field screening.
          </p>
          <Button
            size="lg"
            className="text-lg px-8 bg-[#079eff] hover:bg-[#0384d4] cursor-pointer"
            onClick={() => signIn("google")}
          >
            <Camera className="w-5 h-5 mr-2" />
            Start Screening Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomeBody;
