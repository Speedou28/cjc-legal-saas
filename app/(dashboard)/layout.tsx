import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#1a202c]/80 backdrop-blur-md border-b border-[#2d3748] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">⚖️</span>
              </div>
              <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                LexiConsult
              </Link>
            </div>

            {/* Right Menu */}
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2d3748]/50 border border-[#374151]">
                <span className="text-xs text-[#94a3b8]">👤</span>
                <span className="text-sm text-[#cbd5e1]">valerie@cjc-avocats.com</span>
              </div>

              <Link
                href="/dashboard/admin"
                className="text-sm font-medium text-[#cbd5e1] hover:text-[#3b82f6] px-3 py-2 rounded-lg hover:bg-[#374151]/50 transition-all duration-200"
              >
                Admin
              </Link>

              <a
                href="/auth/login"
                className="text-sm font-medium text-[#cbd5e1] hover:text-[#ef4444] px-4 py-2 rounded-lg hover:bg-[#374151]/50 transition-all duration-200 border border-transparent hover:border-[#ef4444]/30"
              >
                Déconnexion
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2d3748] mt-20 py-8 text-center text-[#94a3b8] text-sm">
        <p>© 2024 LexiConsult. Tous droits réservés. Powered by Claude AI</p>
      </footer>
    </div>
  );
}
