# LinWeb - Linux in Your Browser

Run full Linux distributions with GUI directly in your web browser using WebAssembly and v86 emulator.

## Features

- Run multiple Linux distributions (Alpine, Debian, Arch)
- Full GUI support
- 100% browser-based - no server-side containers
- No Docker required
- Deployed on Vercel
- Zero local storage usage during build and deployment

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Emulator:** v86 (WebAssembly-based x86 emulator)
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm

### Local Development

1. Clone the repository:
```bash
git clone <your-repo-url>
cd linweb
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Setting up Vercel Deployment

1. Create a new project on [Vercel](https://vercel.com)

2. Get your Vercel credentials:
   - **VERCEL_TOKEN**: Go to Account Settings > Tokens > Create Token
   - **VERCEL_ORG_ID**: Found in your team/org settings
   - **VERCEL_PROJECT_ID**: Found in Project Settings > General

3. Add GitHub Secrets:
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Add the following secrets:
     - `VERCEL_TOKEN`
     - `VERCEL_ORG_ID`
     - `VERCEL_PROJECT_ID`

4. Push to main branch:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

The GitHub Actions workflow will automatically build and deploy to Vercel.

## How It Works

1. **v86 Emulator**: Uses WebAssembly to emulate x86 architecture in the browser
2. **Client-Side Only**: Linux runs entirely in the browser - no server-side containers
3. **Live ISO Loading**: Downloads Linux ISOs from public mirrors on-demand
4. **No Persistence**: All data is lost when the browser tab is closed (by design)

## Architecture

```
linweb/
├── app/
│   ├── page.tsx          # Landing page
│   ├── linux/
│   │   └── page.tsx      # Linux emulator page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   └── LinuxEmulator.tsx # v86 emulator component
├── public/
│   └── v86/              # v86 BIOS files
│       ├── seabios.bin
│       └── vgabios.bin
├── types/
│   └── v86.d.ts          # TypeScript definitions for v86
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions workflow
└── next.config.ts        # Next.js configuration
```

## Supported Linux Distributions

- **Alpine Linux** (Recommended) - Lightweight, ~200MB
- **Debian** - Stable and versatile, ~800MB
- **Arch Linux** - Lightweight and flexible, ~900MB

## Performance Notes

- Initial boot takes 2-5 minutes depending on internet speed
- Performance depends on:
  - Browser (Chrome/Firefox recommended)
  - Device specifications
  - Internet connection speed

## Limitations

- No data persistence (by design)
- Performance limited by browser WebAssembly capabilities
- Large downloads for full distributions
- Not suitable for production workloads

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 90+
- Edge 90+
- Safari 15+ (with limitations)

## Troubleshooting

### Emulator won't start
- Check browser console for errors
- Ensure you have a stable internet connection
- Try a different distribution (Alpine is fastest)
- Clear browser cache and reload

### Slow performance
- Use Alpine Linux (smallest and fastest)
- Close other browser tabs
- Ensure your device meets minimum requirements
- Try a different browser (Chrome typically performs best)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Credits

- [v86](https://github.com/copy/v86) - WebAssembly x86 emulator
- [Next.js](https://nextjs.org/) - React framework
- [Vercel](https://vercel.com/) - Deployment platform
