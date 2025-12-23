'use client';

import { useEffect, useRef, useState } from 'react';
import type V86 from 'v86';
import type { DownloadProgressEvent } from 'v86';

interface LinuxEmulatorProps {
  distro?: 'alpine' | 'tinycore' | 'debian' | 'arch';
}

export default function LinuxEmulator({ distro = 'tinycore' }: LinuxEmulatorProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('Initializing...');
  const emulatorRef = useRef<V86 | null>(null);

  useEffect(() => {
    let mounted = true;

    const initEmulator = async () => {
      try {
        // Dynamically import v86 to avoid SSR issues
        const V86 = (await import('v86')).default;

        if (!mounted || !screenRef.current) return;

        // Configuration for different distros
        const distroConfigs = {
          // TinyCore - Fastest option (only ~25MB)
          tinycore: {
            cdrom: {
              url: 'https://distro.ibiblio.org/tinycorelinux/16.x/x86_64/release/TinyCorePure64-16.2.iso',
              async: true,
              size: 25 * 1024 * 1024,
            },
            memory_size: 128 * 1024 * 1024, // Only 128MB needed
            vga_memory_size: 2 * 1024 * 1024,
            acpi: true, // Enable ACPI for better performance
          },
          // Alpine - Small and full-featured (~62MB)
          alpine: {
            cdrom: {
              url: 'https://dl-cdn.alpinelinux.org/alpine/v3.21/releases/x86_64/alpine-virt-3.21.0-x86_64.iso',
              async: true,
              size: 62 * 1024 * 1024,
            },
            memory_size: 256 * 1024 * 1024,
            vga_memory_size: 2 * 1024 * 1024,
            acpi: true,
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

        setLoadingStatus('Downloading system files...');

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

        // Track download progress
        emulatorRef.current.add_listener('download-progress', (e: DownloadProgressEvent) => {
          if (mounted && e.total > 0) {
            const percent = Math.min(99, Math.round((e.loaded / e.total) * 100));
            setLoadingProgress(percent);
            const fileSizeMB = (e.total / (1024 * 1024)).toFixed(1);
            const loadedMB = (e.loaded / (1024 * 1024)).toFixed(1);
            setLoadingStatus(`Downloading ${e.file_name} (${loadedMB}MB / ${fileSizeMB}MB)`);
          } else if (mounted && e.lengthComputable === false) {
            // For downloads without known size, show spinning loader
            setLoadingStatus(`Downloading ${e.file_name}...`);
          }
        });

        emulatorRef.current.add_listener('emulator-ready', () => {
          if (mounted) {
            setLoadingStatus('Starting Linux...');
            setLoadingProgress(100);
            // Give a moment for boot to start before hiding loader
            setTimeout(() => setIsLoading(false), 2000);
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
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 z-10">
          <div className="text-center max-w-md w-full px-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-6"></div>
            <p className="text-white text-xl font-semibold mb-2">Loading Linux {distro}</p>
            <p className="text-gray-300 text-sm mb-4">{loadingStatus}</p>

            {loadingProgress > 0 && (
              <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                <div
                  className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
            )}

            {loadingProgress > 0 && (
              <p className="text-gray-400 text-xs mt-2">
                {loadingProgress}% complete
              </p>
            )}
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
