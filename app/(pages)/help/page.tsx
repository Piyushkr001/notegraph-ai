"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Search, 
  Book, 
  Settings, 
  CreditCard, 
  HelpCircle,
  MessageSquare,
  Zap
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { SparklesText } from '@/components/ui/sparkles-text';
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const categories = [
  {
    title: "Getting Started",
    description: "Learn how to capture your first notes and navigate the dashboard.",
    icon: <Book className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
    colorClass: "bg-purple-100 dark:bg-purple-900/40 border-purple-200 dark:border-purple-800/50",
  },
  {
    title: "Account & Settings",
    description: "Manage your profile, preferences, and security settings.",
    icon: <Settings className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
    colorClass: "bg-indigo-100 dark:bg-indigo-900/40 border-indigo-200 dark:border-indigo-800/50",
  },
  {
    title: "Billing & Plans",
    description: "Upgrade your account, manage subscriptions, and view invoices.",
    icon: <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    colorClass: "bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800/50",
  },
  {
    title: "Troubleshooting",
    description: "Fix common issues and learn how to optimize your NoteGraph experience.",
    icon: <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
    colorClass: "bg-amber-100 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800/50",
  },
];

const faqs = [
  {
    question: "How does the AI process my notes?",
    answer: "Whenever you save a note in NoteGraph AI, it is sent securely to our advanced LLM pipeline. The AI evaluates the raw text, extracts the main topics, summarizes the core contents, and applies appropriate tags based on context."
  },
  {
    question: "Is my data private and secure?",
    answer: "Absolutely. Your data is sandboxed per user account using enterprise-grade authentication. None of your notes are used to train public models, and only you have access to your personal Knowledge Graph."
  },
  {
    question: "How do I use the Knowledge Graph?",
    answer: "The Knowledge Graph automatically populates as you create more notes. It maps linguistic and topical similarities between your documents. You can view the graph in your dashboard to uncover hidden connections visually."
  },
  {
    question: "Can I export my notes?",
    answer: "Yes, you have full ownership of your brain dump. You can export your library as Markdown files at any time from your Account Settings page so you're never locked in."
  },
  {
    question: "What happens if a note fails to process?",
    answer: "Occasionally, API timeouts occur. If a note is marked as 'Failed' on your dashboard, you can open the note and click 'Reprocess' to trigger the AI analysis again without losing your original text."
  }
];

export default function HelpcenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const query = searchQuery.trim().toLowerCase();

  const filteredCategories = categories.filter(
    (cat) =>
      cat.title.toLowerCase().includes(query) ||
      cat.description.toLowerCase().includes(query)
  );

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
  );

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-indigo-50/80 via-white to-cyan-50/80 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 overflow-hidden relative">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[5%] left-[-10%] w-[600px] h-[600px] bg-purple-400/20 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-24 max-w-7xl z-10 relative">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
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
            <HelpCircle className="size-4 mr-2 text-indigo-500" />
            <AnimatedGradientText className="text-sm font-medium">
              We are here to help
            </AnimatedGradientText>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white drop-shadow-sm max-w-4xl mx-auto leading-[1.1] mb-6">
            How can we <br className="hidden sm:block" />
            <SparklesText>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 via-indigo-500 to-blue-500 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400">
                assist you today?
              </span>
            </SparklesText>
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl relative mt-4 shadow-xl shadow-indigo-100/30 dark:shadow-indigo-900/10 rounded-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input 
              type="text" 
              placeholder="Search for articles, guides, or keywords..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-32 h-14 rounded-full text-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-gray-200/50 dark:border-gray-800/50 focus-visible:ring-indigo-500 shadow-inner"
            />
            <div className="absolute inset-y-1 right-1 flex items-center">
              <Button type="submit" className="rounded-full h-12 px-6 bg-linear-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 transition-opacity">
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length > 0 && (
          <div className="max-w-5xl mx-auto mb-24">
            <div className="grid sm:grid-cols-2 gap-6">
              {filteredCategories.map((cat, idx) => (
              <Card 
                key={idx} 
                className={cn(
                  "border overflow-hidden bg-white/70 dark:bg-gray-900/60 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer",
                  "hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-800"
                )}
              >
                <CardContent className="p-8 flex items-start gap-5">
                  <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 border", cat.colorClass)}>
                    {cat.icon}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-muted-foreground dark:text-gray-400 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        )}

        {/* FAQ Section */}
        {filteredFaqs.length > 0 && (
          <div className="max-w-3xl mx-auto mb-24">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Can't find what you're looking for? Browse our most common queries below.</p>
            </div>
            
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-800/50 p-6 md:p-10 shadow-sm">
              <Accordion className="w-full space-y-4">
                {filteredFaqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="border-b-0 bg-white/50 dark:bg-gray-950/50 rounded-xl overflow-hidden px-4 border border-gray-100 dark:border-gray-800">
                  <AccordionTrigger className="text-left font-semibold text-[1.05rem] text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed px-1 pb-5 pt-1 text-[1rem]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
              </Accordion>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredCategories.length === 0 && filteredFaqs.length === 0 && (
          <div className="max-w-3xl mx-auto mb-24 text-center py-16 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-800/50">
            <div className="bg-gray-100 dark:bg-gray-800 h-16 w-16 mx-auto rounded-full flex items-center justify-center mb-4">
               <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No results found</h3>
            <p className="text-muted-foreground">We couldn't find any articles or FAQs matching "{searchQuery}".</p>
          </div>
        )}

        {/* Still Need Help CTA */}
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 pt-10 pb-10 rounded-[2.5rem] bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 px-8 lg:px-12">
          <div>
            <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
            <p className="text-muted-foreground max-w-sm">
              Our support team is always ready to assist you bridging the gap from chaos to clarity.
            </p>
          </div>
          <div className="shrink-0">
            <Link href="/contact">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all rounded-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 scale-100 flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" /> Contact Support 
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
