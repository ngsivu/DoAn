import { api } from 'services/api';

class LoginServices {
  handleLogin = (data: { email: string; password: string }) => {
    return api.post('auth/login', data);
  };
}

const loginServices = new LoginServices();

export default loginServices;
