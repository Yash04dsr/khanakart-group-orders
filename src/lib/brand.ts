type Brand = {
  id: "crowdplate" | "khanakart";
  name: "CrowdPlate" | "KhanaKart";
  domain: string;
  mark: string;
  description: string;
};

const isKhanaKartHost =
  typeof window !== "undefined" &&
  (window.location.hostname === "khanakart.me" ||
    window.location.hostname.endsWith(".khanakart.me"));

export const BRAND: Brand = isKhanaKartHost
  ? {
      id: "khanakart",
      name: "KhanaKart",
      domain: "khanakart.me",
      mark: "/khanakart-mark.svg",
      description:
        "KhanaKart is a shared session for campus group orders. Everyone adds their items. You place one order at any outlet.",
    }
  : {
      id: "crowdplate",
      name: "CrowdPlate",
      domain: "crowdplate.online",
      mark: "/crowdplate-mark.svg",
      description:
        "CrowdPlate is a shared session for campus group orders. Everyone adds their items. You place one order at any outlet.",
    };

export const applyBrandToDocument = () => {
  document.documentElement.dataset.brand = BRAND.id;
  document.title = `${BRAND.name} — Group ordering for campus outlets`;

  const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  const author = document.querySelector<HTMLMetaElement>('meta[name="author"]');
  const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
  const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');

  if (description) description.content = BRAND.description;
  if (author) author.content = BRAND.name;
  if (ogTitle) ogTitle.content = document.title;
  if (favicon) favicon.href = BRAND.mark;
};
