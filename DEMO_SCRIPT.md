# AudienceLoop · 3-Minute Hackathon Demo Script

**Speaker Persona:** Lead Full-Stack & AI Engineer presenting to hackathon judges.  
**Total Duration:** 3:00 minutes.

---

### [0:00 - 0:35] Part 1: The Problem & Brand Isolation
**Action:** Open `http://localhost:3000`. Show the header and workspace selector.
**Script:**
> "Hi everyone. Every brand’s audience is fundamentally different. What drives viral engagement for a B2B infrastructure startup will fall completely flat for a D2C fitness brand.
>
> Most social tools use generic LLM advice that hallucinates numbers or suggests platitudes. We built **AudienceLoop**: a Social Media Engagement Agent that learns from a brand’s own historical metrics and remembers past community conversations — with zero hallucinations.
>
> Notice in the top left we are on **CloudScale Analytics**, a B2B data engineering SaaS. Look at our metrics: our top topics are *Benchmarking* at 5.33% engagement and *Architecture* at 5.62%, with peak posting windows on **Tuesday and Thursday mornings at 8:00 AM**.
>
> Now watch what happens when I switch workspaces to **PulseFit Activewear**: the entire intelligence profile transforms. Peak times shift to **Saturday and Sunday afternoons**, and our winning format is *Short Video workout drills* at 8.84% engagement. Strict multi-tenant isolation ensures data never bleeds across brands."

---

### [0:35 - 1:15] Part 2: Statistical Rigor & Data Ingestion with PII Scrubbing
**Action:** Click the **CSV Import** tab.
**Script:**
> "Let’s look at how data gets in. Brands don’t need live social credentials to demo this. I’ll click **Quick-Load Sample Posts**, which populates standard CSV analytics data with impressions, likes, comments, and shares.
>
> Our ingestion engine features intelligent column mapping, duplicate detection, and automated **PII Scrubbing**. If a user comment or post contains an email address or phone number, our regex pipeline automatically redacts them to `[EMAIL_MASKED]` and `[PHONE_MASKED]` before storage.
>
> Even better: on our Analytics dashboard, whenever a topic has fewer than 3 posts, AudienceLoop labels it **'Limited Evidence (N < 3)'**, preventing managers from making big strategic bets on statistical noise."

---

### [1:15 - 2:05] Part 3: The Grounded AI Agent & Evidence Inspector
**Action:** Click the **Engagement Agent** tab. Click the preset chip: *“What should we post this week, and why?”*
**Script:**
> "Now, let’s ask the agent the million-dollar question: *'What should we post this week, and why?'*
>
> Notice how AudienceLoop answers. It doesn’t give generic advice. It cites specific historical posts: `[Post post-cs-101]` and community comments: `[Comment comm-cs-03]`.
>
> Every number in the answer is verified against database records. And look at this: when I click on this citation card, the **Evidence Inspector Modal** opens up. The manager can see the exact raw post, verified impressions (48,200), reactions (1,840), the exact formula proof `(reactions + comments + shares) / impressions`, and the rationale behind the citation.
>
> Even untrusted community comments are quarantined safely, preventing prompt injection while preserving community sentiment."

---

### [2:05 - 2:40] Part 4: Post Draft Studio & Content Calendar
**Action:** Click the **Draft Studio** tab. Select Goal: *Thought Leadership*, Topic: *Benchmarking*, Format: *Carousel*. Click **Generate Evidence-Grounded Post Draft**.
**Script:**
> "Next, let’s turn insight into action in the **Draft Studio**.
>
> The agent crafts a draft calibrated to CloudScale’s precise engineering tone. Notice the baseline engagement estimate: it calculates **5.25%** based on supporting posts `post-cs-101` and `post-cs-108`.
>
> I can tweak the copy right here, pick recommended hashtags, choose the optimal recommended time window (Tuesday 8:30 AM), and click **Save as Approved Calendar Post**.
>
> Heading over to our **Content Calendar**, the post is staged with clear workflow governance. We explicitly indicate staging status so no team is misled into thinking an unverified post was pushed live."

---

### [2:40 - 3:00] Part 5: Closed-Loop Strategy Audit (Feedback Loop) & Azure Architecture
**Action:** Click the **Strategy Feedback Loop** tab.
**Script:**
> "Finally, the loop closes in the **Strategy Feedback Loop**.
>
> AudienceLoop doesn’t just make recommendations and forget them; it compares past advice with subsequent actual performance.
>
> Here we see that recommending technical carousels was **Validated** with a **+3.40%** delta, while testing casual Friday humor was **Refuted** with a **-3.61%** drop, teaching the system to prioritize technical depth.
>
> Under the hood, this is architected for Microsoft Azure using **Azure Container Apps**, **Azure OpenAI GPT-4o**, **Azure SQL Database**, and **Azure AI Search**.
>
> That is AudienceLoop — verifiable, evidence-grounded social media intelligence for modern brands. Thank you!"
