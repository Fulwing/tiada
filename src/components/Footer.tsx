import React from 'react';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0d1117] pt-10 pb-[34px] relative">
      <div className="container mx-auto px-20">
        <div className="flex justify-between mb-8">
          <div className="w-[416px] pt-8">
            <Image src="/TIADA.png" alt="Tiada Logo" width={84} height={30} />
          </div>
          <div className="w-52 pt-0.5 pb-4">
            <h3 className="text-[#8b949e] text-[13px] mb-[19px]">Product</h3>
            <ul className="text-[#8b949e] text-sm space-y-[17.5px]">
              <li>Features</li>
              <li>Security</li>
              <li>Team</li>
              <li>Enterprise</li>
              <li>Customer stories</li>
              <li>The ReadME Project</li>
              <li>Pricing</li>
              <li>Resources</li>
              <li>Roadmap</li>
            </ul>
          </div>
          <div className="w-52 pt-0.5 pb-[183.5px]">
            <h3 className="text-[#8b949e] text-[13px] mb-[19px]">Platform</h3>
            <ul className="text-[#8b949e] text-sm space-y-[17.5px]">
              <li>Developer API</li>
              <li>Partners</li>
              <li>Electron</li>
              <li>GitHub Desktop</li>
            </ul>
          </div>
          <div className="w-52 pt-0.5 pb-[116.5px]">
            <h3 className="text-[#8b949e] text-[13px] mb-[19px]">Support</h3>
            <ul className="text-[#8b949e] text-sm space-y-[17.5px]">
              <li>Docs</li>
              <li>Community Forum</li>
              <li>Professional Services</li>
              <li>Skills</li>
              <li>Status</li>
              <li>Contact GitHub</li>
            </ul>
          </div>
          <div className="w-52 pt-0.5 pb-[83px]">
            <h3 className="text-[#8b949e] text-[13px] mb-[19px]">Company</h3>
            <ul className="text-[#8b949e] text-sm space-y-[17.5px]">
              <li>About</li>
              <li>Blog</li>
              <li>Careers</li>
              <li>Press</li>
              <li>Inclusion</li>
              <li>Social Impact</li>
              <li>Shop</li>
            </ul>
          </div>
          </div>
        <div className="bg-[#161b22] py-[25px] px-4 flex justify-between items-center">
          <div className="flex text-[#8b949e] text-xs space-x-4">
            <span>© 2024 Tiada</span>
            <span>Terms</span>
            <span>Privacy</span>
            <span>Sitemap</span>
            <span>What is Tiada?</span>
          </div>
          <div className="flex items-center space-x-4">
            <Image src="/twitter-icon.svg" alt="Twitter" width={22} height={18} />
            <Image src="/facebook-icon.svg" alt="Facebook" width={18} height={18} />
            <Image src="/linkedin-icon.svg" alt="LinkedIn" width={19} height={18} />
            <Image src="/youtube-icon.svg" alt="YouTube" width={23} height={16} />
            <Image src="/twitch-icon.svg" alt="Twitch" width={18} height={18} />
            <Image src="/tiktok-icon.svg" alt="TikTok" width={18} height={18} />
            <Image src="/github-icon.svg" alt="GitHub" width={20} height={20} />
          </div>
        </div>
      </div>
      <div className="absolute bottom-[42px] left-20">
        <Image src="/Group-3740.svg" alt="Tiada Logo" width={21} height={24} />
      </div>
    </footer>
  );
};

export default Footer;

