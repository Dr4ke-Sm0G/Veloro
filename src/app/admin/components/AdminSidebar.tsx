'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Search,
  Package,
  User,
  Menu,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users }, // Corrected icon for Users
  { href: '/admin/catalogue', label: 'Catalogue', icon: Package }, // Corrected icon for Catalogue
];
const others = [
  { href: '/admin/units', label: 'Units', icon: Search },
  { href: '/admin/drivers', label: 'Drivers', icon: User },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Define heights for fixed elements to ensure correct stacking and spacing.
  // These values should match the actual heights of your global Navbar and this sidebar's mobile header.
  // Assuming global Navbar is 80px tall (e.g., pt-20 in layout)
  const GLOBAL_NAVBAR_HEIGHT_PX = 80;
  // Height of this sidebar's mobile header (py-4, px-6)
  const ADMIN_MOBILE_HEADER_HEIGHT_PX = 64; // py-4 (16px top + 16px bottom) + content height

  // Calculate the combined height for positioning the sidebar content
  const COMBINED_FIXED_HEIGHT_PX = GLOBAL_NAVBAR_HEIGHT_PX + ADMIN_MOBILE_HEADER_HEIGHT_PX;


  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close on desktop resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      {/* Mobile Header for Admin section (visible only on mobile)
          This div is fixed at the top, positioned *below* the global Navbar (top: 80px),
          and has a z-index (z-40) higher than the sliding sidebar but lower than the global Navbar (assumed z-50). */}
      <div
        className="fixed left-0 w-full bg-white dark:bg-gray-900 border-b dark:border-gray-700 z-40 md:hidden py-4 px-6 flex justify-between items-center"
        style={{ top: `${GLOBAL_NAVBAR_HEIGHT_PX}px` }} // Positioned below the global Navbar
      >
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Admin</h1>
        <button onClick={() => setIsOpen(open => !open)} aria-label="Toggle Admin Menu">
          {isOpen ? <X className="h-6 w-6 text-gray-700 dark:text-gray-300" /> : <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />}
        </button>
      </div>

      {/* Sidebar Content (the actual sliding panel)
          On mobile, it's fixed and slides in/out. Its top position accounts for
          both the global Navbar and this sidebar's mobile header.
          Crucially, its z-index (z-35) is now lower than the global Navbar (z-50)
          and its own mobile header (z-40), preventing it from overlapping the main navbar.
          On desktop, it becomes relative and part of the flex layout. */}
      <aside
        className={cn(
          // Base styles
          'bg-white dark:bg-gray-900 border-r dark:border-gray-700 px-4 py-6',
          // Mobile: fixed sliding panel below combined headers
          'fixed left-0 w-64 transform transition-transform duration-300 ease-in-out z-35', // Changed z-index from z-50 to z-35
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Position & size on mobile only: starts below combined fixed heights
          `top-[${COMBINED_FIXED_HEIGHT_PX}px] h-[calc(100vh-${COMBINED_FIXED_HEIGHT_PX}px)]`,
          // Desktop: always visible, relative, full height
          'md:relative md:translate-x-0 md:top-0 md:h-full md:flex md:flex-col md:w-64'
        )}
      >
        {/* Main section */}
        <h2 className="px-2 text-sm font-semibold text-muted-foreground dark:text-gray-400 mb-4">Main</h2>
        <nav className="space-y-1 relative">
          {links.map(link => {
            const active = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-muted text-primary dark:bg-gray-700 dark:text-white'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                )}
                onClick={() => setIsOpen(false)} // Close sidebar on link click
              >
                {active && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-md bg-primary/10 dark:bg-blue-600/20"
                    transition={{ duration: 0.3 }}
                  />
                )}
                <Icon className="relative z-10 h-5 w-5" />
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Others section */}
        <h2 className="mt-6 px-2 text-sm font-semibold text-muted-foreground dark:text-gray-400 mb-4">Others</h2>
        <nav className="space-y-1">
          {others.map(link => {
            const active = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-muted text-primary dark:bg-gray-700 dark:text-white'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                )}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Backdrop mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden" // z-30 is lower than sidebar (z-35)
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
