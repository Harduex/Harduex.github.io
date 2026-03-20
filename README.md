# Harduex.github.io

Personal portfolio website, hosted on GitHub Pages.

**Live site:** [harduex.com](https://harduex.com)

## Tech Stack

- **HTML/CSS** — Single-page static site
- **[MDB Bootstrap](https://mdbootstrap.com/)** — UI framework (Material Design for Bootstrap)
- **[Font Awesome 5](https://fontawesome.com/)** — Icon library
- **[AOS](https://michalsnik.github.io/aos/)** — Animate On Scroll library
- **[Particles.js](https://vincentgarreau.com/particles.js/)** — Animated particle background
- **[EmailJS](https://www.emailjs.com/)** — Contact form email delivery (no backend needed)
- **Google Analytics** — Site analytics via gtag.js

## Local Development

No build tools needed. This is a static site.

```bash
# Option 1: Open directly in a browser
open index.html

# Option 2: Use a local HTTP server (recommended for full functionality)
python3 -m http.server 8000
# Then visit http://localhost:8000
```

> A local server is recommended because some features (EmailJS, Particles.js config loading) may not work with `file://` protocol due to CORS restrictions.

## Deployment

This site is deployed automatically via **GitHub Pages** from the `master` branch.

- **Custom domain**: Configured via the `CNAME` file (`harduex.com`)
- **Push to deploy**: Any push to `master` triggers a GitHub Pages build

To deploy changes:
```bash
git add <files>
git commit -m "description of changes"
git push origin master
```

## Blog Redirects

The blog has been migrated to a separate Ghost instance at [blog.harduex.com](https://blog.harduex.com). The `blog/` directory contains redirect pages that forward old blog URLs (e.g., `harduex.com/blog/post-slug/`) to their new locations on `blog.harduex.com`. These redirects preserve SEO link equity and ensure existing links continue to work.

## EmailJS Configuration

The contact form uses [EmailJS](https://www.emailjs.com/) for client-side email delivery. The public key, service ID, and template ID are embedded in `scripts/main.js` — this is by design for client-side email services, but you should restrict usage to your domain:

1. Log in to [emailjs.com](https://www.emailjs.com/)
2. Go to **Account → Security → Allowed Origins**
3. Add `https://harduex.com` as the only allowed origin
4. If the contact form returns a **`Gmail_API: Invalid grant`** error, the Gmail OAuth token has expired — go to **Email Services**, find your Gmail service, click **Reconnect** and re-authorise via Google

## Project Structure

```
.
├── index.html              # Main portfolio page
├── css/
│   ├── main.css            # Custom styles
│   ├── dark/
│   │   └── mdb.dark.min.css  # MDB Bootstrap framework (dark theme)
│   ├── aos.css             # Animate On Scroll styles
│   └── font-awesome/       # Font Awesome icons + webfonts (woff/woff2 only)
├── scripts/
│   ├── main.js             # Custom JS (age calc, contact form, particles, work periods)
│   ├── mdb.min.js          # MDB Bootstrap JS
│   ├── aos.js              # AOS animation library
│   └── particles.min.js    # Particles.js library
├── assets/
│   └── particles.json      # Particles.js configuration
├── images/                 # Portfolio images (avatar, about, programming, music, art, contact)
├── blog/                   # SEO redirect pages -> blog.harduex.com
├── CNAME                   # Custom domain configuration
├── favicon.ico             # Browser favicon
├── robots.txt              # Search engine crawl rules
└── sitemap.xml             # Sitemap for search engines
```
