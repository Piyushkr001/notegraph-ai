"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Scale, FileText, CheckCircle, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const termHighlights = [
  {
    icon: <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
    title: "1. Acceptance of Terms",
    colorClass: "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800/50",
    content: "By accessing or using NoteGraph AI, you agree to be bound by these localized Terms of Service. If you disagree with any segment, please discontinue use immediately to secure your data."
  },
  {
    icon: <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
    title: "2. Content Ownership",
    colorClass: "bg-purple-100 dark:bg-purple-900/40 border-purple-200 dark:border-purple-800/50",
    content: "You retain all intellectual property rights to the notes and ideas you submit. You grant us an operational license solely to process and restructure them for your dashboard usage."
  },
  {
    icon: <Scale className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
    title: "3. Fair Usage",
    colorClass: "bg-indigo-100 dark:bg-indigo-900/40 border-indigo-200 dark:border-indigo-800/50",
    content: "Accounts are provisioned for personal human usage. Algorithmic abuse via automated ingestion scripts or exploiting the underlying LLM pipeline limits may result in rate-limiting or suspension."
  },
  {
    icon: <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
    title: "4. Service Availability",
    colorClass: "bg-amber-100 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800/50",
    content: "While we strive for a 99.9% uptime, NoteGraph AI is provided 'as is'. We are not liable for unpredictable LLM downtime natively inherited from upstream AI sub-processors."
  }
];

export default function TermsOfServicePage() {
  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-indigo-50/80 via-white to-cyan-50/80 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 overflow-hidden relative">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-purple-400/20 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[50%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />

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
            <Scale className="size-4 mr-2 text-indigo-500" />
            <AnimatedGradientText className="text-sm font-medium">
              Legal & Compliance
            </AnimatedGradientText>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white drop-shadow-sm max-w-4xl mx-auto leading-[1.1] mb-6">
            Terms of <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 via-indigo-500 to-blue-500 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400">Service.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl dark:text-gray-300">
            A comprehensive guide to the rules, responsibilities, and guidelines framing your experience internally inside NoteGraph AI.
          </p>
          <div className="mt-8 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-4 py-2 rounded-full border border-indigo-100 dark:border-indigo-900/50">
            Last Updated: {currentDate}
          </div>
        </div>

        {/* Terms Highlight Cards */}
        <div className="max-w-5xl mx-auto mb-20 relative">
          <div className="absolute inset-0 bg-linear-to-b from-indigo-500/5 to-purple-500/5 rounded-3xl blur-2xl -z-10" />
          <div className="grid md:grid-cols-2 gap-8">
            {termHighlights.map((term, idx) => (
              <Card 
                key={idx} 
                className={cn(
                  "border overflow-hidden bg-white/70 dark:bg-gray-900/60 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 group",
                  "hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-800"
                )}
              >
                <CardContent className="p-8 flex flex-col h-full">
                  <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border", term.colorClass)}>
                    {term.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white leading-tight">
                    {term.title}
                  </h3>
                  <p className="text-muted-foreground dark:text-gray-400 text-base leading-relaxed grow">
                    {term.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Standard Legal Text Section */}
        <div className="max-w-4xl mx-auto mb-24 p-8 md:p-12 bg-white/50 dark:bg-gray-900/40 backdrop-blur-md rounded-[2.5rem] border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            
            <h3 className="text-2xl tracking-tight text-gray-900 dark:text-white font-bold mb-4 mt-8 first:mt-0">1. Account Security and Registration</h3>
            <p className="leading-relaxed mb-6">
              You must register securely to access the platform. You are wholly responsible for maintaining the confidentiality of your session tokens and credentials. Any suspicious activity traced to your local session must be reported immediately. NoteGraph AI strictly reserves the right to lock down accounts identified as compromised.
            </p>

            <h3 className="text-2xl tracking-tight text-gray-900 dark:text-white font-bold mb-4 mt-8">2. Acceptable Use and Restrictions</h3>
            <p className="leading-relaxed mb-6">
              By utilizing our platform, you explicitly agree not to: 
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Reverse engineer or deeply scrape the internal logic.</li>
              <li>Upload any material containing destructive software payloads, malware, or illicit substances.</li>
              <li>Attempt to circumvent the OpenRouter LLM rate limiters intentionally.</li>
              <li>Impersonate any other individual or entity operating within our system.</li>
            </ul>
            
            <h3 className="text-2xl tracking-tight text-gray-900 dark:text-white font-bold mb-4 mt-8">3. Modifications to the Service</h3>
            <p className="leading-relaxed mb-6">
              We continually upgrade our infrastructure. We categorically reserve the right to natively modify, deprecate, or suspend elements of the core AI processing pipelines at any time with or without extended notice, to combat outages or optimize server capabilities.
            </p>

            <h3 className="text-2xl tracking-tight text-gray-900 dark:text-white font-bold mb-4 mt-8">4. Limitation of Liability</h3>
            <p className="leading-relaxed mb-6">
              To the maximum extent permitted flawlessly by applicable law, NoteGraph AI operators shall not be directly liable for any indirect, incidental, or consequential disruptions (including local loss of conceptual data matrices) arising out of the performance of the external AI pipelines or server hosting environments.
            </p>
          </div>
        </div>

        {/* Reach Out / Queries CTA */}
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 pt-10 pb-10 rounded-[2.5rem] bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 px-8 lg:px-12">
          <div>
            <h2 className="text-2xl font-bold mb-2">Have questions?</h2>
            <p className="text-muted-foreground max-w-sm">
              We've tried to keep the legalese out as much as possible, focusing precisely on transparency.
            </p>
          </div>
          <div className="shrink-0 flex gap-4">
            <Link href="/privacy-policy">
              <Button size="lg" variant="outline" className="h-12 px-6 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                View Privacy Policy
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all rounded-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 scale-100 flex items-center">
                Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
