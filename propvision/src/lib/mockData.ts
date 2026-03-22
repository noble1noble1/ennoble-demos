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
    soldDate: "Nov 2024",
    daysOnMarket: 45,
    condition: "Good",
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
    soldDate: "Oct 2024",
    daysOnMarket: 62,
    condition: "Fair",
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
  },
];

export const mockRentEstimate: RentEstimate = {
  low: 3800,
  mid: 4500,
  high: 5200,
};

export const mockMarketData: MarketDataPoint[] = [
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
  },
  {
    id: 2,
    text: "MTA announces $3.2B investment in Penn Station renovation — transit accessibility improvements expected by 2027",
    source: "Metropolitan Transit Authority",
    timestamp: "5 min ago",
    relevance: 91,
  },
  {
    id: 3,
    text: "Crime rate in Midtown South precinct decreased 12% year-over-year according to latest NYPD CompStat data",
    source: "NYPD CompStat",
    timestamp: "8 min ago",
    relevance: 87,
  },
  {
    id: 4,
    text: "Major tech employer opening 450,000 sqft headquarters at One Penn Plaza — estimated 3,500 new jobs",
    source: "Commercial Observer",
    timestamp: "12 min ago",
    relevance: 85,
  },
  {
    id: 5,
    text: "NYC median condo prices up 4.2% in Q4 2024, outpacing national average of 2.8%",
    source: "StreetEasy Market Report",
    timestamp: "15 min ago",
    relevance: 82,
  },
  {
    id: 6,
    text: "Rezoning proposal for Garment District would allow increased residential density within 0.5mi radius",
    source: "NYC Dept of City Planning",
    timestamp: "18 min ago",
    relevance: 79,
  },
  {
    id: 7,
    text: "New Whole Foods Market confirmed for 6th Avenue location — neighborhood retail amenities expanding",
    source: "Crain's New York Business",
    timestamp: "22 min ago",
    relevance: 75,
  },
  {
    id: 8,
    text: "Property tax assessment appeal window opens March 1 — potential 8-12% reduction for comparable units",
    source: "NYC Finance Dept",
    timestamp: "25 min ago",
    relevance: 72,
  },
];

export const mockInvestmentBrief = `## Executive Summary

The subject property at 350 Fifth Avenue, New York, NY 10118 represents a compelling investment opportunity in Manhattan's Midtown corridor. The 3-bedroom, 2-bathroom condominium spanning 1,850 sqft is currently valued at $1,275,000, reflecting a 10.9% appreciation since its last sale in June 2021 at $1,150,000.

## Market Analysis

The Midtown Manhattan market continues to demonstrate resilience, with median condo prices rising 4.2% year-over-year. Key demand drivers include proximity to Penn Station (undergoing $3.2B renovation), expanding tech sector employment, and limited new inventory in established buildings.

Current rental rates for comparable units range from $3,800 to $5,200/month, with a median estimate of $4,500/month. This translates to a gross rental yield of approximately 4.24%, above the Manhattan average of 3.8%.

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

**BUY — Strong conviction.** The property offers an attractive entry point in a market with multiple positive catalysts. The combination of infrastructure investment (Penn Station, Hudson Yards), employment growth, and constrained supply supports continued appreciation. Recommended hold period: 5-7 years for optimal returns.

*Analysis generated from 14 data sources including MLS, public records, census data, transit authorities, and real-time market intelligence.*`;
