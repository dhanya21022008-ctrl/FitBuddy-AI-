import React from 'react';
import {
  Sparkles,
  Dumbbell,
  Database,
  Code,
  ShieldCheck,
  CheckCircle2,
  Server,
  Layers,
  Heart,
  Cpu,
  Globe,
  FileText,
  Lock,
} from 'lucide-react';
import { MedicalDisclaimer } from '../components/MedicalDisclaimer';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-10">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/80">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Project Overview & Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About FitBuddy-AI
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          FitBuddy-AI is an AI-powered fitness planning application designed to provide personalized general fitness guidance based on user-provided information.
        </p>
      </div>

      {/* Project Goals */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Dumbbell className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Project Goals
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Personalized Fitness Guidance</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed pl-6">
              Tailoring exercise selection, volume, and caloric targets according to individual height, weight, gender, age, and activity level.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Easy-To-Use Interface</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed pl-6">
              Frictionless, responsive design functioning seamlessly across mobile phones, tablets, laptops, and desktop displays.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>AI-Assisted Planning</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed pl-6">
              Leveraging Gemini AI models with strict system instructions and structured schemas to generate safe, progressive regimens.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Fitness Progress Awareness</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed pl-6">
              Providing clear non-scale victory markers, RPE tracking, and realistic habit targets to cultivate long-term consistency.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5 sm:col-span-2">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Simple User Management</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed pl-6">
              Comprehensive CRUD capability to store user records, search by goals or biometrics, review full plans, and clean up profiles.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Layers className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Technology Stack
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* React */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
              <Code className="w-4 h-4" />
              <span>React 19</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Component-based frontend architecture with responsive hooks, state management, and accessible navigation.
            </p>
          </div>

          {/* TypeScript */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
              <FileText className="w-4 h-4" />
              <span>TypeScript</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              End-to-end type safety covering user entities, biometric validation, API payloads, and plan schemas.
            </p>
          </div>

          {/* Tailwind CSS */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
              <Globe className="w-4 h-4" />
              <span>Tailwind CSS</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Utility-first styling with custom emerald colorways, typography hierarchy, soft shadows, and clean mobile responsiveness.
            </p>
          </div>

          {/* Supabase */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <Database className="w-4 h-4" />
              <span>Supabase / Database</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Relational PostgreSQL schemas (`supabase-schema.sql`), indexed queries, RLS policies, and server persistence.
            </p>
          </div>

          {/* Gemini AI */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Google Gemini AI</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Advanced reasoning via `@google/genai` TypeScript SDK and `gemini-3.8-flash` on the server backend.
            </p>
          </div>

          {/* Security Architecture */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
              <Lock className="w-4 h-4" />
              <span>Security Architecture</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Zero client API keys. Server-side proxy endpoints (`/api/*`), input validation, and defensive fallbacks.
            </p>
          </div>
        </div>
      </div>

      {/* BSc Computer Science Project Details */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Server className="w-4 h-4" />
          <span>Academic Evaluation Note</span>
        </div>
        <h3 className="text-xl font-bold">
          BSc Computer Science Capstone Demonstration
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          FitBuddy-AI was developed as an end-to-end production software engineering demonstration. It embodies practical implementations of Full-Stack Architecture, RESTful API Design, JSON Schema Validation, Database Normalization, and Safe Generative AI integration without exposing sensitive credentials to the browser runtime.
        </p>
      </div>

      {/* Mandatory Disclaimer */}
      <MedicalDisclaimer />
    </div>
  );
};
