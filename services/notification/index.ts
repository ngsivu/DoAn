import { api } from 'services/api';

class NotificationService {
  getListNotification = (params: any) => {
    return api.get('/notifications', params);
  };

  setMarkAsRead = (id: any) => {
    return api.patch(`/notifications/${id}`);
  };
}

const notificationService = new NotificationService();

export default notificationService;
