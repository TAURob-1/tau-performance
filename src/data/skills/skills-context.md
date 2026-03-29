[TAU Skills — Paid Search]
---
name: paid-search
description: TAU paid search activation skill. Campaign architecture from Audience Graph M_KEY keyword clusters, intent-based structure, match type hierarchy, PMax control, incrementality testing, quality score. Activate when graph shows M_KEY allocation above 8%.
---

# Paid Search

Translating Audience Graph keyword clusters into structured, intent-segmented search campaigns. Platform-agnostic methodology, with platform-specific activation guidance for Google Ads and Microsoft Ads.

## Purpose

Turn graph keyword data (terms, volumes, CPCs, competition scores) into campaign architecture built around intent purity. Every campaign has a clear intent job. Every valuable term is protected on exact. Automation is controlled, not trusted.

## Diagnostic

1. What is M_KEY allocation? (HIGH = search leads the plan; MID = search supports; LOW = brand defence only)
2. Which keyword clusters carry commercial intent (high CPC) vs informational intent (low CPC)?
3. What branded terms exist and what is the competitive threat on them?
4. What conversion events are available — and how far downstream can we measure?
5. Is there first-party data for audience overlays or value-based signals (M_CRM)?
6. What is the current quality score baseline on key landing pages?

## Intent-Based Campaign Architecture

### The Cardinal Rule: Separate by Intent

Every campaign serves one intent job. Mixing intents in a single campaign corrupts bidding signals, reporting, and optimisation decisions.

| Intent Tier | Examples | Campaign Approach |
|------------|---------|-------------------|
| **Brand** | Brand name, brand + product, brand + location | Dedicated brand campaign. Always separate. Never mixed with generic. Exact match. Target impression share bidding. |
| **High commercial** | "buy X", "X price", "best X for Y", product-specific terms | Dedicated campaigns per cluster. Exact match primary. Phrase match secondary for close variants. Separate budget. |
| **Mid-funnel / consideration** | "X vs Y", "X reviews", "how to choose X" | Separate campaign. Exact + phrase. Lower bid expectations. Judge on assisted value, not last-click. |
| **Informational / top-funnel** | "what is X", "how to X" | Consider whether search is the right channel. If yes, separate campaign with content-led landing pages. |
| **Competitor** | Competitor brand names, "alternative to X" | Dedicated campaign. Tight budget. Monitor quality score (will be low). Measure incrementality specifically. |

### Why Brand Must Be Separate

- Brand conversions are not search conversions — they are demand captured from other channels
- Mixing brand and generic inflates reported ROAS and corrupts smart bidding signals
- Brand CPCs are typically 10-20x cheaper than generic — mixing distorts average CPC reporting
- Brand campaign exists to defend, not to grow. If no competitors bid on your brand, question whether brand search spend is needed at all
- Always report brand and generic performance separately. Combined reporting is meaningless.

## Match Type Hierarchy

**Default to exact. Expand with evidence.**

### Exact Match (Primary)
- All high-value commercial terms from graph keyword clusters
- All brand terms
- All competitor terms
- Terms where CPC > £2 or where you need bid precision
- Exact match protects your best terms from being cannibalised by broad match or PMax

### Phrase Match (Secondary)
- Close variants and modifiers of exact terms
- Use to discover extensions of proven intent themes
- Cross-pollinate negatives to prevent phrase from stealing exact traffic

### Broad Match (Exception, Not Default)
- Only with strong conversion data (50+ conversions/month in the campaign)
- Only with smart bidding active
- Only when exact and phrase coverage is already established
- Never as a substitute for proper keyword research
- Monitor search terms report weekly — broad match will find irrelevant traffic

### Negative Keywords
- **Cross-campaign negatives**: Prevent cannibalisation between intent tiers (brand negatives on generic, generic negatives on brand)
- **Cross-cluster negatives**: Prevent overlap between keyword clusters
- **PMax negatives**: Apply brand terms and high-value exact terms as negatives on PMax to prevent it stealing credit
- **Query mining cadence**: Review search terms report weekly for first month, fortnightly thereafter. Add negatives and promote good queries to exact.

## Performance Max: Necessary but Dangerous

### Why PMax Is Necessary
- Google is funnelling inventory toward PMax (Shopping, Display, YouTube, Discover, Gmail, Maps)
- Some inventory is only accessible through PMax
- For e-commerce, PMax Shopping is often the primary product feed channel

### Why PMax Is Dangerous
- **Black box**: No search terms report, limited placement transparency
- **Credit stealing**: PMax will claim conversions from brand search, Shopping, and remarketing — inflating its reported performance
- **Cannibalisation**: Without controls, PMax eats your best-performing exact match traffic
- **Google's incentive misalignment**: Google profits from broad automation. Your profit comes from precision.

### Controlling PMax
1. **Negative keywords on PMax**: Add all brand terms as negatives. Add top-performing exact match terms as negatives. Force PMax to find incremental traffic, not cannibalise known winners.
2. **Asset group discipline**: Separate asset groups by intent theme. Don't dump all products/services into one group.
3. **Audience signals**: Feed graph-derived audiences (interests, demographics, customer lists) as signals, not just targets.
4. **URL exclusions**: Exclude landing pages that serve your exact match campaigns.
5. **Budget isolation**: Separate PMax budget from standard search. Don't let PMax starve your controlled campaigns.
6. **Measurement**: Judge PMax on incremental conversions only. Run incrementality tests (geo-based holdouts or on/off tests) to verify PMax is actually driving new business, not just re-labelling existing conversions.

## Incrementality: Trust but Verify

### The Problem with Platform Attribution
- Google's data-driven attribution model does not adequately measure incrementality
- Last-click, first-click, and data-driven models all tell you what touched the customer, not what changed their behaviour
- Search is particularly prone to over-claiming because it sits at the bottom of the funnel — people who would have converted anyway still search first
- Smart bidding optimises to platform-reported conversions, not incremental conversions. This matters.

### Incrementality Testing Approaches

| Method | How | When |
|--------|-----|------|
| **Geo-based holdout** | Suppress search in matched geographic regions for 4-6 weeks. Measure conversion difference. | Budget > £10K/month. Best for generic search. |
| **On/off test** | Pause a campaign or keyword set for 2-4 weeks. Measure total business conversions (not just search). | Works for brand search and PMax. Simple but noisy. |
| **Matched market test** | Split similar markets into test/control. Run search in test only. | Larger budgets. Most rigorous. |
| **Conversion lift study** | Platform-native (Google, Meta). Measures incremental lift from exposed vs holdout groups. | Available for larger spenders. Better than nothing but platform-run = platform-biased. |

### What to Test First
1. **Brand search incrementality**: Are you paying for clicks that would have come organically? Often the answer is yes.
2. **PMax incrementality**: Is PMax driving new conversions or relabelling existing ones?
3. **Generic search incrementality**: Especially for high-CPC terms where the cost of non-incremental clicks is highest.

## Quality Score: The Hidden Multiplier

### Why Quality Score Matters
- Quality score directly affects CPC (higher QS = lower cost for same position)
- Quality score affects ad rank (higher QS = better position for same bid)
- A 3-point quality score improvement can reduce CPCs by 30-50%
- Quality score is the single most controllable lever for search efficiency

### The Three Components

| Component | Weight | How to Improve |
|-----------|--------|----------------|
| **Expected CTR** | ~40% | Write compelling ad copy. Test headlines relentlessly. Use all RSA headline slots with varied angles. Include keywords naturally. |
| **Ad relevance** | ~20% | Tight ad group theming — one intent cluster per ad group. Headlines must match the keyword intent, not just contain the keyword. |
| **Landing page experience** | ~40% | Page must deliver on the ad promise. Fast load time (<3s). Mobile-optimised. Clear above-fold content matching the search intent. No bait-and-switch. |

### Landing Page Requirements
- **Relevance**: Landing page content must match the keyword cluster intent. Generic homepages destroy quality score.
- **Speed**: Core Web Vitals matter. Aim for LCP < 2.5s, FID < 100ms, CLS < 0.1.
- **Mobile**: Over 60% of search traffic is mobile. If the mobile experience is poor, quality score suffers.
- **Conversion path**: Clear CTA above the fold. Minimal friction. Form length appropriate to the value exchange.

## Ad Copy: Fresh, Tested, Intent-Matched

### Copy Principles
- **Match the intent**: Ad copy for "buy ski boots" is different from "best ski boots review." Write to the search state, not the product.
- **Fresh copy rotation**: Refresh RSA headlines every 4-6 weeks. Google rewards novelty and penalises stale ads.
- **Test, don't guess**: Run at least 3 RSA variants per ad group. Pin only when you have data proving a headline wins in a specific position.
- **Include proof points**: Prices, ratings, delivery times, stock status. Specificity beats generality.

### RSA Best Practices
- Use all 15 headline slots with genuinely different angles
- At least 4 description slots with varied messages
- Don't pin everything — let Google test combinations, but pin your strongest brand/CTA headline to position 1 if data supports it
- Include keyword-relevant headlines but don't keyword-stuff
- Refresh underperforming assets (low impression share, "Learning" status stuck)

## Connecting to Audience Graph

| Graph Signal | Search Action |
|-------------|---------------|
| M_KEY HIGH | Search leads the plan. Dedicated budget. Full intent segmentation. |
| M_KEY MID | Search supports. Focus on high-commercial clusters only. |
| M_KEY LOW | Brand defence only. Minimal generic. |
| Keyword clusters with volume + CPC | Map directly to campaign structure by intent tier |
| Platform targeting (Google native segments) | Layer as audience signals on generic campaigns |
| Daypart peaks (index >= 115) | Apply ad scheduling bid adjustments |
| M_CRM HIGH | Customer Match for RLSA, value-based bidding, exclusions |

## Daypart and Scheduling

When graph shows daypart peaks:
- Apply ad scheduling bid adjustments to peak hours (+10-30%)
- Reduce bids during deep troughs (index < 80) by 20-50%
- Align with conversion window, not just engagement — peak search may differ from peak conversion
- Test before committing: run 2 weeks with observation-only scheduling before applying bid adjustments

## Microsoft Ads Considerations

- Import Google Ads structure but don't assume identical performance
- Microsoft audience tends older, higher income, desktop-heavy
- LinkedIn profile targeting is unique to Microsoft — use for B2B
- Lower CPCs but lower volume — good for incremental reach at efficient cost
- Monitor separately; don't just mirror Google bid strategies

## TAU POV

- **Search captures demand, it rarely creates it** — Don't over-credit search for conversions driven by other channels
- **Exact match is the foundation** — Every other match type is an expansion from a proven exact match base
- **PMax is a necessary tool, not a trusted partner** — Control it with negatives, budget isolation, and incrementality testing
- **Google's attribution is not neutral** — Google profits when you spend more. Their measurement tools will not tell you to spend less. Verify with independent incrementality tests.
- **Quality score is strategy, not hygiene** — A 3-point QS improvement beats a 30% budget increase for efficiency
- **Fresh copy compounds** — Stale ads decay in CTR, quality score, and conversion rate simultaneously
- **Brand search is defence, not growth** — Report and budget it separately. Always.

## Templates

```markdown
## Paid Search Plan
- M_KEY allocation: X% [TIER]
- Intent structure:
  - Brand: [terms, match type, bid strategy]
  - High commercial: [clusters, exact match, bid strategy]
  - Consideration: [clusters, exact + phrase, bid strategy]
  - Competitor: [terms, budget cap]
- PMax: [role, negatives applied, asset groups, incrementality test plan]
- Quality score baseline: [current scores, improvement targets]
- Copy refresh cadence: [schedule]
- Audience overlays: [from platform targeting]
- Scheduling: [from daypart peaks]
- Budget: £X (Y% of total), brand/generic split
- Measurement: [conversion events, incrementality test design, reporting separation]
```

## Anti-patterns

- Mixing brand and generic in one campaign or one report
- Defaulting to broad match before exact coverage is established
- Treating PMax as "set and forget" without negatives or incrementality testing
- Trusting Google's data-driven attribution without independent verification
- Letting ad copy go stale for months
- Ignoring quality score on landing pages
- Reporting combined brand + generic ROAS as "search performance"
- Building campaigns from keyword tools without graph context
- Running broad match without conversion tracking
- Optimising to platform-reported conversions without questioning incrementality

## Connected Skills

- `channel/search` — parent skill for search strategy and measurement philosophy
- `tools/audience-graph` — source of keyword clusters, mechanism tiers, platform targeting
- `channel/youtube` — Demand Gen crossover when M_KEY + M_CHAN align
- `client/attribution-diagnostic` — incrementality testing design and execution

---
*TAU — The Independent Marketing Intelligence Architect*



[TAU Skills — Meta Social]
---
name: meta-social
description: TAU Meta platform activation. Advantage+ campaigns, Conversions API, detailed targeting post-ATT, Instagram Reels vs Feed, Audience Network. Activate when graph shows M_INT is HIGH or Meta appears in platform targeting.
---

# Meta Social

Meta platform activation — turning Audience Graph interest signals and platform targeting into Facebook, Instagram, and Audience Network campaigns.

## Purpose

Translate M_INT mechanism data, Rosetta Stone audience signals, and Meta native targeting segments into campaign architecture. Navigate post-ATT targeting, Advantage+ automation, and creative system design.

## Diagnostic

1. What is M_INT allocation? (HIGH = interest-led prospecting is primary; MID = supporting channel)
2. Does graph show Meta native targeting segments? What types (demographics, interests, behaviours)?
3. Is first-party data available for Custom Audiences and CAPI (M_CRM)?
4. What creative assets exist? (Video for Reels, static for Feed, Stories format)
5. What is the conversion event hierarchy? (Purchase > Lead > View Content)

## Advantage+ Decision Tree

### When to Use Advantage+ Shopping Campaigns (ASC)
- Sufficient conversion volume (50+ per week per ad set)
- Strong creative pipeline (10+ variants)
- Clear purchase/conversion event
- Budget allows for learning phase (£50+ per day per ad set)

### When to Use Manual Campaigns
- M_INT is MID and precise targeting matters
- Testing specific audience hypotheses from graph
- Budget is constrained and learning phase waste is unacceptable
- Need to control frequency across specific audience segments

### Hybrid Approach
- ASC for proven audiences and retargeting
- Manual campaigns for prospecting with graph-derived interest stacks
- Separate budget pools to prevent ASC from cannibalising prospecting

## M_INT to Meta Audience Mapping

| Graph Signal | Meta Targeting |
|-------------|----------------|
| Interest attributes (BEHAV class) | Detailed Targeting: Interests |
| Psychographic attributes (PSYCH class) | Detailed Targeting: Behaviours + Interest intersection |
| Demographic attributes (DEMO class) | Demographics (native, reliable post-ATT) |
| CRM/1P data (M_CRM HIGH) | Custom Audiences + Lookalikes |
| Channel affinity shows Meta high | Platform allocation justified |

## Conversions API (CAPI)

- **Always recommend CAPI alongside pixel** — Browser-side tracking alone loses 20-40% of conversions post-ATT
- **Event match quality**: Target 6.0+ score. Use email, phone, external_id as matching keys
- **Deduplication**: Use event_id to prevent double-counting between pixel and CAPI
- **Server-side events**: Purchase, Lead, Subscribe, Add to Cart — send within 1 hour of event

## Creative System

### Format Selection by Placement
| Placement | Format | Best For |
|-----------|--------|----------|
| Instagram Reels | 9:16 video, 15-30s | Awareness, top-funnel, younger skew |
| Instagram Feed | 1:1 or 4:5 image/video | Consideration, product showcase |
| Instagram Stories | 9:16 image/video, 15s | Urgency, offers, swipe-up CTAs |
| Facebook Feed | 1:1 or 4:5 image/video | Broad reach, older demo |
| Audience Network | Multiple formats | Reach extension, lower CPM |

### Creative Testing Framework
- Test creative variables (hook, message, CTA) not just ad formats
- Minimum 3 variants per ad set for meaningful signal
- Kill underperformers at 2x target CPA, not before
- Refresh creative every 2-4 weeks to manage fatigue

## Daypart and Scheduling

When graph shows daypart peaks:
- Apply campaign budget scheduling to concentrate spend in peak hours
- Meta's delivery optimisation handles most scheduling, but budget dayparting can improve efficiency
- Peak evening hours (19:00-22:00) often align with social usage patterns

## TAU POV

- **Broad targeting works when creative is strong and conversion data is clean** — Post-ATT, Meta's algorithm often outperforms manual targeting
- **Interest stacking is not strategy** — Too many interests = no targeting. Use graph M_INT signals to select 2-3 high-confidence interest categories
- **Retargeting efficiency is not proof of strategy** — Separate prospecting and retargeting reporting. Judge prospecting on downstream value
- **CAPI is table stakes** — Without server-side events, you're optimising on incomplete data

## Templates

```markdown
## Meta Activation Plan
- M_INT allocation: X% [TIER]
- Platform targeting segments: [from graph]
- Campaign structure:
  - Prospecting: [Advantage+ / Manual, audiences]
  - Retargeting: [Custom Audiences, window]
- CAPI status: [Implemented / Needed]
- Creative system: [formats, variants, testing plan]
- Budget: £X (Y% of total)
- Measurement: [Conversion lift study / holdout / incrementality]
```

## Anti-patterns

- Stacking 20+ interests in one ad set
- Judging Meta only on last-click attribution
- Running Advantage+ without creative diversity
- No CAPI implementation
- Same creative across Reels, Feed, and Stories
- Optimising to View Content when Purchase data is available

## Connected Skills

- `channel/social` — parent skill for social strategy and measurement
- `tools/audience-graph` — source of M_INT tiers, platform targeting, daypart data
- `rosetta-stone/sub-skills/psychographic` — motivation mapping for creative
- `rosetta-stone/sub-skills/digital-identity` — CRM and lookalike seed quality
- `thinking/psychological` — creative hooks and behavioural triggers

---
*TAU — The Independent Marketing Intelligence Architect*



[TAU Skills — Attribution Diagnostic]
---
name: attribution-diagnostic
description: Measurement audit methodology. Use when assessing client's current attribution setup, identifying gaps, and recommending improvements. Zepz-style engagement.
---

# Attribution Diagnostic

TAU's measurement and attribution audit methodology.

## Purpose

Assess a client's current measurement maturity, identify gaps between their setup and best practice, and provide a prioritised roadmap to improve.

## Diagnostic Questions

Before applying frameworks:

1. What attribution model(s) are currently in use?
2. What's the primary source of truth for marketing performance?
3. How are offline conversions tracked (if applicable)?
4. What's the current MMM/incrementality testing capability?
5. What decisions are currently blocked by measurement gaps?
6. What's the appetite for investment in measurement infrastructure?

## Frameworks

### Measurement Maturity Model
```
Level 1: Last-click only, siloed channel reporting
Level 2: Multi-touch attribution, cross-channel dashboards
Level 3: MMM + MTA integration, incrementality testing
Level 4: Unified measurement, real-time optimisation, automated allocation
Level 5: Predictive, prescriptive, self-optimising
```

### Attribution Model Selection
| Business Type | Recommended Primary | Supporting |
|--------------|---------------------|------------|
| E-commerce | Data-driven MTA | MMM for budget |
| Lead gen (long cycle) | Position-based | Incrementality |
| Brand building | MMM | Brand lift studies |
| Omnichannel retail | Unified (online+offline) | Geo tests |

### Incrementality Testing Framework
- Geo holdout design
- Matched market selection
- Lift measurement methodology
- iROAS calculation

## TAU POV

- **Don't trust any single model** — triangulate MTA, MMM, and incrementality
- **Incrementality is truth** — everything else is modelled allocation
- **Measure what matters** — focus on business outcomes, not vanity metrics
- **Privacy-first** — design for a cookieless future now

## Templates

- Measurement maturity assessment scorecard
- Attribution gap analysis
- Measurement roadmap (30/60/90 day)
- Incrementality test design document

## Anti-patterns

- Choosing attribution model based on what looks best for a channel
- Over-investing in MTA without incrementality validation
- Building measurement infrastructure before defining decisions it should inform
- Treating attribution as a one-time project vs ongoing capability

## Connected Skills

- `channel/search` — Search attribution specifics
- `channel/tv-av` — AV measurement, brand lift
- `rosetta-stone` — Audience understanding for attribution windows

## Worked Examples

[Zepz engagement — anonymised details to be added]

---
*TAU — The Independent Marketing Intelligence Architect*



[TAU Skills — Channel Approach]
---
name: channel-approach
description: TAU channel approach — how to run each paid channel well and what to watch for. Covers paid search, social, display/programmatic, CTV, linear TV, cross-channel measurement, exposure control testing, and browser/OS fragmentation. Activate on any channel planning, media plan audit, or budget allocation conversation.
---

# TAU Channel Approach

How TAU thinks about paid channels. For each channel: why it works, how to run it well, what to control, and what to watch for. This is not a best-practice checklist — it is a point of view backed by evidence.

---

## Paid Search

### Why It Works
Search captures explicit demand. When someone types a query, they are telling you what they want. No other channel offers this level of declared intent. For high-intent commercial queries, search delivers the most direct connection between audience need and advertiser response.

### How to Run It Well

**Exact match is the foundation.** Maximise exact match keyword percentage. Every high-value commercial term, brand term, and competitor term should be on exact. Phrase match extends proven themes. Broad match is the exception — only after 50+ conversions/month with smart bidding active and existing exact coverage established.

> *"When you use broad match keywords, you should only use broad match keywords... At Grow My Ads, we think that's complete nonsense."* — Austin LeClear, Grow My Ads
> Source: [Grow My Ads](https://growmyads.com/exact-match-vs-broad-match-why-you-need-both-in-google-ads-despite-googles-advice/)

**Segment by intent — never mix.** Brand, high commercial, consideration, informational, competitor — each gets its own campaign with appropriate match types, bid strategy, and budget. Where possible, keep intent tiers pure. Mixed intent corrupts bidding signals and makes reporting meaningless.

> *"95% of brands waste budget on mixed traffic."* Branded keywords average 1299% ROAS vs 68% for generic — 19x difference. Blending these inflates reported performance.
> Source: [Echelonn](https://www.echelonn.io/post/google-ads-branded-non-branded-campaign-structure)

**Quality Score is strategy, not hygiene.** A 3-point QS improvement can reduce CPCs by 30-50%. QS 10 delivers 80% less per conversion than QS 5. Landing page experience and ad relevance are the controllable levers — invest in them before increasing budget.

> *"Quality Score isn't a cosmetic metric. It's the economic engine."* — Frederick Vallaeys, CEO Optmyzr (former Google employee)
> Source: [Optmyzr](https://www.optmyzr.com/blog/google-ads-quality-score/); [WordStream QS study (~$100M spend)](https://www.wordstream.com/blog/ws/2013/07/16/quality-score-cost-per-conversion)

**Fresh copy compounds.** Refresh RSA headlines every 4-6 weeks ideally. Stale ads decay in CTR, quality score, and conversion rate simultaneously. Google's own Ad Strength metric is unreliable — "average" Ad Strength outperformed "excellent" on CPA and ROAS in Optmyzr's study of 1M+ ads.

> Source: [Optmyzr Ad Strength Study (22K accounts, 1M+ ads)](https://www.optmyzr.com/blog/google-ad-strength-study/)

**Keyword clusters from the Audience Graph are a starting point.** They identify your target audience's search behaviour. Build them out with Google's recommendations and actual search query data. Validate within 2 weeks of launch — graph CPC data is a benchmark, not a bid cap.

### What to Control

**Brand search.** We will likely always run brand campaigns — SEO links are less reliable than they were, so brand search is increasingly needed for defence. But be aware: limited incrementality. The eBay study found 99.5% of brand traffic arrived organically when ads paused. Separate brand reporting. Always.

> Source: [Blake, Nosko & Tadelis, Econometrica 2015](https://faculty.haas.berkeley.edu/stadelis/BNT_ECMA_rev.pdf)

**Performance Max.** PMax is necessary — Google is funnelling inventory toward it. But it must be controlled:
- Add brand terms and top exact match terms as PMax negatives
- Isolate PMax budget from standard search
- Separate asset groups by intent theme
- Use URL exclusions to prevent cannibalisation
- Judge on incremental conversions, not platform-reported

PMax does not require incrementality testing as a hard rule, but it does require control. Without negatives and budget isolation, PMax will claim credit for conversions your exact match campaigns were already winning.

> *"I would be the world's foremost Smart Shopping evangelist if it weren't for the data obfuscation."* — Kirk Williams, ZATO (Top 25 PPCer, 9 years running)
> Source: [ZATO](https://zatomarketing.com/ppc-marketing-book); [Adalytics PMax report](https://www.adexchanger.com/online-advertising/adalytics-exposes-an-alleged-10-5-billion-black-hole-in-the-google-search-partners-program/)

**Google's attribution.** Google's data-driven attribution does not sufficiently measure incrementality. DDA identifies correlation, not causation. Google removed the attribution models that disadvantaged its own platform. Verify with independent measurement where budget justifies it.

> *"Google's models identify correlation (someone clicked a Google ad before converting), not causation (the ad actually caused the conversion). Google's primary goal is to maximize advertiser spending, not to provide unbiased measurement."* — Measured.com
> Source: [Measured](https://www.measured.com/faq/google-platform-attribution-pros-cons-and-why-you-need-more/); [Michael Taylor, Vexpower](https://www.measured.com/blog/google-drops-all-the-attribution-models-that-make-it-look-bad/)

**Microsoft Ads.** Not a Google clone — plan separately ideally. Older, higher-income, desktop-heavy audience. LinkedIn profile targeting is unique for B2B. Lower CPCs, lower volume. Import structure but monitor independently.

**Negative keywords from day one.** Cross-campaign negatives to prevent cannibalisation. PMax negatives for credit theft prevention. Weekly search terms review for the first month, fortnightly after.

---

## Social / Meta

### Why It Works
Social solves a discovery problem that search cannot. Search captures existing demand; social creates it. Meta's algorithm is genuinely good at finding people who will respond to a specific creative — a matching problem where AI adds real value, because Meta has no search-intent signal to rely on.

### How to Run It Well

**Advantage+ is more justifiable than PMax.** Meta is deprecating manual campaign APIs (legacy ASC/AAC APIs deprecated October 2025; API v25.0 permanently prohibits legacy creation in Q1 2026). Unlike PMax, there are fewer viable alternatives — and when fed clean data and quality creative, Advantage+ delivers genuine cost reductions of 20-40%.

> *"Your job changed from 'control the campaign' to 'feed the system good inputs.' Advertisers struggling most are those still trying to micromanage."* — Jon Loomer
> Source: [Jon Loomer (83 Meta changes in 2025)](https://www.jonloomer.com/meta-advertising-changes-2025/)

However, Advantage+'s key risk is over-indexing on retargeting. Wicked Reports analysed 55,661 Meta campaigns and found Advantage+ new customer acquisition cost more than doubled from $257 to $528 (May 2024 to May 2025), while manual campaigns acquired new customers more cheaply. Use Advantage+ for scale and retargeting; consider manual campaigns for cold prospecting where budget allows.

> Source: [Wicked Reports (55,661 campaigns)](https://www.wickedreports.com/blog/meta-advantage-research-results)

**CAPI is table stakes.** Browser-side tracking loses 20-40% of conversions post-ATT. Target event match quality 6.0+. Use email, phone, external_id as matching keys. Deduplicate with event_id. No CAPI = optimising on incomplete data.

**Creative is the primary lever.** Post-ATT, with automated targeting, creative quality and variety is the single biggest controllable variable. Different creative for Reels, Feed, and Stories — never repurpose across placements. Refresh every 2-4 weeks ideally. Test creative variables (hook, message, CTA), not just formats. Minimum 3 variants per ad set.

**Interest stacking is not targeting.** Stacking 20+ interests = no targeting. Use Audience Graph M_INT signals to select 2-3 high-confidence interest categories. Broad targeting with strong creative often outperforms over-layered interests post-ATT.

### What to Control

**Separate prospecting from retargeting — always.** Retargeting looks efficient because it captures people already in the funnel. Judge prospecting on downstream value over 30-90 days, not last-click CPA. Separate budgets, separate reporting.

**Meta's self-reported attribution inflates performance.** Platform-reported ROAS is not incremental ROAS. Run conversion lift studies or geo holdouts. Priority: test retargeting incrementality first — it over-claims most.

> *"What the data and effectiveness theories say doesn't fit with what the increasingly powerful platforms tell us we need to do."* — Tom Roach, Jellyfish/BBH
> Source: [Tom Roach](https://thetomroach.com/2025/01/12/brand-building-in-the-platforms/)

**Attention decay on scrollable formats.** Up to 70% of branded moments appear when less than 20% of paid reach is watching. 2.5 seconds is the minimum attention threshold for memory encoding. 85% of digital placements receive less than this.

> Source: [Prof. Karen Nelson-Field, Amplified Intelligence](https://www.mi-3.com.au/05-04-2023/reach-curves-have-gone-rogue-karen-nelson-field-warns-scrollable-media-attention-decay)

**Frequency management is your problem.** No cross-platform frequency system exists. If running Meta + TikTok + Pinterest, plan to a total frequency budget and account for overlap.

**TikTok is not Instagram Reels.** Different audience behaviour, content expectations, and creative requirements. Plan separately.

---

## Display / Programmatic

### Why It Works
Display works when it has a specific job: contextual prospecting against relevant content, audience extension for niche segments, local/geographic deployment, retargeting support, or high-impact format brand presence. Some audiences still consume content on websites — sports sites, news, specialist verticals. For these audiences, display in the right environment is effective.

Contextual targeting is the post-cookie opportunity. Contextual ads are 50% more likely to be clicked than non-contextual. 65% of consumers prefer ads relevant to the page they're viewing over ads based on browsing history. As cookies deprecate, contextual becomes more important.

> Source: [GumGum/Dentsu study](https://gumgum.com/blog/landmark-study-proves-the-effectiveness-of-contextual-over-behavioral-targeting) — contextual impressions cost 29% less than behavioural; [Harris Poll](https://www.cmswire.com/digital-marketing/contextual-targeting-vs-cookies-who-will-win-in-2024/)

High-impact formats (takeovers, skins, rich media) deliver up to 45x more attention than standard banners. Desktop Topscroll delivers 5,476 seconds of attention per 1,000 impressions — 72x higher than standard display.

> Source: [Adnami eye-tracking study](https://www.adnami.io/blog/eyetracking-study-confirms-that-high-impact-outperform-standard-display)

### How to Run It Well

**Buy via PMP or Programmatic Guaranteed — not open exchange for brand campaigns.** Work on buying direct from trusted suppliers as much as possible. PMP gives you control over which publishers you buy from. PG locks in inventory, price, and placement. Open exchange means you don't know where your ads run.

SPO (supply path optimisation) can be achieved through pushing PMP and PG — fewer intermediaries means more of your spend reaches publishers.

> *"The programmatic supply chain's original sin is the belief that advertisers can simply buy a publisher's audiences cheaper somewhere else."* — Ana Milicevic, Sparrow Advisers
> Source: [New Digital Age](https://newdigitalage.co/programmatic/ana-milicevic-the-programmatic-supply-chain-non-surprise/); ANA Q2 2025: [$26.8B lost annually to programmatic supply chain inefficiencies](https://www.ana.net/content/show/id/pr-2025-08-programmatictrans)

**Display must have a specific job or it shouldn't be in the plan.** If you can't explain display's role in one sentence, remove it. "Every plan has display" is not a strategy.

**Log-level data is beneficial but realistic.** This is for large customers — DV360 won't provide it easily, and it's expensive. But where accessible, log-level data is the only way to independently audit where ads ran, at what frequency, and whether they were seen by real humans.

### What to Control

**Separate retargeting from prospecting — completely.** Same rule as social. Different economics, different reporting, always.

**Cookie bombing is not a strategy — never recommend it.** Blanketing users with display impressions to claim post-view credit is wasteful and deceptive. Judge display on controlled incrementality, not post-view windows.

**Post-view attribution is guilty until proven innocent.** Default to post-click measurement. Only include post-view if validated by incrementality tests. Short windows (1-7 days max) if used at all.

**Ad fraud is structural, not marginal.** $26.8B lost annually (ANA 2025). Verification companies report ~1% invalid traffic while real rates may exceed 50%. Verification is necessary but not sufficient — layer with supply-path audit, URL reporting, and performance validation.

> *Dr. Augustine Fou: AppNexus once cleaned 240 billion of 260 billion impressions — 92% fraudulent.*
> Source: [Dr. Augustine Fou](https://www.linkedin.com/pulse/programmatic-has-been-problematic-from-start-dr-augustine-fou)

**MFA sites steal budget silently.** Sites created solely to serve ads pass verification but deliver near-zero attention. Demand URL-level reporting and exclude MFA inventory.

**Viewability is not attention.** 85% of digital placements receive less than 2.5 seconds of active attention. Being "viewable" (50% pixels for 1 second) means almost nothing for brand impact.

> *"66p in every £1 is wasted through poor branding in digital."* — Prof. Karen Nelson-Field
> Source: [Amplified Intelligence](https://www.vccp.com/uk/news/2025/may/hacking-the-attention-economy-vccp-media-and-dr-karen-nelson-field-reveal-1-5-second-formula-for-effective-digital-advertising)

---

## CTV / AV

### Why It Works
CTV captures more active attention than almost any other digital format — 8.1 seconds per 15s ad vs less than 2.5s for most display and social. It combines TV's lean-back, full-screen attention with digital's targeting and measurement capabilities. Co-viewing (~1.7 viewers per screen) means impression counts understate actual audience.

> Source: [Prof. Karen Nelson-Field](https://www.mi-3.com.au/04-04-2022/nines-attention-study-mobile-beats-ctv-which-beats-linear-tv-active-attention-existing)

YouTube CTV is uniquely powerful because of search-intent targeting — no other CTV platform lets you target based on what people searched for. Custom intent audiences built from keyword clusters are YouTube's unique weapon. But broadcast VOD (ITVX, C4) is arguably a better environment for brand campaigns. Don't over-push YouTube at the expense of premium broadcaster inventory.

### How to Run It Well

**Distinguish three tiers of CTV — never bundle them.**

| Tier | Examples | Quality | Risk |
|------|----------|---------|------|
| **Broadcast CTV / BVOD** | ITVX, C4 Streaming, Sky Go | Premium, brand-safe, broadcaster-controlled, verified audiences, frequency management | Low — highest trust |
| **YouTube CTV** | YouTube on TV screens | Massive scale, search-intent targeting, Google audience stack | Medium — user-generated content, variable quality |
| **Long-tail / programmatic CTV** | Open exchange CTV, FAST channels, smaller apps | Cheaper CPMs | High — fraud-prone, brand safety risk, weak verification |

These are NOT the same channel. Budget, creative, targeting, and measurement should differ by tier.

**Geographic testing applies to CTV too — not just linear.** Run in 2-3 regions first. Measure sales-lift vs holdout regions. Benefits: cost reduction, clean holdout data, phased scaling. Most brands go national too early.

**Measure with brand lift and search lift, not completion rates.** Completion rate is hygiene. The real question: did CTV exposure drive search behaviour, site visits, or brand recall? Also: MMM, phone-based DR measurement, and exposure control testing.

### What to Control

**CTV fraud is real — particularly on less premium inventory.** 19% of global programmatic CTV traffic was invalid in Q3 2025. 38% of CTV app bundle IDs were malformed or fraudulent. Focus fraud concern on long-tail/programmatic CTV, not broadcast BVOD.

> *Dr. Augustine Fou: Python scripts generate 12 billion fake CTV bid requests daily — roughly half of all US CTV bid requests.*
> Source: [Dr. Augustine Fou](https://mediagroupww.com/en/insights/the-online-advertising-landscape-qa-with-dr-augustine-fou-cyber-security-and-ad-fraud-researcher/)

**Cross-platform frequency is unsolved.** You can model it but never solve for it completely. Plan to a total frequency budget, allocate per platform, use overlap data. Consider sequential deployment across platforms. Prioritise CTV platforms with good frequency management over linear where frequency is estimated via TVRs.

**Overlap is the hidden cost.** ITVX ↔ ITV Linear: 52% overlap. C4 Streaming ↔ Channel 4 Linear: 50%. YouTube CTV ↔ ITVX: 32%. Always de-duplicate.

**CTV targeting precision claims deserve scepticism.** Only 28% of advertisers feel confident in viewable, fraud-free CTV placements. Trust broadcaster-reported data over programmatic-reported data.

---

## Linear TV

### Why It Works
TV delivers the highest attention per impression of any channel. Full-screen, non-scrollable, lean-back viewing creates conditions for memory encoding that scrollable digital formats cannot match. Linear TV = 6.2s active attention per 15s ad. Streaming TV = 9.7s. Compare to less than 2.5s for most digital.

TV builds commercial memory infrastructure. It creates the mental availability that makes all downstream channels more efficient — search, social, display all perform better when audiences have been primed by TV. This is measurable through search-lift, direct traffic-lift, and declining customer acquisition costs.

> Source: [Prof. Karen Nelson-Field, Amplified Intelligence](https://www.vccp.com/uk/news/2025/may/hacking-the-attention-economy-vccp-media-and-dr-karen-nelson-field-reveal-1-5-second-formula-for-effective-digital-advertising)

### How to Run It Well

**Creative quality is the primary driver.** The shift to abstract, left-brain creative (product-centric, text-heavy, no character or narrative) has destroyed TV effectiveness over the last 15 years. Right-brain creative — humour, story, distinctive characters, fluency devices — builds long-term memory. "Showmanship" beats "salesmanship."

> *Orlando Wood (System1): Analysis of 53,000+ ads shows consistent effectiveness advantage for right-brain creative features.*
> Source: [System1 / "Lemon" and "Look Out"](https://system1group.com/lemon)

**Connect to ESOV.** Excess share of voice (SOV - SOM) drives share of market. Brands that outspend their market share grow. TV is the most efficient channel for building SOV at scale.

> Source: Binet & Field, "The Long and Short of It"; IPA Effectiveness Awards databank

**Broad reach usually beats over-targeting for brand jobs.** For fame and cultural impact, linear TV has no substitute. Over-targeting TV until it behaves like expensive display destroys its unique value.

**Geographic testing is TV's secret weapon.** Run in 2-3 regions first. Measure sales-lift vs holdout. Benefits: 20-30% CPM reduction, clean holdout data, phased scaling, better frequency. This should apply to CTV too.

**Minimum effective frequency.** Under-frequency wastes money (not enough repetitions for memory). Over-frequency wastes goodwill. Brand awareness: 3-5 exposures. Activation: 2-3. Use reach curves to find diminishing returns.

**Sponsorship and integration.** Programme sponsorship creates brand-programme association that standalone spots cannot match. Higher recall, lower skip rate. Worth the premium for right-fit opportunities.

### What to Control

**Don't judge TV by digital direct-response metrics.** Measuring TV on clicks or last-click CPA is a category error. Judge on brand tracking, search-lift, pricing power trends, long-term acquisition cost, MMM contribution, phone-based DR, and exposure control testing.

**BARB measurement is evolving — both a limitation and an opportunity.** Nielsen sunsetting panel-only measurement. BARB expanding to YouTube — early but improving. Most buyers don't use the data enough. BARB allows the best comparison between CTV and linear TV; those who exploit it have an advantage.

---

## Exposure Control Testing: The Future of Omnichannel Measurement

### Why This Matters

Platform attribution (last-click, DDA, self-reported ROAS) tells you what touched the customer. Incrementality testing tells you what changed their behaviour. These are fundamentally different questions.

Multi-touch attribution has failed — plagued by data reconciliation issues, walled garden blind spots, identity collapse, and GDPR. Media mix modelling is too slow and too expensive for tactical decisions. Exposure control testing — measuring the causal difference between exposed and unexposed groups — is emerging as the measurement methodology that calibrates everything else.

> *"Multi-touch attribution has been plagued by severe data reconciliation issues, walled garden blind spots, the collapse of third-party tracking, and painful onboarding. Cross-channel marketing measurement has failed marketers."* — Trevor Testwuide, CEO Measured
> Source: [Measured](https://www.businesswire.com/news/home/20190514005374/en/Multi-Touch-Attribution-Is-Dead-Measured-Launches-Cross-Channel-Incrementality-Measurement-for-Marketers)

### The Methods

**Ghost Ads / PSA Control**
The gold standard for digital incrementality. The ad platform records instances where an ad would have won the auction but doesn't serve it — creating zero-cost counterfactual data. DoorDash reduced experimentation dilution by 92% and tightened iROAS confidence intervals by 35% using ghost ads.

> Source: [Garrett Johnson, Boston University, Journal of Marketing Research 2017](https://journals.sagepub.com/doi/10.1509/jmr.15.0297); [DoorDash Engineering](https://advertising.doordash.com/en-us/resources/measuring-incrementality-with-ghost-ads-at-doordash)

**Geo-Based Holdouts**
Suppress a channel in matched geographic regions for 4-6 weeks. Measure the conversion difference. Works across all channels including TV, CTV, social, search. Meta's open-source GeoLift package and Google's GeoexperimentsResearch make this accessible.

> Meta found its ads drove over 4.5x more value in-store than online when measured via geo-based incrementality.
> Source: [Meta GeoLift](https://facebookincubator.github.io/GeoLift/); [Google GeoX](https://github.com/google/GeoexperimentsResearch)

**Conversion Lift Studies**
Platform-native (Meta, Google). Measures incremental lift from exposed vs holdout groups. Better than nothing, but platform-run = platform-biased. Use as one input, not the only input.

**On/Off Tests**
Simple: pause a campaign or channel for 2-4 weeks. Measure total business conversions (not just that channel's conversions). Noisy but effective for brand search and PMax incrementality.

### The Emerging Framework

The best practice is not to choose between MMM, MTA, and incrementality — it is to use all three, with incrementality as the calibration layer:

- **MMM** identifies which channels drive sales across the full funnel
- **MTA / platform reporting** guides daily tactical optimisation
- **Incrementality tests** validate and calibrate both models when they disagree

Incrementality is the "source of truth" that keeps the other models honest.

> Source: [Triple Whale](https://www.triplewhale.com/blog/mmm-mta-incrementality); [Fospha](https://www.fospha.com/measurement-101/mmm-mta-incrementality-building-a-suite-of-truth)

### What to Test First
1. **Brand search** — are you paying for clicks that would come organically?
2. **PMax** — is it driving new conversions or relabelling existing ones?
3. **Social retargeting** — is it incremental or just capturing pipeline?
4. **Display post-view** — are post-view conversions real?
5. **TV/CTV** — what is the actual sales-lift vs holdout regions?

---

## Browser and OS Fragmentation: A Channel Within a Channel

### The Problem

Chrome and Safari are not the same advertising environment. iOS and Android are not the same advertising environment. Yet most campaigns treat them identically. This is a planning error.

### Chrome vs Safari

Safari blocks all third-party cookies by default (ITP, since March 2020). Chrome still allows them (Google abandoned Privacy Sandbox cookie deprecation in April 2025). This creates a bifurcated measurement landscape:

- **eCPMs on Safari are ~30% lower than Chrome** — and some estimates put the gap at 50% after ITP
- Safari's ITP 2.1 reduces first-party cookie storage to 7 days — users returning after 7 days appear as "new," inflating CPA metrics
- ITP 2.2 limits conversion attribution via link decoration to 24 hours
- US-based businesses miss up to 36% of data due to ITP and ad blockers combined

> Source: [Kevel](https://www.kevel.com/blog/safari-itp/); [Stape](https://stape.io/blog/safari-itp); [Institute for Fiscal Studies (UK)](https://ifs.org.uk/sites/default/files/2023-02/CWP0423-Taking-the-biscuit-how-Safari-privacy-policies-affect-online-advertising.pdf)

**Planning implication:** Safari and Chrome campaigns perform differently because they measure differently. A campaign that looks inefficient on Safari may actually perform well — you just can't see the conversions. Break out browser reporting where possible. Don't reallocate budget away from Safari based on incomplete data.

### iOS vs Android

Post-ATT, iOS and Android are fundamentally different attribution environments:

- The majority of iOS users opt out of ATT tracking, falling back to SKAdNetwork (aggregated, delayed, limited granularity)
- Android's LAT opt-out rate remains under 2% — attribution is still largely deterministic
- Many marketers saw cost per install jump 30-50% on iOS after ATT — not because iOS became less effective, but because attribution broke

**iOS users are higher value:** iOS captures 60% of $330B global ad spend despite smaller user base. iOS users have higher average incomes ($53,251 vs $37,040), drive 2x click-through rates, and generate ~5x higher ARPU for subscription apps.

> Source: [Tekrevol](https://www.tekrevol.com/blogs/android-vs-ios-statistics/); [Adapty.io](https://adapty.io/blog/iphone-vs-android-users/); [Airbridge](https://www.airbridge.io/blog/post-att-advertising-strategies)

**Apple Private Relay** hides IP addresses for iCloud+ subscribers. **Hide My Email** creates random email addresses. Both further reduce signal quality on Apple devices.

> Source: [Marketing Dive](https://www.marketingdive.com/news/apple-doubles-down-on-privacy-further-complicating-tracking-and-targeting/601533/); [Pixalate](https://www.pixalate.com/blog/icloud-private-relay-ad-fraud-study)

### Planning Rules

1. **Break out browser and OS reporting where platform allows.** Chrome, Safari, Firefox are different channels for measurement purposes.
2. **Don't penalise Safari/iOS for measurement gaps.** Lower reported ROAS on Safari may reflect tracking failure, not campaign failure.
3. **Server-side tracking (CAPI, GTM server-side) partially closes the gap.** Prioritise implementation for iOS/Safari traffic.
4. **Consider separate campaigns by OS for mobile app install or subscription businesses** where iOS/Android unit economics differ substantially.
5. **Account for the fragmentation in MMM and incrementality models.** Browser/OS mix affects what you can measure — models should reflect this.

---

## Cross-Channel Principles

**Every platform profits when you spend more. Their tools won't tell you to spend less.** Google, Meta, TikTok, CTV sellers, programmatic vendors — all have revenue incentives misaligned with your incrementality. This is the most important principle in digital advertising.

**Budget sufficiency check is mandatory.** Budget ÷ CPM × 1,000 = impressions. Impressions ÷ frequency = max unique reach. Compare to audience size. If reachable % is low, flag it. No exceptions.

**Attention economics should weight channel allocation.** Channels with higher attention per impression (TV, CTV, premium video) deliver more memory encoding per pound spent than low-attention channels (display, social feed). Factor attention into planning, not just CPM.

**Creative quality multiplies media investment.** Right-brain creative (story, humour, character) consistently outperforms left-brain creative (text-heavy, product-centric). The creative decision is a media decision.

**The 7 planning layers should all be followed.** Strategic objectives, channel roles, platform selection, audience, measurement, creative, flighting. Not necessarily in strict order — personas or strategic approach could come first — but all layers should be completed. Skipping layers (especially measurement) is the most common planning failure.

**Geographic concentration beats thin national coverage for constrained budgets.** Concentrate in 2-3 regions. Depth beats breadth.

**Separate brand vs performance reporting across ALL channels.** Social retargeting is performance. Social prospecting is (partly) brand. CTV is brand. Display retargeting is performance. Never blend them in one report.

---

## Sources

### Search
- [Austin LeClear, Grow My Ads — Exact vs Broad Match](https://growmyads.com/exact-match-vs-broad-match-why-you-need-both-in-google-ads-despite-googles-advice/)
- [Frederick Vallaeys, Optmyzr — Quality Score](https://www.optmyzr.com/blog/google-ads-quality-score/)
- [Larry Kim, WordStream — QS Cost Impact (~$100M study)](https://www.wordstream.com/blog/ws/2013/07/16/quality-score-cost-per-conversion)
- [Optmyzr — Ad Strength Study (1M+ ads)](https://www.optmyzr.com/blog/google-ad-strength-study/)
- [Echelonn — Brand/Generic Separation](https://www.echelonn.io/post/google-ads-branded-non-branded-campaign-structure)
- [Blake, Nosko & Tadelis — eBay Brand Search Study (Econometrica 2015)](https://faculty.haas.berkeley.edu/stadelis/BNT_ECMA_rev.pdf)
- [Kirk Williams, ZATO — PMax Criticism](https://zatomarketing.com/ppc-marketing-book)
- [Sam Tomlinson — PMax Control](https://www.samtomlinson.me/insights/maximizing-performance-max/)
- [Michael Taylor, Vexpower/Measured — Attribution Bias](https://www.measured.com/blog/google-drops-all-the-attribution-models-that-make-it-look-bad/)
- [Daniel Gilbert, Brainlabs — Automation Scepticism](https://searchengineland.com/author/daniel-gilbert)
- [Brad Geddes, Adalysis — Guardrails on Automation](https://adalysis.com/blog/managing-google-ads-accounts-ai/)

### Social
- [Jon Loomer — 83 Meta Changes 2025](https://www.jonloomer.com/meta-advertising-changes-2025/)
- [Wicked Reports — 55,661 Meta Campaigns Study](https://www.wickedreports.com/blog/meta-advantage-research-results)
- [Tom Roach — Platform Incentive Misalignment](https://thetomroach.com/2025/01/12/brand-building-in-the-platforms/)
- [Prof. Karen Nelson-Field — Attention Decay on Scrollable](https://www.mi-3.com.au/05-04-2023/reach-curves-have-gone-rogue-karen-nelson-field-warns-scrollable-media-attention-decay)

### Display / Programmatic
- [ANA Q2 2025 — $26.8B Programmatic Waste](https://www.ana.net/content/show/id/pr-2025-08-programmatictrans)
- [Dr. Augustine Fou — Ad Fraud Research](https://www.linkedin.com/pulse/programmatic-has-been-problematic-from-start-dr-augustine-fou)
- [Ana Milicevic, Sparrow Advisers — Supply Chain](https://newdigitalage.co/programmatic/ana-milicevic-the-programmatic-supply-chain-non-surprise/)
- [Nandini Jammi, Check My Ads — Brand Safety](https://www.adexchanger.com/online-advertising/check-my-ads-opens-shop-to-audit-broken-brand-safety-strategies/)
- [GumGum/Dentsu — Contextual vs Behavioural Study](https://gumgum.com/blog/landmark-study-proves-the-effectiveness-of-contextual-over-behavioral-targeting)
- [Adnami — High-Impact Format Attention (Eye-Tracking)](https://www.adnami.io/blog/eyetracking-study-confirms-that-high-impact-outperform-standard-display)

### CTV / TV
- [Prof. Karen Nelson-Field — CTV Attention Data](https://www.mi-3.com.au/04-04-2022/nines-attention-study-mobile-beats-ctv-which-beats-linear-tv-active-attention-existing)
- [Orlando Wood, System1 — Creative Effectiveness](https://system1group.com/lemon)
- [Binet & Field — The Long and Short of It](https://www.ipa.co.uk/knowledge/publications-reports/the-long-and-the-short-of-it)
- [Bob Hoffman — Ad Contrarian](https://www.bobhoffmanswebsite.com/)

### Measurement
- [Garrett Johnson — Ghost Ads (Journal of Marketing Research 2017)](https://journals.sagepub.com/doi/10.1509/jmr.15.0297)
- [DoorDash — Ghost Ads Implementation](https://advertising.doordash.com/en-us/resources/measuring-incrementality-with-ghost-ads-at-doordash)
- [Meta GeoLift](https://facebookincubator.github.io/GeoLift/)
- [Google GeoexperimentsResearch](https://github.com/google/GeoexperimentsResearch)
- [Measured.com — Cross-Channel Incrementality](https://www.measured.com/)
- [Triple Whale — MMM + MTA + Incrementality Framework](https://www.triplewhale.com/blog/mmm-mta-incrementality)

### Browser / OS Fragmentation
- [Kevel — Safari ITP Impact](https://www.kevel.com/blog/safari-itp/)
- [Stape — Safari ITP Technical Detail](https://stape.io/blog/safari-itp)
- [IFS (UK) — Safari Privacy and Advertising](https://ifs.org.uk/sites/default/files/2023-02/CWP0423-Taking-the-biscuit-how-Safari-privacy-policies-affect-online-advertising.pdf)
- [Tekrevol — iOS vs Android Statistics](https://www.tekrevol.com/blogs/android-vs-ios-statistics/)
- [Airbridge — Post-ATT Strategies](https://www.airbridge.io/blog/post-att-advertising-strategies)

---
*TAU — The Independent Marketing Intelligence Architect*



[TAU Skills — Search]
---
name: search
description: TAU channel skill for paid search and search-led intent capture. Use for keyword architecture, search measurement, and connecting Rosetta Stone audience logic to search activation.
---

# Search

TAU's point of view on search as an intent-capture and demand-interpretation channel.

## Purpose

Design search around commercial intent, not just keyword coverage. Search is where Rosetta Stone signals become explicit demand, conversion architecture, and measurement truth.

## Diagnostic

1. Is the job demand capture, demand shaping, competitor defence, or lifecycle harvesting?
2. How much demand already exists versus needs to be created elsewhere?
3. Which Rosetta mechanisms are strongest: `M_KEY`, `M_CTX`, `M_TIME`, or `M_CRM`?
4. What conversion events and offline outcomes need to be fed back into bidding?
5. Where will search be judged incorrectly by last-click reporting?

## Frameworks

### Planning Layers

- Layer 2: define search's role in the comms architecture
- Layer 3: build campaign, match-type, and landing-page logic
- Layer 5: set incremental measurement and query-quality KPIs
- Layer 6: align message to intent state
- Layer 7: phase spend around demand peaks

### Rosetta Stone -> Search Activation

| Mechanism | Search Use |
|-----------|------------|
| `M_KEY` | Core lever. Build intent clusters, query mining, and landing-page architecture around it. |
| `M_CTX` | Use contextual landing pages, dynamic copy, and category-entry-point language. |
| `M_TIME` | Apply seasonality, dayparting, and event-based bid logic. |
| `M_CRM` | Use Customer Match, suppression, value-based bidding, and lifecycle audience overlays. |
| `M_LAL` | Use modeled audiences carefully to extend query coverage or smart bidding signals. |

### Measurement

- Separate branded, generic, competitor, and shopping intent
- Track impression share and lost share only when they connect to profitable demand
- Validate with incrementality or geo tests where search appears to over-claim
- Feed downstream revenue or qualified pipeline value, not just form fills

## TAU POV

- Search does not create all the demand it captures.
- Keyword structure should mirror buying states, not org charts.
- Broad match and automation are tools, not strategy.
- Search reporting is useful, but not neutral. It will over-credit itself unless checked.

## Templates

```markdown
## Search Plan
- Channel role:
- Priority intent clusters:
- Audience overlays:
- Measurement approach:
- Landing-page requirements:
- Risks and exclusions:
```

## Anti-patterns

- Treating all conversions as equal
- Letting brand search mask upstream media performance problems
- Expanding match types before negative and query hygiene are in place
- Measuring search only in-platform

## Connected Skills

- `rosetta-stone` — audience inputs and blueprint aggregation
- `rosetta-stone/sub-skills/category-brand` — intent and purchase-stage logic
- `rosetta-stone/sub-skills/life-stage` — transition-driven search demand
- `client/attribution-diagnostic` — measurement and incrementality design

---
*TAU — The Independent Marketing Intelligence Architect*



[TAU Skills — Social]
---
name: social
description: TAU channel skill for paid social. Use for platform audience strategy, creative system design, measurement, and linking Rosetta Stone audience signals to social activation.
---

# Social

TAU's point of view on social as an audience-shaping, creative-testing, and scalable activation channel.

## Purpose

Turn Rosetta Stone audience architecture into platform-ready social activation across Meta, TikTok, LinkedIn, Pinterest, and adjacent ecosystems.

## Diagnostic

1. Is social here to create demand, capture demand, retarget demand, or all three?
2. Which platforms matter for attention versus actual conversion?
3. Are we activating through interests, creators, first-party audiences, or lookalikes?
4. Which creative variables need to be tested against audience hypotheses?
5. How will we separate platform-reported efficiency from true incremental value?

## Frameworks

### Planning Layers

- Layer 2: define social's job inside the wider comms system
- Layer 3: choose platforms, campaign structure, and audience design
- Layer 5: set holdouts, lift studies, and conversion-quality reporting
- Layer 6: build message and creative variants by audience state
- Layer 7: phase creative fatigue management and bursts

### Rosetta Stone -> Social Activation

| Mechanism | Social Use |
|-----------|------------|
| `M_INT` | Core lever for interest and behaviour-led prospecting. |
| `M_LAL` | Primary scale tool when 1P seed quality is strong. |
| `M_CRM` | Use matched audiences for retargeting, exclusions, value tiers, and lifecycle messaging. |
| `M_CHAN` | Platform selection should follow media-consumption patterns, not trend bias. |
| `M_CTX` | Use creator, placement, and content-environment fit to reinforce audience mindset. |

### Measurement

- Distinguish creative testing from budget scaling decisions
- Judge audiences on downstream value, not just platform CPA
- Use conversion lift or matched-market tests where possible
- Track fatigue, frequency, and incremental reach alongside efficiency

## TAU POV

- Social is not one channel. Platform behaviour matters.
- Creative and audience are inseparable on social.
- Lookalikes are only as good as the seed and exclusion logic.
- Retargeting efficiency is not proof of strategic effectiveness.

## Templates

```markdown
## Social Plan
- Platform role by audience:
- Prospecting audiences:
- 1P / retargeting audiences:
- Creative hypotheses:
- Measurement approach:
- Scaling rule:
```

## Anti-patterns

- Copying the same audience logic across every platform
- Optimising to cheap soft conversions
- Using broad automation without a clear creative system
- Letting remarketing dominate spend because it looks efficient

## Connected Skills

- `rosetta-stone` — audience inputs and blueprint aggregation
- `rosetta-stone/sub-skills/psychographic` — motive and message fit
- `rosetta-stone/sub-skills/digital-identity` — CRM and lookalike design
- `thinking/psychological` — creative hooks and reframing

---
*TAU — The Independent Marketing Intelligence Architect*