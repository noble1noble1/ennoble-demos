# Ennoble Demos

Two AI-powered demo applications showcasing real-time data analysis dashboards with dark, command-center-style interfaces.

## PropVision — AI Property Investment Command Center

`propvision/`

Enter any US property address to generate a comprehensive AI-powered investment analysis. Aggregates data from 14+ simulated sources including MLS, public records, and neural search intelligence.

**Panels:**
- Property Details with value indicator and image hero
- Interactive Map with comparable property markers
- Rent Gauge with yield calculations
- 10-Year Market Trends chart
- Comparable Properties grid with price/sqft comparison
- Subject vs Top Comp side-by-side comparison
- Neighborhood Stats with walk/transit/bike scores and demographic gradient bars
- Cash Flow Calculator with donut chart breakdown
- Risk Assessment spider chart
- AI Intelligence Feed with bullish/bearish sentiment tracking
- AI Investment Brief with scenario switching

**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Recharts, Mapbox GL

```bash
cd propvision
npm install
npm run dev    # http://localhost:3000
```

## BusinessXRay — AI Business Intelligence Scanner

`business-xray/`

Enter any business website URL to instantly scan and analyze tech stack, SEO health, performance, social presence, competitor landscape, AI readiness, conversion flow, and get AI-generated recommendations.

**Panels:**
- Tech Stack detection with confidence scores
- SEO Health with circular score ring
- Performance Metrics with speed gauge and Core Web Vitals
- Social Presence with engagement sparklines
- Competitor Analysis with visual bar chart
- AI Readiness spider chart
- AI Recommendations with impact/effort badges
- Conversion Flow health checks (newsletter, CTA, exit-intent, trust badges)

**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Lucide Icons

```bash
cd business-xray
npm install
npm run dev    # http://localhost:3001
```

## Deployment

Each app is a standalone Next.js project. Deploy them as separate Vercel projects:

**Option A — Vercel Dashboard:**
1. Import the repo and set **Root Directory** to `propvision/` for PropVision
2. Import the repo again and set **Root Directory** to `business-xray/` for BusinessXRay
3. Both use default Next.js build settings — no extra configuration needed

**Option B — Vercel CLI:**
```bash
# PropVision
cd propvision && vercel --yes

# BusinessXRay
cd business-xray && vercel --yes
```

Both apps build with `next build` and require no environment variables for the demo.

## Design System

Both apps share a consistent dark theme with:
- Background: `#0a0a0a` with subtle grid lines
- Accent: `#00ff88` (neon green) with `#00ccff` (cyan) secondary
- Card-based panel layout with hover glow effects
- Staggered load animations with shimmer skeleton loaders
- Monospace typography for data-heavy displays
- Noise texture overlay for depth

## License

Demo applications for portfolio purposes.
