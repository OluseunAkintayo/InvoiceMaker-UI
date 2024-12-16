import React from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from './DashboardSidebar'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
      <SidebarProvider defaultOpen={true}>
        <DashboardSidebar />
        <main className='bg-slate-100 w-full'>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
  )
}

export default DashboardLayout;
