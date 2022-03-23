/// <reference types="svelte" />
/// <reference types="vite/client" />

// eslint-disable-next-line @typescript-eslint/naming-convention
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_PUBLIC_RSA_KEY: string;
  readonly VITE_PRIVATE_RSA_KEY: string;
  readonly VITE_AES_GCM_KEY: string;
  readonly VITE_NACL_IV: string;
  readonly VITE_NACL_PUBLIC: string;
  readonly VITE_NACL_PRIVATE: string;
  readonly VITE_GPG_PRIVATE: string;
  readonly VITE_GPG_PUBLIC: string;
  readonly VITE_GPG_PASS: string;
  // more env variables...
}

// eslint-disable-next-line @typescript-eslint/naming-convention
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
