export const getAdminSecret = () => {
  return localStorage.getItem('admin_secret') || '';
};

export const setAdminSecret = (secret) => {
  localStorage.setItem('admin_secret', secret);
};

export const clearAdminSecret = () => {
  localStorage.removeItem('admin_secret');
};
