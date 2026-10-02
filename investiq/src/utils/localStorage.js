// localStorage utility functions for user persistence

const USER_STORAGE_KEY = 'menu_app_user';

export const saveUserToStorage = (user) => {
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
};

export const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem(USER_STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const clearUserFromStorage = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
};
