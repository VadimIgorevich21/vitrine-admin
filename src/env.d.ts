/* eslint-disable */
/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

import { ComponentCustomProperties } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $filters: {
      formatNumberNew: (value: any) => string | null;
      formatDateTimeWithoutSeconds: (value: any) => string;
      [key: string]: any;
    }
  }
}
