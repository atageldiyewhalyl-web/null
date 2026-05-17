import { PassThrough } from "node:stream";
import type { AppLoadContext, EntryContext } from "react-router";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  loadContext: AppLoadContext
) {
  return new Promise((resolve, reject) => {
    let abortTimer: ReturnType<typeof setTimeout>;
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter
        context={routerContext}
        url={request.url}
      />,
      {
        onAllReady() {
          clearTimeout(abortTimer);
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          clearTimeout(abortTimer);
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          console.error("SSR Error:", error);
        },

      }
    );

    abortTimer = setTimeout(abort, ABORT_DELAY);
  });
}
