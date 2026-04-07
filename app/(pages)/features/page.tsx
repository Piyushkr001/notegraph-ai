import React from "react";
import Link from "next/link";
import { ArrowRight, Brain, Network, Notebook, Sparkles, Share2, Search, Lock, Zap, Layers, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { SparklesText } from '@/components/ui/sparkles-text';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "AI Knowledge Extraction",
    description: "Instantly process long disorganized notes. Our AI reads your content, extracts core summaries, and distills the actionable insights so you never lose track of a good idea.",
    icon: <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
    colorClass: "bg-purple-100 dark:bg-purple-900/40 border-purple-200 dark:border-purple-800/50",
  },
  {
    title: "Interactive Knowledge Graph",
    description: "Visualize how your thoughts connect natively. The graph reveals hidden semantic relationships across topics, helping you spark new ideas you might have missed.",
    icon: <Network className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    colorClass: "bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800/50",
  },
  {
    title: "Automated Tagging System",
    description: "Stop wasting time organizing folders. Let AI automatically categorize your notes into logical tags and overarching topics based strictly on context.",
    icon: <Layers className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
    colorClass: "bg-indigo-100 dark:bg-indigo-900/40 border-indigo-200 dark:border-indigo-800/50",
  },
  {
    title: "Distraction-Free Editor",
    description: "A fast, clean workspace designed solely for thinking and typing. Equipped with markdown shortcuts, deep focus modes, and lightning fast responsiveness.",
    icon: <Notebook className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
    colorClass: "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800/50",
  },
  {
    title: "Semantic Global Search",
    description: "Find exactly what you're looking for, even if you don't remember the exact keywords. Search by concept or meaning and retrieve instant results.",
    icon: <Search className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
    colorClass: "bg-amber-100 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800/50",
  },
  {
    title: "Private & Secure by Default",
    description: "Your architecture of thought belongs to you. Built with top-tier authentication and secure data isolation, ensuring your ideas stay locked and yours.",
    icon: <Lock className="h-6 w-6 text-slate-600 dark:text-slate-400" />,
    colorClass: "bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50",
  },
];

export const metadata = {
  title: "Features - Notegraph AI",
  description: "Explore the powerful features behind Notegraph AI's intelligent note taking system.",
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-indigo-50/80 via-white to-cyan-50/80 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 overflow-hidden relative">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-purple-400/20 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
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
            <Sparkles className="size-4 mr-2 text-indigo-500" />
            <AnimatedGradientText className="text-sm font-medium">
              Powerful Tools for Powerful Minds
            </AnimatedGradientText>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white drop-shadow-sm max-w-5xl mx-auto leading-[1.1] mb-6">
            Everything you need to <br className="hidden md:block" />
            <SparklesText>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 via-indigo-500 to-blue-500 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400">
                build a second brain.
              </span>
            </SparklesText>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl dark:text-gray-300">
            Discover how NoteGraph AI transforms the way you capture, connect, and comprehend your ideas securely on the cloud.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
          {features.map((feature, idx) => (
            <Card 
              key={idx} 
              className={cn(
                "border overflow-hidden bg-white/70 dark:bg-gray-900/60 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 group",
                "hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-800"
              )}
            >
              <CardContent className="p-8 flex flex-col h-full">
                <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border", feature.colorClass)}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white leading-tight">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground dark:text-gray-400 text-base leading-relaxed grow">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Large Feature Banner */}
        <div className="max-w-6xl mx-auto bg-gray-900 text-white rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden shadow-2xl mb-24">
          <div className="absolute top-0 right-0 w-full h-full bg-linear-to-tl from-indigo-600/30 via-transparent to-purple-600/30 opacity-50 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-indigo-200">
                <Zap className="h-4 w-4" /> Wait-Free Processing
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Experience unparalleled AI speeds immediately.</h2>
              <p className="text-lg text-gray-300 max-w-xl">
                Unlike bulk legacy knowledge bases, NoteGraph connects you directly to top-tier enterprise AI models for on-demand extraction right when you hit save.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Link href="/sign-up">
                  <Button size="lg" className="h-12 px-8 text-base rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-all scale-100 hover:scale-105">
                    Start Now For Free
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base text-black rounded-full border-white/20 hover:bg-white/10 hover:text-white transition-all">
                    <Play className="mr-2 h-4 w-4" /> Watch Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
