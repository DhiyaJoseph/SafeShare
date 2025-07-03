import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive, 
  Download, 
  Share2, 
  Trash2, 
  Search,
  Filter,
  Grid,
  List,
  Lock,
  Shield,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useSecurity } from '../contexts/SecurityContext';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadDate: string;
  isEncrypted: boolean;
  threatStatus: 'safe' | 'warning' | 'danger';
  shared: boolean;
  downloads: number;
}

const FileManager: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploading, setUploading] = useState(false);
  const { addAlert } = useSecurity();

  useEffect(() => {
    // Mock file data
    const mockFiles: FileItem[] = [
      {
        id: '1',
        name: 'quarterly-report.pdf',
        type: 'pdf',
        size: 2547000,
        uploadedBy: 'John Doe',
        uploadDate: '2024-01-15T10:30:00Z',
        isEncrypted: true,
        threatStatus: 'safe',
        shared: false,
        downloads: 5
      },
      {
        id: '2',
        name: 'project-mockup.png',
        type: 'image',
        size: 1024000,
        uploadedBy: 'Sarah Wilson',
        uploadDate: '2024-01-14T14:22:00Z',
        isEncrypted: true,
        threatStatus: 'safe',
        shared: true,
        downloads: 12
      },
      {
        id: '3',
        name: 'suspicious-file.exe',
        type: 'executable',
        size: 3045000,
        uploadedBy: 'Unknown',
        uploadDate: '2024-01-13T09:15:00Z',
        isEncrypted: false,
        threatStatus: 'danger',
        shared: false,
        downloads: 0
      },
      {
        id: '4',
        name: 'presentation.pptx',
        type: 'presentation',
        size: 5120000,
        uploadedBy: 'Mike Johnson',
        uploadDate: '2024-01-12T16:45:00Z',
        isEncrypted: true,
        threatStatus: 'safe',
        shared: true,
        downloads: 8
      }
    ];
    setFiles(mockFiles);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'doc':
      case 'docx':
        return <FileText className="h-6 w-6" />;
      case 'image':
      case 'jpg':
      case 'png':
      case 'gif':
        return <Image className="h-6 w-6" />;
      case 'video':
      case 'mp4':
      case 'avi':
        return <Video className="h-6 w-6" />;
      case 'audio':
      case 'mp3':
      case 'wav':
        return <Music className="h-6 w-6" />;
      case 'zip':
      case 'rar':
        return <Archive className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  const getThreatStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'danger': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getThreatStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      case 'danger': return <AlertCircle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    // Simulate threat detection
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.vbs'];
    const isSuspicious = suspiciousExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (isSuspicious) {
      addAlert({
        type: 'warning',
        message: `Suspicious file detected: ${file.name}. Upload blocked for security.`
      });
      setUploading(false);
      return;
    }

    // Simulate upload process
    setTimeout(() => {
      const newFile: FileItem = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type.split('/')[0] || 'unknown',
        size: file.size,
        uploadedBy: 'Current User',
        uploadDate: new Date().toISOString(),
        isEncrypted: true,
        threatStatus: 'safe',
        shared: false,
        downloads: 0
      };

      setFiles(prev => [newFile, ...prev]);
      addAlert({
        type: 'info',
        message: `File "${file.name}" uploaded successfully with AES-256 encryption.`
      });
      setUploading(false);
    }, 2000);
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || file.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">File Manager</h1>
        <div className="flex items-center space-x-2">
          <label className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            <Upload className="h-4 w-4 mr-2 inline" />
            {uploading ? 'Uploading...' : 'Upload File'}
            <input
              type="file"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Files</option>
              <option value="pdf">PDF</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
            </select>
          </div>
          <div className="flex items-center space-x-1 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* File Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <div key={file.id} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getFileIcon(file.type)}
                  {file.isEncrypted && <Lock className="h-4 w-4 text-green-600" />}
                </div>
                <div className={`flex items-center space-x-1 ${getThreatStatusColor(file.threatStatus)}`}>
                  {getThreatStatusIcon(file.threatStatus)}
                  <Shield className="h-4 w-4" />
                </div>
              </div>
              
              <h3 className="font-medium text-gray-900 mb-2 truncate" title={file.name}>
                {file.name}
              </h3>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p>Size: {formatFileSize(file.size)}</p>
                <p>By: {file.uploadedBy}</p>
                <p>Downloads: {file.downloads}</p>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-800">
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {file.shared && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Shared
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getFileIcon(file.type)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{file.name}</div>
                          <div className="flex items-center space-x-2">
                            {file.isEncrypted && <Lock className="h-3 w-3 text-green-600" />}
                            {file.shared && <Share2 className="h-3 w-3 text-blue-600" />}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {file.uploadedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center space-x-1 ${getThreatStatusColor(file.threatStatus)}`}>
                        {getThreatStatusIcon(file.threatStatus)}
                        <span className="text-sm capitalize">{file.threatStatus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          <Share2 className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;