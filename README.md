# AudienceLoop · Social Media Engagement Agent

**AudienceLoop** is an evidence-grounded social media intelligence agent that continuously learns which post styles, topics, and publishing times drive engagement for a specific brand. It remembers community conversations, tracks sentiment, and surfaces recommendations strictly verified against stored historical data.

---

## Architecture Overview (Microsoft Azure Reference Architecture)

AudienceLoop is architected for enterprise cloud deployment leveraging the **Microsoft Azure AI & Application Platform**.

```
                           +-----------------------------------------------+
                           |            Brand Managers / Editors           |
                           +-----------------------------------------------+
                                                  |
                                                  v
                           +-----------------------------------------------+
                           |      Vite + React (TypeScript) Frontend      |
                           |   (Analytics, Chat, Calendar, Draft Studio)   |
                           +-----------------------------------------------+
                                                  |
                                                  v  HTTPS / REST APIs
+---------------------------------------------------------------------------------------------------+
| Azure App Service / Azure Container Apps (Node.js / Express Runtime)                             |
|                                                                                                   |
|  +--------------------+   +-----------------------+   +--------------------+   +---------------+  |
|  | CSV Ingestion &    |   | Analytical Aggregator |   | Editorial Calendar |   | Privacy Guard |  |
|  | Column Mapping     |   | (Sample Size Rigor)   |   | & Workflow Engine  |   | (PII Masking) |  |
|  +--------------------+   +-----------------------+   +--------------------+   +---------------+  |
|                                     |                                                             |
|                                     v                                                             |
|                       +---------------------------+                                               |
|                       | Grounded RAG Orchestrator |                                               |
|                       +---------------------------+                                               |
+-------------------------------------|-------------------------------------------------------------+
                                      |
         +----------------------------+-----------------------------+
         |                                                          |
         v                                                          v
+-------------------------------+                         +-------------------------------+
|  Azure OpenAI Service (GPT-4o)|                         | Azure SQL Database / Postgres |
|  - Grounded reasoning         |                         |  - Multi-tenant Brand schemas |
|  - Zero hallucination rules   |                         |  - Posts & Engagement metrics |
|  - Real citation enforcement  |                         |  - Community Comments memory  |
+-------------------------------+                         |  - Feedback Loop Audit records|
         |                                                +-------------------------------+
         v                                                          |
+-------------------------------+                                   v
| Azure AI Search (Optional)    |                         +-------------------------------+
|  - Semantic vector retrieval  |                         | Azure Blob Storage            |
|  - Hybrid keyword ranking     |                         |  - Raw CSV import archives    |
+-------------------------------+                         +-------------------------------+
```

### Azure Services Identified in Deployment:
1. **Azure Container Apps / Azure App Service**: Hosts the full-stack containerized web application with autoscaling and zero-downtime blue/green deployment.
2. **Azure OpenAI Service (`gpt-4o`)**: Grounded generative reasoning engine with content safety filters, temperature control ($T=0.2$), and zero data retention for model retraining.
3. **Azure SQL Database / Azure Database for PostgreSQL**: Persistent ACID relational store with partitioned indexes for multi-tenant brand isolation.
4. **Azure AI Search (Cognitive Search)**: Semantic index for historical post embeddings and community conversation memory.
5. **Azure Blob Storage**: High-durability storage for imported social media archives and media assets.
6. **Azure Key Vault**: Hardware security module for zero-leak credential management.

---

## Key Features

- **Strict Multi-Tenant Brand Isolation**: Cleanly separates all posts, metrics, comments, and calendar records per brand. Includes two contrasting synthetic demo brands:
  - **CloudScale Analytics** (B2B SaaS / Developer Tools: high engagement on technical architecture & benchmarks on weekday mornings).
  - **PulseFit Activewear** (D2C Fitness & Lifestyle: high engagement on workout drills and community stories on weekend afternoons).
- **CSV Ingestion Engine**:
  - Flexible column mapping (supports standard social analytics exports).
  - Automated row validation with exact line-number error reporting.
  - Content hash deduplication.
  - **PII Scrubbing**: Automatically detects and masks email addresses and phone numbers.
- **Statistical Rigor & Sample Size Discipline**:
  - Automatically flags topics with sample size $N < 3$ with a prominent **"Limited Evidence"** label.
  - Generates best-time heatmaps with explicit statistical disclaimers: *"Estimates based on historical results, not guaranteed algorithmic outcomes."*
- **Community Conversation Memory**:
  - Tracks user comments, recurring questions, feature requests, and concerns.
  - Classifies sentiment (Positive, Neutral, Negative, Net Sentiment).
  - Treats comments as **untrusted data**, stripping potential prompt injection attempts.
- **Evidence-Grounded AI Agent**:
  - Grounded RAG agent that cites exact Post IDs (`[Post post-cs-101]`) and Comment IDs (`[Comment comm-cs-03]`).
  - Interactive **Evidence Inspector Modal**: Click any citation in the answer to view underlying metrics (impressions, reactions, comments, verified formula).
  - Dual-mode AI backend: Connects to **Azure OpenAI**, **Google Gemini**, or deterministic grounded rule engine if credentials are omitted.
- **Post Draft Studio**:
  - Generates copy tailored to brand tone, target audience, format, and strategic goal.
  - Computes expected engagement rate benchmark based on stored records.
  - Direct *"Save to Content Calendar"* action.
- **Editorial Content Calendar**:
  - Complete workflow states: `Draft`, `Approved`, `Scheduled`, `Published`.
  - Staging transparency: Clearly discloses that real platform broadcasting is simulated in staging mode.
- **Closed-Loop Strategy Audit (Feedback Loop)**:
  - Compares historical recommendations against subsequent results.
  - Labels outcomes as `Validated`, `Refuted`, or `Inconclusive`.
  - Quantifies evidence deltas (e.g. `+3.40%` on technical deep-dives vs `-3.61%` on casual Friday humor).

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 20+ installed
- npm 9+

### 1. Install & Launch (Single Command)
```bash
npm install
npm run dev
```
The server will start on `http://localhost:3000`.

### 2. Run Automated Verification Tests
AudienceLoop includes an end-to-end automated test suite covering brand isolation, metric calculation formulas, sample size flags, CSV import validation, PII masking, and evidence grounding:
```bash
npm test
```
*Expected result: 19/19 Tests Passed.*

### 3. Build & Run Production Container
```bash
# Using Docker
docker build -t audienceloop .
docker run -p 3000:3000 audienceloop

# Or using Docker Compose
docker compose up --build
```

---

## CSV File Format Specification

AudienceLoop accepts standard CSV files for both posts and community comments.

### Posts CSV Headers (`sample_social_posts.csv`)
| Column | Type | Description |
|---|---|---|
| `platform` | string | `linkedin`, `twitter`, `instagram`, or `threads` |
| `content` | string | Full text of the social post *(PII automatically masked)* |
| `published_at` | datetime | ISO timestamp or `YYYY-MM-DD HH:mm:ss` |
| `topic` | string | Category (e.g. `Benchmarking`, `Architecture`, `Workout Tips`) |
| `format` | string | `carousel`, `infographic`, `text`, `short_video`, or `poll` |
| `impressions` | integer | Total verified views |
| `reactions` | integer | Likes / reactions count |
| `comments` | integer | Comment count |
| `shares` | integer | Retweets / reshares count |
| `tags` | string | Semicolon or comma delimited tags |

### Comments CSV Headers (`sample_community_comments.csv`)
| Column | Type | Description |
|---|---|---|
| `post_id` | string | Optional reference to historical post |
| `author` | string | User handle *(auto-sanitized)* |
| `timestamp` | datetime | Timestamp of comment |
| `content` | string | Comment text *(emails/phones automatically masked)* |
| `topic` | string | Topic area |
| `theme` | string | `question`, `concern`, `praise`, `feature_request`, `complaint` |

---

## Azure Deployment Instructions

1. **Provision Resource Group**:
   ```bash
   az group create --name rg-audienceloop --location eastus
   ```
2. **Deploy Azure OpenAI Service**:
   ```bash
   az cognitiveservices account create --name oai-audienceloop --resource-group rg-audienceloop --location eastus --kind OpenAI --sku s0
   az cognitiveservices account deployment create --resource-group rg-audienceloop --name oai-audienceloop --deployment-name gpt-4o --model-name gpt-4o --model-version "2024-05-13" --model-format OpenAI --sku-capacity 10 --sku-name "Standard"
   ```
3. **Deploy Container to Azure Container Apps**:
   ```bash
   az containerapp create \
     --name audienceloop \
     --resource-group rg-audienceloop \
     --environment managedEnv-audienceloop \
     --image audienceloop:latest \
     --target-port 3000 \
     --ingress external \
     --env-vars AZURE_OPENAI_API_KEY="secretref:oai-key" AZURE_OPENAI_ENDPOINT="https://oai-audienceloop.openai.azure.com"
   ```
