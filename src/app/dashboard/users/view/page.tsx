import { Suspense } from "react";
import UserProfileClient from "./UserProfileClient";

export default function UserProfilePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <UserProfileClient />
    </Suspense>
  );
}
