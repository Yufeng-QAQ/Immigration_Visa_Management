type NotificationType = "success" | "error" | "info" | "warning";
type Listener = (type: NotificationType, message: string) => void;

class EventBus {
  private listeners: Listener[] = [];

  on(listener: Listener) {
    this.listeners.push(listener);
  }

  off(listener: Listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  emit(type: NotificationType, message: string) {
    this.listeners.forEach(l => l(type, message));
  }
}

export const notificationEmitter = new EventBus();

export const notify = {
  success: (message: string) => notificationEmitter.emit("success", message),
  error: (message: string) => notificationEmitter.emit("error", message),
  info: (message: string) => notificationEmitter.emit("info", message),
  warning: (message: string) => notificationEmitter.emit("warning", message),
};
