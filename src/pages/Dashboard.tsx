import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  FileText, 
  Users, 
  Shield, 
  Activity, 
  Upload, 
  Download, 
  AlertTriangle,
  TrendingUp,
  Clock
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalUsers: 0,
    securityAlerts: 0,
    storageUsed: 0,
    recentActivity: [],
    threatDetections: 0
  });

  useEffect(() => {
    // Simulate API call for dashboard data
    const mockStats = {
      totalFiles: 1247,
      totalUsers: 89,
      securityAlerts: 3,
      storageUsed: 75,
      recentActivity: [
        { id: 1, user: 'John Doe', action: 'Uploaded file', file: 'quarterly-report.pdf', time: '2 minutes ago' },
        { id: 2, user: 'Sarah Wilson', action: 'Shared file', file: 'project-specs.docx', time: '5 minutes ago' },
        { id: 3, user: 'Mike Johnson', action: 'Downloaded file', file: 'budget-2024.xlsx', time: '10 minutes ago' },
        { id: 4, user: 'Emma Davis', action: 'Created folder', file: 'Marketing Assets', time: '15 minutes ago' },
      ],
      threatDetections: 7
    };
    setStats(mockStats);
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'from-red-500 to-red-600';
      case 'manager': return 'from-blue-500 to-blue-600';
      case 'user': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const quickActions = [
    { icon: Upload, label: 'Upload Files', color: 'from-blue-500 to-blue-600' },
    { icon: Users, label: 'Manage Users', color: 'from-purple-500 to-purple-600', adminOnly: true },
    { icon: Shield, label: 'Security Settings', color: 'from-green-500 to-green-600' },
    { icon: Activity, label: 'View Audit Logs', color: 'from-yellow-500 to-yellow-600', adminOnly: true },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your secure workspace today.
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getRoleColor(user?.role || '')} text-white font-semibold`}>
            {user?.role?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Files</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalFiles.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600 text-sm">+12% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600 text-sm">+5% from last week</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Security Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.securityAlerts}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-red-600 text-sm">Requires attention</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900">{stats.storageUsed}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.storageUsed}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            if (action.adminOnly && user?.role !== 'admin' && user?.role !== 'manager') {
              return null;
            }
            
            return (
              <button
                key={index}
                className={`p-4 rounded-lg bg-gradient-to-r ${action.color} text-white hover:shadow-lg transition-all transform hover:scale-105`}
              >
                <action.icon className="h-6 w-6 mb-2" />
                <span className="block font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Threat Detection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {stats.recentActivity.map((activity: any) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.user} {activity.action}
                  </p>
                  <p className="text-xs text-gray-600">{activity.file}</p>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">System Status</span>
              </div>
              <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">Secure</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Threats Detected</span>
              </div>
              <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                {stats.threatDetections} Today
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Download className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Last Backup</span>
              </div>
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;