import React, { useState } from 'react';
import { Github, Linkedin, Instagram, X, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showSocial, setShowSocial] = useState(false);

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/OphioPhani',
      icon: Github,
      color: 'text-cyan-400',
      hoverColor: 'hover:border-cyan-400/50',
      bgColor: 'hover:bg-cyan-400/10',
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/ganji-phani-chandra-730809380/',
      icon: Linkedin,
      color: 'text-blue-400',
      hoverColor: 'hover:border-blue-400/50',
      bgColor: 'hover:bg-blue-400/10',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/2h4ni_/',
      icon: Instagram,
      color: 'text-pink-400',
      hoverColor: 'hover:border-pink-400/50',
      bgColor: 'hover:bg-pink-400/10',
    },
  ];

  return (
    <>
      {/* Main Footer */}
      <footer className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700/50 relative z-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between gap-4">
            {/* Left - Copyright */}
            <div className="flex-1">
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <span>&copy; {currentYear} Attendance Calculator</span>
                <span className="text-xs">|</span>
                <span>Made with</span>
                <Heart size={14} className="text-red-400 fill-red-400" />
                <span>by</span>
                <span className="font-semibold text-slate-300">Ganji Phani Chandra</span>
              </p>
            </div>

            {/* Right - Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg border border-slate-600/30 transition-all duration-300 ${link.bgColor} ${link.hoverColor}`}
                    title={link.name}
                  >
                    <IconComponent size={18} className={link.color} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-4">
            {/* Copyright */}
            <div className="text-center">
              <p className="text-xs text-slate-400">
                &copy; {currentYear} Attendance Calculator
              </p>
            </div>

            {/* Creator Name (Clickable) */}
            <div className="text-center">
              <button
                onClick={() => setShowSocial(true)}
                className="text-sm text-slate-300 hover:text-slate-100 transition-colors"
              >
                Made with <Heart size={12} className="text-red-400 fill-red-400 inline mx-1" /> by{' '}
                <span className="font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Ganji Phani Chandra
                </span>
              </button>
            </div>

            {/* Social Icons */}
            <div className="flex items-center justify-center gap-3">
              {socialLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg border border-slate-600/30 transition-all duration-300 ${link.bgColor} ${link.hoverColor}`}
                    title={link.name}
                  >
                    <IconComponent size={18} className={link.color} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </footer>

      {/* Social Links Modal - For Mobile */}
      {showSocial && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setShowSocial(false)}
        >
          <div
            className="bg-gradient-to-br from-slate-800 via-slate-750 to-slate-900 rounded-2xl p-8 max-w-sm w-full border border-slate-700/50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Connect with Me
              </h3>
              <button
                onClick={() => setShowSocial(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              {socialLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowSocial(false)}
                    className="flex items-center gap-3 p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/60 transition-colors border border-slate-600/30 hover:border-slate-600/60 group"
                  >
                    <IconComponent size={24} className={link.color} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-200 group-hover:text-slate-100">
                        {link.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {link.name === 'GitHub' && '@OphioPhani'}
                        {link.name === 'LinkedIn' && 'Ganji Phani Chandra'}
                        {link.name === 'Instagram' && '@2h4ni_'}
                      </p>
                    </div>
                    <span className="text-slate-500 group-hover:text-slate-300">→</span>
                  </a>
                );
              })}
            </div>

            <p className="text-xs text-slate-500 text-center mt-6">
              Click to open in new tab ↗
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
