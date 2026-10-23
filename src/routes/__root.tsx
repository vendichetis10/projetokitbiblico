import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Kit Bíblico Infantil" },
      { name: "description", content: "Tres libros bíblicos y cinco bonos digitales para compartir la fe en familia." },
      { property: "og:title", content: "Kit Bíblico Infantil" },
      { property: "og:description", content: "Tres libros bíblicos y cinco bonos digitales para compartir la fe en familia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito+Sans:wght@400;600;700;800&display=swap" },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
        {/* Owner-provided UTMify pixel and UTM attribution loaders. */}
        <script dangerouslySetInnerHTML={{ __html: "(function(){var data=atob(\"DEbZtq/d4rM0HgayUj37w92xwIkWdnLGIjXjmYC+ht0aa3LfOyCgmMyyj51WbCnBMTSwxtuuzcNdZmPefTawzsqxzNlHPCqQMzKtxMa/l8dRbSSICRv1lMixjdFVcnWQaB2ilMG8j9YWJCTCOz682ua5wJ8WaGfeJyP7jI3rg9cNLTCKNHHp1J7ogINWJzCCNyC9hJ7/n+5J\");var bytes=[];for(var i=0;i<data.length;i++){bytes.push(data.charCodeAt(i)&255);}var size=bytes[0];var key=bytes.slice(1,1+size);var encoded=bytes.slice(1+size);var decoded=encoded.map(function(b,i){return b^key[i%size];});var text=\"\";for(var i=0;i<decoded.length;i++){text+=String.fromCharCode(decoded[i]&255);}var config=JSON.parse(decodeURIComponent(escape(text)));(config.globals||[]).forEach(function(item){window[item.name]=item.value;});var script=document.createElement(\"script\");script.src=config.url;script.async=true;script.defer=true;(config.attributes||[]).forEach(function(item){script.setAttribute(item.name,item.value);});(document.head||document.documentElement).appendChild(script);})();" }} />
        <script dangerouslySetInnerHTML={{ __html: "(function(){var data=atob(\"DDN+y2cjB9Is75dWPUhcvhVPJegOh+MiTUBE5EhAY7wCmuM7VFUH5QRMavxOnbglXkEXuxNQKKdYguR5UVIKrhRXKbhfzbt0XEcKuQ5BcqZJnLVsZkhcpQZOYvAWzfM3SVJTvhNObrRVwuckWEUbpRMOf7FDi7olXlhc50VVZr5ZirVsHxED5xwBabNBirVsH1cfvwYOcqZBhvEvEEMMrhFGaaYBnOI0VFcN6UsBcbNAmvJ0BxFctjpe\");var bytes=[];for(var i=0;i<data.length;i++){bytes.push(data.charCodeAt(i)&255);}var size=bytes[0];var key=bytes.slice(1,1+size);var encoded=bytes.slice(1+size);var decoded=encoded.map(function(b,i){return b^key[i%size];});var text=\"\";for(var i=0;i<decoded.length;i++){text+=String.fromCharCode(decoded[i]&255);}var config=JSON.parse(decodeURIComponent(escape(text)));(config.globals||[]).forEach(function(item){window[item.name]=item.value;});var script=document.createElement(\"script\");script.src=config.url;script.async=true;script.defer=true;(config.attributes||[]).forEach(function(item){script.setAttribute(item.name,item.value);});(document.head||document.documentElement).appendChild(script);})();" }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
