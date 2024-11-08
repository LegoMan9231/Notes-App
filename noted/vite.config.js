import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

//js
// vite.config.js
export default {
server: {
proxy: {
'/api': 'http://localhost:5000',
},
},
};
