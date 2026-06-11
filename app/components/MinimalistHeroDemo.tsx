import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { MinimalistHero } from "./ui/minimalist-hero";
import NewLandingSpinnerSection from "./NewLandingSpinnerSection";

export default function MinimalistHeroDemo() {
  return (
    <main className="relative isolate bg-white">
      <section className="relative z-0 h-[200vh]">
        <div className="sticky top-0 z-0 h-screen overflow-hidden bg-white">
          <MinimalistHero
            logoText="nüll."
            navLinks={[
              { label: "Blog", href: "/blog" },
              { label: "LEISTUNGEN", href: "#services" },
            ]}
            categoryLinks={[
              { label: "Anwälte & Berater", href: "/kanzlei-websites" },
              { label: "Ärzte & Praxen", href: "/arztpraxis-websites" },
            ]}
            ctaLink={{ label: "Anfrage starten", href: "#contact" }}
            mainText="Websites, SEO und Google Ads für Unternehmen in Deutschland. Damit aus Suchen echte Anfragen werden."
            readMoreLink="#services"
            readMoreLabel="Mehr erfahren"
            imageSrc="/assets/new-landing/arrow.webp"
            imageAlt="Black cursor over a blue circle."
            overlayText={{
              part1: "be found.",
              part2: "be chosen.",
            }}
            socialLinks={[
              { icon: Facebook, href: "#", label: "Facebook" },
              { icon: Instagram, href: "#", label: "Instagram" },
              { icon: Twitter, href: "#", label: "Twitter" },
              { icon: Linkedin, href: "https://www.linkedin.com/company/n%C3%BCll/", label: "LinkedIn" },
            ]}
            locationText="Mannheim, DE"
          />
        </div>
      </section>
      <div className="relative z-20 -mt-[100vh] min-h-screen bg-white">
        <NewLandingSpinnerSection />
      </div>
    </main>
  );
}
