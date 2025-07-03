import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Shield, 
  Activity,
  Settings
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { path: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'manager', 'user'] },
    { path: '/app/files', icon: FileText, label: 'File Manager', roles: ['admin', 'manager', 'user'] },
    { path: '/app/users', icon: Users, label: 'User Management', roles: ['admin', 'manager'] },
    { path: '/app/security', icon: Shield, label: 'Security', roles: ['admin', 'manager', 'user'] },
    { path: '/app/audit', icon: Activity, label: 'Audit Logs', roles: ['admin'] },
  ];

  const canAccess = (roles: string[]) => {
    return roles.includes(user?.role || '');
  };

  return (
    <aside className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">SafeShare</span>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => {
            if (!canAccess(item.roles)) return null;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;