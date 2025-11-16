
import { Suspense } from 'react';

import Navbar from '@/components/Navbar'; 
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { UploadCloud } from 'lucide-react';
import Footer from '@/components/Footer';
import ScanPageClient from './ScanPageClient';


function Loading() {
  return (
    <div className="min-h-screen bg-white text-black ">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-5xl mb-8">
        <div className="space-y-8 flex flex-col items-center">
          <div className="text-center">
            {/* Skeleton for Title */}
            <Skeleton className="h-10 w-64 mb-4 mx-auto" />
            {/* Skeleton for Subtitle */}
            <Skeleton className="h-6 w-96 max-w-full mx-auto" />
          </div>

          {/* Skeleton for Upload Card */}
          <Card className="w-full max-w-xl border-2 border-dashed border-gray-300">
            <CardContent>
              <div className="flex flex-col items-center justify-center p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <UploadCloud className="w-8 h-8 text-gray-300 animate-pulse" />
                </div>
                {/* Skeleton for "Tap to upload" */}
                <Skeleton className="h-5 w-32 mb-1" />
                {/* Skeleton for "PNG, JPG..." */}
                <Skeleton className="h-4 w-40 mb-4" />
                
                <div className="flex items-center w-full mb-4">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink mx-4 text-xs text-gray-400 font-medium">
                    OR
                  </span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {/* Skeleton for Button */}
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>

         
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ScanPageClient />
    </Suspense>
  );
}