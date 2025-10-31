export function Footer() {
  return (
    <footer className="border-t border-green-muted bg-gradient-to-b from-white to-green-muted">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-black md:flex-row">
        <p>&copy; {new Date().getFullYear()} <span className="text-green-dark font-semibold">Pixel</span><span className="text-black font-semibold">Primp</span>. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#privacy" className="hover:text-green-dark font-medium transition-colors">
            Privacy
          </a>
          <a href="#terms" className="hover:text-green-dark font-medium transition-colors">
            Terms
          </a>
        </div>
      </div>
    </footer>
  )
}
