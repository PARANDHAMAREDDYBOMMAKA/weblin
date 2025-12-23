declare module 'v86' {
  export interface V86Config {
    screen_container?: HTMLElement | null;
    bios?: {
      url: string;
    };
    vga_bios?: {
      url: string;
    };
    cdrom?: {
      url: string;
      async?: boolean;
      size?: number;
    };
    hda?: {
      url: string;
      async?: boolean;
    };
    memory_size?: number;
    vga_memory_size?: number;
    autostart?: boolean;
    acpi?: boolean;
  }

  export interface DownloadProgressEvent {
    file_name: string;
    loaded: number;
    total: number;
    lengthComputable: boolean;
  }

  export default class V86 {
    constructor(config: V86Config);
    add_listener(event: 'download-progress', callback: (e: DownloadProgressEvent) => void): void;
    add_listener(event: 'emulator-ready', callback: () => void): void;
    add_listener(event: string, callback: (e?: unknown) => void): void;
    destroy(): void;
    run(): void;
    stop(): void;
  }
}