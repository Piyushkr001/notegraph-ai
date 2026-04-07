"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Brain, Target, Shield, Sparkles, Users, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { SparklesText } from '@/components/ui/sparkles-text';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const values = [
  {
    title: "Innovation First",
    description: "We constantly push the boundaries of what AI can do for personal knowledge management, ensuring our users always have cutting-edge tools at their fingertips.",
    icon: <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
    colorClass: "bg-purple-100 dark:bg-purple-900/40 border-purple-200 dark:border-purple-800/50",
  },
  {
    title: "Privacy by Design",
    description: "Your second brain is your most private asset. We architect our systems from the ground up to ensure your data is secure, sandboxed, and strictly your own.",
    icon: <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
    colorClass: "bg-indigo-100 dark:bg-indigo-900/40 border-indigo-200 dark:border-indigo-800/50",
  },
  {
    title: "User-Centric Architecture",
    description: "Technology should bow to the mind, not the other way around. Every feature we build aims to reduce cognitive load and friction in the note-taking process.",
    icon: <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    colorClass: "bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800/50",
  },
  {
    title: "Passionate Craft",
    description: "We are obsessed with performance and design. From zero-latency writing to beautifully mapped knowledge graphs, we care deeply about the details.",
    icon: <Heart className="h-6 w-6 text-pink-600 dark:text-pink-400" />,
    colorClass: "bg-pink-100 dark:bg-pink-900/40 border-pink-200 dark:border-pink-800/50",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-indigo-50/80 via-white to-cyan-50/80 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 overflow-hidden relative">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-purple-400/20 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-24 max-w-7xl z-10 relative">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-20 md:mb-32">
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
            <Target className="size-4 mr-2 text-indigo-500" />
            <AnimatedGradientText className="text-sm font-medium">
              Our Vision
            </AnimatedGradientText>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white drop-shadow-sm max-w-5xl mx-auto leading-[1.1] mb-6">
            Building the Future of <br className="hidden md:block" />
            <SparklesText>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 via-indigo-500 to-blue-500 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400">
                Knowledge.
              </span>
            </SparklesText>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl dark:text-gray-300">
            We're a team of engineers, designers, and systems-thinkers on a mission to eliminate information overload and augment human intelligence.
          </p>
        </div>

        {/* Our Story Layout */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
          <div className="relative group">
            <div className="absolute -inset-2 bg-linear-to-r from-indigo-500 to-purple-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-1000" />
            <div className="relative h-full w-full rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 p-8 shadow-xl">
              <div className="h-16 w-16 bg-linear-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg mb-8">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">The Agentic Architecture</h2>
              <div className="space-y-4 text-lg text-muted-foreground dark:text-gray-300">
                <p>
                  It started with a challenge to build something utilizing modern <b>agentic ideas, cloud code, and autonomous workflows</b>—so we set out to solve the ultimate knowledge problem: information overload.
                </p>
                <p>
                  We realized that scaling human knowledge requires autonomous systems to parse, tag, and organize incoming data streams dynamically seamlessly.
                  We architected NoteGraph AI utilizing serverless cloud code and a swarm of specialized AI Agents. Every time a note is created, it enters an autonomous background workflow where models like Codex and broader LLMs extract semantic relationships without human intervention.
                </p>
                <p>
                  NoteGraph AI is a live, production-ready demonstration of what happens when you combine autonomous agent pipelines with beautiful interface design.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
             <div className="p-8 rounded-3xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
               <h3 className="text-4xl font-black text-indigo-600 dark:text-indigo-400 mb-2">10M+</h3>
               <p className="text-muted-foreground text-lg font-medium">Synced Thoughts</p>
             </div>
             <div className="p-8 rounded-3xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50">
               <h3 className="text-4xl font-black text-purple-600 dark:text-purple-400 mb-2">100k+</h3>
               <p className="text-muted-foreground text-lg font-medium">Nodes Connected</p>
             </div>
             <div className="p-8 rounded-3xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
               <h3 className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">99.9%</h3>
               <p className="text-muted-foreground text-lg font-medium">Uptime Guarantee</p>
             </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="max-w-6xl mx-auto mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that drive every line of code we write and every feature we design.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, idx) => (
              <Card 
                key={idx} 
                className={cn(
                  "border overflow-hidden bg-white/70 dark:bg-gray-900/60 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 group",
                  "hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-800"
                )}
              >
                <CardContent className="p-8 flex items-start gap-6 h-full">
                  <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 border", value.colorClass)}>
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white leading-tight">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground dark:text-gray-400 text-base leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6 pt-10 pb-8 rounded-[3rem] bg-linear-to-b from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-gray-900 border border-indigo-100 dark:border-indigo-900/50 px-6 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold">Join us on our journey</h2>
          <p className="text-lg text-muted-foreground max-w-xl">
            We are redefining what it means to take notes. Upgrade your brain today.
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
