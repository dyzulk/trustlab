"use client";

import React from "react";

export default function Preloader() {
  return (
    <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-500 border-t-transparent"></div>
    </div>
  );
}
