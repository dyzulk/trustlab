"use client";

import React, { Suspense } from 'react';
import EditLegalPageClient from './EditLegalPageClient';
import { useSearchParams } from 'next/navigation';

function EditLegalPageContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    // If id is null, we might be in creation mode or invalid. 
    // EditLegalPageClient seems to require id, so handle gracefully if needed or pass as is.
    return <EditLegalPageClient id={id || ''} />;
}

export default function EditLegalPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-10">Loading editor...</div>}>
       <EditLegalPageContent />
    </Suspense>
  );
}
