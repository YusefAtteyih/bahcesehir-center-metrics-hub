
import { useState, useCallback } from 'react';
import { toast } from "@/hooks/use-toast";

export interface Notification {
  id: string;
  type: 'workflow' | 'system' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedId?: string;
  priority: 'low' | 'medium' | 'high';
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((
    type: Notification['type'],
    title: string,
    message: string,
    priority: Notification['priority'] = 'medium',
    relatedId?: string
  ) => {
    const notification: Notification = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      relatedId,
      priority
    };

    setNotifications(prev => [notification, ...prev]);

    // Show toast for high priority notifications
    if (priority === 'high') {
      toast({
        title,
        description: message,
      });
    }

    return notification.id;
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const getUnreadCount = useCallback(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const getNotificationsByType = useCallback((type: Notification['type']) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  // Workflow-specific notification helpers
  const notifyKpiSubmission = useCallback((centerName: string, kpiName: string) => {
    return addNotification(
      'workflow',
      'KPI Update Submitted',
      `${centerName} has submitted an update for ${kpiName}`,
      'high'
    );
  }, [addNotification]);

  const notifyKpiApproval = useCallback((kpiName: string, approved: boolean) => {
    return addNotification(
      'workflow',
      approved ? 'KPI Update Approved' : 'KPI Update Rejected',
      `Your ${kpiName} update has been ${approved ? 'approved' : 'rejected'}`,
      'high'
    );
  }, [addNotification]);

  const notifyRevisionRequest = useCallback((kpiName: string, comments: string) => {
    return addNotification(
      'workflow',
      'Revision Requested',
      `Your ${kpiName} update needs revision: ${comments}`,
      'high'
    );
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
    getNotificationsByType,
    notifyKpiSubmission,
    notifyKpiApproval,
    notifyRevisionRequest
  };
};
