export default function Footer() {
  return (
    <footer className="py-8 text-center text-white/40 text-sm">
      <div className="container mx-auto px-6">
        <p>Designed & Built by Your Name</p>
        <p className="mt-2 text-xs">© {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
}
