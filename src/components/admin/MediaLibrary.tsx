import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload, Trash2, Image as ImageIcon, Eye, EyeOff,
  Database, RefreshCw, CheckCircle2, Award, User, Boxes, Camera
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BucketType = 'certifications' | 'profile' | 'assets' | 'project-photos';

interface CertificationImage {
  id: string;
  title: string;
  date: string;
  storage_path: string;
  public_url: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
}

interface ProfileImage {
  id: string;
  title: string;
  storage_path: string;
  public_url: string;
  is_primary: boolean;
  is_active: boolean;
}

interface AssetImage {
  id: string;
  title: string;
  category: string;
  storage_path: string;
  public_url: string;
  is_active: boolean;
}

interface StorageStats {
  bucket_id: string;
  file_count: number;
  total_size_mb: number;
}

export const MediaLibrary = () => {
  const queryClient = useQueryClient();
  const [selectedBucket, setSelectedBucket] = useState<BucketType>('certifications');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form fields for certifications
  const [certTitle, setCertTitle] = useState("");
  const [certDate, setCertDate] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  // Form fields for profile
  const [profileTitle, setProfileTitle] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  // Form fields for assets
  const [assetTitle, setAssetTitle] = useState("");
  const [assetCategory, setAssetCategory] = useState("");

  // Fetch storage statistics
  const { data: storageStats } = useQuery({
    queryKey: ['storage-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_storage_stats');
      if (error) throw error;
      return data as StorageStats[];
    }
  });

  // Fetch certification images
  const { data: certifications, isLoading: certLoading } = useQuery({
    queryKey: ['certification-images-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certification_images')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as CertificationImage[];
    },
    enabled: selectedBucket === 'certifications'
  });

  // Fetch profile images
  const { data: profileImages, isLoading: profileLoading } = useQuery({
    queryKey: ['profile-images-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profile_images')
        .select('*');
      if (error) throw error;
      return data as ProfileImage[];
    },
    enabled: selectedBucket === 'profile'
  });

  // Fetch asset images
  const { data: assetImages, isLoading: assetsLoading } = useQuery({
    queryKey: ['asset-images-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('asset_images')
        .select('*');
      if (error) throw error;
      return data as AssetImage[];
    },
    enabled: selectedBucket === 'assets'
  });

  const uploadCertificationMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) throw new Error("No file selected");
      setUploading(true);

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('certifications')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('certifications')
        .getPublicUrl(fileName);

      const maxOrder = certifications?.length ? Math.max(...certifications.map(c => c.display_order)) : 0;

      const { error: dbError } = await supabase
        .from('certification_images')
        .insert([{
          title: certTitle,
          date: certDate,
          storage_path: fileName,
          public_url: publicUrl,
          is_featured: isFeatured,
          display_order: maxOrder + 1,
          is_active: true
        }]);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certification-images-admin'] });
      queryClient.invalidateQueries({ queryKey: ['certifications'] }); // For frontend
      resetForm();
      toast.success("Certification uploaded successfully!");
    },
    onError: (error: any) => {
      setUploading(false);
      toast.error(`Upload failed: ${error.message}`);
    }
  });

  const uploadProfileMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) throw new Error("No file selected");
      setUploading(true);

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `profile-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('profile_images')
        .insert([{
          title: profileTitle,
          storage_path: fileName,
          public_url: publicUrl,
          is_primary: isPrimary,
          is_active: true
        }]);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile-images-admin'] });
      resetForm();
      toast.success("Profile image uploaded successfully!");
    },
    onError: (error: any) => {
      setUploading(false);
      toast.error(`Upload failed: ${error.message}`);
    }
  });

  const uploadAssetMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) throw new Error("No file selected");
      setUploading(true);

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${assetCategory}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('asset_images')
        .insert([{
          title: assetTitle,
          category: assetCategory,
          storage_path: fileName,
          public_url: publicUrl,
          is_active: true
        }]);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset-images-admin'] });
      resetForm();
      toast.success("Asset uploaded successfully!");
    },
    onError: (error: any) => {
      setUploading(false);
      toast.error(`Upload failed: ${error.message}`);
    }
  });

  const deleteCertificationMutation = useMutation({
    mutationFn: async ({ id, storagePath }: { id: string; storagePath: string }) => {
      const { error: storageError } = await supabase.storage
        .from('certifications')
        .remove([storagePath]);

      if (storageError) console.error("Storage delete error:", storageError);

      const { error: dbError } = await supabase
        .from('certification_images')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certification-images-admin'] });
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      toast.success("Certification deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete certification");
    }
  });

  const toggleCertificationActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('certification_images')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certification-images-admin'] });
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      toast.success("Certification visibility updated");
    },
    onError: () => {
      toast.error("Failed to update certification");
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      const url = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    switch (selectedBucket) {
      case 'certifications':
        if (!certTitle || !certDate) {
          toast.error("Title and date are required for certifications");
          return;
        }
        uploadCertificationMutation.mutate();
        break;
      case 'profile':
        if (!profileTitle) {
          toast.error("Title is required for profile images");
          return;
        }
        uploadProfileMutation.mutate();
        break;
      case 'assets':
        if (!assetTitle || !assetCategory) {
          toast.error("Title and category are required for assets");
          return;
        }
        uploadAssetMutation.mutate();
        break;
      default:
        toast.error("Project photos should be managed in the Gallery tab");
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCertTitle("");
    setCertDate("");
    setIsFeatured(false);
    setProfileTitle("");
    setIsPrimary(false);
    setAssetTitle("");
    setAssetCategory("");
    setUploading(false);
  };

  const getBucketIcon = (bucket: BucketType) => {
    switch (bucket) {
      case 'certifications': return <Award className="h-4 w-4" />;
      case 'profile': return <User className="h-4 w-4" />;
      case 'assets': return <Boxes className="h-4 w-4" />;
      case 'project-photos': return <Camera className="h-4 w-4" />;
    }
  };

  const getBucketStats = (bucketId: string) => {
    return storageStats?.find(s => s.bucket_id === bucketId);
  };

  return (
    <div className="space-y-6">
      {/* Storage Statistics */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="h-5 w-5" />
            Storage Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(['certifications', 'profile', 'assets', 'project-photos'] as BucketType[]).map(bucket => {
              const stats = getBucketStats(bucket);
              return (
                <div key={bucket} className="glass p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-white">
                    {getBucketIcon(bucket)}
                    <span className="font-medium capitalize">{bucket.replace('-', ' ')}</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-300">
                    {stats?.file_count || 0} files
                  </div>
                  <div className="text-sm text-white/60">
                    {stats?.total_size_mb?.toFixed(2) || '0.00'} MB
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Media
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Storage Bucket</Label>
            <Select value={selectedBucket} onValueChange={(v) => setSelectedBucket(v as BucketType)}>
              <SelectTrigger className="bg-white/10 text-white border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="certifications">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Certifications
                  </div>
                </SelectItem>
                <SelectItem value="profile">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </div>
                </SelectItem>
                <SelectItem value="assets">
                  <div className="flex items-center gap-2">
                    <Boxes className="h-4 w-4" />
                    Assets
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-white/60 text-xs">Note: Project photos should be managed in the Gallery tab</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Image File *</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="bg-white/10 text-white border-white/20 file:bg-white/20 file:text-white file:border-0"
                />
                <p className="text-white/60 text-xs">Max size: 5MB. Formats: JPG, PNG, WebP</p>
              </div>

              {selectedBucket === 'certifications' && (
                <>
                  <div className="space-y-2">
                    <Label className="text-white">Certification Title *</Label>
                    <Input
                      value={certTitle}
                      onChange={(e) => setCertTitle(e.target.value)}
                      placeholder="e.g., AWS Certified Solutions Architect"
                      className="bg-white/10 text-white border-white/20 placeholder:text-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Date Obtained *</Label>
                    <Input
                      value={certDate}
                      onChange={(e) => setCertDate(e.target.value)}
                      placeholder="e.g., October 2025"
                      className="bg-white/10 text-white border-white/20 placeholder:text-white/40"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded border-white/20"
                    />
                    <Label htmlFor="featured" className="text-white text-sm">
                      Featured certification (larger display)
                    </Label>
                  </div>
                </>
              )}

              {selectedBucket === 'profile' && (
                <>
                  <div className="space-y-2">
                    <Label className="text-white">Image Title *</Label>
                    <Input
                      value={profileTitle}
                      onChange={(e) => setProfileTitle(e.target.value)}
                      placeholder="e.g., Professional Headshot 2025"
                      className="bg-white/10 text-white border-white/20 placeholder:text-white/40"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="primary"
                      checked={isPrimary}
                      onChange={(e) => setIsPrimary(e.target.checked)}
                      className="rounded border-white/20"
                    />
                    <Label htmlFor="primary" className="text-white text-sm">
                      Set as primary profile photo
                    </Label>
                  </div>
                </>
              )}

              {selectedBucket === 'assets' && (
                <>
                  <div className="space-y-2">
                    <Label className="text-white">Asset Title *</Label>
                    <Input
                      value={assetTitle}
                      onChange={(e) => setAssetTitle(e.target.value)}
                      placeholder="e.g., Company Logo"
                      className="bg-white/10 text-white border-white/20 placeholder:text-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Category *</Label>
                    <Select value={assetCategory} onValueChange={setAssetCategory}>
                      <SelectTrigger className="bg-white/10 text-white border-white/20">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="logo">Logo</SelectItem>
                        <SelectItem value="icon">Icon</SelectItem>
                        <SelectItem value="background">Background</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Upload to {selectedBucket}
                  </>
                )}
              </Button>
            </div>

            {previewUrl && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Image Preview</Label>
                  <div className="relative h-64 rounded-lg overflow-hidden border-2 border-white/20">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-contain bg-black/20"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Media Gallery by Bucket */}
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Manage Media
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => queryClient.invalidateQueries()}
              className="bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="certifications" className="space-y-4">
            <TabsList className="glass w-full grid grid-cols-3 gap-2">
              <TabsTrigger value="certifications" className="data-[state=active]:bg-white/20">
                <Award className="h-4 w-4 mr-2" />
                Certifications
              </TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-white/20">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="assets" className="data-[state=active]:bg-white/20">
                <Boxes className="h-4 w-4 mr-2" />
                Assets
              </TabsTrigger>
            </TabsList>

            {/* Certifications Gallery */}
            <TabsContent value="certifications">
              {certLoading ? (
                <div className="text-center py-12 text-white">Loading certifications...</div>
              ) : !certifications || certifications.length === 0 ? (
                <div className="text-center py-12 text-white/60">
                  <Award className="h-16 w-16 mx-auto mb-4 opacity-40" />
                  <p>No certifications yet. Upload your first certification above!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className={`relative group rounded-lg overflow-hidden border-2 ${
                        cert.is_active ? 'border-green-500/50' : 'border-red-500/50'
                      }`}
                    >
                      <div className="aspect-square relative">
                        <img
                          src={cert.public_url}
                          alt={cert.title}
                          className="w-full h-full object-contain bg-white/5 p-4"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-4">
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => toggleCertificationActiveMutation.mutate({
                                id: cert.id,
                                isActive: cert.is_active
                              })}
                              className="bg-white/20 hover:bg-white/30 border-white/30"
                            >
                              {cert.is_active ? (
                                <EyeOff className="h-4 w-4 text-white" />
                              ) : (
                                <Eye className="h-4 w-4 text-white" />
                              )}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="destructive"
                                  className="bg-red-500/80 hover:bg-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="glass border-white/20">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-white">Delete certification?</AlertDialogTitle>
                                  <AlertDialogDescription className="text-white/80">
                                    This will permanently delete {cert.title} from storage.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20 border-white/20">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteCertificationMutation.mutate({
                                      id: cert.id,
                                      storagePath: cert.storage_path
                                    })}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-2 left-2 flex gap-2 flex-wrap">
                        {cert.is_featured && (
                          <Badge className="bg-purple-500/80 text-white">Featured</Badge>
                        )}
                        {cert.is_active ? (
                          <Badge className="bg-green-500/80 text-white">Active</Badge>
                        ) : (
                          <Badge className="bg-red-500/80 text-white">Hidden</Badge>
                        )}
                      </div>
                      <div className="p-3 bg-black/40">
                        <p className="text-white text-sm font-medium line-clamp-1">{cert.title}</p>
                        <p className="text-white/60 text-xs">{cert.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Profile Images Gallery */}
            <TabsContent value="profile">
              {profileLoading ? (
                <div className="text-center py-12 text-white">Loading profile images...</div>
              ) : !profileImages || profileImages.length === 0 ? (
                <div className="text-center py-12 text-white/60">
                  <User className="h-16 w-16 mx-auto mb-4 opacity-40" />
                  <p>No profile images yet. Upload your profile photo above!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profileImages.map((img) => (
                    <div
                      key={img.id}
                      className={`relative group rounded-lg overflow-hidden border-2 ${
                        img.is_active ? 'border-green-500/50' : 'border-red-500/50'
                      }`}
                    >
                      <div className="aspect-square relative">
                        <img
                          src={img.public_url}
                          alt={img.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute top-2 left-2 flex gap-2">
                        {img.is_primary && (
                          <Badge className="bg-purple-500/80 text-white">Primary</Badge>
                        )}
                        {img.is_active ? (
                          <Badge className="bg-green-500/80 text-white">Active</Badge>
                        ) : (
                          <Badge className="bg-red-500/80 text-white">Hidden</Badge>
                        )}
                      </div>
                      <div className="p-3 bg-black/40">
                        <p className="text-white text-sm font-medium line-clamp-1">{img.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Assets Gallery */}
            <TabsContent value="assets">
              {assetsLoading ? (
                <div className="text-center py-12 text-white">Loading assets...</div>
              ) : !assetImages || assetImages.length === 0 ? (
                <div className="text-center py-12 text-white/60">
                  <Boxes className="h-16 w-16 mx-auto mb-4 opacity-40" />
                  <p>No assets yet. Upload your first asset above!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {assetImages.map((asset) => (
                    <div
                      key={asset.id}
                      className={`relative group rounded-lg overflow-hidden border-2 ${
                        asset.is_active ? 'border-green-500/50' : 'border-red-500/50'
                      }`}
                    >
                      <div className="aspect-square relative">
                        <img
                          src={asset.public_url}
                          alt={asset.title}
                          className="w-full h-full object-contain bg-white/5 p-4"
                        />
                      </div>
                      <div className="absolute top-2 left-2 flex gap-2">
                        <Badge className="bg-blue-500/80 text-white capitalize">{asset.category}</Badge>
                        {asset.is_active ? (
                          <Badge className="bg-green-500/80 text-white">Active</Badge>
                        ) : (
                          <Badge className="bg-red-500/80 text-white">Hidden</Badge>
                        )}
                      </div>
                      <div className="p-3 bg-black/40">
                        <p className="text-white text-sm font-medium line-clamp-1">{asset.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
