'use client';

import { useState } from 'react';
import LinuxEmulator from '@/components/LinuxEmulator';

export default function LinuxPage() {
  const [selectedDistro, setSelectedDistro] = useState<'tinycore' | 'alpine' | 'debian' | 'arch'>('tinycore');
  const [isStarted, setIsStarted] = useState(false);

  const distros = [
    {
      id: 'tinycore' as const,
      name: 'TinyCore Linux',
      description: 'Ultra-lightweight, fastest boot time',
      size: '~40MB',
      recommended: true,
      speed: 'Fastest',
    },
    {
      id: 'alpine' as const,
      name: 'Alpine Linux',
      description: 'Lightweight, security-oriented distribution',
      size: '~62MB',
      recommended: false,
      speed: 'Fast',
    },
    {
      id: 'debian' as const,
      name: 'Debian 13',
      description: 'Stable and full-featured distribution',
      size: '~470MB',
      recommended: false,
      speed: 'Slow',
    },
    {
      id: 'arch' as const,
      name: 'Arch Linux',
      description: 'Rolling release, cutting-edge packages',
      size: '~890MB',
      recommended: false,
      speed: 'Very Slow',
    },
  ];

  const handleStart = () => {
    setIsStarted(true);
  };

  if (isStarted) {
    return (
      <main className="min-h-screen bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                {distros.find(d => d.id === selectedDistro)?.name}
              </h1>
              <p className="text-gray-400 text-sm">
                Running in your browser via WebAssembly
              </p>
            </div>
            <button
              onClick={() => setIsStarted(false)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Stop & Change Distro
            </button>
          </div>
          <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
            <LinuxEmulator distro={selectedDistro} />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Linux in Your Browser
          </h1>
          <p className="text-xl text-gray-300">
            Run full Linux distributions with GUI directly in your web browser
          </p>
          <p className="text-gray-400 mt-2">
            Powered by v86 WebAssembly emulator
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Choose a Distribution
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {distros.map((distro) => (
              <button
                key={distro.id}
                onClick={() => setSelectedDistro(distro.id)}
                className={`p-6 rounded-xl transition-all transform hover:scale-105 ${
                  selectedDistro === distro.id
                    ? 'bg-blue-600 ring-4 ring-blue-400'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-white">
                    {distro.name}
                  </h3>
                  {distro.recommended && (
                    <span className="px-2 py-1 text-xs bg-green-500 text-white rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  {distro.description}
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Download size:</span>
                    <span className="text-white font-semibold">{distro.size}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Speed:</span>
                    <span className={`font-semibold ${
                      distro.speed === 'Fastest' ? 'text-green-400' :
                      distro.speed === 'Fast' ? 'text-blue-400' :
                      distro.speed === 'Slow' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>{distro.speed}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleStart}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            Start {distros.find(d => d.id === selectedDistro)?.name}
          </button>
          <p className="text-gray-400 text-sm mt-4">
            Note: TinyCore loads in ~30 seconds, Alpine in ~1-2 minutes, others may take 5+ minutes
          </p>
        </div>

        <div className="mt-12 bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            Important Notes
          </h3>
          <ul className="text-gray-300 space-y-2 text-sm">
            <li>• All Linux instances run entirely in your browser using WebAssembly</li>
            <li>• No data is stored on servers - everything runs locally</li>
            <li>• Performance depends on your device specifications</li>
            <li>• Data is lost when you close the browser or refresh the page</li>
            <li>• For best experience, use a modern browser (Chrome, Firefox, Edge)</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
