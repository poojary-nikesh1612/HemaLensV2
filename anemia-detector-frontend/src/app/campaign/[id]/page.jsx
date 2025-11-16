"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  MapPin,
  ScanLine,
  FileText,
  Phone,
  UserCheck,
  Users,
  AlertTriangle,
  Percent,
} from "lucide-react";
import Link from "next/link";
import { utils, writeFile } from "xlsx";
import { decode } from "js-base64";

function DetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 md:px-8 py-8 max-w-7xl">
        {/* Header skeleton */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div>
            <Skeleton className="h-10 w-72 mb-3" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Skeleton className="h-12 w-full md:w-48" />
            <Skeleton className="h-12 w-full md:w-48" />
          </div>
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-1/3 mb-4" />
                <Skeleton className="h-8 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Patient list skeleton */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full mt-4" />
            <Skeleton className="h-10 w-full mt-4" />
            <Skeleton className="h-10 w-full mt-4" />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export default function CampaignDetailsPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const { id: encodedId } = params;
  const campaignId = decode(encodedId);

  const [campaign, setCampaign] = useState(null);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //data fetching
  useEffect(() => {
    if (status === "authenticated" && campaignId) {
      const fetchCampaignDetails = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/campaigns/${campaignId}`);
          const data = await response.json();
          if (data.success) {
            setCampaign(data.data.campaign);
            setPatients(data.data.patients);
          } else {
            console.log("Failed to fetch details:", data.error);
          }
        } catch (error) {
          console.log("Error fetching details:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCampaignDetails();
    }
  }, [status, campaignId]);

  //handle generate report
  const handleGenerateReport = () => {
    const dataToExport = patients.map((p) => ({
      Name: p.name,
      Age: p.age,
      Gender: p.gender,
      "Phone Number": p.phone,
      "Date Registered": new Date(p.createdAt).toLocaleDateString(),
    }));
    const worksheet = utils.json_to_sheet(dataToExport);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Patients");
    writeFile(workbook, `${campaign.name}_Patient_Report.xlsx`);
  };

  if (isLoading || status === "loading") {
    return <DetailsSkeleton />;
  }
  if (!session) {
    return null;
  }
  if (!campaign) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto p-8 text-center">
          <h2 className="text-2xl font-bold">Campaign not found.</h2>
        </main>
      </>
    );
  }

  //Calculate stats for this campaign
  const totalScanned = campaign.totalScanned || 0;
  const totalAnemic = campaign.anemiaDetected || 0;
  const detectionRate =
    totalScanned > 0 ? ((totalAnemic / totalScanned) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 md:px-8 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {campaign.name}
            </h1>
            <p className="text-lg text-gray-600 flex items-center mt-2">
              <MapPin className="h-5 w-5 mr-2 text-gray-400" />
              {campaign.area}
            </p>
          </div>
          <div className="w-full md:w-auto">
            <Button
              className="bg-green-600 hover:bg-green-700 w-full mb-8 py-6 rounded-xl cursor-pointer"
              onClick={handleGenerateReport}
              disabled={patients.length === 0}
            >
              <FileText className="mr-2 h-4 w-4" /> Download Report
            </Button>
            <Link
              href={`/scan?campaignId=${encodedId}`}
              passHref
              className="w-full "
            >
              <Button className="bg-[#079eff] hover:bg-[#0384d4] w-full py-6 rounded-xl cursor-pointer">
                <ScanLine className="mr-2 h-4 w-4" /> Start Scanning
              </Button>
            </Link>
          </div>
        </div>

        {/*STATS CARDS*/}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">
                  Total Scanned
                </h3>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-[#079eff]" />
                </div>
              </div>
              <p className="text-4xl font-bold text-gray-900">{totalScanned}</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">
                  Anemia Detected
                </h3>
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <p className="text-4xl font-bold text-gray-900">{totalAnemic}</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">
                  Detection Rate
                </h3>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Percent className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <p className="text-4xl font-bold text-gray-900">
                {detectionRate}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/*PATIENT LIST*/}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <UserCheck className="mr-3 h-6 w-6 text-[#079eff]" />
              Flagged Patient List
            </CardTitle>
            <CardDescription>
              {patients.length} individuals require a confirmatory blood test.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {patients.length > 0 ? (
              <div className="flow-root">
                <ul className="divide-y divide-gray-200 overflow-y-auto h-[600px]">
                  {patients.map((patient) => (
                    <li
                      key={patient._id}
                      className="py-4 flex items-center justify-between space-x-4"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-medium text-gray-900 truncate">
                            {patient.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            Age: {patient.age} | Gender: {patient.gender}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          <Phone className="h-4 w-4 inline mr-1.5 text-gray-400" />
                          {patient.phone || "No phone"}
                        </p>
                        <p className="text-xs text-gray-400">
                          Registered:{" "}
                          {new Date(patient.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              //EMPTY STATE
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <UserCheck className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Patients Saved Yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start scanning to add flagged patients to this campaign.
                </p>
                <Link href={`/scan?campaignId=${encodedId}`} passHref>
                  <Button className="bg-[#079eff] hover:bg-[#0384d4]">
                    <ScanLine className="mr-2 h-4 w-4" />
                    Start Scanning Now
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
