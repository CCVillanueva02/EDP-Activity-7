export interface User {
  user_id: number;
  username: string;
  password: string;
  email: string;
  full_name: string;
  role: 'Admin' | 'Staff' | 'Dentist';
  status: 'Active' | 'Inactive';
  created_at: string;
  last_login?: string;
}

export const mockUsers: User[] = [
  {
    user_id: 1,
    username: 'admin',
    password: 'admin123',
    email: 'admin@dentalclinic.com',
    full_name: 'System Administrator',
    role: 'Admin',
    status: 'Active',
    created_at: '2026-01-01',
    last_login: '2026-05-09'
  },
  {
    user_id: 2,
    username: 'staff1',
    password: 'staff123',
    email: 'staff1@dentalclinic.com',
    full_name: 'Maria Santos',
    role: 'Staff',
    status: 'Active',
    created_at: '2026-01-15',
    last_login: '2026-05-08'
  },
  {
    user_id: 3,
    username: 'dentist1',
    password: 'dentist123',
    email: 'carlo.mendoza@dentalclinic.com',
    full_name: 'Dr. Carlo Mendoza',
    role: 'Dentist',
    status: 'Active',
    created_at: '2026-02-01'
  },
  {
    user_id: 4,
    username: 'staff2',
    password: 'staff123',
    email: 'staff2@dentalclinic.com',
    full_name: 'Juan Dela Cruz',
    role: 'Staff',
    status: 'Inactive',
    created_at: '2026-03-01'
  },
];

let users = [...mockUsers];

export const getUsersData = () => users;

export const addUser = (user: Omit<User, 'user_id' | 'created_at'>) => {
  const newUser: User = {
    ...user,
    user_id: Math.max(...users.map(u => u.user_id)) + 1,
    created_at: new Date().toISOString().split('T')[0]
  };
  users.push(newUser);
  return newUser;
};

export const updateUser = (userId: number, updates: Partial<User>) => {
  const index = users.findIndex(u => u.user_id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    return users[index];
  }
  return null;
};

export const deleteUser = (userId: number) => {
  users = users.filter(u => u.user_id !== userId);
};

export const authenticateUser = (username: string, password: string) => {
  const user = users.find(
    u => u.username === username && u.password === password && u.status === 'Active'
  );

  if (user) {
    updateUser(user.user_id, { last_login: new Date().toISOString().split('T')[0] });
  }

  return user;
};

export const getUserByEmail = (email: string) => {
  return users.find(u => u.email === email);
};

export const resetPassword = (email: string, newPassword: string) => {
  const user = getUserByEmail(email);
  if (user) {
    updateUser(user.user_id, { password: newPassword });
    return true;
  }
  return false;
};
