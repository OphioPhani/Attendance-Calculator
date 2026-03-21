import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700/50 py-6 px-4 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left side - Copyright */}
        <div className="text-center md:text-left">
          <p className="text-sm text-slate-300">
            &copy; {currentYear} Smart Attendance Calculator
          </p>
        </div>

        {/* Center - App Info */}
        <div className="text-center">
          <p className="text-sm text-slate-400">
            Matrusri Engineering College
          </p>
        </div>

        {/* Right side - Creator */}
        <div className="text-center md:text-right">
          <p className="text-sm text-slate-300">
            Website created by{' '}
            <span className="font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Ganji Phani Chandra
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
