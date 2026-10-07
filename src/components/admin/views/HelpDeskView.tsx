"use client";

import React, { useState, useEffect } from "react";
import {
  Bot,
  Search,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  HelpCircle,
  X,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HelpDeskViewProps {
  onSetFeedback: (fb: { type: "success" | "error"; message: string }) => void;
}

export function HelpDeskView({ onSetFeedback }: HelpDeskViewProps) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [category, setCategory] = useState("EMERGENCY");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live prompt tester
  const [testQuestion, setTestQuestion] = useState("");
  const [testAnswer, setTestAnswer] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    fetchHelpDeskData();
  }, []);

  const fetchHelpDeskData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/helpdesk");
      if (res.ok) {
        const resData = await res.json();
        if (resData.success) {
          setData(resData);
        }
      }
    } catch {
      onSetFeedback({ type: "error", message: "Failed to fetch Help Desk administration data." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsSubmitting(true);
    try {
      const tags = tagsStr.split(",").map((t) => t.trim()).filter(Boolean);
      const res = await fetch("/api/admin/helpdesk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, title, content, tags, isActive: true }),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        onSetFeedback({ type: "success", message: resData.message });
        setShowAddModal(false);
        setTitle("");
        setContent("");
        setTagsStr("");
        fetchHelpDeskData();
      } else {
        onSetFeedback({ type: "error", message: resData.error || "Failed to save item." });
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error saving knowledge item." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/helpdesk?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        onSetFeedback({ type: "success", message: "Knowledge base item deleted." });
        fetchHelpDeskData();
      }
    } catch {
      onSetFeedback({ type: "error", message: "Network error deleting item." });
    }
  };

  const handleRunTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuestion) return;

    setIsTesting(true);
    setTestAnswer(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: testQuestion, language: "en" }),
      });
      const resData = await res.json();
      if (res.ok && resData.reply) {
        setTestAnswer(resData.reply);
      } else {
        setTestAnswer("The AI Assistant could not process this prompt. Please check API configuration.");
      }
    } catch {
      setTestAnswer("AI test query timed out or failed to reach the server.");
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="py-16 text-center text-xs text-slate-500">
        Loading IndoStates Help Desk AI oversight telemetry...
      </div>
    );
  }

  const stats = data.stats || {};
  const commonQuestions = data.commonQuestions || [];
  const knowledgeBase = data.knowledgeBase || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">IndoStates Help Desk — AI Assistant Administration</h2>
          <p className="text-xs text-slate-500">
            Audit patient conversational interactions, frequent questions, and manage structured clinical knowledge base
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddModal(true)}
          className="text-xs font-bold"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Add Knowledge Article</span>
        </Button>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Total Conversations</div>
          <div className="text-lg font-black text-slate-800 mt-1">{stats.totalConversations ?? 0} Chats</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Automated Triage</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-hospital-700">Questions Answered</div>
          <div className="text-lg font-black text-hospital-800 mt-1">
            {stats.totalQuestionsAnswered ?? 0} Queries
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Multilingual Natural Language</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-emerald-600">User Satisfaction</div>
          <div className="text-lg font-black text-emerald-700 mt-1">{stats.positiveFeedbackRate || "97%"}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5 font-semibold">Positive Rating</div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500">Knowledge Items</div>
          <div className="text-lg font-black text-slate-800 mt-1">{knowledgeBase.length} Articles</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Active Grounding Context</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Knowledge Base Editor (2 Columns) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden lg:col-span-2">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-800">Hospital Knowledge Base Articles</h3>
            <span className="text-[11px] text-slate-500 font-semibold">{knowledgeBase.length} Entries</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {knowledgeBase.map((kb: any) => (
              <div key={kb.id} className="p-4 space-y-1.5 hover:bg-slate-50 transition">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-hospital-50 text-hospital-800">
                    {kb.category}
                  </span>
                  <button
                    onClick={() => handleDeleteItem(kb.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition"
                    title="Delete knowledge item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="font-bold text-xs text-slate-900">{kb.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{kb.content}</p>
                {kb.tags && kb.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {kb.tags.map((t: string, idx: number) => (
                      <span key={idx} className="text-[9px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-500 font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Common Inquiries & Live Tester */}
        <div className="space-y-6 lg:col-span-1">
          {/* Top Inquiries */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <HelpCircle className="w-4 h-4 text-hospital-700" />
              <h3 className="font-bold text-xs text-slate-800">Most Frequent Patient Inquiries</h3>
            </div>
            <div className="space-y-2">
              {commonQuestions.map((cq: any, idx: number) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 text-xs flex justify-between items-center">
                  <span className="font-medium text-slate-700 truncate pr-2">{cq.question}</span>
                  <span className="font-mono font-bold text-slate-500 text-[10px] shrink-0">
                    {cq.count} asked
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live AI Tester */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Bot className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-xs text-slate-800">Test AI Knowledge Retrieval</h3>
            </div>

            <form onSubmit={handleRunTest} className="space-y-2 text-xs">
              <input
                type="text"
                placeholder="Ask e.g. What are the ICU bed rates?"
                value={testQuestion}
                onChange={(e) => setTestQuestion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
              />
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={isTesting}
                className="w-full font-bold text-xs"
              >
                {isTesting ? "Querying AI..." : "Test AI Assistant"}
              </Button>
            </form>

            {testAnswer && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed mt-2">
                <span className="font-bold text-hospital-800 block text-[10px] uppercase mb-1">
                  AI Grounded Response:
                </span>
                {testAnswer}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Knowledge Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Add Knowledge Base Article</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs bg-white"
                >
                  <option value="EMERGENCY">Emergency &amp; Trauma</option>
                  <option value="APPOINTMENTS">Appointments &amp; Booking</option>
                  <option value="DIAGNOSTICS">Diagnostics &amp; Scans</option>
                  <option value="DOCTORS">Doctors &amp; Schedules</option>
                  <option value="INSURANCE">Insurance &amp; TPA</option>
                  <option value="SERVICES">Clinical Services</option>
                  <option value="FACILITIES">Hospital Facilities</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fasting Guidelines for Ultrasound Abdomen"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Clinical Information Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Clear, factual instructions referenced by IndoStates Help Desk..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Search Keywords / Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="ultrasound, fasting, abdomen, prep"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Add to Knowledge Base"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
