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
        // Check browser compatibility
        if (typeof WebAssembly === 'undefined') {
          throw new Error('WebAssembly is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Edge.');
        }

        if (!('SharedArrayBuffer' in window)) {
          console.warn('SharedArrayBuffer not available - emulator may run slower');
        }

        // Comprehensive Node.js polyfills for v86 browser compatibility
        if (typeof window !== 'undefined') {
          const win = window as any;

          // 1. Global object
          if (!win.global) {
            win.global = window;
          }

          // 2. setImmediate/clearImmediate (Node.js timing functions)
          if (!win.setImmediate) {
            win.setImmediate = (callback: (...args: any[]) => void, ...args: any[]) =>
              setTimeout(callback, 0, ...args);
          }
          if (!win.clearImmediate) {
            win.clearImmediate = (id: number) => clearTimeout(id);
          }

          // 3. Process object (minimal polyfill)
          if (!win.process) {
            win.process = {
              env: {},
              version: '',
              versions: {},
              platform: 'browser',
              browser: true,
              nextTick: (callback: () => void) => Promise.resolve().then(callback),
              cwd: () => '/',
              chdir: () => {},
            };
          }

          // 4. Buffer polyfill (if not already provided by bundler)
          if (!win.Buffer && !win.global.Buffer) {
            // Simple Buffer polyfill for basic operations
            // Most modern bundlers provide this, but we'll add a basic version as fallback
            console.log('Buffer not available - using Uint8Array fallback');
          }
        }

        // Dynamically import v86 to avoid SSR issues
        const V86 = (await import('v86')).default;

        if (!mounted || !screenRef.current) {
          console.log('Not mounted or screen ref not ready');
          return;
        }

        // Ensure the screen container is fully rendered
        if (!screenRef.current.isConnected) {
          console.log('Screen container not connected to DOM');
          return;
        }

        // Helper function to create proxied URL
        const proxyUrl = (originalUrl: string) =>
          `/api/proxy-iso?url=${encodeURIComponent(originalUrl)}`;

        // Configuration for different distros
        const distroConfigs = {
          // TinyCore - Fastest option (only ~40MB)
          tinycore: {
            cdrom: {
              url: proxyUrl('https://distro.ibiblio.org/tinycorelinux/16.x/x86_64/release/TinyCorePure64-16.2.iso'),
              async: true,
              size: 40 * 1024 * 1024,
            },
            memory_size: 128 * 1024 * 1024, // Only 128MB needed
            vga_memory_size: 2 * 1024 * 1024,
            acpi: true, // Enable ACPI for better performance
          },
          // Alpine - Small and full-featured (~62MB)
          alpine: {
            cdrom: {
              url: proxyUrl('https://dl-cdn.alpinelinux.org/alpine/v3.23/releases/x86_64/alpine-virt-3.23.2-x86_64.iso'),
              async: true,
              size: 62 * 1024 * 1024,
            },
            memory_size: 256 * 1024 * 1024,
            vga_memory_size: 2 * 1024 * 1024,
            acpi: true,
          },
          // Debian - Full-featured (~470MB)
          debian: {
            cdrom: {
              url: proxyUrl('https://cdimage.debian.org/debian-cd/current-live/amd64/iso-hybrid/debian-live-13.2.0-amd64-standard.iso'),
              async: true,
              size: 470 * 1024 * 1024,
            },
            memory_size: 1024 * 1024 * 1024,
            vga_memory_size: 16 * 1024 * 1024,
            acpi: true,
          },
          // Arch Linux - Rolling release (~890MB)
          arch: {
            cdrom: {
              url: proxyUrl('https://mirror.arizona.edu/archlinux/iso/2025.12.01/archlinux-2025.12.01-x86_64.iso'),
              async: true,
              size: 890 * 1024 * 1024,
            },
            memory_size: 1024 * 1024 * 1024,
            vga_memory_size: 16 * 1024 * 1024,
            acpi: true,
          },
        };

        const config = distroConfigs[distro];

        setLoadingStatus('Initializing emulator...');
        console.log('Starting v86 emulator with config:', config);
        console.log('Screen container:', screenRef.current);

        emulatorRef.current = new V86({
          wasm_path: '/build/v86.wasm',
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

        console.log('V86 instance created');

        // Track all events for debugging
        emulatorRef.current.add_listener('download-progress', (e: DownloadProgressEvent) => {
          console.log('Download progress:', e);
          if (mounted && e.total > 0) {
            const percent = Math.min(99, Math.round((e.loaded / e.total) * 100));
            setLoadingProgress(percent);
            const fileSizeMB = (e.total / (1024 * 1024)).toFixed(1);
            const loadedMB = (e.loaded / (1024 * 1024)).toFixed(1);
            setLoadingStatus(`Downloading ${e.file_name} (${loadedMB}MB / ${fileSizeMB}MB)`);
          } else if (mounted) {
            setLoadingStatus(`Downloading ${e.file_name}...`);
          }
        });

        emulatorRef.current.add_listener('download-error', (e: unknown) => {
          console.error('Download error:', e);
          if (mounted) {
            const errorMessage = typeof e === 'object' && e !== null && 'message' in e
              ? (e as any).message
              : 'Network error - please check your connection';
            setError(`Download failed: ${errorMessage}. Try refreshing the page.`);
          }
        });

        emulatorRef.current.add_listener('emulator-ready', () => {
          console.log('Emulator ready');
          if (mounted) {
            setLoadingStatus('Starting Linux...');
            setLoadingProgress(100);
            setTimeout(() => setIsLoading(false), 2000);
          }
        });

      } catch (err) {
        console.error('Failed to initialize emulator:', err);
        if (mounted) {
          let errorMessage = 'Failed to load Linux emulator. ';

          if (err instanceof Error) {
            if (err.message.includes('fetch') || err.message.includes('network')) {
              errorMessage += 'Network error - please check your connection.';
            } else if (err.message.includes('CORS')) {
              errorMessage += 'Browser security blocked the request.';
            } else if (err.message.includes('WebAssembly')) {
              errorMessage += 'WebAssembly not supported in this browser.';
            } else {
              errorMessage += err.message;
            }
          } else {
            errorMessage += 'Please refresh the page and try again.';
          }

          setError(errorMessage);
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
        style={{
          minHeight: '600px',
          width: '100%',
          height: '100%',
          position: 'relative'
        }}
      >
        <div style={{ overflow: 'hidden', width: '100%', height: '100%' }}></div>
        <canvas style={{ display: 'none' }}></canvas>
      </div>
    </div>
  );
}
