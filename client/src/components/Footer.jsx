import React, { useState } from 'react';
import { Github, Linkedin, Instagram, X } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showSocial, setShowSocial] = useState(false);

  return (
    <>
      <footer className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700/50 py-6 px-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side - Copyright */}
          <div className="text-center md:text-left">
            <p className="text-sm text-slate-300">
              &copy; {currentYear} Attendance Calculator
            </p>
          </div>

          {/* Center - Empty */}
          <div className="text-center"></div>

          {/* Right side - Creator (Clickable) */}
          <div className="text-center md:text-right">
            <button
              onClick={() => setShowSocial(true)}
              className="text-sm text-slate-300 hover:text-slate-100 transition-colors cursor-pointer"
            >
              Website created by{' '}
              <span className="font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent hover:from-cyan-300 hover:to-blue-300">
                Ganji Phani Chandra
              </span>
            </button>
          </div>
        </div>
      </footer>

      {/* Social Links Modal */}
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
              {/* GitHub */}
              <a
                href="https://github.com/OphioPhani"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/60 transition-colors border border-slate-600/30 hover:border-cyan-400/50"
              >
                <Github size={20} className="text-cyan-400" />
                <div>
                  <p className="text-sm font-medium text-slate-200">GitHub</p>
                  <p className="text-xs text-slate-400">@OphioPhani</p>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/ganji-phani-chandra-730809380/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/60 transition-colors border border-slate-600/30 hover:border-blue-400/50"
              >
                <Linkedin size={20} className="text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-slate-200">LinkedIn</p>
                  <p className="text-xs text-slate-400">Ganji Phani Chandra</p>
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/2h4ni_/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/60 transition-colors border border-slate-600/30 hover:border-pink-400/50"
              >
                <Instagram size={20} className="text-pink-400" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Instagram</p>
                  <p className="text-xs text-slate-400">@2h4ni_</p>
                </div>
              </a>
            </div>

            <p className="text-xs text-slate-500 text-center mt-6">
              Click to visit ↗
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
