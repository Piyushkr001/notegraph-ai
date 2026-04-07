"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Lock, EyeOff, Database } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const policies = [
  {
    icon: <Lock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
    title: "1. Information We Collect",
    colorClass: "bg-indigo-100 dark:bg-indigo-900/40 border-indigo-200 dark:border-indigo-800/50",
    content: "When you interact with NoteGraph AI, we securely collect account credentials via our authentication partner (Clerk), alongside the raw text data of the notes you actively create, manage, and process through our dashboard."
  },
  {
    icon: <Database className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
    title: "2. How We Use Information",
    colorClass: "bg-purple-100 dark:bg-purple-900/40 border-purple-200 dark:border-purple-800/50",
    content: "The raw text of your notes is evaluated solely to power your personal Knowledge Graph logic. It is used in real-time to generate your personal summaries, extract context-specific tags, and map your semantic topics together."
  },
  {
    icon: <EyeOff className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: "3. AI Privacy Guarantee",
    colorClass: "bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800/50",
    content: "We proudly maintain a strict zero-retention policy for public LLM training. Your private thoughts belong to you. Your inputted notes are never utilized to fine-tune or train any overarching public AI models."
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
    title: "4. Data Security",
    colorClass: "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800/50",
    content: "All note data and interconnected graphs are encrypted at rest and in transit. Your specific graph is entirely sandboxed and securely isolated via row-level security mapped strict to your user identity."
  }
];

export default function PrivacyPolicyPage() {
  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-indigo-50/80 via-white to-cyan-50/80 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 overflow-hidden relative">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-5%] left-[-10%] w-[600px] h-[600px] bg-purple-400/20 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-24 max-w-7xl z-10 relative">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] mb-6">
            <span
              className={cn(
                "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-linear-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-size-[300%_100%] p-px"
              )}
              style={{
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "destination-out",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "subtract",
                WebkitClipPath: "padding-box",
              }}
            />
            <ShieldCheck className="size-4 mr-2 text-indigo-500" />
            <AnimatedGradientText className="text-sm font-medium">
              Legal & Compliance
            </AnimatedGradientText>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white drop-shadow-sm max-w-4xl mx-auto leading-[1.1] mb-6">
            Privacy <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 via-indigo-500 to-blue-500 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400">Policy.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl dark:text-gray-300">
            Your notes are your most private asset. Learn exactly how we ensure your data remains completely secure, private, and solely under your control.
          </p>
          <div className="mt-8 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-4 py-2 rounded-full border border-indigo-100 dark:border-indigo-900/50">
            Last Updated: {currentDate}
          </div>
        </div>

        {/* Privacy Highlight Cards */}
        <div className="max-w-5xl mx-auto mb-20 relative">
          <div className="absolute inset-0 bg-linear-to-b from-indigo-500/5 to-purple-500/5 rounded-3xl blur-2xl -z-10" />
          <div className="grid md:grid-cols-2 gap-8">
            {policies.map((policy, idx) => (
              <Card 
                key={idx} 
                className={cn(
                  "border overflow-hidden bg-white/70 dark:bg-gray-900/60 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 group",
                  "hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-800"
                )}
              >
                <CardContent className="p-8 flex flex-col h-full">
                  <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border", policy.colorClass)}>
                    {policy.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white leading-tight">
                    {policy.title}
                  </h3>
                  <p className="text-muted-foreground dark:text-gray-400 text-base leading-relaxed grow">
                    {policy.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Standard Legal Text Section */}
        <div className="max-w-4xl mx-auto mb-24 p-8 md:p-12 bg-white/50 dark:bg-gray-900/40 backdrop-blur-md rounded-[2.5rem] border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            <h3 className="text-2xl tracking-tight text-gray-900 dark:text-white font-bold mb-4 mt-8 first:mt-0">User Rights & Control</h3>
            <p className="leading-relaxed mb-6">
              You retain total ownership over everything you create within NoteGraph AI. Under the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA), you consistently possess the ultimate right to request access to your compiled data, correct inaccuracies, or permanently delete your account alongside all deeply nested relationships from our secure cloud infrastructure.
            </p>
            
            <h3 className="text-2xl tracking-tight text-gray-900 dark:text-white font-bold mb-4 mt-8">Third-Party Subprocessors</h3>
            <p className="leading-relaxed mb-6">
              To deliver our seamless experience, we employ strict subprocessing vendors exclusively for core operations (namely Clerk for stateless Identity Management, Neon/Vercel for PostgreSQL cloud persistence, and OpenRouter for encrypted LLM traversal). Strict data processing agreements rigidly bind these subprocessors entirely, prohibiting any shadow retention or unauthorized evaluation of your packets.
            </p>

            <h3 className="text-2xl tracking-tight text-gray-900 dark:text-white font-bold mb-4 mt-8">Cookies and Tracking</h3>
            <p className="leading-relaxed mb-6">
              Our site architecture leverages essential cookies uniquely mapped to preserving your active login session and guarding the interface against Cross-Site Request Forgery (CSRF). We explicitly do not employ intrusive third-party invasive trackers for algorithmic behavioral ad-targeting within the dashboard environment.
            </p>
          </div>
        </div>

        {/* Reach Out / Queries CTA */}
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 pt-10 pb-10 rounded-[2.5rem] bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 px-8 lg:px-12">
          <div>
            <h2 className="text-2xl font-bold mb-2">Have privacy concerns?</h2>
            <p className="text-muted-foreground max-w-sm">
              Transparency is paramount to us. Get in touch with our DPO team immediately.
            </p>
          </div>
          <div className="shrink-0 flex gap-4">
            <Link href="/help">
              <Button size="lg" variant="outline" className="h-12 px-6 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                Help Center
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all rounded-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 scale-100 flex items-center">
                Contact Legal 
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
