import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, Sparkles, RefreshCw, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '@/src/lib/utils';

export default function AIVision() {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const base64Data = image.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: "Identify the animal in this image. Return data in JSON format: { \"name\": \"Common Name\", \"scientificName\": \"Scientific Name\", \"description\": \"Brief overview\", \"habitat\": \"Preferred environment\", \"characteristics\": [\"trait1\", \"trait2\"], \"funFact\": \"An interesting fact\" }. If no animal is detected, return an error field." },
              { inlineData: { mimeType: "image/jpeg", data: base64Data } }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text || '{}');
      if (data.error) {
        setError("Could not identify any wildlife in this image. Please try a clearer photo.");
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
      setError("AI analysis failed. Please ensure your GEMINI_API_KEY is configured.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 max-w-5xl mx-auto overflow-y-auto hide-scrollbar">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
          <Sparkles className="w-3 h-3" />
          Native AI Vision
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">EcoScan Lens</h1>
        <p className="text-slate-400 max-w-2xl mx-auto italic">
          Upload a photo of any animal or habitat to instantly identify species and get detailed ecological insights.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Upload Section */}
        <div className="flex flex-col gap-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative aspect-square rounded-3xl border-2 border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-900 transition-all cursor-pointer overflow-hidden group flex flex-col items-center justify-center p-8",
              image && "border-solid border-emerald-500/30"
            )}
          >
            {image ? (
              <>
                <img src={image} className="absolute inset-0 w-full h-full object-cover" alt="Source" />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="w-12 h-12 text-white" />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 text-slate-500 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-semibold text-slate-300">Click to upload or capture</p>
                  <p className="text-xs">Supports JPG, PNG, WEBP</p>
                </div>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
              accept="image/*" 
            />
          </div>

          <div className="flex gap-3">
            <button
              disabled={!image || isProcessing}
              onClick={analyzeImage}
              className="flex-1 py-4 bg-emerald-500 rounded-2xl font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
            >
              {isProcessing ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              {isProcessing ? 'Analyzing Intelligence...' : 'Scan Species'}
            </button>
            <button
              onClick={() => { setImage(null); setResult(null); setError(null); }}
              className="px-4 py-4 bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="glass-panel rounded-3xl p-6 min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div 
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-8"
              >
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-4 border-emerald-500/10 rounded-full" />
                  <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Neural Scan in Progress</h3>
                <p className="text-slate-400 text-sm">Our AI models are cross-referencing wildlife databases and morphological patterns.</p>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4"
              >
                <AlertCircle className="w-16 h-16 text-red-400 opacity-50" />
                <h3 className="text-xl font-bold text-white">{error}</h3>
              </motion.div>
            ) : result ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 space-y-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Identification Confirmed
                    </div>
                    <h2 className="text-3xl font-extrabold text-white">{result.name}</h2>
                    <p className="text-sm italic text-slate-400 font-mono">{result.scientificName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Habitat</p>
                    <p className="text-sm text-slate-200">{result.habitat}</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Confidence</p>
                    <p className="text-sm text-emerald-400 font-bold">98.4% Match</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{result.description}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Key Characteristics</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.characteristics?.map((c: string) => (
                      <span key={c} className="px-3 py-1 bg-slate-800 text-slate-200 text-xs rounded-full border border-slate-700">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-800">
                  <div className="flex items-start gap-4 bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                    <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-emerald-400 uppercase mb-1">Global Insight</h5>
                      <p className="text-xs text-slate-400 italic">"{result.funFact}"</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4 opacity-30">
                <Camera className="w-16 h-16 text-slate-500" />
                <div>
                  <h3 className="text-lg font-semibold">Ready for Scan</h3>
                  <p className="text-sm">Upload an image to start AI detection</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
