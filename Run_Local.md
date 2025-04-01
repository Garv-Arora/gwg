#Running Locally

## 1. Create a New Folder & Enter It

```bash
mkdir gupshup-with-garv
cd gupshup-with-garv
```

---

## 2. Initialize Your Project & Install Dependencies

1. **Initialize package.json:**
   ```bash
   npm init -y
   ```

2. **Install all required libraries and devDependencies:**
   ```bash
   npm install react react-dom react-router-dom axios framer-motion react-icons react-markdown express cors nodemailer

   npm install --save-dev @vitejs/plugin-react vite tailwindcss postcss autoprefixer concurrently nodemon @tailwindcss/typography @tailwindcss/forms
   ```

---

## 3. Create Your Configuration Files

Make sure you have these **four** files in the project’s root directory:

1. **`vite.config.js`**  
   ```js
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';

   export default defineConfig({
     plugins: [react()],
     server: {
       proxy: {
         '/api': 'http://localhost:5000'
       }
     }
   });
   ```

2. **`tailwind.config.js`**  
   ```js
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: [
       "./index.html",
       "./src/**/*.{js,jsx,ts,tsx}",
     ],
     theme: {
       extend: {
         colors: {
           'brand-black': '#000000',
           'brand-orange': '#FF8800',
           'brand-gold': '#FFD700',
           'brand-white': '#FFFFFF',
           'brand-gray': '#AAAAAA',
           'brand-red': '#FF4444',
           'brand-yellow': '#FFDD22',
         },
         fontFamily: {
           sans: ['Poppins', 'sans-serif'],
           heading: ['Montserrat', 'sans-serif'],
         },
         borderRadius: {
           'xl': '1rem',
           '2xl': '1.5rem',
         },
         boxShadow: {
           'neon': '0 0 10px rgba(255, 136, 0, 0.7), 0 0 20px rgba(255, 136, 0, 0.5)',
           'neon-hover': '0 0 15px rgba(255, 136, 0, 0.8), 0 0 30px rgba(255, 136, 0, 0.6)',
         },
       },
     },
     plugins: [
       require('@tailwindcss/typography'),
       require('@tailwindcss/forms')
     ],
   };
   ```

3. **`postcss.config.js`**  
   ```js
   module.exports = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   };
   ```

4. **`package.json`** (scripts section should look like this):
   ```json
   {
     "scripts": {
       "start": "node index.js",
       "build": "vite build",
       "preview": "vite preview",
       "dev:server": "nodemon index.js",
       "dev:client": "vite",
       "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\""
     }
   }
   ```

---

## 4. Create the File & Folder Structure

You should have:

```
gupshup-with-garv/
├── index.html
├── index.js              // Express server code
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles/
    │   └── index.css
    ├── assets/
    │   └── images/
    │       └── logo.png
    ├── components/
    │   ├── common/...
    │   ├── home/...
    │   ├── ...
    └── pages/
        └── ...
└── server/
    └── data/
        ├── blogPosts.js
        └── products.js
```

**Copy the code** for each file (from the previous instructions / README) exactly into its location. The core files are:

- `index.html`
- `index.js` (Express server)
- `src/main.jsx`
- `src/App.jsx`
- `src/styles/index.css`
- `server/data/blogPosts.js`
- `server/data/products.js`
- Plus all the components/pages shown in the conversation.

---

## 5. Run in Development Mode

Use this command to run **both** the Express server and the Vite dev server concurrently:

```bash
npm run dev
```

- The **server** side runs on `http://localhost:3000/` by default.
- The **frontend** runs on `http://localhost:5173/`.  

In your browser, go to <http://localhost:5173> to see the React frontend. API requests to `/api/...` will be proxied to `localhost:3000`.

---

## 6. Build for Production

When you’re ready to create a production build for your frontend:

```bash
npm run build
```

This outputs bundled files into a `dist` directory.

---

## 7. Serve the Production Build

Once you have built the frontend, you can have Express serve those static files by running:

```bash
npm start
```

This will:

- Serve the optimized frontend from the `dist` folder
- Serve the API endpoints under `/api`

Visit <http://localhost:3000> to see the production version.

---

## That’s It!

You now have a fully working **local** setup of “Gupshup with Garv.” Feel free to modify the blog posts, products, or theme to your liking:

1. **Replace the dummy logo** in `src/assets/images/logo.png` with your own.
2. **Adjust** colors or fonts in `tailwind.config.js`.
3. **Edit** blog posts and products in `server/data/`.

When you make changes, just re-run:

```bash
npm run dev
```

…and refresh your browser to see them. Enjoy!
