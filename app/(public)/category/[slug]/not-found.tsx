import Link from 'next/link';

// Ensure this is a default export of a function returning JSX
export default function CategoryNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <h2 className="text-[64px] font-black text-neutral-800 leading-none">৪০৪</h2>
      <p className="text-[20px] font-bold text-neutral-600 mt-4">
        দুঃখিত, এই বিভাগটি খুঁজে পাওয়া যায়নি।
      </p>
      <Link 
        href="/" 
        className="mt-8 px-8 py-3 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-colors"
      >
        মূল পাতায় ফিরে যান
      </Link>
    </div>
  );
}