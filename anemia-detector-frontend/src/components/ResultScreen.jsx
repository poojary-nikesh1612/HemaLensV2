"use client";
import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import Footer from "./Footer";
import { RotateCcw, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Navbar from "./Navbar";

const ResultScreen = ({
  image,
  onRetake,
  result,
  campaignId,
  onPatientSaved,
}) => {
  const { isAnemic } = result;

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // State for the form fields
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");

  // Function to save the patient to the database
  const handleSavePatient = async (e) => {
    e.preventDefault();
    if (!name || !age || !gender || !phone) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsSaving(true);

    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: campaignId,
          name: name,
          age: parseInt(age),
          gender: gender,
          phone: phone,
          result: isAnemic ? "Anemic" : "Non-Anemic",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save patient.");
      }

      toast.success("Patient saved successfully!");
      setIsModalOpen(false);
      onPatientSaved();
    } catch (error) {
      console.error("Error saving patient:", error);
      toast.error("Error saving patient", { description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <Navbar />
        {/* This Dialog component is the modal for saving a patient */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Save Patient Details</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSavePatient}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="age" className="text-right">
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="gender" className="text-right">
                    Gender
                  </Label>
                  <Select onValueChange={setGender} value={gender}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="ghost" disabled={isSaving}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="bg-[#079eff] hover:bg-[#0384d4]"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Patient"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:mb-10">
          <div className="w-full max-w-2xl space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-black mb-2">
                Analysis Completed
              </h1>
              <p className="text-gray-600">
                The AI has analyzed the patient's palm image. Review the result
                below.
              </p>
            </div>

            <Card
              className={`p-4 border-3 ${
                isAnemic
                  ? "border-red-300 bg-red-50"
                  : "border-green-300 bg-green-50"
              }`}
            >
              <CardTitle className="text-xl font-bold">
                Analyzed Image
              </CardTitle>
              <CardContent className="p-4">
                <div className="relative aspect-square max-w-md mx-auto bg-[#f1f9fe] rounded-lg overflow-hidden">
                  <img
                    src={image || "/placeholder.svg"}
                    alt="Palm being analyzed"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div
                  className={`${
                    isAnemic
                      ? " border-2 bg-red-100 text-red-800 border-red-200"
                      : "bg-green-100 text-green-800 border-green-200"
                  } rounded-lg p-6 mt-10`}
                >
                  <h1 className="text-xl font-semibold">Analysis Result</h1>
                  <p className="text-3xl font-bold ml-10 py-2">
                    {isAnemic ? "Anemic" : "Non-Anemic"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={onRetake}
                variant="outline"
                className="text-lg px-8 bg-transparent cursor-pointer"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Scan Next Person
              </Button>

              <Button
                size="lg"
                className="md:w-[40%] text-lg px-8 bg-[#079eff] hover:bg-[#0384d4] cursor-pointer disabled:opacity-50"
                disabled={!isAnemic}
                onClick={() => setIsModalOpen(true)}
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Save Patient
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResultScreen;
