"use client";

import { initStores } from "@/lib/initStores";

let initialized = false;

export default function StoreInitializer() {
  if (!initialized && typeof window !== "undefined") {
    initStores();
    initialized = true;
  }
  return null;
}
