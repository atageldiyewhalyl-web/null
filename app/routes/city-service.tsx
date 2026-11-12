import { useParams } from "react-router";
import CityPageV2 from "../components/v2/CityPageV2";
import { cityPage, SERVICE_LABEL, SERVICE_SLUG } from "../components/v2/cities";
import { SERVICES } from "../components/v2/links";

// /leistungen/:service/:city: local service pages (data: components/v2/cities.ts). Unknown combinations show "not found".
export function meta({ params }: { params: { service?: string; city?: string } }) {
  const page = cityPage(params.city, params.service);
  if (!page) return [{ title: "Seite nicht gefunden | nüll." }, { name: "robots", content: "noindex, nofollow" }];
  const url = `https://nuell-agentur.com/leistungen/${SERVICE_SLUG[page.service]}/${page.slug}`;
  const image = page.video ? `https://nuell-agentur.com${page.video.prefix}-poster.jpg` : "https://nuell-agentur.com/og-image.png";
  return [
    { title: page.metaTitle },
    { name: "description", content: page.metaDescription },
    { property: "og:title", content: page.metaTitle },
    { property: "og:description", content: page.metaDescription },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "de_DE" },
    { property: "og:site_name", content: "nüll." },
    { property: "og:image", content: image },
    { property: "og:image:alt", content: `${SERVICE_LABEL[page.service]} in ${page.name}: nüll.` },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: page.metaTitle },
    { name: "twitter:description", content: page.metaDescription },
    { name: "twitter:image", content: image },
    { tagName: "link", rel: "canonical", href: url },
  ];
}

export default function CityServiceRoute() {
  const { service, city } = useParams();
  const page = cityPage(city, service);
  if (!page) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-white px-4 text-center">
        <div>
          <h1 className="text-[2.4rem] font-bold tracking-[-0.05em] text-[#0e0e10]">Seite nicht gefunden<span className="text-[#007aff]">.</span></h1>
          <a href={SERVICES} className="mt-6 inline-block border-b-2 border-[#111111] pb-0.5 font-black tracking-[-0.04em] text-[#111111]">Alle Leistungen</a>
        </div>
      </main>
    );
  }
  return <CityPageV2 key={`${page.service}-${page.slug}`} city={page} />;
}
