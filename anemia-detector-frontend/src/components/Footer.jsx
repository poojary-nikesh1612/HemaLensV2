import { Heart } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="border-t border-t-gray-200 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#079eff] rounded flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold">HemaLens</span>
              </div>
              <p className="text-gray-600 text-sm">
                AI-powered anemia detection for accessible healthcare screening.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link
                    href="https://www.nhlbi.nih.gov/health/anemia"
                    className="hover transition-colors hover:underline"
                  >
                    About Anemia
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.nhm.gov.in/images/pdf/programmes/child-health/guidelines/Control-of-Iron-Deficiency-Anaemia.pdf"
                    target="_blank"
                    className="hover transition-colors hover:underline"
                  >
                    Health Guidelines
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://newsinhealth.nih.gov/2014/01/avoiding-anemia"
                    target="_blank"
                    className="hover transition-colors hover:underline"
                  >
                    Prevention Tips
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link
                    href="#how-it-works"
                    className="hover transition-colors hover:underline"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover transition-colors hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover transition-colors hover:underline"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className=" mt-8 pt-8 text-center text-sm text-gray-600">
            <p>
              © 2025 HemaLens. This tool is for screening purposes only and
              should not replace professional medical advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
