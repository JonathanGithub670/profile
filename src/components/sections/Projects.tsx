"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Card from '../ui/Card';
import Image from 'next/image';
import { ExternalLink, Github, X, Youtube } from 'lucide-react';

const projects = [
  {
    title: 'Company Website with Attendance',
    description: 'A comprehensive company website integrated with an attendance system. Features include employee management and real-time tracking.',
    image: '/image/company.png',
    tags: ['React.js', 'Node.js', 'PostgreSQL'],
    links: { demo: 'https://naras-logistik.com/', github: '#' },
  },
  {
    title: 'Laundry POS System',
    description: 'A Point of Sale system designed for laundry businesses. Streamlines transactions and order management.',
    image: '/image/laundry.png',
    tags: ['Flutter', 'Node.js', 'SQLite'],
    links: { demo: '#', github: '#' },
  },
  {
    title: 'Appointment Booking App',
    description: 'An application for scheduling appointments. Users can browse available slots and book appointments easily.',
    image: '/image/laravel.png',
    tags: ['Laravel', 'React.js', 'MySQL'],
    links: { demo: '#', github: 'https://github.com/JonathanGithub670/aplikasi-janji-temu-dosen', youtube: 'https://youtu.be/gX8hT56Bj4g' },
  },
];

export default function Projects() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="projects" className="section-padding">
      <div className="container mx-auto">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
        >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">featured projects<span className="text-purple-500">.</span></h2>
            <p className="text-white/60">Check out some of my recent work.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card className="h-full flex flex-col group">
                        <div className="h-48 bg-white/5 rounded-xl mb-6 overflow-hidden relative">
                             {project.image ? (
                                <div 
                                    className="relative w-full h-full cursor-pointer"
                                    onClick={() => setSelectedImage(project.image!)}
                                >
                                    <img 
                                        src={project.image} 
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                             ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center text-white/20">
                                    Project Preview
                                </div>
                             )}
                        </div>
                        
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">{project.title}</h3>
                            <div className="flex gap-3">
                                <a href={project.links.github} className="text-white/60 hover:text-white"><Github size={20} /></a>
                                <a href={project.links.demo} className="text-white/60 hover:text-white" target="_blank" rel="noopener noreferrer"><ExternalLink size={20} /></a>
                                {(project.links as any).youtube && (
                                    <a href={(project.links as any).youtube} className="text-white/60 hover:text-white" target="_blank" rel="noopener noreferrer">
                                        <Youtube size={20} />
                                    </a>
                                )}
                            </div>
                        </div>
                        
                        <p className="text-white/70 mb-6 flex-grow text-sm leading-relaxed">
                            {project.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 text-xs font-mono text-blue-300">
                            {project.tags.map(tag => (
                                <span key={tag} className="bg-blue-500/10 px-2 py-1 rounded">{tag}</span>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedImage(null)}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative max-w-4xl w-full aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-white/10"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <Image
                        src={selectedImage}
                        alt="Project Preview"
                        fill
                        className="object-contain"
                    />
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
