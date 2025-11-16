"use client";

import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PlusCircle,
  MapPin,
  Activity,
  Users,
  AlertTriangle,
  FileText,
  Eye,
  ScanLine,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { utils, writeFile } from "xlsx";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { encode } from "js-base64";

// Loading skeleton component
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
      <Navbar />
      <main className="container mx-auto px-4 md:px-8 py-8 max-w-7xl">
        {/* Header Skeleton */}
        <div className="mb-10">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Campaign Cards Skeleton */}
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-full" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState("");
  const [newCampaignArea, setNewCampaignArea] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  //data fetching
  const fetchCampaigns = async () => {
    setIsLoading(true);
    const response = await fetch("/api/campaigns");
    const data = await response.json();
    if (data.success) {
      setCampaigns(data.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchCampaigns();
    }
  }, [status]);

  // Show skeleton while loading session or data
  if (status === "loading" || isLoading) {
    return <DashboardSkeleton />;
  }

  if (!session) {
    return null;
  }

  // Calculate overall statistics
  const totalScanned = campaigns.reduce(
    (acc, camp) => acc + camp.totalScanned,
    0
  );
  const totalAnemic = campaigns.reduce(
    (acc, camp) => acc + camp.anemiaDetected,
    0
  );
  const anemiaPercentage =
    totalScanned > 0 ? ((totalAnemic / totalScanned) * 100).toFixed(1) : 0;

  // Function to generate the overall Excel report
  const handleGenerateReport = () => {
    const dataToExport = campaigns.map((c) => ({
      "Campaign Name": c.name,
      Area: c.area,
      "Total Scanned": c.totalScanned,
      "Anemia Detected": c.anemiaDetected,
      "Detection Rate (%)":
        c.totalScanned > 0
          ? ((c.anemiaDetected / c.totalScanned) * 100).toFixed(1)
          : 0,
    }));

    dataToExport.push({});
    dataToExport.push({
      "Campaign Name": "OVERALL TOTALS",
      "Total Scanned": totalScanned,
      "Anemia Detected": totalAnemic,
      "Detection Rate (%)":
        totalScanned > 0 ? ((totalAnemic / totalScanned) * 100).toFixed(1) : 0,
    });

    const worksheet = utils.json_to_sheet(dataToExport);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Campaigns");
    writeFile(workbook, "HemaLens_Overall_Report.xlsx");
  };

  //handle create compaign
  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (!newCampaignName || !newCampaignArea) {
      alert("Please fill in all fields.");
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCampaignName,
          area: newCampaignArea,
        }),
      });

      if (response.ok) {
        setNewCampaignName("");
        setNewCampaignArea("");
        setIsModalOpen(false);
        await fetchCampaigns();
      } else {
        alert("Failed to create campaign. Please try again.");
      }
    } catch (error) {
      console.log("Error creating campaign:", error);
    } finally {
      setIsSaving(false);
    }
  };

  //handle delete compaign
  const handleDeleteCampaign = async (campaignId) => {
    if (
      confirm(
        "Are you sure you want to delete this campaign?\nAll associated patient data will be permanently lost. This action cannot be undone."
      )
    ) {
      try {
        const response = await fetch(`/api/campaigns/${campaignId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setCampaigns(campaigns.filter((c) => c._id !== campaignId));
        } else {
          alert("Failed to delete campaign. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting campaign:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
      <Navbar />

      <main className="container mx-auto px-4 md:px-8 py-8 max-w-7xl">
        {/*Header Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                Welcome back,{" "}
                <span className="text-[#079eff]">
                  {session.user.name.split(" ")[0]}
                </span>
              </h1>
              <p className="text-gray-600 text-lg">
                Track your anemia screening campaigns and health impact across
                regions.
              </p>
            </div>
            {/* --- CREATE CAMPAIGN MODAL TRIGGER --- */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-[#079eff] hover:bg-[#0384d4] text-white px-6 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  size="lg"
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                  <DialogDescription>
                    Start a new screening drive. Give it a name and the area
                    you'll be visiting.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateCampaign}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newCampaignName}
                        onChange={(e) => setNewCampaignName(e.target.value)}
                        placeholder="e.g., Kudremukh Village Drive"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="area" className="text-right">
                        Area
                      </Label>
                      <Input
                        id="area"
                        value={newCampaignArea}
                        onChange={(e) => setNewCampaignArea(e.target.value)}
                        placeholder="e.g., Kudremukh, Mangaluru"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="ghost">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      className="bg-[#079eff] hover:bg-[#0384d4]"
                      disabled={isSaving}
                    >
                      {isSaving ? "Creating..." : "Create Campaign"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Total People Scanned Card */}
          <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-white to-blue-50/50 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="h-6 w-6 text-[#079eff]" />
                </div>
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Total People Screened
              </h3>
              <p className="text-3xl font-bold text-gray-900">{totalScanned}</p>
              <p className="text-xs text-gray-500 mt-2">Across all campaigns</p>
            </CardContent>
          </Card>

          {/* Anemia Detected Card */}
          <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-white to-red-50/50 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    parseFloat(anemiaPercentage) > 25
                      ? "bg-red-100 text-red-700"
                      : parseFloat(anemiaPercentage) > 15
                      ? "bg-orange-100 text-orange-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {anemiaPercentage}%
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Anemia Cases Detected
              </h3>
              <p className="text-3xl font-bold text-gray-900">{totalAnemic}</p>
              <p className="text-xs text-gray-500 mt-2">
                Flagged for medical attention
              </p>
            </CardContent>
          </Card>
          {/*Overall report Download*/}
          <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">
                  Overall Report
                </h3>
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 mt-3 cursor-pointer"
                onClick={handleGenerateReport}
                disabled={campaigns.length === 0 && !isLoading}
              >
                Download Report
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Screening Campaigns
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Your health screening history across different areas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Campaign Cards */}
          {campaigns.map((campaign, index) => {
            return (
              <Card
                key={campaign._id}
                className="border shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white overflow-hidden"
              >
                <CardHeader className="pb-3 relative">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-[#079eff] transition-colors">
                      {campaign.name}
                    </CardTitle>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {campaign.area}
                  </p>
                  <Button
                    variant=""
                    size="icon"
                    className="absolute top-2 right-2 bg-blue-50   text-black hover:text-red-500 hover:bg-red-50 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCampaign(campaign._id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Screening Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center mb-1">
                        <Users className="h-3 w-3 text-[#079eff] mr-1" />
                        <p className="text-xs text-gray-600">Screened</p>
                      </div>
                      <p className="text-xl font-bold text-gray-900">
                        {campaign.totalScanned}
                      </p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center mb-1">
                        <AlertTriangle className="h-3 w-3 text-red-600 mr-1" />
                        <p className="text-xs text-gray-600">Anemic</p>
                      </div>
                      <p className="text-xl font-bold text-red-600">
                        {campaign.anemiaDetected}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 border-t border-gray-100 mt-8">
                    <Link
                      href={`/scan?campaignId=${encode(campaign._id)}`}
                      passHref
                    >
                      <Button className="w-full justify-center rounded-lg bg-[#079eff] hover:bg-[#0384d4] cursor-pointer text-white">
                        <ScanLine className="h-4 w-4 mr-2" />
                        Start Scanning
                      </Button>
                    </Link>
                    <Link href={`/campaign/${encode(campaign._id)}`} passHref>
                      <Button
                        variant="ghost"
                        className="w-full justify-center rounded-lg border border-gray-300 rounded-bl-lg text-gray-600 hover:text-[#079eff] hover:bg-blue-50 cursor-pointer"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Add New Campaign Card (Triggers the modal) */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Card className="border-2 border-dashed border-gray-300 hover:border-[#079eff] hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group bg-transparent">
                <CardContent className="flex flex-col h-full items-center justify-center p-8 min-h-[300px]">
                  <div className="p-3 bg-blue-100 rounded-full mb-4 group-hover:bg-[#079eff] transition-colors duration-200">
                    <PlusCircle className="h-6 w-6 text-[#079eff] group-hover:text-white transition-colors duration-200" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 group-hover:text-[#079eff] transition-colors duration-200">
                    {campaigns.length === 0 && !isLoading
                      ? "Create Your First Campaign"
                      : "Create New Campaign"}
                  </h3>
                </CardContent>
              </Card>
            </DialogTrigger>
          </Dialog>
        </div>
      </main>
      <Footer />
    </div>
  );
}
