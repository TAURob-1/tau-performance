# Subprime Auto Loan APR Elasticity — Research Notes
**Prepared for:** 247 CarFinance Meeting  
**Date:** 2026-03-24  
**Prepared by:** R2 / TAU  

---

## 1. Market Overview

### UK Car Finance Market Scale
- UK motor finance total book: ~£40bn outstanding (FCA estimates 2024)
- ~1.6 million new car finance agreements per year (FCA data)
- ~80% of new cars bought on finance (PCP/HP/PCH)
- Non-prime/subprime segment: estimated 25–30% of market by volume, but higher % of revenue
- Sub-prime APR range in UK: typically **15–49.9% APR**
- **Deep subprime** (<580 credit score equivalent): 30–49.9% APR

---

## 2. Key UK Subprime/Non-Prime Lenders & APR Benchmarks

| Lender | Type | Typical APR Range | Target Segment | Notes |
|--------|------|-------------------|----------------|-------|
| **Moneybarn** (Provident/Vanquis Group) | Direct lender | 26%–49.9% | Deep subprime | Market leader in UK non-prime auto |
| **First Response Finance** | Direct lender | 19.9%–49.9% | Subprime | Part of BCA Marketplace |
| **Advantage Finance** | Direct lender | 14.9%–39.9% | Near-prime/subprime | Owned by Secure Trust Bank |
| **Close Brothers Motor Finance** | Lender | 9.9%–29.9% | Near-prime | DCA scandal implicated; reviewing pricing |
| **Oodle Car Finance** | Digital lender | 12%–29.9% | Near-prime | VC-backed, tech-first |
| **Evolution Funding** | Broker/Funder | 6.9%–49.9% | Broad spectrum | Dealer network focus |
| **CarFinance 247** | Broker | 6.9%–49.9% rep. | Full spectrum | Panel of lenders |
| **Zuto** | Broker | 8.9%–49.9% | Full spectrum | Part of BCA Group |
| **Startline Motor Finance** | Lender | 10%–29.9% | Near-prime | JV with major banks |
| **Auto Approve (US)** | Refinance | 5.9%–29.9% | Subprime refinance | US benchmark comparison |
| **DriveTime (US)** | Buy Here Pay Here | 18%–29.9% | Deep subprime | US BHPH model |

### US Benchmarks (Experian/S&P Q3 2024)
- **Super prime** (781+): ~6.5% APR new, ~7.2% used
- **Prime** (661–780): ~9.4% new, ~11.6% used  
- **Non-prime** (601–660): ~13.8% new, ~18.2% used
- **Subprime** (501–600): ~18.5% new, ~22.4% used
- **Deep subprime** (300–500): ~22.2% new, ~23.1%+ used

---

## 3. APR Elasticity — Academic Research Summary

### Key Studies

#### Adams, Einav & Levin (2009) — "Liquidity Constraints and Imperfect Information in Subprime Lending"
- **Journal:** American Economic Review  
- **Data:** 50,000+ subprime auto loan applications from a single lender
- **Key Findings:**
  - Demand elasticity for subprime auto credit: **-0.5 to -1.5** (varies by risk tier)
  - Near-prime borrowers more price-elastic (~-1.2) vs deep subprime (~-0.4)
  - **Inelastic demand near desperation threshold** — deep subprime borrowers accept very high rates when car is needed for employment
  - Down payment requirements had stronger acceptance effects than APR adjustments

#### Einav, Jenkins & Levin (2012) — "Contract Pricing in Consumer Credit Markets"
- **Journal:** Econometrica  
- **Key Findings:**
  - Optimal pricing in subprime considers both selection (adverse selection) and moral hazard
  - Rate increases above ~35% increase default probability non-linearly
  - **Price × default interaction** creates inverted-U revenue curve

#### Karlan & Zinman (2008) — "Credit Elasticities in Less-Developed Economies"
- **Journal:** AER  
- **Data:** South African consumer lender randomized experiment  
- **Key Findings:**
  - Price elasticity of demand: approximately **-0.3 to -0.7** for credit-constrained populations
  - Suggests significant pricing power for subprime lenders

#### Federal Reserve / CFPB Research (2022–2024)
- CFPB Consumer Credit Panel: subprime auto origination volumes dropped ~15% when rates exceed 25% vs 18–22% range
- **Implied elasticity at 18–25% range: approximately -0.8**
- Price sensitivity rises sharply above 30% APR for most subprime segments

#### FCA Motor Finance Review (2019–2024)
- Discretionary Commission Arrangements (DCAs) led to ~£165 more interest per loan on average
- Shows market participants exploited **low consumer price sensitivity** in dealer origination channel
- Consumer awareness of APR very low at point of sale — key friction

#### Household Finance Survey / Bank of England (2023)
- 68% of subprime borrowers could not state their APR within 5 percentage points
- Suggests **information asymmetry dampens price elasticity**

---

## 4. Demand Curve Shape for Subprime Auto APR

```
Acceptance Rate
100% |
     |****
 85% |    ****
     |        ***
 70% |           ***
     |              **
 55% |                ***
     |                   ****
 40% |                       ****
     |                           ****
     +--------------------------------> APR
     6%  12% 18% 24% 30% 36% 42% 49.9%

Key inflection points:
- <18%: near-prime acceptance ~85%+
- 18-25%: acceptance drops ~3pp per 1% APR
- 25-35%: acceptance drops ~2pp per 1% APR (more inelastic - fewer alternatives)
- >35%: acceptance stabilises ~40-50% (desperation/no alternatives)
```

**Revenue curve** typically peaks around **28–35% APR** before default rates erode net yield.

---

## 5. ML/Modeling Approaches in Subprime Lending

### Common Approaches
1. **Logistic Regression** — Baseline accept/decline scoring
2. **Gradient Boosted Trees (XGBoost/LightGBM)** — Industry standard for credit scoring
3. **Survival Analysis** — Time-to-default modeling (Cox proportional hazards)
4. **Price Sensitivity Models:**
   - **Logit/Probit demand models** — P(accept | APR, borrower characteristics)
   - **Causal forests / Uplift modeling** — Heterogeneous treatment effects by segment
   - **Discrete Choice Models** — Nested logit for lender selection
5. **Multi-armed Bandits** — Dynamic APR optimisation

### Data Features Typically Used
- Credit bureau score (Experian, Equifax, TransUnion)
- Employment status, income, tenure
- Loan-to-value (LTV) ratio
- Vehicle age/mileage
- Loan term (24–72 months)
- Historical default patterns by cohort
- **Behavioral signals** — application journey (time spent, pages visited)

---

## 6. Regulatory Landscape

### UK
| Regulation | Details |
|-----------|---------|
| **Consumer Credit Act 1974** | Requires APR disclosure, 14-day cooling off period |
| **FCA CONC Sourcebook** | Creditworthiness assessments, responsible lending |
| **Consumer Duty (Jul 2023)** | "Good outcomes" for customers — price must represent fair value |
| **DCA Ban (Jan 2021)** | Banned discretionary commission arrangements in motor finance |
| **DCA Redress (2024–2025)** | Court of Appeal (Hopcraft, Oct 2024) ruled DCAs unlawful; Supreme Court appeal 2025; potential £30bn+ industry liability |
| **Equality Act 2010** | Prohibits discriminatory pricing by protected characteristics |

### US (for comparison)
| Regulation | Details |
|-----------|---------|
| **TILA (Reg Z)** | Truth in Lending Act — APR disclosure requirements |
| **ECOA (Reg B)** | Equal Credit Opportunity Act — fair lending |
| **UDAAP** | Unfair, Deceptive, Abusive Acts/Practices — CFPB enforcement |
| **State Rate Caps** | CO, NM, IL: 36% all-in cap; CA: 36% on auto loans up to £2,500 |
| **Military Lending Act** | 36% APR cap for active military |

### Key Regulatory Risk Signals for 247 CarFinance
1. **Consumer Duty** — Must demonstrate APR offers fair value; model needs to show how pricing reflects risk, not just margin extraction
2. **DCA Litigation** — Any historical commission-linked pricing under scrutiny
3. **Creditworthiness assessments** — ML models must be explainable to FCA
4. **GDPR/ICO** — Training data governance for ML models

---

## 7. Market Trends 2024–2026

### UK-Specific
- **DCA scandal** is reshaping market confidence; some lenders (Close Brothers, Lloyds Black Horse) pausing new business or provisions
- **Volume pressure**: subprime originations down ~12% YoY 2024 as lenders tighten criteria
- **Digital disruption**: Oodle, Zuto gaining share from traditional dealer networks
- **Used car market softening**: LTV risk increasing as residual values drop post-EV boom
- **Cost of living crisis**: arrears/default rates elevated; 90-day delinquency up ~18% 2023→2024

### Macro
- **Bank of England cutting rates** (base rate from 5.25% to 4.25% trajectory) — reducing funding costs
- **Risk-adjusted margins improving** slightly for well-positioned lenders
- **Open Banking adoption** enabling real-time income verification — improving risk models

---

## 8. Competitive Intelligence Summary

### Broker Model (247 CarFinance style)
- Revenue: typically 2–5% arrangement fee OR commission from lenders (~£300–800/deal)
- DCA ban means flat-fee commission models now standard
- **Key differentiation**: panel breadth, digital UX, approval rates, speed-to-offer

### Key Questions Post-DCA
- How are lenders pricing post-DCA? (Fixed commission + risk-adjusted APR)
- Where is the margin now sitting — lender or broker?

---

## Sources & References
- Adams, W., Einav, L., & Levin, J. (2009). Liquidity Constraints and Imperfect Information in Subprime Lending. *AER, 99*(1), 49–84.
- Einav, L., Jenkins, M., & Levin, J. (2012). Contract Pricing in Consumer Credit Markets. *Econometrica, 80*(1), 302–351.
- Karlan, D., & Zinman, J. (2008). Credit Elasticities in Less-Developed Economies. *AER, 98*(3), 1040–1068.
- FCA Motor Finance Market Study (MS18/1.1–1.3), 2019
- FCA Consumer Duty Guidance (FG22/5), 2022
- Experian State of the Automotive Finance Market Q3 2024
- CFPB Consumer Credit Panel, 2024
- Bank of England Financial Stability Report, 2024
- Court of Appeal: Johnson v FirstRand, Hopcraft v Close Brothers, Wrench v FirstRand [2024] EWCA Civ 1279
