import React, { useState } from 'react';
import { X, Github, Copy, Check, Terminal, GitBranch, ArrowUpRight } from 'lucide-react';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({ isOpen, onClose }) => {
  const [repoUrl, setRepoUrl] = useState('https://github.com/technologhistic/Nexus-Nepal-demo.git');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-lg p-6 sm:p-8 shadow-xl border border-[#14161A]/15">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100 text-[#5C6678] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-md bg-[#14161A] text-white flex items-center justify-center">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl text-[#14161A]">Push to GitHub</h2>
            <p className="text-xs text-[#5C6678]">
              Deploy and sync the Nexus Nepal codebase
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200 text-xs text-[#14161A] flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-[#556B2F] shrink-0" />
          <span>
            <strong>Git Status:</strong> Local repository initialized with branch <code className="font-mono bg-gray-200 px-1 py-0.5 rounded-xs">main</code>. All files are committed.
          </span>
        </div>

        {/* Remote URL Configuration */}
        <div className="mt-5">
          <label className="block text-xs font-semibold text-[#14161A] mb-1">
            Your Target GitHub Repository URL:
          </label>
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/username/nexus-nepal.git"
            className="w-full text-xs font-mono bg-gray-50 border border-gray-300 rounded-md py-2.5 px-3.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
          />
        </div>

        {/* Command Box */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-[#5C6678] flex items-center gap-1.5">
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
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 bg-gray-900 text-emerald-400 rounded-md text-xs font-mono overflow-x-auto leading-relaxed">
            {pushCommand}
          </pre>
        </div>

        {/* Modal Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          <a
            href="https://github.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-4 rounded-md bg-gray-900 hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>Create New Repo on GitHub</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-md bg-[#3B4A1F] hover:bg-[#232D0F] text-[#F5EEDC] text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
