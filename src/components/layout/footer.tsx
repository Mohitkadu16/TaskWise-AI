import Link from 'next/link';
import { Github, Linkedin, Instagram, Mail, Globe } from 'lucide-react';

export default function Footer() {
  // Replace these URLs with your real links
  const links = [
    { label: 'Project GitHub', href: 'https://github.com/Mohitkadu16/TaskWise-AI', icon: Github },
    { label: 'My GitHub', href: 'https://github.com/Mohitkadu16/', icon: Github },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mohit-kadu-856410243', icon: Linkedin },
    { label: 'Instagram', href: 'https://www.instagram.com/loyalmanuka', icon: Instagram },
    { label: 'Email', href: 'mailto:mohitkadu13@gmail.com', icon: Mail },
    { label: 'Portfolio', href: 'https://mohitkadu.vercel.app', icon: Globe },
  ];

  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/90 backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl px-4 flex items-center justify-between gap-3 h-16">
        <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} TaskWise AI</div>

        <nav aria-label="footer" className="flex flex-wrap items-center gap-3">
          {links.map((l) => {
            const Icon = l.icon;
            // Use anchor for external links
            return (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium hover:bg-accent/10"
                aria-label={l.label}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{l.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}
