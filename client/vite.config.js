import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
   const env = loadEnv(mode, process.cwd(), "VITE_PROXY");

   return {
      // vite config
      server:{
        proxy:{
          "/api" : env.VITE_PROXY
        }
      },
      plugins: [react()],
   };
});
