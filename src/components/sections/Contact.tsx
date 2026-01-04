"use client";

import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { Mail } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="section-padding py-32 text-center">
      <div className="container mx-auto max-w-2xl">
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
        >
            <p className="text-blue-400 mb-4 font-mono">04. What&apos;s Next?</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h2>
            <p className="text-white/60 mb-10 text-lg leading-relaxed">
                Although I&apos;m not currently looking for any new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
            </p>
            
            <a href="mailto:example@email.com">
                <Button variant="outline" className="px-8 py-4 text-lg border-blue-500 text-blue-400 hover:bg-blue-500/10">
                    <Mail className="inline-block mr-2 w-5 h-5" />
                    Say Hello
                </Button>
            </a>
        </motion.div>
      </div>
    </section>
  );
}
