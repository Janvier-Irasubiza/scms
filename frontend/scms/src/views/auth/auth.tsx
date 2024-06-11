export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user');
  const loggedIn = !!token;

  console.log("Token:", token);
  console.log("Logged In:", loggedIn);

  return {
    authenticated: !!token,
    userId: userId
  };
};