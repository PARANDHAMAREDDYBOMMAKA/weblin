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
    };
    hda?: {
      url: string;
      async?: boolean;
    };
    memory_size?: number;
    vga_memory_size?: number;
    autostart?: boolean;
  }

  export default class V86 {
    constructor(config: V86Config);
    add_listener(event: string, callback: () => void): void;
    destroy(): void;
    run(): void;
    stop(): void;
  }
}
