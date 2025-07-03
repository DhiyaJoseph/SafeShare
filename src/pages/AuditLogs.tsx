import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar, 
  User, 
  FileText, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  details: string;
  riskLevel: 'low' | 'medium' | 'high';
  location?: string;
}

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('7days');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  useEffect(() => {
    // Mock audit log data
    const mockLogs: AuditLog[] = [
      {
        id: '1',
        timestamp: '2024-01-15T10:30:00Z',
        userId: '1',
        userName: 'John Doe',
        action: 'FILE_UPLOAD',
        resource: 'quarterly-report.pdf',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        success: true,
        details: 'Successfully uploaded encrypted file',
        riskLevel: 'low',
        location: 'New York, US'
      },
      {
        id: '2',
        timestamp: '2024-01-15T10:25:00Z',
        userId: '2',
        userName: 'Sarah Wilson',
        action: 'LOGIN_ATTEMPT',
        resource: 'Authentication System',
        ipAddress: '192.168.1.105',
        userAgent: 'Mozilla/5.0 (macOS; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        success: false,
        details: 'Failed login attempt - incorrect password',
        riskLevel: 'medium',
        location: 'San Francisco, US'
      },
      {
        id: '3',
        timestamp: '2024-01-15T10:20:00Z',
        userId: '3',
        userName: 'Mike Johnson',
        action: 'FILE_DOWNLOAD',
        resource: 'project-specs.docx',
        ipAddress: '10.0.0.15',
        userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36',
        success: true,
        details: 'File downloaded and decrypted successfully',
        riskLevel: 'low',
        location: 'London, UK'
      },
      {
        id: '4',
        timestamp: '2024-01-15T10:15:00Z',
        userId: 'unknown',
        userName: 'Unknown User',
        action: 'THREAT_DETECTED',
        resource: 'malicious-file.exe',
        ipAddress: '203.0.113.5',
        userAgent: 'curl/7.68.0',
        success: false,
        details: 'Malicious file upload blocked by threat detection',
        riskLevel: 'high',
        location: 'Unknown'
      },
      {
        id: '5',
        timestamp: '2024-01-15T10:10:00Z',
        userId: '1',
        userName: 'John Doe',
        action: 'USER_CREATED',
        resource: 'emma@safeshare.com',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        success: true,
        details: 'New user account created with role: user',
        riskLevel: 'low',
        location: 'New York, US'
      },
      {
        id: '6',
        timestamp: '2024-01-15T10:05:00Z',
        userId: '4',
        userName: 'Emma Davis',
        action: 'PASSWORD_CHANGE',
        resource: 'User Account',
        ipAddress: '192.168.1.110',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
        success: true,
        details: 'Password changed successfully with strong security requirements',
        riskLevel: 'low',
        location: 'Chicago, US'
      },
      {
        id: '7',
        timestamp: '2024-01-15T09:55:00Z',
        userId: '2',
        userName: 'Sarah Wilson',
        action: 'FILE_SHARE',
        resource: 'budget-2024.xlsx',
        ipAddress: '192.168.1.105',
        userAgent: 'Mozilla/5.0 (macOS; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        success: true,
        details: 'File shared with external user via secure link',
        riskLevel: 'medium',
        location: 'San Francisco, US'
      },
      {
        id: '8',
        timestamp: '2024-01-15T09:50:00Z',
        userId: '1',
        userName: 'John Doe',
        action: 'SECURITY_SETTINGS_CHANGE',
        resource: 'System Configuration',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        success: true,
        details: 'Updated password policy requirements',
        riskLevel: 'medium',
        location: 'New York, US'
      }
    ];
    setLogs(mockLogs);
  }, []);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'FILE_UPLOAD':
      case 'FILE_DOWNLOAD':
      case 'FILE_SHARE':
        return <FileText className="h-4 w-4" />;
      case 'LOGIN_ATTEMPT':
      case 'PASSWORD_CHANGE':
        return <User className="h-4 w-4" />;
      case 'THREAT_DETECTED':
        return <AlertTriangle className="h-4 w-4" />;
      case 'USER_CREATED':
      case 'SECURITY_SETTINGS_CHANGE':
        return <Shield className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string, success: boolean) => {
    if (!success) return 'text-red-600 bg-red-50';
    
    switch (action) {
      case 'THREAT_DETECTED':
        return 'text-red-600 bg-red-50';
      case 'LOGIN_ATTEMPT':
        return 'text-blue-600 bg-blue-50';
      case 'FILE_UPLOAD':
      case 'FILE_DOWNLOAD':
        return 'text-green-600 bg-green-50';
      case 'FILE_SHARE':
        return 'text-yellow-600 bg-yellow-50';
      case 'SECURITY_SETTINGS_CHANGE':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.ipAddress.includes(searchTerm);
    
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesRisk = riskFilter === 'all' || log.riskLevel === riskFilter;
    
    // Date filter logic
    const now = new Date();
    const logDate = new Date(log.timestamp);
    let matchesDate = true;
    
    switch (dateFilter) {
      case '24hours':
        matchesDate = (now.getTime() - logDate.getTime()) <= (24 * 60 * 60 * 1000);
        break;
      case '7days':
        matchesDate = (now.getTime() - logDate.getTime()) <= (7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        matchesDate = (now.getTime() - logDate.getTime()) <= (30 * 24 * 60 * 60 * 1000);
        break;
    }
    
    return matchesSearch && matchesAction && matchesRisk && matchesDate;
  });

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Resource', 'IP Address', 'Success', 'Risk Level', 'Details'],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.userName,
        log.action,
        log.resource,
        log.ipAddress,
        log.success ? 'Yes' : 'No',
        log.riskLevel,
        log.details
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600 mt-1">Monitor system activity and security events</p>
        </div>
        <button
          onClick={exportLogs}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export Logs</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Security Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{logs.filter(l => l.riskLevel === 'high').length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Failed Actions</p>
              <p className="text-2xl font-bold text-gray-900">{logs.filter(l => !l.success).length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((logs.filter(l => l.success).length / logs.length) * 100)}%
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Actions</option>
              <option value="FILE_UPLOAD">File Upload</option>
              <option value="FILE_DOWNLOAD">File Download</option>
              <option value="FILE_SHARE">File Share</option>
              <option value="LOGIN_ATTEMPT">Login Attempt</option>
              <option value="THREAT_DETECTED">Threat Detected</option>
              <option value="USER_CREATED">User Created</option>
              <option value="PASSWORD_CHANGE">Password Change</option>
              <option value="SECURITY_SETTINGS_CHANGE">Security Settings</option>
            </select>
          </div>
          
          <div>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
          
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="24hours">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => {
                const timestamp = formatTimestamp(log.timestamp);
                return (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getActionColor(log.action, log.success)}`}>
                          {getActionIcon(log.action)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {log.action.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                          <div className="flex items-center space-x-2">
                            {log.success ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <AlertTriangle className="h-3 w-3 text-red-500" />
                            )}
                            <span className={`text-xs ${log.success ? 'text-green-600' : 'text-red-600'}`}>
                              {log.success ? 'Success' : 'Failed'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                        <div className="text-sm text-gray-500">{log.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{log.resource}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">{log.ipAddress}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRiskLevelColor(log.riskLevel)}`}>
                        {log.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{timestamp.date}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {timestamp.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => setShowDetails(showDetails === log.id ? null : log.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              {(() => {
                const log = logs.find(l => l.id === showDetails);
                if (!log) return null;
                
                return (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Event Details</h3>
                      <button
                        onClick={() => setShowDetails(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Event ID</label>
                          <p className="text-sm text-gray-900 font-mono">{log.id}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                          <p className="text-sm text-gray-900">{new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">User</label>
                          <p className="text-sm text-gray-900">{log.userName} ({log.userId})</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Action</label>
                          <p className="text-sm text-gray-900">{log.action}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Resource</label>
                          <p className="text-sm text-gray-900">{log.resource}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">IP Address</label>
                          <p className="text-sm text-gray-900 font-mono">{log.ipAddress}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Location</label>
                          <p className="text-sm text-gray-900">{log.location}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Risk Level</label>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRiskLevelColor(log.riskLevel)}`}>
                            {log.riskLevel}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">User Agent</label>
                        <p className="text-sm text-gray-900 font-mono break-all">{log.userAgent}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Details</label>
                        <p className="text-sm text-gray-900">{log.details}</p>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;