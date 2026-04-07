"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Loader2, Mail, MapPin, Send, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { SparklesText } from '@/components/ui/sparkles-text';
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("/api/contact", formData);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-indigo-50/80 via-white to-cyan-50/80 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 overflow-hidden relative">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-20 max-w-6xl z-10 relative mt-8">
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
            <MessageSquare className="size-4 mr-2 text-indigo-500" />
            <AnimatedGradientText className="text-sm font-medium">
              We'd love to hear from you
            </AnimatedGradientText>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white drop-shadow-sm max-w-4xl mx-auto leading-[1.1] mb-6">
            Let's Start a <br className="hidden sm:block" />
            <SparklesText>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 via-indigo-500 to-blue-500 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400">
                Conversation.
              </span>
            </SparklesText>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl dark:text-gray-300">
            Have questions about Notegraph AI? Whether you need support, want to request a feature, or just say hello — we're here.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col p-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm hover:shadow-md transition-all group">
              <div className="h-14 w-14 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mail className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Email Us</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Our friendly team is here to help.</p>
              <a href="mailto:support@notegraph.ai" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-semibold transition-colors">
                support@notegraph.ai
              </a>
            </div>

            <div className="flex flex-col p-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm hover:shadow-md transition-all group">
              <div className="h-14 w-14 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Visit Us</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Come say hello at our office HQ.</p>
              <p className="text-gray-900 dark:text-white font-medium leading-relaxed">
                Moradabad, Uttar Pradesh<br/>
                244001
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3 p-8 md:p-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl shadow-indigo-100/20 dark:shadow-indigo-900/10">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Send us a message</h3>
            <p className="text-muted-foreground mb-8">Fill out the form below and we'll reply shortly.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="John Doe" 
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="h-12 bg-white/50 dark:bg-black/50 border-gray-200 dark:border-gray-800 focus-visible:ring-indigo-500 transition-shadow"
                    required
                  />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="h-12 bg-white/50 dark:bg-black/50 border-gray-200 dark:border-gray-800 focus-visible:ring-indigo-500 transition-shadow"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 font-medium">Phone Number <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  placeholder="+1 (555) 000-0000" 
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="h-12 bg-white/50 dark:bg-black/50 border-gray-200 dark:border-gray-800 focus-visible:ring-indigo-500 transition-shadow"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="message" className="text-gray-700 dark:text-gray-300 font-medium">Message</Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  placeholder="How can we help you?" 
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="resize-none bg-white/50 dark:bg-black/50 border-gray-200 dark:border-gray-800 focus-visible:ring-indigo-500 transition-shadow"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-base shadow-lg hover:shadow-xl transition-all rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 scale-100 hover:scale-[1.02] active:scale-[0.98]" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}