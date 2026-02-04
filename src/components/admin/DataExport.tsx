import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Database, FileJson, FileSpreadsheet, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const DataExport = () => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [dateRange, setDateRange] = useState<'7' | '30' | '90' | 'all'>('30');
  const [isExporting, setIsExporting] = useState(false);

  const exportData = async (table: 'visitors' | 'contact_messages' | 'all') => {
    setIsExporting(true);
    try {
      let visitors = null;
      let messages = null;

      // Calculate date filter
      const getDateFilter = () => {
        if (dateRange === 'all') return null;
        const days = parseInt(dateRange);
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date.toISOString();
      };

      const dateFilter = getDateFilter();

      // Fetch visitors
      if (table === 'visitors' || table === 'all') {
        let query = supabase
          .from('visitors')
          .select('*')
          .order('visited_at', { ascending: false });

        if (dateFilter) {
          query = query.gte('visited_at', dateFilter);
        }

        const { data, error } = await query;
        if (error) throw error;
        visitors = data;
      }

      // Fetch messages
      if (table === 'contact_messages' || table === 'all') {
        let query = supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (dateFilter) {
          query = query.gte('created_at', dateFilter);
        }

        const { data, error } = await query;
        if (error) throw error;
        messages = data;
      }

      // Export based on format
      if (exportFormat === 'json') {
        exportJSON({ visitors, messages });
      } else {
        exportCSV({ visitors, messages }, table);
      }

      toast.success("Data exported successfully!");
    } catch (error: any) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const exportJSON = (data: any) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    downloadFile(blob, `portfolio-data-${new Date().toISOString().split('T')[0]}.json`);
  };

  const exportCSV = (data: any, table: string) => {
    let csv = '';

    if (data.visitors && data.visitors.length > 0) {
      csv += 'VISITORS\n';
      csv += ['ID', 'Visitor #', 'Page', 'Country', 'City', 'IP Address', 'Visited At'].join(',') + '\n';
      data.visitors.forEach((v: any) => {
        csv += [
          v.id,
          v.visitor_number || '',
          v.page_url || '',
          v.country || '',
          v.city || '',
          v.ip_address || '',
          new Date(v.visited_at).toLocaleString()
        ].map(field => `"${field}"`).join(',') + '\n';
      });
      csv += '\n\n';
    }

    if (data.messages && data.messages.length > 0) {
      csv += 'CONTACT MESSAGES\n';
      csv += ['ID', 'Name', 'Email', 'Message', 'CV Requested', 'Date'].join(',') + '\n';
      data.messages.forEach((m: any) => {
        csv += [
          m.id,
          m.name,
          m.email,
          (m.message || '').replace(/"/g, '""'),
          m.cv_requested ? 'Yes' : 'No',
          new Date(m.created_at).toLocaleString()
        ].map(field => `"${field}"`).join(',') + '\n';
      });
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    downloadFile(blob, `portfolio-${table}-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Export & Backup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white">Export Format</Label>
            <Select value={exportFormat} onValueChange={(v: any) => setExportFormat(v)}>
              <SelectTrigger className="bg-white/10 text-white border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass border-white/20">
                <SelectItem value="csv" className="text-white">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    CSV (Excel)
                  </div>
                </SelectItem>
                <SelectItem value="json" className="text-white">
                  <div className="flex items-center gap-2">
                    <FileJson className="h-4 w-4" />
                    JSON (Database)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Date Range</Label>
            <Select value={dateRange} onValueChange={(v: any) => setDateRange(v)}>
              <SelectTrigger className="bg-white/10 text-white border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass border-white/20">
                <SelectItem value="7" className="text-white">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Last 7 days
                  </div>
                </SelectItem>
                <SelectItem value="30" className="text-white">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Last 30 days
                  </div>
                </SelectItem>
                <SelectItem value="90" className="text-white">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Last 90 days
                  </div>
                </SelectItem>
                <SelectItem value="all" className="text-white">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    All time
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={() => exportData('visitors')}
            disabled={isExporting}
            className="w-full"
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Visitors
          </Button>
          <Button
            onClick={() => exportData('contact_messages')}
            disabled={isExporting}
            className="w-full"
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Messages
          </Button>
          <Button
            onClick={() => exportData('all')}
            disabled={isExporting}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Export All Data
          </Button>
        </div>

        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <p className="text-sm text-blue-300">
            <strong>Tip:</strong> Regular data exports help you:
          </p>
          <ul className="list-disc list-inside text-sm text-blue-200 mt-2 space-y-1">
            <li>Keep backups of your analytics data</li>
            <li>Import data into external tools (Excel, Google Sheets)</li>
            <li>Comply with data protection regulations (GDPR)</li>
            <li>Migrate to other platforms if needed</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
