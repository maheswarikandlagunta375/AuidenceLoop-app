import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Download, 
  RefreshCw,
  Info,
  Table
} from 'lucide-react';
import Papa from 'papaparse';
import { Brand } from '../types';

interface ImportCsvTabProps {
  brand: Brand;
  onImportSuccess: () => Promise<void>;
}

export const ImportCsvTab: React.FC<ImportCsvTabProps> = ({ brand, onImportSuccess }) => {
  const [importType, setImportType] = useState<'posts' | 'comments'>('posts');
  const [csvText, setCsvText] = useState('');
  const [fileName, setFileName] = useState('');
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<any | null>(null);

  // Default target fields
  const postFields = [
    { key: 'content', label: 'Post Content / Text (Required)' },
    { key: 'published_at', label: 'Publication Date / Time' },
    { key: 'platform', label: 'Platform (linkedin, twitter, etc.)' },
    { key: 'topic', label: 'Topic Category' },
    { key: 'format', label: 'Format (carousel, infographic, text, etc.)' },
    { key: 'impressions', label: 'Impressions / Reach' },
    { key: 'reactions', label: 'Reactions / Likes' },
    { key: 'comments', label: 'Comments Count' },
    { key: 'shares', label: 'Shares / Retweets' },
    { key: 'tags', label: 'Tags / Keywords' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
      inspectHeaders(text);
    };
    reader.readAsText(file);
  };

  const inspectHeaders = (text: string) => {
    const parsed = Papa.parse(text, { header: true, preview: 2 });
    if (parsed.meta.fields && parsed.meta.fields.length > 0) {
      setParsedHeaders(parsed.meta.fields);
      // Auto-map matching keys
      const initialMap: Record<string, string> = {};
      for (const field of parsed.meta.fields) {
        const lower = field.toLowerCase().replace(/[^a-z0-9]/g, '_');
        initialMap[lower] = field;
      }
      setColumnMapping(initialMap);
    }
  };

  const handleLoadSamplePosts = async () => {
    setIsProcessing(true);
    setImportResult(null);
    try {
      const res = await fetch('/api/sample-csv/posts');
      const text = await res.text();
      setCsvText(text);
      setFileName('sample_social_posts.csv');
      setImportType('posts');
      inspectHeaders(text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadSampleComments = async () => {
    setIsProcessing(true);
    setImportResult(null);
    try {
      const res = await fetch('/api/sample-csv/comments');
      const text = await res.text();
      setCsvText(text);
      setFileName('sample_community_comments.csv');
      setImportType('comments');
      inspectHeaders(text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteImport = async () => {
    if (!csvText.trim()) return;
    setIsProcessing(true);
    setImportResult(null);

    try {
      const endpoint = importType === 'posts'
        ? `/api/brands/${brand.id}/import-posts`
        : `/api/brands/${brand.id}/import-comments`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csvText,
          columnMapping
        })
      });

      const data = await res.json();
      setImportResult(data);
      if (data.success) {
        await onImportSuccess();
      }
    } catch (err) {
      console.error('Import error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-cyan-400 font-medium mb-1">
            Data Ingestion & Safeguards · {brand.name}
          </div>
          <h1 className="text-lg font-semibold text-slate-100">
            CSV Import Engine & Column Mapping
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Import historical post engagement metrics or audience comments. Built-in PII scrubbers automatically mask sensitive emails and phone numbers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadSamplePosts}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            Quick-Load Sample Posts
          </button>
          <button
            onClick={handleLoadSampleComments}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            Quick-Load Sample Comments
          </button>
        </div>
      </div>

      {/* Import Type Selector */}
      <div className="flex items-center gap-2 bg-slate-900/60 p-1 rounded-lg border border-slate-800 w-fit">
        <button
          onClick={() => { setImportType('posts'); setImportResult(null); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            importType === 'posts'
              ? 'bg-slate-800 text-cyan-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Historical Social Posts & Metrics
        </button>
        <button
          onClick={() => { setImportType('comments'); setImportResult(null); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            importType === 'comments'
              ? 'bg-slate-800 text-cyan-300 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Community Conversation Comments
        </button>
      </div>

      {/* Main Upload Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl p-8 text-center bg-slate-950/40 transition-colors">
          <UploadCloud className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-200 mb-1">
            Choose CSV file or paste content below
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Supports standard CSV exports from Sprout Social, Buffer, Hootsuite, LinkedIn Analytics, or manual spreadsheets.
          </p>

          <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-100 rounded-lg text-xs font-medium cursor-pointer border border-slate-700 transition-colors">
            <span>Browse CSV File</span>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {fileName && (
            <div className="mt-3 text-xs text-cyan-400 font-medium flex items-center justify-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Loaded: {fileName}</span>
            </div>
          )}
        </div>

        {/* Text Area for manual paste */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Raw CSV Text Content
          </label>
          <textarea
            value={csvText}
            onChange={(e) => {
              setCsvText(e.target.value);
              inspectHeaders(e.target.value);
            }}
            placeholder="paste CSV rows with headers here..."
            rows={5}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 font-mono text-[11px] leading-relaxed rounded-lg p-3 focus:outline-none focus:border-cyan-600 resize-none"
          />
        </div>

        {/* Column Mapping Table (For Posts) */}
        {importType === 'posts' && parsedHeaders.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5 text-cyan-400" />
                <span>Column Header Mapping</span>
              </h4>
              <span className="text-[11px] text-slate-500">
                {parsedHeaders.length} headers detected in CSV
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
              {postFields.map((field) => (
                <div key={field.key} className="space-y-1">
                  <label className="text-[11px] text-slate-400 truncate block">
                    {field.label}
                  </label>
                  <select
                    value={columnMapping[field.key] || ''}
                    onChange={(e) => setColumnMapping({ ...columnMapping, [field.key]: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-cyan-600"
                  >
                    <option value="">-- Match Column --</option>
                    {parsedHeaders.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Automatic PII Scrubbing + Deduplication Enforced</span>
          </div>

          <button
            onClick={handleExecuteImport}
            disabled={!csvText.trim() || isProcessing}
            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Validating & Importing...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Import Into {brand.name}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Import Result Notification Banner */}
      {importResult && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-850 pb-2">
            <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-2">
              {importResult.success ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              )}
              <span>Import Execution Summary</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              {importResult.insertedCount} inserted · {importResult.duplicateCount} duplicates skipped
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
              <div className="text-slate-500 text-[11px]">Inserted Records</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">
                +{importResult.insertedCount}
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
              <div className="text-slate-500 text-[11px]">Duplicates Avoided</div>
              <div className="text-sm font-bold text-slate-300 mt-0.5">
                {importResult.duplicateCount}
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
              <div className="text-slate-500 text-[11px]">PII Tokens Masked</div>
              <div className="text-sm font-bold text-cyan-400 mt-0.5">
                {importResult.piiMaskedCount}
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
              <div className="text-slate-500 text-[11px]">Malformed Discarded</div>
              <div className="text-sm font-bold text-rose-400 mt-0.5">
                {importResult.rejectedCount}
              </div>
            </div>
          </div>

          {importResult.errors && importResult.errors.length > 0 && (
            <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-3 text-xs space-y-1">
              <div className="font-semibold text-rose-300 text-[11px]">Validation Rejections:</div>
              {importResult.errors.map((err: any, i: number) => (
                <div key={i} className="text-slate-400 font-mono text-[11px]">
                  • Line {err.line}: {err.reason}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
