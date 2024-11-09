"use client"
import VirtualTable from "@/components/vTable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Image from "next/image";

const queryClient = new QueryClient();


export default function Home() {
  return (
    <>
    <QueryClientProvider client={queryClient}>
    <VirtualTable />
    </QueryClientProvider>
    </>
  );
}
