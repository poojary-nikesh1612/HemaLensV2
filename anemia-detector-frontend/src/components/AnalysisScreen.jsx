import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import Footer from "./Footer";
import Navbar from "./Navbar";

function ScannerOverlay({ active, className }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-lg",
        active ? "opacity-100" : "opacity-0",
        "transition-opacity duration-300",
        className
      )}
    >
      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(59,130,246,0.25)_95%),linear-gradient(90deg,transparent_95%,rgba(59,130,246,0.25)_95%)] bg-[length:100%_24px,24px_100%]" />

      {/* Moving scan line */}
      <div className="absolute inset-x-0 h-24 -translate-y-24 animate-scan bg-gradient-to-b from-transparent via-blue-400/40 to-transparent" />

      {/* Glow border */}
      <div className="absolute inset-0 rounded-lg ring-2 ring-blue-400/40" />
    </div>
  );
}

const AnalysisScreen = ({ image }) => {
  return (
    <>
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center p-4 sm:mb-10">
          <div className="w-full max-w-2xl space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-black mb-2">
                Analyzing Your Palm
              </h1>
              <p className="text-gray-600">
                Our AI is examining your palm image for anemia indicators
              </p>
            </div>
            {/* Image with scanning overlay */}
            <Card>
              <CardContent className="p-6">
                <div className="relative aspect-square max-w-md mx-auto bg-[#e9f7ff] rounded-lg overflow-hidden">
                  <img
                    src={image || "/placeholder.svg"}
                    alt="Palm being analyzed"
                    className="w-full h-full object-cover"
                  />

                  <ScannerOverlay active={true} />
                </div>

                <div className="mt-12">
                  <p className="text-sm text-gray-700 ">
                    Please wait while our advanced AI analyzes color patterns,
                    skin tone variations, and other indicators in your palm
                    image to detect potential signs of anemia.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AnalysisScreen;
