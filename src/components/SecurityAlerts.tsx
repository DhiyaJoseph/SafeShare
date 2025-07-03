import React from 'react';
import { useSecurity } from '../contexts/SecurityContext';
import { AlertTriangle, Info, X } from 'lucide-react';

const SecurityAlerts: React.FC = () => {
  const { alerts, removeAlert } = useSecurity();

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-lg shadow-lg border flex items-center space-x-3 max-w-md ${
            alert.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          {alert.type === 'error' ? (
            <AlertTriangle className="h-5 w-5 text-red-600" />
          ) : alert.type === 'warning' ? (
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          ) : (
            <Info className="h-5 w-5 text-blue-600" />
          )}
          <span className="flex-1 text-sm">{alert.message}</span>
          <button
            onClick={() => removeAlert(alert.id)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default SecurityAlerts;