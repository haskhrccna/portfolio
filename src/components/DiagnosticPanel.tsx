import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DiagnosticPanel = () => {
  const [results, setResults] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    const testResults: any[] = [];

    // Test 1: Check Supabase client
    testResults.push({
      test: "Supabase Client",
      status: supabase ? "✅ Pass" : "❌ Fail",
      details: supabase ? "Client initialized" : "Client not initialized"
    });

    // Test 2: Try SELECT
    try {
      const { count, error } = await supabase
        .from('visitors')
        .select('*', { count: 'exact', head: true });

      if (error) {
        testResults.push({
          test: "SELECT Permission",
          status: "❌ Fail",
          details: `Error ${error.code}: ${error.message}`,
          hint: error.hint || "No hint provided"
        });
      } else {
        testResults.push({
          test: "SELECT Permission",
          status: "✅ Pass",
          details: `Found ${count} visitors`
        });
      }
    } catch (err: any) {
      testResults.push({
        test: "SELECT Permission",
        status: "❌ Fail",
        details: err.message
      });
    }

    // Test 3: Try INSERT
    try {
      const { data, error } = await supabase
        .from('visitors')
        .insert([
          {
            page_url: '/diagnostic-test',
            visited_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        testResults.push({
          test: "INSERT Permission",
          status: "❌ Fail",
          details: `Error ${error.code}: ${error.message}`,
          hint: error.hint || "Check RLS policies",
          solution: error.code === '42501' ?
            "Run SUPABASE_FIX.sql in your Supabase SQL Editor" :
            "Check database configuration"
        });
      } else {
        testResults.push({
          test: "INSERT Permission",
          status: "✅ Pass",
          details: `Successfully inserted test record (ID: ${data?.id?.substring(0, 8)}...)`
        });
      }
    } catch (err: any) {
      testResults.push({
        test: "INSERT Permission",
        status: "❌ Fail",
        details: err.message
      });
    }

    setResults(testResults);
  };

  if (!isVisible) return null;

  const hasFailed = results.some(r => r.status.includes("❌"));

  return (
    <div className="fixed bottom-20 right-4 z-50 max-w-md">
      <Card className="glass border-2 border-yellow-500/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              {hasFailed ? "🔴" : "🟢"} Database Diagnostics
            </CardTitle>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white/60 hover:text-white text-xl leading-none"
            >
              ×
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {results.map((result, idx) => (
            <div key={idx} className="text-xs">
              <div className="flex items-start gap-2">
                <span className="font-mono">{result.status}</span>
                <span className="text-white font-semibold">{result.test}</span>
              </div>
              <div className="text-white/70 ml-6 mt-1">
                {result.details}
              </div>
              {result.hint && (
                <div className="text-yellow-300 ml-6 mt-1 italic">
                  Hint: {result.hint}
                </div>
              )}
              {result.solution && (
                <div className="text-green-300 ml-6 mt-1 font-semibold">
                  → {result.solution}
                </div>
              )}
            </div>
          ))}

          {hasFailed && (
            <div className="mt-4 p-2 bg-red-500/20 border border-red-500/50 rounded text-xs text-white">
              <div className="font-bold mb-1">⚠️ Action Required:</div>
              <div>1. Go to your Supabase dashboard</div>
              <div>2. Open SQL Editor</div>
              <div>3. Run the commands from SUPABASE_FIX.sql</div>
            </div>
          )}

          <button
            onClick={runDiagnostics}
            className="w-full mt-3 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded text-white text-xs transition-colors"
          >
            🔄 Re-run Tests
          </button>
        </CardContent>
      </Card>
    </div>
  );
};
