export interface TechStackItem {
  name: string;
  category: "framework" | "hosting" | "analytics" | "cms" | "ecommerce" | "cdn" | "security" | "other";
  confidence: number;
  icon: string;
  color: string;
}

export interface SEOMetric {
  label: string;
  score: number;
  maxScore: number;
  status: "good" | "warning" | "critical";
  detail: string;
}

export interface PerformanceMetric {
  label: string;
  value: string;
  score: number;
  unit: string;
  benchmark: string;
}

export interface SocialPresence {
  platform: string;
  followers: string;
  engagement: string;
  lastPost: string;
  status: "active" | "moderate" | "inactive";
}

export interface Competitor {
  name: string;
  url: string;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
}

export interface AIReadinessMetric {
  label: string;
  score: number;
  detail: string;
  color: string;
}

export interface Recommendation {
  id: number;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  effort: "easy" | "moderate" | "hard";
  category: string;
}

export interface ConversionCheck {
  label: string;
  status: "found" | "missing" | "partial";
  detail: string;
}

export interface ScanResult {
  url: string;
  businessName: string;
  industry: string;
  overallScore: number;
  techStack: TechStackItem[];
  seoMetrics: SEOMetric[];
  performance: PerformanceMetric[];
  socialPresence: SocialPresence[];
  competitors: Competitor[];
  aiReadiness: AIReadinessMetric[];
  recommendations: Recommendation[];
  conversionChecks: ConversionCheck[];
}

export const mockScanResult: ScanResult = {
  url: "brightleaf-coffee.com",
  businessName: "Brightleaf Coffee Roasters",
  industry: "Food & Beverage / Specialty Coffee",
  overallScore: 62,
  techStack: [
    { name: "WordPress", category: "cms", confidence: 98, icon: "W", color: "#21759b" },
    { name: "WooCommerce", category: "ecommerce", confidence: 95, icon: "W", color: "#96588a" },
    { name: "PHP 8.1", category: "framework", confidence: 92, icon: "P", color: "#777bb4" },
    { name: "Cloudflare", category: "cdn", confidence: 99, icon: "C", color: "#f38020" },
    { name: "Google Analytics 4", category: "analytics", confidence: 97, icon: "G", color: "#e37400" },
    { name: "Stripe", category: "ecommerce", confidence: 88, icon: "S", color: "#635bff" },
    { name: "Mailchimp", category: "other", confidence: 85, icon: "M", color: "#ffe01b" },
    { name: "Let's Encrypt", category: "security", confidence: 99, icon: "L", color: "#00cc88" },
    { name: "SiteGround", category: "hosting", confidence: 78, icon: "S", color: "#6e4a9e" },
    { name: "Yoast SEO", category: "cms", confidence: 91, icon: "Y", color: "#a4286a" },
  ],
  seoMetrics: [
    { label: "Title Tag", score: 85, maxScore: 100, status: "good", detail: "Well-optimized, 58 chars" },
    { label: "Meta Description", score: 70, maxScore: 100, status: "warning", detail: "Exists but could be more compelling (142 chars)" },
    { label: "H1 Structure", score: 90, maxScore: 100, status: "good", detail: "Single H1, properly structured" },
    { label: "Mobile Friendly", score: 95, maxScore: 100, status: "good", detail: "Responsive design, passes Google test" },
    { label: "Schema Markup", score: 40, maxScore: 100, status: "critical", detail: "Missing LocalBusiness, Product, and Review schema" },
    { label: "Internal Links", score: 65, maxScore: 100, status: "warning", detail: "32 internal links, some orphan pages found" },
    { label: "Image Alt Tags", score: 55, maxScore: 100, status: "warning", detail: "18/34 images missing alt text" },
    { label: "Page Speed", score: 72, maxScore: 100, status: "warning", detail: "LCP: 2.8s, CLS: 0.12" },
    { label: "SSL Certificate", score: 100, maxScore: 100, status: "good", detail: "Valid Let's Encrypt certificate" },
    { label: "Sitemap", score: 80, maxScore: 100, status: "good", detail: "XML sitemap present, 47 URLs indexed" },
  ],
  performance: [
    { label: "First Contentful Paint", value: "1.8", score: 78, unit: "s", benchmark: "< 1.8s" },
    { label: "Largest Contentful Paint", value: "2.8", score: 62, unit: "s", benchmark: "< 2.5s" },
    { label: "Total Blocking Time", value: "180", score: 71, unit: "ms", benchmark: "< 200ms" },
    { label: "Cumulative Layout Shift", value: "0.12", score: 65, unit: "", benchmark: "< 0.1" },
    { label: "Interaction to Next Paint", value: "220", score: 68, unit: "ms", benchmark: "< 200ms" },
    { label: "Speed Index", value: "3.2", score: 58, unit: "s", benchmark: "< 3.4s" },
  ],
  socialPresence: [
    { platform: "Instagram", followers: "12.4K", engagement: "3.2%", lastPost: "2 days ago", status: "active" },
    { platform: "Facebook", followers: "8.7K", engagement: "1.8%", lastPost: "5 days ago", status: "active" },
    { platform: "X (Twitter)", followers: "2.1K", engagement: "0.4%", lastPost: "3 weeks ago", status: "moderate" },
    { platform: "TikTok", followers: "890", engagement: "5.1%", lastPost: "1 week ago", status: "active" },
    { platform: "LinkedIn", followers: "340", engagement: "0.2%", lastPost: "2 months ago", status: "inactive" },
    { platform: "YouTube", followers: "1.2K", engagement: "2.8%", lastPost: "3 weeks ago", status: "moderate" },
  ],
  competitors: [
    {
      name: "Blue Bottle Coffee",
      url: "bluebottlecoffee.com",
      overallScore: 88,
      strengths: ["Strong SEO", "Schema markup", "Fast site"],
      weaknesses: ["Limited local content"],
    },
    {
      name: "Counter Culture Coffee",
      url: "counterculturecoffee.com",
      overallScore: 82,
      strengths: ["Great content strategy", "Active blog"],
      weaknesses: ["Slow mobile speed", "Missing social proof"],
    },
    {
      name: "Stumptown Coffee",
      url: "stumptowncoffee.com",
      overallScore: 79,
      strengths: ["Brand recognition", "E-commerce"],
      weaknesses: ["Weak schema", "Poor Core Web Vitals"],
    },
    {
      name: "Intelligentsia Coffee",
      url: "intelligentsia.com",
      overallScore: 75,
      strengths: ["Strong visuals", "Good UX"],
      weaknesses: ["No blog", "Limited SEO"],
    },
  ],
  aiReadiness: [
    { label: "Structured Data", score: 35, detail: "Missing critical schema types for AI citation", color: "#ff4444" },
    { label: "Content Authority", score: 58, detail: "Some E-E-A-T signals but lacking author bios and expertise markers", color: "#ff8800" },
    { label: "AI Crawler Access", score: 72, detail: "robots.txt allows most AI crawlers, no llms.txt file", color: "#00ccff" },
    { label: "Citability Score", score: 45, detail: "Content not structured for AI extraction — needs clear claims and data", color: "#ff8800" },
    { label: "Entity Recognition", score: 52, detail: "Weak sameAs links, no Knowledge Panel claimed", color: "#ff8800" },
    { label: "Content Freshness", score: 68, detail: "Blog updated monthly, main pages stale (6+ months)", color: "#00ccff" },
  ],
  recommendations: [
    { id: 1, title: "Add LocalBusiness Schema Markup", description: "Implement JSON-LD structured data for LocalBusiness, Product, and Review types to improve AI citability and rich snippet eligibility.", impact: "high", effort: "easy", category: "SEO" },
    { id: 2, title: "Optimize Largest Contentful Paint", description: "LCP is 2.8s (target <2.5s). Compress hero images, implement lazy loading, and add preload hints for above-fold assets.", impact: "high", effort: "moderate", category: "Performance" },
    { id: 3, title: "Fix Missing Image Alt Tags", description: "18 of 34 images lack alt text. Add descriptive alt attributes for accessibility and SEO crawlability.", impact: "medium", effort: "easy", category: "SEO" },
    { id: 4, title: "Create llms.txt File", description: "Add an llms.txt file to help AI systems understand site structure. Include key pages, business description, and content hierarchy.", impact: "medium", effort: "easy", category: "AI Readiness" },
    { id: 5, title: "Revive LinkedIn Presence", description: "LinkedIn has been inactive for 2 months with only 340 followers. Post weekly industry content to build B2B credibility.", impact: "low", effort: "moderate", category: "Social" },
    { id: 6, title: "Claim Google Knowledge Panel", description: "Submit entity verification to establish brand authority in Google's knowledge graph and improve AI entity recognition.", impact: "high", effort: "hard", category: "AI Readiness" },
    { id: 7, title: "Add Email Capture to Blog Pages", description: "Blog pages have no newsletter signup. Add exit-intent popup and inline CTAs to capture organic traffic.", impact: "medium", effort: "easy", category: "Conversion" },
    { id: 8, title: "Improve Meta Description", description: "Current meta description is functional but not compelling. Rewrite with clear value proposition and call-to-action in 155 chars.", impact: "low", effort: "easy", category: "SEO" },
  ],
  conversionChecks: [
    { label: "Newsletter Signup", status: "partial", detail: "Footer only — no inline or popup capture on high-traffic pages" },
    { label: "Primary CTA", status: "found", detail: "'Order Now' button above fold on homepage, good contrast" },
    { label: "Exit-Intent Popup", status: "missing", detail: "No exit-intent capture detected on any page" },
    { label: "Social Proof", status: "partial", detail: "Customer count shown but no reviews or testimonials on landing page" },
    { label: "Contact Form", status: "found", detail: "Contact page form with name, email, message fields" },
    { label: "Live Chat", status: "missing", detail: "No live chat widget detected — consider adding for conversion support" },
    { label: "Trust Badges", status: "partial", detail: "SSL badge present, missing payment security and guarantee badges" },
    { label: "Mobile CTA Sticky", status: "missing", detail: "No sticky CTA on mobile scroll — high bounce risk" },
  ],
};

export const scanStages = [
  "Resolving DNS...",
  "Connecting to server...",
  "Analyzing HTML structure...",
  "Detecting tech stack...",
  "Scanning meta tags...",
  "Evaluating page speed...",
  "Checking SSL certificate...",
  "Crawling internal links...",
  "Analyzing schema markup...",
  "Scanning social profiles...",
  "Identifying competitors...",
  "Evaluating AI readiness...",
  "Computing SEO score...",
  "Generating report...",
];
