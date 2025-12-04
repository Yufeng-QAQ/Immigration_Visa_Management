import Log, {ILog} from "../models/log";

export class LogService {
  static async write(username: string, operation: string, recordName?: string) {
    try {
      await Log.create({
        username,
        operation,
        recordName: recordName || null,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error("Failed to write log:", err);
    }
  }

  async getLogs() {
    return await Log.find().sort({ createdAt: -1 });
  }
}

