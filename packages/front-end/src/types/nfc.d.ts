export interface NDEFRecord {
  recordType: string;
  mediaType?: string;
  id?: string;
  data?: ArrayBuffer | string;
}

export interface NDEFMessage {
  records: NDEFRecord[];
}

export interface NDEFWriter {
  write(message: NDEFMessage): Promise<void>;
}

export interface NDEFReader {
  scan(): Promise<void>;
  onreading: ((event: NDEFReadingEvent) => void) | null;
  onreadingerror: (() => void) | null;
}

export interface NDEFReadingEvent extends Event {
  message: NDEFMessage;
}

export interface Navigator {
  ndef?: NDEFReader;
}

export interface Window {
  NDEFReader?: { new(): NDEFReader };
  NDEFWriter?: { new(): NDEFWriter };
}

