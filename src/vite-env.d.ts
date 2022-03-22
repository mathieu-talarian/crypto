/// <reference types="svelte" />
/// <reference types="vite/client" />

// eslint-disable-next-line @typescript-eslint/naming-convention
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_PUBLIC_RSA_KEY: string;
  readonly VITE_PRIVATE_RSA_KEY: string;
  readonly VITE_AES_GCM_KEY: string;
  // more env variables...
}

// eslint-disable-next-line @typescript-eslint/naming-convention
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
