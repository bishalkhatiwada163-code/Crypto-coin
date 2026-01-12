# 🚀 Quick Start Guide - CryptoVerse Website

## Step 1: Rename Home Page

Your main landing page needs to be named `index.html`:

**Windows (PowerShell):**
```powershell
Rename-Item -Path ".\index-new.html" -NewName "index.html"
```

**Linux/Mac:**
```bash
mv index-new.html index.html
```

## Step 2: Test Locally

### Option A: Python HTTP Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Then visit: http://localhost:8000
```

### Option B: VS Code Live Server
1. Install "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option C: Node.js http-server
```bash
npm install -g http-server
http-server

# Visit: http://localhost:8080
```

## Step 3: Customize Your Content

### Edit These Files:

1. **index.html** - Update:
   - Hero section title and subtitle
   - Coin name and description
   - Call-to-action buttons

2. **about.html** - Update:
   - About section content
   - Vision and mission
   - Technology details

3. **tokenomics.html** - Update:
   - Token supply numbers
   - Distribution percentages
   - Vesting schedule

4. **roadmap.html** - Update:
   - Phase names and descriptions
   - Timeline information
   - Current status

5. **team.html** - Update:
   - Team member names and roles
   - Avatar emojis or images
   - Social media links

6. **faq.html** - Update:
   - Questions specific to your coin
   - Answers about your project
   - Support contact info

7. **contact.html** - Update:
   - Email addresses
   - Support channels
   - Response times

8. **whitepaper.html** - Update:
   - Full whitepaper content
   - Technical documentation
   - Economic model details

9. **community.html** - Update:
   - Social media links
   - Community channel links
   - Member counts

## Step 4: Update Global Elements

### Global Search & Replace:

Replace these in ALL files:

| Old | New |
|-----|-----|
| `CryptoVerse` | Your Coin Name |
| `CVR` | Your Token Symbol |
| `0.45` | Your Token Price |
| `1,000,000,000` | Your Total Supply |
| `hello@cryptoverse.io` | Your Email |

### In script.js:

Update the price data (around line 100):
```javascript
const priceData = [
    { label: 'Current Price', value: '$0.45', change: '+12.5%', positive: true },
    // Update these values
];
```

## Step 5: Add Your Branding

### Update Colors (optional)

Edit `styles.css` `:root` section:
```css
:root {
    --primary: #00d4ff;      /* Change cyan to your color */
    --secondary: #b020f0;    /* Change purple to your color */
    --accent-green: #00ff88; /* Change green to your color */
    /* ... other colors ... */
}
```

### Replace Logo/Icon

Find this in hero section of `index.html`:
```html
<div class="hero-image-content::before {
    content: '🪙';  /* Replace emoji */
}
```

Replace with:
```html
<img src="your-logo.png" alt="Logo">
```

## Step 6: Connect Navigation Links

Update all internal links in navigation to point to correct files:

```html
<!-- Example in nav -->
<li><a href="index.html">Home</a></li>
<li><a href="about.html">About</a></li>
<li><a href="tokenomics.html">Tokenomics</a></li>
<!-- etc -->
```

## Step 7: Add Social Media Links

Replace `#` with actual URLs in `community.html`:

```html
<a href="https://t.me/your-telegram-group">Telegram</a>
<a href="https://discord.gg/your-server">Discord</a>
<a href="https://twitter.com/your-handle">Twitter</a>
<a href="https://github.com/your-repo">GitHub</a>
```

## Step 8: Prepare for Deployment

### Create .htaccess (if using Apache):
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

### Create Sitemap (sitemap.xml):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>https://yoursite.com/</loc></url>
    <url><loc>https://yoursite.com/about.html</loc></url>
    <url><loc>https://yoursite.com/buy.html</loc></url>
    <!-- Add all pages -->
</urlset>
```

## Step 9: Deploy Online

### Option A: Vercel (Recommended)
```bash
npm install -g vercel
vercel
# Follow prompts
```

### Option B: Netlify
1. Drag and drop `crypto` folder to [netlify.com](https://netlify.com)
2. Or connect GitHub repo

### Option C: GitHub Pages
1. Create `username.github.io` repo
2. Push files to repo
3. Enable Pages in settings

### Option D: Traditional Hosting
1. FTP/SSH to server
2. Upload all files to `public_html`
3. Set `index.html` as default

## Step 10: Post-Deployment

### Enable HTTPS
- Get SSL certificate (Let's Encrypt is free)
- Update all `http://` to `https://`

### Add Analytics
```html
<!-- Add in footer before </body> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_ID');
</script>
```

### Setup Contact Form Backend
The form UI is ready. You need to add backend:

Example using Formspree:
1. Go to [formspree.io](https://formspree.io)
2. Create account
3. Update form action:
```html
<form action="https://formspree.io/f/YOUR_ID" method="POST">
```

## Step 11: Add Payment Integration

### For MetaMask Wallet Connection:
```html
<script src="https://cdn.ethers.io/lib/ethers.umd.min.js"></script>
```

Update `connectWallet()` in script.js

### For Stripe Payments:
```html
<script src="https://js.stripe.com/v3/"></script>
```

### For Coinbase Commerce:
```html
<script src="https://commerce.coinbase.com/v1/checkout.js"></script>
```

## 🎯 Checklist

- [ ] Renamed `index-new.html` to `index.html`
- [ ] Updated coin name throughout
- [ ] Updated token symbol
- [ ] Updated token price
- [ ] Updated team members
- [ ] Updated social media links
- [ ] Tested locally in browser
- [ ] Added logo/branding
- [ ] Updated FAQ answers
- [ ] Added custom colors (optional)
- [ ] Created sitemap.xml
- [ ] Set up SSL certificate
- [ ] Deployed to production
- [ ] Added analytics
- [ ] Tested on mobile devices
- [ ] Added contact form backend
- [ ] Set up payment processing

## 🔗 Useful Resources

- [Ethereum Development](https://ethereum.org/en/developers/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [Web3.js Documentation](https://web3js.readthedocs.io/)
- [Stripe API](https://stripe.com/docs/api)
- [Coinbase Commerce](https://commerce.coinbase.com/docs/)
- [SEO Best Practices](https://developers.google.com/search)

## 🆘 Troubleshooting

### Links Not Working?
- Check file paths are relative: `about.html` not `/about.html`
- Verify all HTML files are in same directory

### Styling Not Applied?
- Check `styles.css` is in same directory
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors (F12)

### JavaScript Not Working?
- Check `script.js` is in same directory
- Open browser DevTools (F12)
- Look at Console tab for error messages

### Mobile Menu Not Working?
- Test on actual mobile device
- Check viewport meta tag is present
- Try different browser

---

**You're all set! Your professional crypto website is ready to launch! 🚀**
