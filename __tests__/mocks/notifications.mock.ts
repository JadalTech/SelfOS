/**
 * Expo Notifications Test Mock
 * SelfOS Testing Infrastructure
 */

export class MockNotificationService {
  public scheduledNotifications: Array<{ id: string; content: any; trigger: any }> = [];
  public permissionsGranted: boolean = true;

  async requestPermissionsAsync(): Promise<{ status: string }> {
    return { status: this.permissionsGranted ? 'granted' : 'denied' };
  }

  async scheduleNotificationAsync(request: { content: any; trigger: any }): Promise<string> {
    const id = `notif_${Math.random().toString(36).substring(2, 9)}`;
    this.scheduledNotifications.push({ id, ...request });
    return id;
  }

  async cancelScheduledNotificationAsync(id: string): Promise<void> {
    this.scheduledNotifications = this.scheduledNotifications.filter((n) => n.id !== id);
  }

  async cancelAllScheduledNotificationsAsync(): Promise<void> {
    this.scheduledNotifications = [];
  }

  async getAllScheduledNotificationsAsync(): Promise<any[]> {
    return [...this.scheduledNotifications];
  }
}
