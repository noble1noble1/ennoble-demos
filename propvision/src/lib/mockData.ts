export interface TaxHistoryEntry {
  year: number;
  assessed: number;
  tax: number;
  change: number;
}

export interface PropertyData {
  address: string;
  city: string;
  state: string;
  zip: string;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  estimatedValue: number;
  propertyType: string;
  lotSize: number;
  lastSold: string;
  lastSoldPrice: number;
  coordinates: [number, number];
  hoaFee: number;
  parking: string;
  amenities: string[];
  taxHistory: TaxHistoryEntry[];
}

export interface ComparableProperty {
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  distance: string;
  coordinates: [number, number];
  image: string;
  soldDate?: string;
  daysOnMarket?: number;
  condition?: string;
  listingStatus: "Sold" | "Active" | "Pending";
  photoCount: number;
}

export interface RentEstimate {
  low: number;
  mid: number;
  high: number;
}

export interface MarketDataPoint {
  year: string;
  value: number;
  rent: number;
}

export interface NeighborhoodData {
  walkScore: number;
  transitScore: number;
  bikeScore: number;
  medianIncome: number;
  population: number;
  medianAge: number;
  crimeIndex: number;
  schoolRating: number;
}

export interface IntelItem {
  id: number;
  text: string;
  source: string;
  timestamp: string;
  relevance: number;
  category: "zoning" | "infrastructure" | "market" | "schools" | "permits" | "employment" | "safety" | "amenities";
}

export const mockProperty: PropertyData = {
  address: "350 Fifth Avenue",
  city: "New York",
  state: "NY",
  zip: "10118",
  beds: 3,
  baths: 2,
  sqft: 1850,
  yearBuilt: 2018,
  estimatedValue: 1275000,
  propertyType: "Condominium",
  lotSize: 0,
  lastSold: "2021-06-15",
  lastSoldPrice: 1150000,
  coordinates: [-73.9857, 40.7484],
  hoaFee: 1245,
  parking: "1 Deeded Garage Space",
  amenities: [
    "24/7 Doorman",
    "Concierge",
    "Fitness Center",
    "Rooftop Terrace",
    "Residents Lounge",
    "Package Room",
    "Bike Storage",
    "Pet Spa",
    "Children's Playroom",
    "Cold Storage",
  ],
  taxHistory: [
    { year: 2024, assessed: 1260000, tax: 18144, change: 3.2 },
    { year: 2023, assessed: 1220000, tax: 17568, change: 2.8 },
    { year: 2022, assessed: 1187000, tax: 17093, change: 4.5 },
    { year: 2021, assessed: 1136000, tax: 16358, change: 1.2 },
    { year: 2020, assessed: 1122000, tax: 16157, change: -0.8 },
    { year: 2019, assessed: 1131000, tax: 16286, change: 5.1 },
    { year: 2018, assessed: 1076000, tax: 15494, change: 0 },
  ],
};

export const mockComparables: ComparableProperty[] = [
  {
    address: "320 Fifth Ave, Apt 12B",
    price: 1195000,
    beds: 3,
    baths: 2,
    sqft: 1720,
    distance: "0.1 mi",
    coordinates: [-73.9862, 40.7478],
    image: "/placeholder-1.jpg",
    soldDate: "Jan 2025",
    daysOnMarket: 18,
    condition: "Excellent",
    listingStatus: "Sold",
    photoCount: 24,
  },
  {
    address: "15 W 34th St, Unit 8A",
    price: 1350000,
    beds: 3,
    baths: 2.5,
    sqft: 1950,
    distance: "0.2 mi",
    coordinates: [-73.9849, 40.7497],
    image: "/placeholder-2.jpg",
    soldDate: "Dec 2024",
    daysOnMarket: 34,
    condition: "Good",
    listingStatus: "Sold",
    photoCount: 18,
  },
  {
    address: "11 W 30th St, Apt 5C",
    price: 1125000,
    beds: 2,
    baths: 2,
    sqft: 1580,
    distance: "0.3 mi",
    coordinates: [-73.9878, 40.7462],
    image: "/placeholder-3.jpg",
    soldDate: "Feb 2025",
    daysOnMarket: 8,
    condition: "Excellent",
    listingStatus: "Sold",
    photoCount: 31,
  },
  {
    address: "400 Park Ave S, Unit 22D",
    price: 1425000,
    beds: 3,
    baths: 2,
    sqft: 2100,
    distance: "0.4 mi",
    coordinates: [-73.9832, 40.7445],
    image: "/placeholder-4.jpg",
    daysOnMarket: 12,
    condition: "Excellent",
    listingStatus: "Active",
    photoCount: 28,
  },
  {
    address: "225 W 34th St, Apt 3F",
    price: 985000,
    beds: 2,
    baths: 1,
    sqft: 1350,
    distance: "0.5 mi",
    coordinates: [-73.9905, 40.7510],
    image: "/placeholder-5.jpg",
    daysOnMarket: 45,
    condition: "Fair",
    listingStatus: "Pending",
    photoCount: 12,
  },
  {
    address: "45 W 36th St, Unit 10A",
    price: 1575000,
    beds: 4,
    baths: 3,
    sqft: 2250,
    distance: "0.3 mi",
    coordinates: [-73.9856, 40.7510],
    image: "/placeholder-6.jpg",
    soldDate: "Jan 2025",
    daysOnMarket: 12,
    condition: "Excellent",
    listingStatus: "Sold",
    photoCount: 36,
  },
];

export const mockRentEstimate: RentEstimate = {
  low: 3800,
  mid: 4500,
  high: 5200,
};

// 10 years of market data (2015-2024)
export const mockMarketData: MarketDataPoint[] = [
  { year: "2015", value: 720000, rent: 2400 },
  { year: "2015 Q2", value: 735000, rent: 2450 },
  { year: "2015 Q3", value: 745000, rent: 2480 },
  { year: "2015 Q4", value: 755000, rent: 2520 },
  { year: "2016", value: 770000, rent: 2550 },
  { year: "2016 Q2", value: 785000, rent: 2600 },
  { year: "2016 Q3", value: 800000, rent: 2650 },
  { year: "2016 Q4", value: 815000, rent: 2700 },
  { year: "2017", value: 840000, rent: 2780 },
  { year: "2017 Q2", value: 860000, rent: 2850 },
  { year: "2017 Q3", value: 875000, rent: 2900 },
  { year: "2017 Q4", value: 890000, rent: 2950 },
  { year: "2018", value: 910000, rent: 3000 },
  { year: "2018 Q2", value: 935000, rent: 3100 },
  { year: "2018 Q3", value: 950000, rent: 3150 },
  { year: "2018 Q4", value: 965000, rent: 3200 },
  { year: "2019", value: 975000, rent: 3300 },
  { year: "2019 Q2", value: 985000, rent: 3350 },
  { year: "2019 Q3", value: 990000, rent: 3380 },
  { year: "2019 Q4", value: 992000, rent: 3400 },
  { year: "2020", value: 985000, rent: 3400 },
  { year: "2020 Q2", value: 945000, rent: 3200 },
  { year: "2020 Q3", value: 960000, rent: 3250 },
  { year: "2020 Q4", value: 980000, rent: 3350 },
  { year: "2021", value: 1020000, rent: 3500 },
  { year: "2021 Q2", value: 1065000, rent: 3650 },
  { year: "2021 Q3", value: 1100000, rent: 3800 },
  { year: "2021 Q4", value: 1120000, rent: 3850 },
  { year: "2022", value: 1150000, rent: 3950 },
  { year: "2022 Q2", value: 1180000, rent: 4050 },
  { year: "2022 Q3", value: 1200000, rent: 4100 },
  { year: "2022 Q4", value: 1190000, rent: 4050 },
  { year: "2023", value: 1195000, rent: 4100 },
  { year: "2023 Q2", value: 1210000, rent: 4200 },
  { year: "2023 Q3", value: 1230000, rent: 4300 },
  { year: "2023 Q4", value: 1245000, rent: 4350 },
  { year: "2024", value: 1255000, rent: 4400 },
  { year: "2024 Q2", value: 1265000, rent: 4450 },
  { year: "2024 Q3", value: 1270000, rent: 4480 },
  { year: "2024 Q4", value: 1275000, rent: 4500 },
];

export const mockNeighborhood: NeighborhoodData = {
  walkScore: 98,
  transitScore: 95,
  bikeScore: 82,
  medianIncome: 89500,
  population: 28745,
  medianAge: 34,
  crimeIndex: 32,
  schoolRating: 7,
};

export const mockIntelItems: IntelItem[] = [
  {
    id: 1,
    text: "New mixed-use development approved at Hudson Yards — 1,200 residential units planned for 2026 completion",
    source: "NYC Planning Commission",
    timestamp: "2 min ago",
    relevance: 94,
    category: "permits",
  },
  {
    id: 2,
    text: "MTA announces $3.2B investment in Penn Station renovation — transit accessibility improvements expected by 2027",
    source: "Metropolitan Transit Authority",
    timestamp: "5 min ago",
    relevance: 91,
    category: "infrastructure",
  },
  {
    id: 3,
    text: "Crime rate in Midtown South precinct decreased 12% year-over-year according to latest NYPD CompStat data",
    source: "NYPD CompStat",
    timestamp: "8 min ago",
    relevance: 87,
    category: "safety",
  },
  {
    id: 4,
    text: "Major tech employer opening 450,000 sqft headquarters at One Penn Plaza — estimated 3,500 new jobs",
    source: "Commercial Observer",
    timestamp: "12 min ago",
    relevance: 85,
    category: "employment",
  },
  {
    id: 5,
    text: "NYC median condo prices up 4.2% in Q4 2024, outpacing national average of 2.8%",
    source: "StreetEasy Market Report",
    timestamp: "15 min ago",
    relevance: 82,
    category: "market",
  },
  {
    id: 6,
    text: "Rezoning proposal for Garment District would allow increased residential density within 0.5mi radius",
    source: "NYC Dept of City Planning",
    timestamp: "18 min ago",
    relevance: 79,
    category: "zoning",
  },
  {
    id: 7,
    text: "PS 116 Mary Lindley Murray rated 8/10 by GreatSchools — reading proficiency up 6% from prior year",
    source: "GreatSchools.org",
    timestamp: "20 min ago",
    relevance: 78,
    category: "schools",
  },
  {
    id: 8,
    text: "New Whole Foods Market confirmed for 6th Avenue location — neighborhood retail amenities expanding",
    source: "Crain's New York Business",
    timestamp: "22 min ago",
    relevance: 75,
    category: "amenities",
  },
  {
    id: 9,
    text: "Building permit filed: 28-story mixed-use tower at 355 W 35th St — 412 units, retail podium, community facility",
    source: "NYC Buildings Dept",
    timestamp: "24 min ago",
    relevance: 74,
    category: "permits",
  },
  {
    id: 10,
    text: "Property tax assessment appeal window opens March 1 — potential 8-12% reduction for comparable units",
    source: "NYC Finance Dept",
    timestamp: "25 min ago",
    relevance: 72,
    category: "market",
  },
  {
    id: 11,
    text: "Midtown South office-to-residential conversion pipeline reaches 2.1M sqft — largest in city history",
    source: "Real Capital Analytics",
    timestamp: "28 min ago",
    relevance: 70,
    category: "zoning",
  },
  {
    id: 12,
    text: "Con Edison completing $180M grid modernization for Midtown — improved reliability, EV charging infrastructure",
    source: "Con Edison",
    timestamp: "32 min ago",
    relevance: 68,
    category: "infrastructure",
  },
];

export const mockInvestmentBrief = `## Executive Summary

The subject property at 350 Fifth Avenue, New York, NY 10118 represents a compelling investment opportunity in Manhattan's Midtown corridor. The 3-bedroom, 2-bathroom condominium spanning 1,850 sqft is currently valued at $1,275,000, reflecting a 10.9% appreciation since its last sale in June 2021 at $1,150,000.

## Market Analysis

The Midtown Manhattan market continues to demonstrate resilience, with median condo prices rising 4.2% year-over-year. Key demand drivers include proximity to Penn Station (undergoing $3.2B renovation), expanding tech sector employment, and limited new inventory in established buildings.

Current rental rates for comparable units range from $3,800 to $5,200/month, with a median estimate of $4,500/month. This translates to a gross rental yield of approximately 4.24%, above the Manhattan average of 3.8%.

Over the trailing 10-year period, the property has appreciated 77.1% from its 2015 baseline of $720,000, representing a compound annual growth rate (CAGR) of 5.9%.

## Debt Service Coverage Analysis

Assuming 80% LTV at 6.5% fixed rate (30-year amortization):

| Metric | Monthly | Annual |
|--------|---------|--------|
| Gross Rental Income | $4,500 | $54,000 |
| Effective Income (5% vacancy) | $4,275 | $51,300 |
| Operating Expenses | -$1,833 | -$21,996 |
| Net Operating Income | $2,442 | $29,304 |
| Mortgage Payment | -$6,449 | -$77,388 |
| Cash Flow | -$4,007 | -$48,084 |

**DSCR: 0.38x** — Property does not self-service debt at current leverage. Recommend reducing LTV to 50-55% or targeting as appreciation play with partial owner-occupancy.

## Tax Benefit Analysis

**Depreciation Schedule (Residential, 27.5 years):**
- Annual depreciation deduction: $46,364 (building value $1,275,000)
- Tax shield at 37% bracket: $17,155/year
- Effective after-tax cost reduction: $1,430/month

**1031 Exchange Potential:**
- Property qualifies for 1031 exchange as investment property
- Deferred gain from 2021 purchase: $125,000
- Estimated tax deferral value: $46,250 at current capital gains rates
- Recommended minimum hold: 2 years for exchange qualification

## Neighborhood Trajectory Assessment

**Growth Indicators (Positive):**
- Penn Station $3.2B renovation (completion 2027)
- Hudson Yards Phase 2 — 1,200 new residential units
- Office-to-residential conversion pipeline: 2.1M sqft
- Major employer expansion: 3,500+ new jobs within 0.5mi
- Grid modernization investment: $180M

**Pressure Points (Monitor):**
- New supply from conversions may moderate rent growth 2026-2028
- HOA special assessments risk (building age: 6 years — low probability)
- Garment District rezoning could increase density competition

**Trajectory Score: 8.2/10** — Strong upward momentum with infrastructure catalysts

## Rental Market Absorption Rate

Current Midtown South absorption metrics:
- Average days on market (rental): 18 days
- Vacancy rate: 2.8% (below city average of 3.4%)
- New lease signing velocity: +8% QoQ
- Lease renewal rate: 72%
- Projected absorption for comparable units: 94% within 30 days

## Risk Assessment

**Low Risk Factors:**
- Prime location with walk score of 98 and transit score of 95
- Declining crime rates in precinct (-12% YoY)
- Strong employment growth with major employers expanding nearby

**Moderate Risk Factors:**
- Interest rate environment may compress cap rates further
- NYC rent stabilization regulations could impact future rental income
- High property tax burden ($18,400/year estimated)

**Risk Rating: LOW-MODERATE (3.2/10)**

## ROI Projection

| Scenario | 5-Year Appreciation | Annual Rental Income | Total ROI |
|----------|-------------------|---------------------|-----------|
| Conservative | 12.5% | $54,000/yr | 33.7% |
| Base Case | 18.2% | $57,600/yr | 40.8% |
| Optimistic | 24.8% | $62,400/yr | 49.3% |

## Recommendation

**BUY — Strong conviction.** The property offers an attractive entry point in a market with multiple positive catalysts. The combination of infrastructure investment (Penn Station, Hudson Yards), employment growth, and constrained supply supports continued appreciation. Tax benefits via depreciation provide meaningful shelter. Recommended hold period: 5-7 years for optimal returns.

*Analysis generated from 14 data sources including MLS, public records, census data, transit authorities, and real-time market intelligence.*`;
