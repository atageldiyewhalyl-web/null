/// <reference types="vite/client" />

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.webp?format=webp&w=1200" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.css" {
  const src: string;
  export default src;
}

declare module "*.css?url" {
  const src: string;
  export default src;
}
