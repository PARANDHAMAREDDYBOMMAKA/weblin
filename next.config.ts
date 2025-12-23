import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config to allow webpack configuration
  turbopack: {},
  webpack: (config, { isServer }) => {
    // Fix for v86 in Next.js - disable node polyfills on client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        'fs/promises': false,
        path: false,
        crypto: false,
        perf_hooks: false,
        module: false,
      };

      // Handle node: protocol imports
      config.plugins.push({
        apply: (compiler: any) => {
          compiler.hooks.normalModuleFactory.tap('IgnoreNodeProtocol', (nmf: any) => {
            nmf.hooks.beforeResolve.tap('IgnoreNodeProtocol', (resource: any) => {
              if (resource.request && resource.request.startsWith('node:')) {
                resource.request = resource.request.replace('node:', '');
                config.resolve.fallback = config.resolve.fallback || {};
                const moduleName = resource.request;
                if (!config.resolve.fallback[moduleName]) {
                  config.resolve.fallback[moduleName] = false;
                }
              }
            });
          });
        }
      });
    }

    // Handle .wasm files for v86
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    return config;
  },
  // Required headers for SharedArrayBuffer (needed by v86)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
