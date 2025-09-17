
"use client";

import Header from '@/components/layout/header';
import MainNav from '@/components/layout/main-nav';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AppLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 text-primary-foreground"
  >
    <path d="M7 20V4M17 20V4M4 8H20M4 16H20" />
  </svg>
);

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  
  return (
      <SidebarProvider>
        <div className="flex min-h-screen">
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center gap-2.5 px-3.5 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm">
                  <AppLogo />
                </div>
                <span className="font-bold text-xl text-primary tracking-tighter">TMills</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <MainNav />
            </SidebarContent>
          </Sidebar>
          <SidebarInset className="flex flex-col min-h-screen !bg-background">
            <Header />
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
  )
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
      <AuthenticatedLayout>
        {children}
      </AuthenticatedLayout>
  );
}
