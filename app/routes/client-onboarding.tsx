import type { MetaFunction } from "react-router";
import { useParams } from "react-router";
import { OnboardingFlow } from "../onboarding/components/OnboardingFlow";
import { Wordmark } from "../onboarding/components/ui";
import { UI } from "../onboarding/i18n";
import { questionnaires } from "../onboarding/questionnaires";

export const meta: MetaFunction = ({ params }) => {
  const q = params.slug ? questionnaires[params.slug] : undefined;
  return [
    { title: q ? `${q.client.name} – Client Onboarding | nüll.` : "Client Onboarding | nüll." },
    { name: "description", content: q ? q.title : "nüll. Client Onboarding" },
    { name: "robots", content: "noindex, nofollow" },
    { name: "theme-color", content: "#ffffff" },
  ];
};

export default function ClientOnboardingRoute() {
  const { slug } = useParams();
  const q = slug ? questionnaires[slug] : undefined;

  if (!q) {
    return (
      <main lang="de" className="mx-auto flex min-h-[100dvh] max-w-[40rem] flex-col justify-center px-6">
        <Wordmark />
        <h1 className="mt-10 text-[clamp(2.2rem,9vw,3.6rem)] font-bold leading-[0.95] tracking-[-0.06em]">
          {UI.de.notFoundTitle}<span className="text-[#007aff]">.</span>
        </h1>
        <p className="mt-5 text-[1.05rem] leading-relaxed text-[#424245]">
          {UI.de.notFoundBody}
        </p>
      </main>
    );
  }

  return <OnboardingFlow q={q} />;
}
