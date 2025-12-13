import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

type Crumb = { href: string; label: string };

interface BreadcrumbProps {
  title?: string;
  description?: string;
  homePath?: string;
}

const formatLabel = (segment: string) => {
  const cleaned = segment.replace(/^:/, "");
  return cleaned
    .split(/[-_]/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
};

export default function Breadcrumb({
  title,
  description,
  homePath = "/",
}: BreadcrumbProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [crumbs, setCrumbs] = useState<Crumb[]>([]);

  const segments = useMemo(
    () => location.pathname.split("/").filter(Boolean),
    [location.pathname]
  );

  useEffect(() => {
    document.title = title ? `${title} | K2AN SLMS` : "K2AN SLMS";
    const next: Crumb[] = segments.map((part, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      return { href, label: formatLabel(part) };
    });
    setCrumbs(next);
  }, [segments]);

  const redirect = (path: string) => navigate(path);

  return (
    <div className="space-y-0">
      <nav aria-label="Breadcrumb">
        <ol className="my-2 flex items-center font-semibold text-gray-500 dark:text-white-dark">
          <li className="flex items-center">
            <button
              type="button"
              onClick={() => redirect(homePath)}
              className="flex items-center hover:text-gray-600 dark:hover:text-white-dark/70"
              aria-current={location.pathname === homePath ? "page" : undefined}
            >
              Home
            </button>
          </li>
          {crumbs.map((b, i) => (
            <li key={b.href} className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              {i === crumbs.length - 1 ? (
                <span
                  className="text-black dark:text-white-light"
                  aria-current="page"
                >
                  {b.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => redirect(b.href)}
                  className="text-black hover:text-black/70 dark:text-white-light dark:hover:text-white-light/70"
                >
                  {b.label}
                </button>
              )}
            </li>
          ))}
        </ol>
      </nav>
      {title && <h1 className="text-2xl font-medium">{title}</h1>}
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {description}
        </p>
      )}
    </div>
  );
}
