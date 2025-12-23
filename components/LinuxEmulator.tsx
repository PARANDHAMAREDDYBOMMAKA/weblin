'use client';

import { useEffect, useRef, useState } from 'react';

interface LinuxEmulatorProps {
  distro?: 'alpine' | 'debian' | 'arch';
}

export default function LinuxEmulator({ distro = 'alpine' }: LinuxEmulatorProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const emulatorRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const initEmulator = async () => {
      try {
        // Dynamically import v86 to avoid SSR issues
        const V86 = (await import('v86')).default;

        if (!mounted || !screenRef.current) return;

        // Configuration for different distros
        const distroConfigs = {
          alpine: {
            cdrom: {
              url: 'https://dl-cdn.alpinelinux.org/alpine/v3.19/releases/x86_64/alpine-virt-3.19.0-x86_64.iso',
              async: true,
            },
            memory_size: 512 * 1024 * 1024,
            vga_memory_size: 8 * 1024 * 1024,
          },
          debian: {
            cdrom: {
              url: 'https://cdimage.debian.org/debian-cd/current-live/amd64/iso-hybrid/debian-live-12.4.0-amd64-standard.iso',
              async: true,
            },
            memory_size: 1024 * 1024 * 1024,
            vga_memory_size: 16 * 1024 * 1024,
          },
          arch: {
            cdrom: {
              url: 'https://mirror.rackspace.com/archlinux/iso/latest/archlinux-x86_64.iso',
              async: true,
            },
            memory_size: 1024 * 1024 * 1024,
            vga_memory_size: 16 * 1024 * 1024,
          },
        };

        const config = distroConfigs[distro];

        emulatorRef.current = new V86({
          screen_container: screenRef.current,
          bios: {
            url: '/v86/seabios.bin',
          },
          vga_bios: {
            url: '/v86/vgabios.bin',
          },
          ...config,
          autostart: true,
        });

        emulatorRef.current.add_listener('emulator-ready', () => {
          if (mounted) {
            setIsLoading(false);
          }
        });

      } catch (err) {
        console.error('Failed to initialize emulator:', err);
        if (mounted) {
          setError('Failed to load Linux emulator. Please refresh the page.');
          setIsLoading(false);
        }
      }
    };

    initEmulator();

    return () => {
      mounted = false;
      if (emulatorRef.current) {
        emulatorRef.current.destroy();
      }
    };
  }, [distro]);

  return (
    <div className="w-full h-full flex flex-col">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading Linux {distro}...</p>
            <p className="text-gray-400 text-sm mt-2">This may take a few minutes</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-75 z-10">
          <div className="text-center text-white">
            <p className="text-xl font-bold mb-2">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div
        ref={screenRef}
        className="flex-1 w-full bg-black"
        style={{ minHeight: '600px' }}
      />
    </div>
  );
}
