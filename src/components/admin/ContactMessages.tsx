import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Mail, Download, RefreshCw, CheckCircle2 } from "lucide-react";
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

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  cv_requested?: boolean;
}

export const ContactMessages = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'cv_requested'>('all');

  const { data: messages, isLoading } = useQuery({
    queryKey: ["contact-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ContactMessage[];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      toast.success("Message deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete message");
    }
  });

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      toast.success("All messages deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete all messages");
    }
  });

  const exportMessages = () => {
    if (!messages || messages.length === 0) {
      toast.error("No messages to export");
      return;
    }

    const csv = [
      ['Name', 'Email', 'Message', 'CV Requested', 'Date'],
      ...messages.map(m => [
        m.name,
        m.email,
        m.message.replace(/,/g, ';'),
        m.cv_requested ? 'Yes' : 'No',
        new Date(m.created_at).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contact-messages-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success("Messages exported successfully");
  };

  const filteredMessages = messages?.filter(m => {
    if (filter === 'cv_requested') return m.cv_requested;
    return true;
  });

  if (isLoading) {
    return (
      <Card className="glass">
        <CardContent className="p-6 text-white text-center">
          Loading messages...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Messages ({filteredMessages?.length || 0})
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["contact-messages"] })}
              className="bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportMessages}
              disabled={!messages || messages.length === 0}
              className="bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={!messages || messages.length === 0}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="glass border-white/20">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-white/80">
                    This action cannot be undone. This will permanently delete all contact messages.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20 border-white/20">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteAllMutation.mutate()}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className={filter === 'all' ? '' : 'bg-white/10 text-white hover:bg-white/20 border-white/20'}
          >
            All ({messages?.length || 0})
          </Button>
          <Button
            variant={filter === 'cv_requested' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('cv_requested')}
            className={filter === 'cv_requested' ? '' : 'bg-white/10 text-white hover:bg-white/20 border-white/20'}
          >
            CV Requested ({messages?.filter(m => m.cv_requested).length || 0})
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!filteredMessages || filteredMessages.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            No messages yet
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-white">{message.name}</span>
                      {message.cv_requested && (
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          CV Requested
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-white/60" />
                      <a
                        href={`mailto:${message.email}`}
                        className="text-blue-300 hover:text-blue-200 text-sm"
                      >
                        {message.email}
                      </a>
                    </div>
                    <p className="text-white/80 text-sm whitespace-pre-wrap">
                      {message.message}
                    </p>
                    <p className="text-white/50 text-xs">
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass border-white/20">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete message?</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/80">
                          This action cannot be undone. This will permanently delete this message from {message.name}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/10 text-white hover:bg-white/20 border-white/20">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(message.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
