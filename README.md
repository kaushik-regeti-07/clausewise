# Clarity - Document Red-Flag Reader

Built in 24 hours for **Hack Devengers 2.0**.

## The problem

Most people sign rental agreements, insurance policies, loan contracts, and medical bills
without understanding the clauses that end up hurting them later - hidden fees,
auto-renewal traps, liability waivers, and penalty clauses buried in dense legal language.
Legal literacy shouldn't be a prerequisite for signing a lease.

## What it does

1. Upload a PDF (or paste text) of any contract, policy, or bill.
2. Clarity extracts the document text and sends it to an NVIDIA Nemotron model
   running on Nebius Token Factory.
3. The model finds every clause that hides a cost, limits your rights, or creates
   an obligation you might not expect, and explains each one in plain language -
   in English or Hindi.
4. Each flagged clause is color-coded by risk (high/medium/low), and clicking a
   card jumps to and highlights the matching text in the original document.

## Tech stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS
- **Nebius Token Factory** running **NVIDIA Nemotron** for document analysis
- `pdf-parse` for text extraction from uploaded PDFs

## Getting started

```bash
npm install
cp .env.example .env.local   # add your Nebius Token Factory API key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's next

- OCR support for scanned/image-based documents
- More regional languages beyond English/Hindi
- Downloadable plain-language summary report
- Browser extension to flag risky clauses on any web-based contract (e.g. Terms of Service)
