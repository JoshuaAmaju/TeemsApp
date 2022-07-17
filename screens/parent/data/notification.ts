import {useQuery} from 'react-query';

export type Notification = {
  id: number;
  title: string;
  content: string;
  timestamp: Date;
};

export const Key = 'notifications';

let NOTIFICATIONS = new Array(10).fill(0).map((_, i) => {
  return {
    id: i,
    timestamp: new Date(2014, 6, 2),
    title: 'Have you tried us out on web?',
    content:
      'Adipiscing ultricies mi in faucibus iaculis hendrerit nisl.Adipiscing ultricies mi in faucibus iaculis hendrerit nisl.Adipiscing ultricies mi in faucibus iaculis hendrerit nisl.',
  };
});

export const removeNotification = (id: number) => {
  return new Promise(r => {
    NOTIFICATIONS = NOTIFICATIONS.filter(n => n.id !== id);
    setTimeout(r, 5000);
  });
};

export const useNotifications = () => {
  return useQuery<Notification[]>([Key], () => {
    return new Promise<Notification[]>(r => {
      setTimeout(r, 2000, NOTIFICATIONS);
    });
  });
};
