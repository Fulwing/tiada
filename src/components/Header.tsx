// components/Header.tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/">
          <Image src="/Group37402.svg" alt="Tiada Logo" width={21} height={24} className={styles.logo} />
        </Link>
        <div className={styles.navLinks}>
          <Link href="/home">
            <span className={styles.navItem}>Home</span>
          </Link>
          <span className={styles.navItem}>About Tiada</span>
          <Link href="/meet-the-team">
            <span className={styles.navItem}>Team</span>
          </Link>
        </div>
        <div className={styles.authLinks}>
          <button className={styles.signUp}>Sign up</button>
          <span className={styles.logIn}>Log In</span>
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

