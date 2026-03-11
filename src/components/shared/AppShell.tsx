"use client";

import StoreInitializer from "./StoreInitializer";
import Sidebar from "./Sidebar";
import ContentArea from "./ContentArea";
import AIChatPanel from "./AIChatPanel";

export default function AppShell() {
  return (
    <>
      <StoreInitializer />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <ContentArea />
        <AIChatPanel />
      </div>
    </>
  );
}
