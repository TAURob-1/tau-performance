# Meeting Questions: 247 CarFinance APR Elasticity Project
**Meeting Date:** 2026-03-24  
**Purpose:** Scoping subprime APR elasticity analysis  

---

## Category 1: Data Access & Quality

**Q1. What loan-level data do you have available?**
- Fields: application date, APR offered, APR accepted, loan amount, term, credit score band, vehicle details, employment status?
- How far back does it go? (3 years minimum for ML; 5+ preferred)
- Is it already clean or does it need significant preprocessing?

**Q2. Do you have experimental or quasi-experimental pricing variation?**
- Have you ever done A/B tests on APR? (Ideal — randomised price variation)
- Are there natural experiments? (e.g., pricing changes on specific dates, lender panel additions/removals)
- Without this, we need instrumental variables or other causal inference approaches — are you comfortable with that caveat?

**Q3. What's your outcome data like?**
- Do you have default/arrears data for completed loans (not just originations)?
- What's your definition of default — 90 days past due? Charge-off?
- Do you have prepayment/early settlement data? (Relevant for true yield analysis)

**Q4. Do you have data on declined applications and the reasons?**
- This is crucial for demand curve estimation — we need to see the full funnel (applied → approved → accepted)
- If declined apps are missing, we can only model accept/reject on offers, not full demand

**Q5. Do you have competitor rate data?**
- Comparison site data? MoneySuperMarket, Confused, etc.?
- Do you know when customers shopped elsewhere? (Browser/session data?)
- Counter-offers from other lenders visible in data?

---

## Category 2: Business Context

**Q6. What specific decision does this model need to power?**
- Are you trying to: (a) set optimal APR at point of offer, (b) understand segment-level elasticity for strategy, (c) build a real-time pricing engine, or (d) all three?
- This determines whether we need a descriptive/analytical output or a production ML system

**Q7. What does your current APR-setting process look like?**
- Is APR set by the lender or do you as a broker influence it?
- Is there a fixed rate card, a risk-banded model, or negotiation room?
- Understanding whether there's pricing freedom is fundamental to whether elasticity analysis can translate to action

**Q8. What's your north-star metric?**
- Net profit per loan? Portfolio yield? Approval rate? Volume? All four?
- There are tensions between these — higher APR = higher yield but lower acceptance rate and potentially higher defaults
- Need to know the objective function before designing the model

**Q9. What happened with your APR pricing around the DCA ban (Jan 2021)?**
- Did commission structures change? Did APRs change as a result?
- Any observed change in acceptance rates or consumer behaviour post-ban?
- This period may be a useful natural experiment

**Q10. What's the competitive pressure like on APR?**
- Do you lose significant volume to competitors on price?
- Do you have win/loss data — cases where customer went elsewhere and for what APR?
- Is price the #1 reason for not completing, or is it approval (lender decision)?

---

## Category 3: Technical / ML Scoping

**Q11. What's your current data infrastructure?**
- Where does the data live? (SQL warehouse, CRM, flat files, data lake?)
- What analytical tools are you using today? (Excel, Python, Power BI, Tableau?)
- Do you have a data science team or is this a greenfield capability?

**Q12. What level of explainability is required for the model?**
- FCA Consumer Duty requires you to demonstrate fair value — will the pricing model need to be fully auditable/explainable?
- GDPR Article 22 — if decisions are "solely automated," customers have right to explanation
- This affects model choice (GLM vs black-box gradient boosting)

**Q13. How do you want to handle protected characteristics?**
- ECOA / Equality Act — model must not proxy-discriminate on age, gender, race, disability
- Do you have a disparate impact testing process?
- Are you aware of the FCA's current focus on algorithmic pricing fairness?

**Q14. What's the deployment timeline and ambition?**
- Phase 1: analytics/insight (3–6 months)? Phase 2: production pricing engine (6–18 months)?
- Real-time pricing engine requires API integration — is that on the roadmap?
- What's the risk appetite for model-driven pricing vs human-in-the-loop?

**Q15. How many loans in your training dataset?**
- Rule of thumb: need 500+ events per feature for stable logistic regression; ML models prefer 10k+ for each risk tier
- If data is thin on deep subprime, do you have access to bureau data to supplement?

---

## Category 4: Competitive Intelligence

**Q16. Who are your main direct competitors and how do you think about your APR positioning?**
- Moneybarn, First Response, Advantage Finance, Oodle — where do you sit vs each?
- Are you systematically higher/lower/competitive on specific risk bands?
- Do you use a comparison tool or competitive rate monitoring internally?

**Q17. How has the DCA redress situation (Court of Appeal Oct 2024) affected your business?**
- Are you exposed as a broker — did you receive commission tied to APR?
- Are any of your panel lenders provisioning for redress? Is that affecting deal flow?
- This is significant risk context for any pricing model — models should not recommend repeat of DCA dynamics

**Q18. What's your view on the fair value / Consumer Duty angle of this project?**
- Has the FCA engaged with you on pricing practices?
- Can we frame the elasticity model explicitly as a Consumer Duty tool — showing your pricing reflects risk not exploitation?
- This could be a regulatory defence AND a better business outcome

---

## Category 5: Strategic Direction

**Q19. Is the goal to optimise APR upward (more margin) or downward (more volume/acceptance)?**
- Some lenders use elasticity to push rates higher in inelastic segments; others use it to lower rates to grow volume
- Being explicit about direction avoids misaligned incentives in the model design

**Q20. Are you open to dynamic/personalised APR or do you need a simple rate card?**
- Personalised APR (different rate per borrower based on predicted elasticity) is more profitable but more complex and regulatorily sensitive
- Pooled-rate approach is simpler and lower risk
- Where does the organisation want to land on this spectrum?

---

## Bonus / If Time Allows

**Q21. Do you have broker/partner channel data?**
- Applications via dealer vs direct — does channel affect acceptance rate at same APR?
- Channel may be a key moderating variable in elasticity

**Q22. Do you observe application abandonment before an offer is made?**
- If you show an indicative rate early (soft search), do people drop off?
- Pre-offer abandonment is a clean price sensitivity signal often overlooked

