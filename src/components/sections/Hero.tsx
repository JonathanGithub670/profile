"use client";

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { ArrowRight, Github, Linkedin, Twitter } from 'lucide-react';

const Lanyard = dynamic(() => import('../ui/Lanyard'), { 
  ssr: false,
  loading: () => <div className="w-full h-full" />
});

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-6 z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Side - Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left lg:w-1/2"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-sm mb-6 text-blue-300">
            Available for freelance work
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Building digital <br />
            <span className="text-gradient">experiences that matter.</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
            I&apos;m a Full Stack Developer passionate about crafting accessible, pixel-perfect user interfaces that blend form and function.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center lg:justify-start gap-4">
            <Button variant="primary" className="flex items-center gap-2 group">
              View Projects 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="secondary" className="flex items-center gap-2">
              Contact Me
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center lg:justify-start gap-6 text-white/40">
            <a href="#" className="hover:text-white transition-colors"><Github className="w-6 h-6" /></a>
            <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-6 h-6" /></a>
            <a href="#" className="hover:text-white transition-colors"><Twitter className="w-6 h-6" /></a>
          </div>
        </motion.div>

        {/* Right Side - Lanyard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:w-1/2 h-[400px] md:h-[500px] w-full"
        >
          <Lanyard position={[0, 0, 20]} />
        </motion.div>
      </div>
    </section>
  );
}
