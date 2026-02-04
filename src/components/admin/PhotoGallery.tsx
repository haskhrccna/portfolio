import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Upload, Trash2, Image as ImageIcon, Eye, EyeOff,
  MoveUp, MoveDown, RefreshCw, CheckCircle2
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProjectPhoto {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export const PhotoGallery = () => {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  const { data: photos, isLoading } = useQuery({
    queryKey: ["project-photos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_photos')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as ProjectPhoto[];
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) throw new Error("No file selected");

      setUploading(true);

      // Upload image to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-photos')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-photos')
        .getPublicUrl(filePath);

      // Get max order
      const maxOrder = photos?.length ? Math.max(...photos.map(p => p.display_order)) : 0;

      // Insert photo record
      const { error: dbError } = await supabase
        .from('project_photos')
        .insert([
          {
            title: title || null,
            description: description || null,
            image_url: publicUrl,
            display_order: maxOrder + 1,
            is_active: true
          }
        ]);

      if (dbError) throw dbError;

      return publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-photos"] });
      setSelectedFile(null);
      setTitle("");
      setDescription("");
      setPreviewUrl(null);
      setImageDimensions(null);
      setUploading(false);
      toast.success("Photo uploaded successfully!");
    },
    onError: (error: any) => {
      console.error("Upload error:", error);
      setUploading(false);
      toast.error(`Upload failed: ${error.message}`);
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('project_photos')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-photos"] });
      toast.success("Photo visibility updated");
    },
    onError: () => {
      toast.error("Failed to update photo");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id, imageUrl }: { id: string; imageUrl: string }) => {
      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const filePath = urlParts[urlParts.length - 1];

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('project-photos')
        .remove([filePath]);

      if (storageError) console.error("Storage delete error:", storageError);

      // Delete from database
      const { error: dbError } = await supabase
        .from('project_photos')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-photos"] });
      toast.success("Photo deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete photo");
    }
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: number }) => {
      const { error } = await supabase
        .from('project_photos')
        .update({ display_order: newOrder })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-photos"] });
      toast.success("Order updated");
    },
    onError: () => {
      toast.error("Failed to update order");
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

      // Load image to get dimensions
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });

        // Warnings for image quality
        if (img.width < 800 || img.height < 600) {
          toast.warning("Image resolution is low. Recommended: at least 800x600px for better quality");
        }
      };
      img.src = url;
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }
    uploadMutation.mutate();
  };

  const movePhoto = (index: number, direction: 'up' | 'down') => {
    if (!photos) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= photos.length) return;

    const photo1 = photos[index];
    const photo2 = photos[newIndex];

    reorderMutation.mutate({ id: photo1.id, newOrder: photo2.display_order });
    reorderMutation.mutate({ id: photo2.id, newOrder: photo1.display_order });
  };

  if (isLoading) {
    return (
      <Card className="glass">
        <CardContent className="p-6 text-white text-center">
          Loading photos...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Photo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Photo File *</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="bg-white/10 text-white border-white/20 file:bg-white/20 file:text-white file:border-0"
                />
                <p className="text-white/60 text-xs">Max size: 5MB. Formats: JPG, PNG, WebP</p>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Title (Optional)</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Cable Installation Phase 1"
                  className="bg-white/10 text-white border-white/20 placeholder:text-white/40"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Description (Optional)</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the project photo..."
                  className="bg-white/10 text-white border-white/20 placeholder:text-white/40"
                  rows={3}
                />
              </div>

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
                    Upload Photo
                  </>
                )}
              </Button>
            </div>

            {previewUrl && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Image Preview</Label>
                  {imageDimensions && (
                    <div className="text-xs text-white/70 space-y-1">
                      <p>Dimensions: {imageDimensions.width} × {imageDimensions.height}px</p>
                      <p>Aspect Ratio: {(imageDimensions.width / imageDimensions.height).toFixed(2)}:1</p>
                    </div>
                  )}
                  <div className="relative h-48 rounded-lg overflow-hidden border-2 border-white/20">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-contain bg-black/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white flex items-center gap-2">
                    Gallery Frame Preview
                    <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-300 border-blue-400/50">
                      How it will appear
                    </Badge>
                  </Label>
                  <p className="text-xs text-white/60">This shows exactly how your photo will fit in the gallery carousel</p>
                  <div className="relative h-60 rounded-lg overflow-hidden border-2 border-green-500/50 group">
                    <img
                      src={previewUrl}
                      alt="Gallery Preview"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {description && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-sm">{description}</p>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white/10 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                      Gallery Frame (240px height)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Photo Gallery */}
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Project Gallery ({photos?.filter(p => p.is_active).length || 0} active / {photos?.length || 0} total)
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["project-photos"] })}
              className="bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!photos || photos.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-40" />
              <p>No photos yet. Upload your first project photo above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className={`relative group rounded-lg overflow-hidden border-2 ${
                    photo.is_active ? 'border-green-500/50' : 'border-red-500/50'
                  }`}
                >
                  <div className="aspect-square relative">
                    <img
                      src={photo.image_url}
                      alt={photo.title || `Project ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-4">
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => toggleActiveMutation.mutate({ id: photo.id, isActive: photo.is_active })}
                          className="bg-white/20 hover:bg-white/30 border-white/30"
                        >
                          {photo.is_active ? (
                            <EyeOff className="h-4 w-4 text-white" />
                          ) : (
                            <Eye className="h-4 w-4 text-white" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => movePhoto(index, 'up')}
                          disabled={index === 0}
                          className="bg-white/20 hover:bg-white/30 border-white/30"
                        >
                          <MoveUp className="h-4 w-4 text-white" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => movePhoto(index, 'down')}
                          disabled={index === photos.length - 1}
                          className="bg-white/20 hover:bg-white/30 border-white/30"
                        >
                          <MoveDown className="h-4 w-4 text-white" />
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
                              <AlertDialogTitle className="text-white">Delete photo?</AlertDialogTitle>
                              <AlertDialogDescription className="text-white/80">
                                This action cannot be undone. This will permanently delete this photo from storage and the gallery.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20 border-white/20">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate({ id: photo.id, imageUrl: photo.image_url })}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      {photo.title && (
                        <p className="text-white text-sm font-medium text-center line-clamp-2">
                          {photo.title}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 flex gap-2">
                    <Badge className="bg-black/60 text-white border-white/30">
                      #{index + 1}
                    </Badge>
                    {photo.is_active ? (
                      <Badge className="bg-green-500/80 text-white">Active</Badge>
                    ) : (
                      <Badge className="bg-red-500/80 text-white">Hidden</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
