"use client";
import React, { useState, useEffect } from "react";
import {
  fetchAutomationState,
  updateAutomationState,
} from "@/actions/admin-automateOrders";
import { Button } from "@/components/ui/button";

const AdminAutomateOrders: React.FC = () => {
  const [isAutomationEnabled, setIsAutomationEnabled] = useState<
    boolean | null
  >(null); // Use `null` initially to avoid mismatch

  useEffect(() => {
    const getState = async () => {
      const state = await fetchAutomationState();
      console.log(state);
      setIsAutomationEnabled(state);
    };

    getState();
  }, []);

  const handleToggle = async () => {
    console.log("---------------")
    if (isAutomationEnabled === null) return; // Prevent toggling before state is set

    const newState = !isAutomationEnabled;
    const success = await updateAutomationState(newState);
    console.log(success);
    if (success) {
      setIsAutomationEnabled(newState);
    }
  };

  return (
    <div className="flex justify-around flex-col items-start w-full md:w-56  mx-2 mt-5 rounded-lg h-24 md:h-28 bg-gray-100 px-4 py-2">
      <span className="font-semibold text-center mb-2">Automate Orders</span>
      {isAutomationEnabled !== null ? (
        <Button
          onClick={handleToggle}
          variant={isAutomationEnabled ? "destructive" : "default"}
          className="mt-2 ml-5 "
        >
          {isAutomationEnabled ? "Deactivate" : "Activate"}
        </Button>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AdminAutomateOrders;
