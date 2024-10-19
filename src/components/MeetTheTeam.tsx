import React from 'react';
import Image from 'next/image';
import styles from '@/styles/MeetTheTeam.module.css';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  imageSrc: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Yinghou Wang",
    role: "Creative Technologist & PM",
    description: "Designer\n@Motorola Solutions\n\nlinktr.ee/yinghou",
    imageSrc: "/yinghou.jpg"
  },
  {
    name: "Daniel (Zhengyuhan) Yan",
    role: "Developer",
    description: "Creative Developer\n@Motorola Solutions",
    imageSrc: "/andrew.jpg"
  },
  {
    name: "Andrew Sosa Guaita",
    role: "Developer",
    description: "Data Science Researcher\n@Motorola Solutions",
    imageSrc: "/andrew.jpg"
  },
  {
    name: "Jinzhou Wan",
    role: "Product Manager",
    description: "Senior Design Lead\n@Motorola Solutions",
    imageSrc: "/andrew.jpg"
  },
  // Add more team members as needed
];

const MeetTheTeam: React.FC = () => {
    return (
      <div className={styles.frame}>
        <div className={styles.backgroundElements}>
          <Image className={styles.vectorIcon} alt="" src="/Vector 17316.svg" width={1229} height={614} />
          <div className={styles.ellipseDiv} />
          <Image className={styles.subtractIcon} alt="" src="/Subtract1.png" width={588} height={956} />
          <Image className={styles.subtractIconPng} alt="" src="/Subtract2.png" width={1150} height={1184} />
        </div>
        
        <div className={styles.sideBar}>
          <div className={styles.sideBarSymbol}>
            <Image src="/People.png" alt="Sidebar Symbol" width={50} height={50} layout="responsive" />
          </div>
          <div className={styles.rectangle} />
        </div>
      <div className={styles.contentWrapper}>
        <div className={styles.navigationBar}>
          {/* Add navigation bar content */}
        </div>
        
        <div className={styles.mainContent}>
          <h1 className={styles.meetTheTeam}>Meet the Team</h1>
          <p className={styles.teamDescription}>
            TIADA team is founded in July 2024, back-up by Motorola Solution DCX.
            Meet our main team members:
          </p>
          
          <div className={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <div key={index} className={styles.productInfoCard}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={member.imageSrc}
                    alt={member.name}
                    width={250}
                    height={250}
                    className={styles.memberImage}
                  />
                  <div className={styles.imageOverlay} />
                </div>
                <div className={styles.memberInfo}>
                  <h2 className={styles.memberName}>{member.name}</h2>
                  <h3 className={styles.memberRole}>{member.role}</h3>
                  <p className={styles.memberDescription}>{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.interestedSection}>
        <div className={styles.interestedGraphics}>
          <Image className={styles.group374021} alt="" src="/Group 374021.png" width={157} height={168} />
          <Image 
            className={styles.previewTheClientHappilyAc} 
            alt="" 
            src="/Happy-Client.png" 
            width={547}
            height={410}
          />
        </div>
          <div className={styles.interestedContent}>
            <h2 className={styles.interestedTitle}>Interested in TIADA team?</h2>
            <p className={styles.interestedDescription}>
              Leave your message here for us, we will reach back to you.
            </p>
            <form className={styles.contactForm}>
              <div className={styles.inputField}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="Your name" />
              </div>
              <div className={styles.inputField}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Contact email" />
              </div>
              <div className={styles.inputField}>
                <label htmlFor="message">Message</label>
                <textarea id="message" placeholder="Leave your message for us"></textarea>
              </div>
              <button type="submit" className={styles.submitButton}>Submit</button>
            </form>
          </div>
        </div>
      </div>
      
      <div className={styles.externalLinksWrapper}>
        <div className={styles.externalLinks}>
          <div className={styles.linkColumn}>
            <h3>Product</h3>
            <a href="#">Features</a>
            <a href="#">Security</a>
            <a href="#">Team</a>
            <a href="#">Enterprise</a>
            <a href="#">Customer stories</a>
            <a href="#">The ReadME Project</a>
            <a href="#">Pricing</a>
            <a href="#">Resources</a>
            <a href="#">Roadmap</a>
          </div>
          <div className={styles.linkColumn}>
            <h3>Platform</h3>
            <a href="#">Developer API</a>
            <a href="#">Partners</a>
            <a href="#">Electron</a>
            <a href="#">GitHub Desktop</a>
          </div>
          <div className={styles.linkColumn}>
            <h3>Support</h3>
            <a href="#">Docs</a>
            <a href="#">Community Forum</a>
            <a href="#">Professional Services</a>
            <a href="#">Skills</a>
            <a href="#">Status</a>
            <a href="#">Contact GitHub</a>
          </div>
          <div className={styles.linkColumn}>
            <h3>Company</h3>
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
            <a href="#">Inclusion</a>
            <a href="#">Social Impact</a>
            <a href="#">Shop</a>
          </div>
        </div>
      </div>
      
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerText}>
            <span>© 2024 Tiada</span>
            <span>Terms</span>
          </div>
          <div className={styles.socialIcons}>
            <Image src="/icon-facebook.svg" alt="Facebook" width={24} height={24} />
            <Image src="/icon-twitter.svg" alt="Twitter" width={24} height={24} />
            <Image src="/icon-youtube.svg" alt="YouTube" width={24} height={24} />
            <Image src="/icon-linkedin.svg" alt="LinkedIn" width={24} height={24} />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MeetTheTeam;