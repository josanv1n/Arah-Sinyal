import { useState } from "react";
import { motion } from "motion/react";
import { Copy, Check, FileCode, CheckCircle2, ChevronRight, HelpCircle, Eye, Info } from "lucide-react";

interface AppsScriptModalProps {
  onClose: () => void;
  gasUrl: string;
  setGasUrl: (url: string) => void;
  spreadsheetId: string;
}

export default function AppsScriptModal({ 
  onClose, 
  gasUrl, 
  setGasUrl,
  spreadsheetId 
}: AppsScriptModalProps) {
  const [copied, setCopied] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const appsScriptCode = `/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Apps Script Code.gs untuk Aplikasi Arah Sinyal Antena TV Digital
 * 
 * spreadsheetId: "${spreadsheetId}"
 * Sheet Name required: "History"
 */

const SPREADSHEET_ID = "${spreadsheetId}";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName("History");
    
    if (!sheet) {
      sheet = ss.insertSheet("History");
    }
    
    // Ensure accurate Header columns
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", 
        "Action Type", 
        "Search Query / Region", 
        "Selected MUX/Station", 
        "Bearing (Degrees)", 
        "Distance (KM)", 
        "Signal Strength (dBm)", 
        "User Latitude", 
        "User Longitude", 
        "AI Analysis Advice"
      ]);
      // Bold headers
      sheet.getRange("A1:J1").setFontWeight("bold").setBackground("#0f172a").setFontColor("#f8fafc");
    }
    
    const timestamp = new Date();
    
    // Save Action Log Row
    sheet.appendRow([
      timestamp,
      data.actionType || "PENCARIAN",
      data.searchQuery || "",
      data.stationName || "",
      data.bearing ? data.bearing.toFixed(1) + "°" : "-",
      data.distance ? data.distance.toFixed(1) + " KM" : "-",
      data.signalStrength ? data.signalStrength + " dBm" : "-",
      data.lat || "-",
      data.lng || "-",
      data.notes || ""
    ]);
    
    // Auto-fit columns
    try {
      sheet.autoResizeColumns(1, 10);
    } catch(err) {}

    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "Data berhasil disimpan ke Google Sheet History!" 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName("History");
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ status: "success", data: [] }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
    const rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ status: "success", data: [] }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
    const headers = rows[0];
    const data = [];
    
    // Read last 25 entries for the Web UI action log
    const startRow = Math.max(1, rows.length - 25);
    for (let i = rows.length - 1; i >= startRow; i--) {
      const row = rows[i];
      const item = {};
      headers.forEach((h, idx) => {
        item[h] = row[idx];
      });
      data.push(item);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", data: data }))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestConnection = async () => {
    if (!gasUrl || !gasUrl.includes("exec")) {
      setTestStatus("error");
      setMsg("URL Apps Script tidak valid. Harap masukkan URL bertakhiran /exec.");
      return;
    }

    setTestStatus("loading");
    setMsg("Mengirim data uji coba ke spreadsheet Anda...");

    try {
      // JSONP or standard mock post since GAS block CORS on straightforward fetch from different domains unless directed correctly
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 8000);

      const testPayload = {
        actionType: "TES_KONEK_APPSCRIPT",
        searchQuery: "Tes Jaringan Otomatis",
        stationName: "Aplikasi Arah Sinyal TV Digital",
        bearing: 45,
        distance: 12.5,
        signalStrength: -65,
        notes: "Koneksi berhasil terhubung dari panel setelan aplikasi."
      };

      const res = await fetch(gasUrl, {
        method: "POST",
        mode: "no-cors", // GAS POST returns redirect which triggers CORS. "no-cors" avoids exception but returns opaque response.
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testPayload),
        signal: controller.signal
      });

      clearTimeout(id);
      setTestStatus("success");
      setMsg("Data uji coba berhasil dikirim! Silakan periksa Google Sheet 'History' Anda.");

    } catch (e: any) {
      setTestStatus("error");
      setMsg("Gagal terhubung: " + e.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-[380px] max-h-[760px] shadow-2xl flex flex-col border border-indigo-100 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 to-indigo-900 text-white p-5">
          <div className="flex items-center gap-2 mb-1">
            <FileCode className="w-5 h-5 text-cyan-400" />
            <h3 className="font-sans font-bold text-sm tracking-wide">Setelan Google Sheets</h3>
          </div>
          <p className="text-[11px] text-zinc-300">Hubungkan log pencarian aplikasi langsung ke data Google Spreadsheet Anda!</p>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
          {/* Section 1: Spreadsheet details */}
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
              <Info className="w-4 h-4 text-blue-900" /> Detail Database target
            </div>
            <div className="text-[10px] space-y-1 font-mono text-slate-600 leading-normal">
              <div>Nama: <span className="font-bold text-slate-900">Script Properties</span></div>
              <div>ID: <span className="font-bold text-slate-900 truncate block text-[9px] select-all">{spreadsheetId}</span></div>
              <div>Sheet: <span className="font-slate-900 bg-cyan-100 text-cyan-800 px-1 py-0.2 rounded font-bold">History</span></div>
            </div>
          </div>

          {/* Section 2: Input Web App URL */}
          <div className="space-y-1.5">
            <label className="text-[10.5px] uppercase font-mono font-bold tracking-wider text-slate-700 block">URL Web App Apps Script</label>
            <input 
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={gasUrl}
              onChange={(e) => setGasUrl(e.target.value)}
              className="w-full text-xs font-mono bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white p-2.5 rounded-xl outline-none transition"
            />
            <p className="text-[9.5px] text-slate-400 leading-normal">
              Masukkan URL Web App hasil deploy Apps Script Anda. Log pencarian akan otomatis disimpan ke baris sheet.
            </p>
          </div>

          {/* Action test connection button */}
          <div className="space-y-2">
            <button 
              onClick={handleTestConnection}
              disabled={testStatus === "loading"}
              className="w-full py-2 bg-indigo-950 active:bg-slate-800 disabled:bg-slate-300 text-white font-semibold text-xs rounded-xl active:scale-98 transition flex items-center justify-center gap-1.5"
            >
              {testStatus === "loading" ? "Menghubungkan..." : "Kirim Data Tes Log"}
            </button>

            {testStatus !== "idle" && (
              <div className={`p-2 rounded-lg text-[10px] leading-relaxed select-all ${
                testStatus === "success" 
                  ? "bg-emerald-50 border border-emerald-100 text-emerald-800"
                  : testStatus === "error"
                  ? "bg-rose-50 border border-rose-100 text-rose-800"
                  : "bg-amber-50 border border-amber-100 text-amber-800 animate-pulse"
              }`}>
                {msg}
              </div>
            )}
          </div>

          {/* Step checklist details */}
          <div className="border-t border-slate-100 pt-3">
            <h4 className="text-[10.5px] uppercase font-mono font-bold tracking-wider text-slate-700 mb-2">Panduan Pasang Apps Script:</h4>
            <div className="space-y-2 text-[10px] text-slate-600 leading-relaxed">
              <div className="flex gap-2">
                <span className="w-4 h-4 bg-slate-100 text-indigo-950 font-bold font-mono rounded-full flex items-center justify-center shrink-0">1</span>
                <div>Buka Google Sheet target, pilih menu <strong className="text-slate-800">Extensions (Ekstensi) &gt; Apps Script</strong>.</div>
              </div>
              <div className="flex gap-2">
                <span className="w-4 h-4 bg-slate-100 text-indigo-950 font-bold font-mono rounded-full flex items-center justify-center shrink-0">2</span>
                <div>Salin kodingan Apps Script di bawah, ganti seluruh isi berkas <strong className="text-slate-800">Code.gs</strong>, lalu simpan.</div>
              </div>
              <div className="flex gap-2">
                <span className="w-4 h-4 bg-slate-100 text-indigo-950 font-bold font-mono rounded-full flex items-center justify-center shrink-0">3</span>
                <div>Klik tombol <strong className="text-slate-800">Deploy (Terapkan) &gt; New Deployment (Terapkan baru)</strong>. Berikan akses jenis <strong className="text-slate-800">Web App</strong>, Execute as <strong className="text-slate-800">Me</strong>, dan Who has access: <strong className="text-slate-800">Anyone (Siapa saja)</strong>.</div>
              </div>
            </div>
          </div>

          {/* Apps Script Codebox to copy */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-700 uppercase">
              <span>Berkas Code.gs</span>
              <button 
                onClick={handleCopy}
                className="text-[9.5px] text-blue-900 flex items-center gap-1 hover:underline active:scale-95 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Kode</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="relative bg-slate-900 rounded-xl p-3 border border-slate-950 overflow-hidden font-mono text-[9px] text-zinc-300 h-32 select-all overflow-y-auto">
              <pre className="whitespace-pre-wrap">{appsScriptCode}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex gap-2">
          <button 
            type="button" 
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 active:bg-slate-800 text-white font-sans text-xs font-bold rounded-xl active:scale-95 transition"
          >
            Selesai Setelan
          </button>
        </div>
      </motion.div>
    </div>
  );
}
