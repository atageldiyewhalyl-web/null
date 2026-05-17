import { redirect, type LoaderFunctionArgs } from "react-router";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const rest = params["*"]?.replace(/^\/+/, "") ?? "";
  const targetPath = rest ? `/${rest}` : "/";
  url.searchParams.delete("lang");

  throw redirect(`${targetPath}${url.search}${url.hash}`, 301);
}

export default function LegacyTurkishRedirect() {
  return null;
}
