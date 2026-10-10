import React, { useState } from 'react';
import { X, Github, Copy, Check, Terminal, ExternalLink, GitBranch, ArrowUpRight } from 'lucide-react';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({ isOpen, onClose }) => {
  const [repoUrl, setRepoUrl] = useState('https://github.com/your-username/nexus-nepal.git');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const pushCommand = `# Push Nexus Nepal to your GitHub repository:
git remote add origin ${repoUrl}
git branch -M main
git push -u origin main`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pushCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#3B4A1F]/20 animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-[#5C6678] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl text-[#14161A]">Push to GitHub</h2>
            <p className="text-xs text-[#5C6678]">
              Deploy and sync the combined Nexus Nepal repository
            </p>
          </div>
        </div>

        <div className="mt-4 p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Git Status:</strong> Local repository initialized with branch <code className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded">main</code>. All combined files & auth assets are staged and committed.
          </span>
        </div>

        {/* Remote URL Configuration */}
        <div className="mt-5">
          <label className="block text-xs font-bold text-[#14161A] mb-1">
            Your Target GitHub Repository URL:
          </label>
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/username/nexus-nepal.git"
            className="w-full text-xs font-mono bg-gray-50 border border-gray-300 rounded-xl py-2.5 px-3.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
          />
        </div>

        {/* Command Box */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-[#5C6678] flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>One-Click Push Commands:</span>
            </span>
            <button
              onClick={handleCopy}
              className="text-xs text-[#3B4A1F] hover:text-black font-semibold flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Commands</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 bg-gray-900 text-emerald-400 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed shadow-inner">
            {pushCommand}
          </pre>
        </div>

        {/* GitHub Direct Link Button */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href="https://github.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>Create New Repo on GitHub</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-[#3B4A1F] hover:bg-[#232D0F] text-[#F5EEDC] text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
