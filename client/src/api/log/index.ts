export interface LogItem {
  username: string;
  operation: string;
  recordName?: string;
  createdAt: Date;
}