import { defineConfig } from "vite";

export default defineConfig({
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:6969/",
                changeOrigin: true,
            }
        }
    }
});
