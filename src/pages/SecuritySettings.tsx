import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Key, 
  AlertTriangle, 
  CheckCircle, 
  Settings, 
  Eye, 
  EyeOff,
  Save,
  RefreshCw
} from 'lucide-react';

const SecuritySettings: React.FC = () => {
  const [passwordSettings, setPasswordSettings] = useState({
    minLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAttempts: 3,
    lockoutDuration: 30
  });

  const [encryptionSettings, setEncryptionSettings] = useState({
    algorithm: 'AES-256',
    keyRotationDays: 90,
    backupEncryption: true
  });

  const [threatDetection, setThreatDetection] = useState({
    scanUploads: true,
    blockExecutables: true,
    quarantineThreats: true,
    emailAlerts: true
  });

  const [auditSettings, setAuditSettings] = useState({
    logLevel: 'detailed',
    retentionDays: 365,
    realTimeMonitoring: true
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Settings saved successfully!');
  };

  const generateNewApiKey = () => {
    const newKey = 'sk-' + Math.random().toString(36).substr(2, 40);
    alert(`New API key generated: ${newKey}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>

      {/* Password Policy */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Lock className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Password Policy</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Length
            </label>
            <input
              type="number"
              min="6"
              max="32"
              value={passwordSettings.minLength}
              onChange={(e) => setPasswordSettings({
                ...passwordSettings,
                minLength: parseInt(e.target.value)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Login Attempts
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={passwordSettings.maxAttempts}
              onChange={(e) => setPasswordSettings({
                ...passwordSettings,
                maxAttempts: parseInt(e.target.value)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-4 space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={passwordSettings.requireUppercase}
              onChange={(e) => setPasswordSettings({
                ...passwordSettings,
                requireUppercase: e.target.checked
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Require uppercase letters</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={passwordSettings.requireNumbers}
              onChange={(e) => setPasswordSettings({
                ...passwordSettings,
                requireNumbers: e.target.checked
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Require numbers</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={passwordSettings.requireSpecialChars}
              onChange={(e) => setPasswordSettings({
                ...passwordSettings,
                requireSpecialChars: e.target.checked
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Require special characters</span>
          </label>
        </div>
      </div>

      {/* Encryption Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">Encryption Settings</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Encryption Algorithm
            </label>
            <select
              value={encryptionSettings.algorithm}
              onChange={(e) => setEncryptionSettings({
                ...encryptionSettings,
                algorithm: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="AES-256">AES-256</option>
              <option value="AES-192">AES-192</option>
              <option value="AES-128">AES-128</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Rotation (days)
            </label>
            <input
              type="number"
              min="30"
              max="365"
              value={encryptionSettings.keyRotationDays}
              onChange={(e) => setEncryptionSettings({
                ...encryptionSettings,
                keyRotationDays: parseInt(e.target.value)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={encryptionSettings.backupEncryption}
              onChange={(e) => setEncryptionSettings({
                ...encryptionSettings,
                backupEncryption: e.target.checked
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Encrypt backups</span>
          </label>
        </div>
      </div>

      {/* Threat Detection */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <h2 className="text-lg font-semibold text-gray-900">Threat Detection</h2>
        </div>
        
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={threatDetection.scanUploads}
              onChange={(e) => setThreatDetection({
                ...threatDetection,
                scanUploads: e.target.checked
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Scan uploaded files for threats</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={threatDetection.blockExecutables}
              onChange={(e) => setThreatDetection({
                ...threatDetection,
                blockExecutables: e.target.checked
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Block executable files</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={threatDetection.quarantineThreats}
              onChange={(e) => setThreatDetection({
                ...threatDetection,
                quarantineThreats: e.target.checked
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Quarantine detected threats</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={threatDetection.emailAlerts}
              onChange={(e) => setThreatDetection({
                ...threatDetection,
                emailAlerts: e.target.checked
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Send email alerts for threats</span>
          </label>
        </div>
      </div>

      {/* Audit Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">Audit & Logging</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Log Level
            </label>
            <select
              value={auditSettings.logLevel}
              onChange={(e) => setAuditSettings({
                ...auditSettings,
                logLevel: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="basic">Basic</option>
              <option value="detailed">Detailed</option>
              <option value="verbose">Verbose</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retention Period (days)
            </label>
            <input
              type="number"
              min="30"
              max="2555"
              value={auditSettings.retentionDays}
              onChange={(e) => setAuditSettings({
                ...auditSettings,
                retentionDays: parseInt(e.target.value)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={auditSettings.realTimeMonitoring}
              onChange={(e) => setAuditSettings({
                ...auditSettings,
                realTimeMonitoring: e.target.checked
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enable real-time monitoring</span>
          </label>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Key className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">API Keys</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current API Key
            </label>
            <div className="flex items-center space-x-2">
              <input
                type={showApiKey ? 'text' : 'password'}
                value="sk-1234567890abcdef1234567890abcdef12345678"
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                {showApiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              <button
                onClick={generateNewApiKey}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Regenerate</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Status */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">Security Status</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">SSL/TLS Encryption</p>
              <p className="text-xs text-green-600">Active</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">File Encryption</p>
              <p className="text-xs text-green-600">AES-256 Enabled</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">Threat Detection</p>
              <p className="text-xs text-green-600">Active</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">Audit Logging</p>
              <p className="text-xs text-green-600">Enabled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;