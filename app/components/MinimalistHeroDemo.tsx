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
              { label: "BLOG", href: "/blog" },
              { label: "CONTACT", href: "#contact" },
              { label: "LEISTUNGEN", href: "#services" },
              { label: "PORTFOLIO", href: "#portfolio" },
            ]}
            mainText="We help businesses get found, build trust, and turn visibility into real inquiries."
            readMoreLink="#"
            imageSrc="/assets/new-landing/arrow.webp"
            imageAlt="Black cursor over a blue circle."
            overlayText={{
              part1: "be found.",
              part2: "be chosen.",
            }}
            socialLinks={[
              { icon: Facebook, href: "#" },
              { icon: Instagram, href: "#" },
              { icon: Twitter, href: "#" },
              { icon: Linkedin, href: "#" },
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
