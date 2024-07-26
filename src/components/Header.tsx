// components/Header.tsx
import Link from 'next/link';

const Header = () => {
  return (
    <header className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 shadow-md fixed top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center px-4">
        <Link href="/">
          <h1 className="text-4xl font-bold">TIADA</h1>
        </Link>
        <div className="flex space-x-4">
          <Link href="/">
            <button className="text-lg font-semibold hover:text-gray-200 transition-colors">Home</button>
          </Link>
          {/* <Link href="/steps">
            <button className="text-lg font-semibold hover:text-gray-200 transition-colors">Steps</button>
          </Link>
          <Link href="/generate">
            <button className="text-lg font-semibold hover:text-gray-200 transition-colors">Generate</button>
          </Link>
          <Link href="/results">
            <button className="text-lg font-semibold hover:text-gray-200 transition-colors">Results</button>
          </Link> */}
          <Link href="/about">
            <button className="text-lg font-semibold hover:text-gray-200 transition-colors">About</button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;

// grey verison
// import Link from 'next/link';

// const Header = () => {
//   return (
//     <header className="w-full bg-gradient-to-br from-[#333] to-[#505050] text-white py-4 shadow-md fixed top-0 left-0 z-50">
//       <nav className="container mx-auto flex justify-between items-center px-4">
//         <h1 className="text-4xl font-bold">TIADA</h1>
//         <div className="flex space-x-4">
//           <Link href="/">
//             <button className="text-lg font-semibold hover:text-gray-200 transition-colors">Home</button>
//           </Link>
//           <Link href="/steps">
//             <button className="text-lg font-semibold hover:text-gray-200 transition-colors">Steps</button>
//           </Link>
//           <Link href="/generate">
//             <button className="text-lg font-semibold hover:text-gray-200 transition-colors">Generate</button>
//           </Link>
//           <Link href="/results">
//             <button className="text-lg font-semibold hover:text-gray-200 transition-colors">Results</button>
//           </Link>
//           <Link href="/about">
//             <button className="text-lg font-semibold hover:text-gray-200 transition-colors">About</button>
//           </Link>
//           <Link href="/teststeps">
//             <button className="text-lg font-semibold hover:text-gray-200 transition-colors">Test Steps</button>
//           </Link>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;

