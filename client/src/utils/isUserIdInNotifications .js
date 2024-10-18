export const isUserIdInNotifications = (notifications, newUserId) => {
  return notifications.some((notification) => notification.sender?._id === newUserId);
};


export const removeNotification = (notifications, newUserId) => {
  return notifications.filter(notification => notification.sender?._id !== newUserId);
};

export const countMatchingNotifications = (notifications, newUserId) => {
  const matchingNotifications = notifications.filter(notification => notification.sender?._id === newUserId);
  return matchingNotifications.length;
};



export const findMatchingNotificationIds = (notifications, removeNotificationsId) => {
  const ids = [];
  
  for (const notification of notifications) {
    if (notification.sender?._id === removeNotificationsId) {
      ids.push(notification._id);
    }
  }
  
  return ids;
};
