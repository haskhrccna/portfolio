import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download, Upload, Database, FileJson, Image as ImageIcon,
  CheckCircle2, AlertCircle, RefreshCw, Archive
} from "lucide-react";
import { toast } from "sonner";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface BackupData {
  backup_date: string;
  certification_images: any[];
  profile_images: any[];
  asset_images: any[];
}

interface StorageFile {
  bucket: string;
  file_path: string;
  file_size: number;
  public_url: string;
}

export const BackupRestore = () => {
  const [backupData, setBackupData] = useState<BackupData | null>(null);
  const [downloading, setDownloading] = useState(false);

  // Fetch storage file list
  const { data: storageFiles, isLoading: filesLoading } = useQuery({
    queryKey: ['storage-files'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('list_all_storage_files');
      if (error) throw error;
      return data as StorageFile[];
    }
  });

  // Create backup mutation
  const createBackupMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('backup_all_images');
      if (error) throw error;
      return data as BackupData;
    },
    onSuccess: (data) => {
      setBackupData(data);
      toast.success("Backup created successfully!");
    },
    onError: (error: any) => {
      toast.error(`Backup failed: ${error.message}`);
    }
  });

  const downloadBackupJSON = () => {
    if (!backupData) {
      toast.error("No backup data available");
      return;
    }

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Backup JSON downloaded!");
  };

  const downloadFileList = () => {
    if (!storageFiles || storageFiles.length === 0) {
      toast.error("No storage files found");
      return;
    }

    // Create CSV content
    const headers = ['Bucket', 'File Path', 'Size (bytes)', 'Public URL'];
    const csvRows = [
      headers.join(','),
      ...storageFiles.map(file => [
        file.bucket,
        file.file_path,
        file.file_size,
        file.public_url || ''
      ].join(','))
    ];
    const csvString = csvRows.join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `storage-files-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("File list downloaded!");
  };

  const downloadAllImages = async () => {
    if (!storageFiles || storageFiles.length === 0) {
      toast.error("No images to download");
      return;
    }

    setDownloading(true);
    toast.info("Starting download of all images. This may take a while...");

    let successCount = 0;
    let failCount = 0;

    for (const file of storageFiles) {
      try {
        const response = await fetch(file.public_url);
        if (!response.ok) throw new Error('Download failed');

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${file.bucket}-${file.file_path}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        successCount++;
        // Add small delay to avoid overwhelming the browser
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Failed to download ${file.file_path}:`, error);
        failCount++;
      }
    }

    setDownloading(false);
    toast.success(`Downloaded ${successCount} images successfully. ${failCount} failed.`);
  };

  const handleRestoreBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setBackupData(data);
        toast.success("Backup file loaded successfully!");
        toast.info("Review the data and use SQL to restore if needed");
      } catch (error) {
        toast.error("Invalid backup file format");
      }
    };
    reader.readAsText(file);
  };

  const getTotalImageCount = () => {
    if (!backupData) return 0;
    return (
      (backupData.certification_images?.length || 0) +
      (backupData.profile_images?.length || 0) +
      (backupData.asset_images?.length || 0)
    );
  };

  const getTotalStorageSize = () => {
    if (!storageFiles) return 0;
    return storageFiles.reduce((sum, file) => sum + file.file_size, 0);
  };

  return (
    <div className="space-y-6">
      {/* Backup Information */}
      <Alert className="glass border-blue-500/50">
        <Database className="h-4 w-4" />
        <AlertTitle className="text-white">About Backup & Restore</AlertTitle>
        <AlertDescription className="text-white/80">
          Create backups of your image metadata (database records) and file lists.
          Images are stored in Supabase Storage and can be downloaded individually or in bulk.
          Restore operations should be performed through SQL Editor for safety.
        </AlertDescription>
      </Alert>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <ImageIcon className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {storageFiles?.length || 0}
                </p>
                <p className="text-sm text-white/60">Total Files</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Archive className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {(getTotalStorageSize() / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-sm text-white/60">Total Size</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Database className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {getTotalImageCount()}
                </p>
                <p className="text-sm text-white/60">Database Records</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup Actions */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Download className="h-5 w-5" />
            Create Backup
          </CardTitle>
          <CardDescription className="text-white/70">
            Download your image metadata and file lists for safekeeping
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => createBackupMutation.mutate()}
              disabled={createBackupMutation.isPending}
              className="w-full"
            >
              {createBackupMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Creating Backup...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Create Database Backup
                </>
              )}
            </Button>

            <Button
              onClick={downloadBackupJSON}
              disabled={!backupData}
              variant="outline"
              className="w-full bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              <FileJson className="h-4 w-4 mr-2" />
              Download Backup JSON
            </Button>

            <Button
              onClick={downloadFileList}
              disabled={!storageFiles || storageFiles.length === 0}
              variant="outline"
              className="w-full bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              <Download className="h-4 w-4 mr-2" />
              Download File List (CSV)
            </Button>

            <Button
              onClick={downloadAllImages}
              disabled={!storageFiles || storageFiles.length === 0 || downloading}
              variant="outline"
              className="w-full bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              {downloading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Download All Images
                </>
              )}
            </Button>
          </div>

          {backupData && (
            <Alert className="glass border-green-500/50">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <AlertTitle className="text-white">Backup Ready</AlertTitle>
              <AlertDescription className="text-white/80">
                Backup created at {new Date(backupData.backup_date).toLocaleString()}.
                Contains {getTotalImageCount()} image records.
                Click "Download Backup JSON" to save it.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Restore Actions */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Restore from Backup
          </CardTitle>
          <CardDescription className="text-white/70">
            Load a backup file to review its contents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <input
              type="file"
              accept=".json"
              onChange={handleRestoreBackup}
              className="hidden"
              id="restore-file"
            />
            <label htmlFor="restore-file">
              <Button
                variant="outline"
                className="w-full bg-white/10 text-white hover:bg-white/20 border-white/20"
                asChild
              >
                <span>
                  <FileJson className="h-4 w-4 mr-2" />
                  Load Backup File
                </span>
              </Button>
            </label>
          </div>

          <Alert className="glass border-yellow-500/50">
            <AlertCircle className="h-4 w-4 text-yellow-400" />
            <AlertTitle className="text-white">Restore Instructions</AlertTitle>
            <AlertDescription className="text-white/80 space-y-2">
              <p>To restore data:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Load your backup JSON file above</li>
                <li>Review the data in the preview below</li>
                <li>Go to Supabase SQL Editor</li>
                <li>Use INSERT statements to restore records</li>
                <li>Re-upload image files to Storage if needed</li>
              </ol>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Backup Preview */}
      {backupData && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              Backup Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Certifications</span>
                    <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-400/50">
                      {backupData.certification_images?.length || 0}
                    </Badge>
                  </div>
                  <p className="text-white/60 text-sm">Certificate badges</p>
                </div>

                <div className="glass p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Profile Images</span>
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-400/50">
                      {backupData.profile_images?.length || 0}
                    </Badge>
                  </div>
                  <p className="text-white/60 text-sm">Profile photos</p>
                </div>

                <div className="glass p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Assets</span>
                    <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-400/50">
                      {backupData.asset_images?.length || 0}
                    </Badge>
                  </div>
                  <p className="text-white/60 text-sm">Logos and icons</p>
                </div>
              </div>

              <div className="bg-black/40 p-4 rounded-lg max-h-96 overflow-auto">
                <pre className="text-white/80 text-xs">
                  {JSON.stringify(backupData, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Storage File List */}
      {storageFiles && storageFiles.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Storage Files ({storageFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-auto">
              {storageFiles.map((file, index) => (
                <div
                  key={index}
                  className="glass p-3 rounded-lg flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {file.file_path}
                    </p>
                    <p className="text-white/60 text-xs">
                      {file.bucket} • {(file.file_size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(file.public_url, '_blank')}
                    className="ml-4 bg-white/10 text-white hover:bg-white/20 border-white/20"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
