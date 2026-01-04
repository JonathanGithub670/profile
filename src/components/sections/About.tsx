"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function About() {
  return (
    <section id="about" className="section-padding relative">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="relative max-w-md mx-auto md:mr-auto rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 z-10" />
                    <Image
                        src="/image/about-foto.png"
                        alt="Profile"
                        width={1000}
                        height={1000}
                        className="w-full h-auto object-cover relative z-0"
                    />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">about me<span className="text-blue-500">.</span></h2>
                <p className="text-white/70 mb-6 leading-relaxed">
                    Hello! I&apos;m a software engineer based in Indonesia. I enjoy creating things that live on the internet, whether that be websites, applications, or anything in between.
                </p>
                <p className="text-white/70 mb-8 leading-relaxed">
                    My goal is to always build products that provide pixel-perfect, performant experiences. Here are a few technologies I&apos;ve been working with recently:
                </p>

                <div className="grid grid-cols-2 gap-4">
                    {['JavaScript (ES6+)', 'React', 'Next.js', 'Node.js', 'TypeScript', 'Tailwind CSS'].map((tech) => (
                        <div key={tech} className="flex items-center gap-2 text-sm text-white/80">
                            <span className="text-blue-500">▹</span> {tech}
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
}
