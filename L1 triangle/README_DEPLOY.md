Deployment options and quick start
================================

Two quick ways to publish this static site:

1) GitHub Pages (recommended for simple static sites)
   - Create a new GitHub repository and push this project to it (see commands below).
   - The repository includes a GitHub Actions workflow ('.github/workflows/deploy.yml') which will automatically deploy the repository root to GitHub Pages whenever you push to the `main` branch.

2) Netlify / Vercel (drag-and-drop or connect repo)
   - You can also drag & drop the project folder (or connect your GitHub repo) to Netlify or Vercel for instant hosting with their free tiers.

PowerShell quick commands (run from the project root on your machine):

1. Initialize git and commit the project

   git init
   git add .
   git commit -m "Initial commit - L1 TRIANGLE site"

2. Create a repository on GitHub (via web UI) and push

   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main

3. The Actions workflow will run automatically and deploy to GitHub Pages. After the workflow completes, your site will be available on the GitHub Pages URL assigned for the repository (or via the Pages settings).

Notes
-----
- The included workflow uses GitHub Pages Actions (native) and requires no secrets—the GITHUB_TOKEN provided to Actions is used automatically.
- If you prefer Netlify or Vercel, just connect the GitHub repo or drag & drop the site's directory.
- If you want me to set up a custom domain or create the repo for you, I can provide the exact steps or a script; I cannot push to GitHub for you without your credentials.

Netlify — quick deploy options
--------------------------------

Option 1 — Drag & drop (fastest, no CLI needed)
- Go to https://app.netlify.com/drop
- Drag the project folder (the site root containing `index.html`) into the drop area. Netlify will upload and publish the site immediately and give you a public URL.

Option 2 — Connect GitHub repo
- Create a GitHub repo and push the project (see earlier steps).
- On Netlify dashboard click "New site from Git" → choose GitHub and select your repository → Deploy site.
   Netlify will pick defaults (publish directory = root) because this repo is static.

Option 3 — Netlify CLI (interactive, from your machine)
- Install Netlify CLI (requires Node.js):
   ```powershell
   npm install -g netlify-cli
   ```
- Login once:
   ```powershell
   netlify login
   ```
- From the project root publish directly (interactive deploy):
   ```powershell
   netlify deploy --dir=. --prod
   ```
   - The first time it will ask to link to a site or create a new one. Choose "create a new site" and follow prompts.

Notes about media and large files
- If you have very large assets (video mp4), prefer hosting them externally (YouTube, Cloudflare, an S3 bucket) and reference the public URL in your HTML. Netlify will still accept them if they are inside the repo, but pushing very large files to git is not recommended.

Using the included `deploy_netlify.ps1` script
--------------------------------------------

I added `deploy_netlify.ps1` to help deploy from Windows PowerShell. It supports two modes:

- Interactive: Opens your browser to `netlify login` and runs `netlify deploy --dir=. --prod`.
- Non-interactive (CI): Use a Personal Access Token + Site ID so the script can deploy without an interactive login.

How to create a Personal Access Token
1. Go to https://app.netlify.com/user/applications#personal-access-tokens
2. Create a new token, copy it and keep it secret.

How to get your Netlify site ID (if you already created a site)
1. In the Netlify dashboard open the site → Site settings → Site information → Site ID.
2. Or run `netlify status` after login to see the linked site id.

Non-interactive deploy example (PowerShell)
```powershell
$env:NETLIFY_AUTH_TOKEN = 'your_personal_access_token_here'
$env:NETLIFY_SITE_ID = 'your_site_id_here'
.\deploy_netlify.ps1
```

Interactive deploy (PowerShell)
```powershell
npm install -g netlify-cli    # if you don't have the CLI yet
.\deploy_netlify.ps1
```

If you prefer GUI drag-and-drop, the fastest route is still: https://app.netlify.com/drop


