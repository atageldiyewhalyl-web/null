import FlyerCheck from "../components/v2/FlyerCheck";

// /check-flyer: landing page for the QR code on the printed flyers. Not for search: noindex.
export function meta() {
  return [
    { title: "Kostenloser Website-Check & Angebot | nüll." },
    { name: "description", content: "Note von 0 bis 100 und deine drei wichtigsten Baustellen in etwa einer Minute. Dein Angebot bekommst du danach per WhatsApp." },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function CheckFlyerRoute() {
  return <FlyerCheck />;
}
