import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Sparkles, Notebook, Network, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { SparklesText } from '@/components/ui/sparkles-text';
import Link from 'next/link';

function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-indigo-50/80 via-white to-cyan-50/80 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 overflow-hidden relative">

      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 z-10 w-full max-w-6xl mx-auto space-y-12">

        {/* Hero Section */}
        <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
          <span
            className={cn(
              "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-linear-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-size-[300%_100%] p-px"
            )}
            style={{
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "destination-out",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "subtract",
              WebkitClipPath: "padding-box",
            }}
          />
          🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
          <AnimatedGradientText className="text-sm font-medium">
            Introducing NoteGraph AI
          </AnimatedGradientText>
          <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white drop-shadow-sm max-w-4xl mx-auto leading-[1.1]">
          Think Better. <br className="hidden sm:block" />
          <SparklesText>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 via-indigo-500 to-blue-500 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400">
              Note Smarter.
            </span>
          </SparklesText>
        </h1>

        <p className="max-w-2xl leading-relaxed text-muted-foreground sm:text-lg md:text-xl dark:text-gray-300">
          An AI powered note-taking and knowledge management system that connects your thoughts and amplifies your creativity.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
          <Link href="/sign-up">
            <Button size="lg" className="h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all rounded-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 scale-100 hover:scale-105">
              Start Building Your Brain <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Link href="/how-it-works">
            <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all scale-100 hover:scale-105">
              See How it Works
            </Button>
          </Link>
        </div>

        {/* Features Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">

          <div className="flex flex-col items-center text-center p-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm hover:shadow-md transition-all group">
            <div className="h-14 w-14 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Brain className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">AI Assistant</h3>
            <p className="text-gray-500 dark:text-gray-400">Summarize, generate ideas, and interact with your notes natively to unlock new insights.</p>
          </div>

          <div className="flex flex-col items-center text-center p-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm hover:shadow-md transition-all group lg:-translate-y-4">
            <div className="h-14 w-14 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Network className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Knowledge Graph</h3>
            <p className="text-gray-500 dark:text-gray-400">Visualize connections and see the big picture across all your related thoughts and documents.</p>
          </div>

          <div className="flex flex-col items-center text-center p-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm hover:shadow-md transition-all group">
            <div className="h-14 w-14 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Notebook className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Seamless Editing</h3>
            <p className="text-gray-500 dark:text-gray-400">A distraction-free, powerful editor designed to keep you focused exclusively on what matters.</p>
          </div>

        </div>
      </main >
    </div >
  );
}

export default Landing;