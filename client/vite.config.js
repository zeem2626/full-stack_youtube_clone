import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
   const env = loadEnv(mode, process.cwd(), "VITE_PROXY");

   return {
      // vite config
      build: {
        // generate .vite/manifest.json in outDir
        manifest: true,
        rollupOptions: {
          // overwrite default .html entry
          // input: './src/main.jsx',
        },
        chunkSizeWarningLimit: 600,
      },
      server: {
        //  proxy: {
        //     // "/api": env.VITE_PROXY,
        //     // "/api": "https://youtube-rfvy.onrender.com/",
        //  },
        
        proxy: {
          "/api": {
            // target: env.VITE_PROXY,
            // target : "https://youtube-rfvy.onrender.com",
            target : "https://youtube-r5sb.onrender.com/",
            // target : "http://localhost:8800",
               changeOrigin: true,
              //  rewrite: (path) => path.replace(/^\/api/, ""),
            },
         },
      },

      plugins: [react()],
   };
});
