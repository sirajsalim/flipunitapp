# Flip Unit Website Context

## Target Audience & Purpose

**Primary visitors:**
- Users searching for a unit converter app
- Users who found the app in the App Store and want more details
- Users needing support or privacy information

**Website vs App audience:** The website serves as a marketing and information hub. Unlike the app (which targets everyone needing conversions), the website specifically targets people in the decision-making phase - they're evaluating whether to download.

**Main goal:** Drive App Store downloads while establishing trust through transparency about privacy and accessibility.

## Design & Content Principles

**Why static HTML:**
- Free hosting on GitHub Pages with custom domain
- Maximum performance (no framework overhead)
- Simple maintenance - no build process, dependencies, or security updates
- Aligns with the app's "simple and focused" philosophy

**Messaging strategy:**
- Lead with accessibility ("built for everyone")
- Privacy as a key differentiator ("no tracking, no compromises")
- Free forever - no upsells, no premium tiers
- Tone: Friendly, straightforward, no marketing fluff

**Performance requirements:**
- Fast load times (static files, minimal JS)
- Works without JavaScript for core content
- Responsive design for all devices

**Privacy requirements:**
- Analytics: GoatCounter only (privacy-friendly, no cookies)
- No third-party tracking scripts
- Consistent with app's zero-data-collection stance

## Key Decisions

**Included:**
- FAQ on homepage (not buried in support) - improves discoverability
- Official Apple App Store badge (white bg/black text) - stands out on dark background
- Screenshot grid showing dark mode only - cleaner presentation, avoids theme toggle complexity
- Accessibility section in Support page - matches App Store accessibility features list
- Custom logo (orange circle with arrows) in header/footer

**Explicitly NOT included:**
- Google Analytics - conflicts with privacy-first brand message
- Cookie consent banners - not needed (GoatCounter doesn't use cookies)
- Light/dark theme toggle for screenshots - kept simple with dark mode only
- Any paid analytics services - website should have zero ongoing costs
- Account creation or email collection - stays consistent with app philosophy

**Technical choices:**
- GitHub Pages: Free, reliable, supports custom domain (flipunit.app)
- GoatCounter: Free for personal use, privacy-respecting, simple page view stats
- No build tools: Edit HTML directly, deploy via git push
- Inter font: Clean, accessible, good readability

## Content Guidelines

**Copy style:**
- Short sentences, scannable content
- Focus on benefits, not features
- Avoid superlatives ("best", "amazing", "revolutionary")
- Be specific about accessibility support
- Privacy claims must be accurate and match the app

**Screenshots:**
- Dark mode only (current decision)
- Show actual app UI, not mockups
- Located in `assets/screenshots/`
- Maintain consistent device frame if used

**Assets:**
- Logo: `assets/icons/logo.svg` (orange #F17D0F circle with white arrows)
- Favicon: `assets/icons/favicon.png`
- Keep assets minimal - every file adds to load time

**Accessibility standards:**
- Semantic HTML (proper headings, landmarks, labels)
- ARIA attributes where needed
- Skip link for keyboard users
- Sufficient color contrast
- All images have alt text (decorative images use empty alt)

## Future Changes

**Acceptable updates:**
- Adding new FAQ questions
- Updating screenshots when app UI changes
- Adding new accessibility features to support page
- Updating iOS version requirements
- Minor copy tweaks

**Keep consistent:**
- Privacy-first messaging (never add invasive tracking)
- Dark color scheme (#0a0a0a background)
- Navigation structure across all pages
- Accessibility standards
- Free hosting (no paid services)

**Common pitfalls to avoid:**
- Don't add tracking that conflicts with privacy message
- Don't create separate mobile site - use responsive design
- Don't add JavaScript frameworks for simple tasks
- Don't forget to update ALL pages when changing nav/footer
- Don't add features the app doesn't have
- Don't commit with broken links or missing assets
