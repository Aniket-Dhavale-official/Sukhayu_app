import React, { useState, useEffect } from "react";
import { UserRole, Language } from "./types";
import { RoleSelector } from "./components/RoleSelector";
import { OTPLogin } from "./components/OTPLogin";
import { PatientApp } from "./components/patient/PatientApp";
import { DoctorApp } from "./components/doctor/DoctorApp";
import { PharmacistApp } from "./components/pharmacist/PharmacistApp";
import {
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
} from "./utils/mockData";
import { toast, Toaster } from "sonner@2.0.3";

type AppState = "role-selection" | "login" | "authenticated";

export default function App() {
  const [appState, setAppState] =
    useState<AppState>("role-selection");
  const [selectedRole, setSelectedRole] =
    useState<UserRole | null>(null);
  const [currentUser, setCurrentUserState] =
    useState<any>(null);
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // Check if user is already logged in
    const user = getCurrentUser();
    if (user) {
      setCurrentUserState(user);
      setSelectedRole(user.role);
      setAppState("authenticated");
    }
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setAppState("login");
  };

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setCurrentUserState(user);
    setAppState("authenticated");
    toast.success(`Welcome, ${user.fullName}!`);
  };

  const handleLogout = () => {
    clearCurrentUser();
    setCurrentUserState(null);
    setSelectedRole(null);
    setAppState("role-selection");
    toast.success("Logged out successfully");
  };

  const handleBack = () => {
    if (appState === "login") {
      setAppState("role-selection");
      setSelectedRole(null);
    }
  };

  const renderApp = () => {
    if (appState === "role-selection") {
      return <RoleSelector onRoleSelect={handleRoleSelect} />;
    }

    if (appState === "login" && selectedRole) {
      return (
        <OTPLogin
          role={selectedRole}
          language={language}
          onLanguageChange={setLanguage}
          onBack={handleBack}
          onLogin={handleLogin}
        />
      );
    }

    if (appState === "authenticated" && currentUser) {
      // Patient and ASHA Worker App
      if (
        currentUser.role === "patient" ||
        currentUser.role === "asha"
      ) {
        return (
          <PatientApp
            user={currentUser}
            language={language}
            onLanguageChange={setLanguage}
            onLogout={handleLogout}
          />
        );
      }

      // Doctor App (Chief Health Officer, MO, Civil Doctor, Emergency Doctor)
      if (
        [
          "cho",
          "mo",
          "civil_doctor",
          "emergency_doctor",
        ].includes(currentUser.role)
      ) {
        return (
          <DoctorApp
            user={currentUser}
            onLogout={handleLogout}
          />
        );
      }

      // Pharmacist App
      if (currentUser.role === "pharmacist") {
        return (
          <PharmacistApp
            user={currentUser}
            onLogout={handleLogout}
          />
        );
      }
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">
            Something went wrong
          </h1>
          <button
            onClick={() => {
              clearCurrentUser();
              setAppState("role-selection");
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderApp()}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#000",
          },
        }}
      />
    </>
  );
}