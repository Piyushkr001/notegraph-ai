import React from "react";
import Link from "next/link";
import { ArrowRight, Pencil, BrainCircuit, Network, Lightbulb, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { SparklesText } from '@/components/ui/sparkles-text';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    title: "Capture Your Thoughts",
    description: "Start by dumping your ideas, meeting notes, research, or random musings into the distraction-free editor. Don't worry about formatting or organizing folders—just type.",
    icon: <Pencil className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
    colorClass: "bg-indigo-100 dark:bg-indigo-900/40 border-indigo-200 dark:border-indigo-800/50",
    features: ["Markdown support", "Auto-saving", "Focus mode"],
  },
  {
    number: "02",
    title: "AI Analysis & Extraction",
    description: "The moment you save, Notegraph's AI goes to work. It natively reads your text, identifies core concepts, writes a succinct summary, and tags the note intelligently.",
    icon: <BrainCircuit className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
    colorClass: "bg-purple-100 dark:bg-purple-900/40 border-purple-200 dark:border-purple-800/50",
    features: ["Automated Summaries", "Smart Tagging", "Entity Recognition"],
  },
  {
    number: "03",
    title: "Connect the Dots",
    description: "Your note is seamlessly injected into your overarching Knowledge Graph. The system compares it with your historical notes and draws semantic relationships automatically.",
    icon: <Network className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    colorClass: "bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800/50",
    features: ["Visual Graph UI", "Semantic linking", "Topic clustering"],
  },
  {
    number: "04",
    title: "Discover Insights",
    description: "When you need an answer months later, you don't search for exact phrases—you search for meaning. Uncover brilliant connections you never explicitly realized.",
    icon: <Lightbulb className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
    colorClass: "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800/50",
    features: ["Global Search", "Relationship tracking", "Idea synthesis"],
  },
];

export const metadata = {
  title: "How It Works - Notegraph AI",
  description: "Learn how Notegraph AI turns unstructured notes into a connected knowledge base.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-indigo-50/80 via-white to-cyan-50/80 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 overflow-hidden relative">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-purple-400/20 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />

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
            <Network className="size-4 mr-2 text-indigo-500" />
            <AnimatedGradientText className="text-sm font-medium">
              The Intelligence Pipeline
            </AnimatedGradientText>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white drop-shadow-sm max-w-4xl mx-auto leading-[1.1] mb-6">
            From Chaos to <br className="hidden sm:block" />
            <SparklesText>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 via-indigo-500 to-blue-500 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400">
                Clarity.
              </span>
            </SparklesText>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl dark:text-gray-300">
            See exactly how Notegraph transforms your raw, unorganized brain dumps into a structured universe of mapped knowledge.
          </p>
        </div>

        {/* Demo Video Section */}
        <div className="max-w-5xl mx-auto w-full mb-24 relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          <div className="relative rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-800/50 bg-black/5 dark:bg-white/5 aspect-video shadow-2xl flex items-center justify-center">
            <img 
              src="/dashboard-demo.webp" 
              alt="Dashboard Note Creation Demo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Step-by-Step Flow */}
        <div className="max-w-4xl mx-auto space-y-12 md:space-y-24 mb-24 relative">
          
          {/* Tracking Line */}
          <div className="absolute left-[39px] md:left-1/2 top-10 bottom-10 w-0.5 bg-linear-to-b from-indigo-200 via-purple-200 to-blue-200 dark:from-indigo-800 dark:via-purple-800 dark:to-blue-800 hidden md:block" />

          {/* Steps */}
          <div className="relative space-y-16 md:space-y-24">
            {steps.map((step, idx) => (
              <div key={idx} className={cn("relative flex flex-col md:flex-row items-center gap-8 md:gap-16", idx % 2 === 1 && "md:flex-row-reverse")}>
                
                {/* Visual Connector / Center Marker */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white dark:bg-gray-950 border-[6px] border-indigo-50 dark:border-indigo-950 items-center justify-center shadow-sm z-10">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm", step.colorClass)}>
                    {step.number}
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full md:w-1/2 flex-none">
                  <Card className="border overflow-hidden bg-white/70 dark:bg-gray-900/60 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-800">
                    <CardContent className="p-8">
                      {/* Mobile Number Badge */}
                      <div className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full mb-4 font-bold text-sm bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                        {step.number}
                      </div>

                      <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border shadow-sm", step.colorClass)}>
                        {step.icon}
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                      
                      <p className="text-muted-foreground dark:text-gray-400 text-base leading-relaxed mb-6">
                        {step.description}
                      </p>

                      <ul className="space-y-2">
                        {step.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-indigo-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Empty Side for Spacing */}
                <div className="hidden md:block w-full md:w-1/2" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6 pt-10 pb-8 rounded-[3rem] bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 px-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to outsmart your own notes?</h2>
          <p className="text-lg text-muted-foreground max-w-xl">
            Join users who are upgrading their brains with seamless AI synthesis.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all rounded-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 scale-100 hover:scale-105">
                Start Building Your Brain <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  );
}
