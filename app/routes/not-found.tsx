export function meta() {
  return [
    { title: "Seite nicht gefunden | nüll." },
    {
      name: "description",
      content:
        "Diese Seite existiert nicht oder wurde verschoben. Zurück zur Startseite von nüll.",
    },
    { name: "robots", content: "noindex, follow" },
  ];
}

export default function NotFoundRoute() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
        404
      </p>
      <h1 className="mt-4 text-3xl font-black tracking-tight text-[#050505] sm:text-4xl">
        Diese Seite gibt es nicht.
      </h1>
      <p className="mt-4 max-w-md text-base text-neutral-600">
        Der Link ist veraltet oder die Seite wurde verschoben. Springe zurück zur
        Startseite oder zu unseren Leistungen.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a
          href="/"
          className="rounded-full bg-[#050505] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Zur Startseite
        </a>
        <a
          href="/leistungen/webdesign"
          className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-[#050505] transition hover:border-neutral-500"
        >
          Unsere Leistungen
        </a>
      </div>
    </main>
  );
}
