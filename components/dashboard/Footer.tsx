export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white px-8 py-6">
      {/* Thin divider at the top */}
      <div className="border-t border-black/10 mb-6" />

      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-black/40">
        <p>
          &copy; {currentYear} 24Ghonta. All rights reserved.
        </p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <span className="hover:text-red-600 transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-red-600 transition-colors cursor-pointer">Support</span>
          <span className="hover:text-red-600 transition-colors cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}