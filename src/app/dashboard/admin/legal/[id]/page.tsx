import React from 'react';
import axios from '@/lib/axios';
import AdminLegalEditorClient from '../AdminLegalEditorClient';

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Fetch data on the client or server, here we do server side for initial population
// But for authenticated admin routes, it's safer to fetch client side OR ensure cookies are passed.
// Given Next.js App Router and Auth Sanctum, client-side fetching in the generic editor is easier 
// OR we create a new client wrapper that specifically fetches by ID.

// Let's create a Client Wrapper for the Edit page specifically to handle fetching.
import EditLegalPageClient from './EditLegalPageClient';

export const metadata = {
  title: "Edit Legal Page",
};

export default async function EditLegalPage({ params }: EditPageProps) {
  const resolvedParams = await params;
  return <EditLegalPageClient id={resolvedParams.id} />;
}
