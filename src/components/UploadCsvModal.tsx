import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import Papa from 'papaparse';

interface UploadCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandId: string;
  brandName: string;
  onImportSuccess: () => Promise<void>;
}

export const UploadCsvModal: React.FC<UploadCsvModalProps> = ({
  isOpen,
  onClose,
  brandId,
  brandName,
  onImportSuccess
}) => {
  const [csvText, setCsvText] = useState('');
  const [fileName, setFileName] = useState('');
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const postFields = [
    { key: 'content', label: 'Post Content / Text (Required)' },
    { key: 'published_at', label: 'Publication Date / Time' },
    { key: 'platform', label: 'Platform (instagram, linkedin, etc.)' },
    { key: 'topic', label: 'Topic Category' },
    { key: 'format', label: 'Format (reels, carousel, single_image)' },
    { key: 'impressions', label: 'Impressions / Reach' },
    { key: 'reactions', label: 'Reactions / Likes' },
    { key: 'comments', label: 'Comments Count' },
    { key: 'shares', label: 'Shares / Retweets' }
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
      const initialMap: Record<string, string> = {};
      for (const field of parsed.meta.fields) {
        const lower = field.toLowerCase().replace(/[^a-z0-9]/g, '_');
        initialMap[lower] = field;
      }
      setColumnMapping(initialMap);
    }
  };

  const handleLoadSample = async () => {
    setIsProcessing(true);
    setImportResult(null);
    try {
      const res = await fetch('/api/sample-csv/posts');
      const text = await res.text();
      setCsvText(text);
      setFileName('sample_social_posts.csv');
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
      const res = await fetch(`/api/brands/${brandId}/import-posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvText, columnMapping })
      });

      const data = await res.json();
      setImportResult(data);
      if (data.success) {
        await onImportSuccess();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-100">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-xl overflow-hidden shadow-2xl">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Upload CSV to {brandName}</h3>
              <p className="text-[11px] text-slate-500">Imports posts, metrics, and scrubbed community comments</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          {/* Quick sample button */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <div className="font-semibold text-slate-800">Quick Test Dataset</div>
              <div className="text-[11px] text-slate-500">Load realistic sample posts with metrics and sample PII</div>
            </div>
            <button
              onClick={handleLoadSample}
              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-md hover:bg-slate-100"
            >
              Load Sample CSV
            </button>
          </div>

          {/* File Picker or Paste Area */}
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/50">
            <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-slate-700 font-semibold mb-2">Select CSV file to import</div>
            <label className="inline-block px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs">
              <span>Browse CSV</span>
              <input type="file" accept=".csv,text/csv" onChange={handleFileUpload} className="hidden" />
            </label>
            {fileName && (
              <div className="mt-2 text-blue-600 font-medium flex items-center justify-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                <span>{fileName}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Or Paste CSV Raw Content</label>
            <textarea
              rows={4}
              value={csvText}
              onChange={(e) => {
                setCsvText(e.target.value);
                inspectHeaders(e.target.value);
              }}
              placeholder="platform,content,published_at,topic,format,impressions..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono text-[11px] focus:outline-none focus:border-blue-600 resize-none"
            />
          </div>

          {/* Column Mapping */}
          {parsedHeaders.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="font-semibold text-slate-800">Column Header Mapping</div>
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {postFields.map((field) => (
                  <div key={field.key} className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 font-medium block truncate">{field.label}</span>
                    <select
                      value={columnMapping[field.key] || ''}
                      onChange={(e) => setColumnMapping({ ...columnMapping, [field.key]: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 text-[11px]"
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

          {/* Results Notification */}
          {importResult && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Import Succeeded</span>
              </div>
              <div className="text-[11px] text-blue-800">
                Inserted {importResult.insertedCount} records ({importResult.duplicateCount} duplicates skipped, {importResult.piiMaskedCount} sensitive tokens scrubbed).
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Automatic PII Scrubbing Active</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 font-medium text-slate-600 hover:text-slate-800"
            >
              Done
            </button>
            <button
              onClick={handleExecuteImport}
              disabled={!csvText.trim() || isProcessing}
              className="px-4 py-1.5 bg-[#1761d8] hover:bg-[#124eb3] disabled:opacity-40 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm"
            >
              {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
              <span>Import Posts</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
