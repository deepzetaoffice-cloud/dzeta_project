# Schema Graph Registry

> **Applies to:** every `@id` in the site's JSON-LD · **Precedence:** the registry the rules point to ([08](../ai/08-seo-geo-aeo-schema.md) §3 rule 5; spec: [the schema-system plan](../plans/2026-09-29-schema-system.md) §7) · **Last reviewed:** 2026-10-08 (P6 part A2, S9)

The one place every `@id` is registered. A new `@id` is added here in the same change that defines it; `check:schema` asserts references resolve within a document or to a row here whose home page defines the node in the same build.

## Registered nodes

| `@id` | Type | Defined on | Referenced by |
|---|---|---|---|
| `https://deepzeta.ai/#organization` | ProfessionalService | every page (the sitewide block, `src/lib/schema/graphs/sitewide.ts`) | every WebPage `about`, every Service `provider`, `#website` `publisher` |
| `https://deepzeta.ai/#website` | WebSite | every page (the sitewide block) | every WebPage/Article `isPartOf` |
| `https://deepzeta.ai/#logo` | ImageObject | every page (the sitewide block) | `#organization` `logo` |
| `https://deepzeta.ai/#person-jamsheed-khalid` | Person | `/about/jamsheed-khalid` (also emitted on `/about`, per the spec §2.1 "founder" row; ships with the About pages in P7) | `#organization` `founder`; article `author` once he is confirmed as an author |
| `https://deepzeta.ai/services#catalog` | OfferCatalog | `/services` (since P6 part A2) | `#organization` `hasOfferCatalog` (only while the hub is live) |
| `{page URL}#service` | Service | its own page (pillar, service, solution, audit; P6) | `#catalog` offers, Home's pillar ItemList, pillar and industry ItemLists |
| `{page URL}` (the bare canonical URL; decision 5) | WebPage (or subtype) | its own page | — (the primary entity on Home and the hub; on a service page the Service is) |
| `{page URL}#itemlist` | ItemList | its own page (Home today; services hub, industry and comparison pages in P6) | — |
| `{page URL}#faq` | FAQPage | its own page, when the FAQ is visible | — |
| `{page URL}#breadcrumb` | BreadcrumbList | its own page, when a breadcrumb is visible | — |
| `{page URL}#howto` | HowTo | its own page, when a how-to is visible | — |
| `{page URL}#article` | Article / BlogPosting | its own page (case studies, guides; P7–P8) | — |
| `{page URL}#termset` | DefinedTermSet | `/resources/glossary` (P8) | — |
| `{page URL}#offer` | Offer | its own page (the audit's price 0 AED; pricing's real prices) | — |

## Shipping today (P6 part A2)

Four kinds of block are emitted. Every other row above is a reserved pattern that its page's plan implements with its page — never before (04 §1.4).

- **The sitewide block**, on every page: `#organization` (with `hasOfferCatalog` → `#catalog` while the hub is live), `#website`, `#logo` (`src/lib/schema/graphs/sitewide.ts`).
- **Home** (`https://deepzeta.ai`): the WebPage, `#itemlist` (the four pillars) and `#faq` (visible since P5).
- **The services hub** (`/services`, R010; `graphs/servicesHub.ts`): the CollectionPage, `#itemlist` and `#catalog` (both list the live services only; each offer's `itemOffered` → its `#service`), `#breadcrumb` and `#faq`.
- **A service page** (`/services/<slug>`; the pilot R027 today; `graphs/service.ts`): `#service` (`provider` → `#organization`, the organization's `areaServed`, `serviceType` = the pillar's name; no `offers` while no price is published; no parent pillar until its page is live), the WebPage (`mainEntity` → `#service`, `breadcrumb` → `#breadcrumb`), `#breadcrumb` and `#faq`. No HowTo: the visible steps describe how the system runs, not steps the reader follows (C11 read strictly; the P6 part A plan).

`check:schema` resolves each reference within its page, or against a node another built page defines (the hub's `#catalog`, a service's `#service`), and checks every BreadcrumbList item against the built pages.

## Conventions (spec §1's decisions)

- `@id` for a page node is the page's absolute canonical URL; nodes that belong to a page are `{page URL}#type` (decision 5).
- The global entities anchor to the bare origin, no locale prefix (decision 2): one entity, the same bytes in every locale.
- External profile URLs are never `@id`s (08 §3 rule 4); they appear only as `sameAs` values, copied exactly from facts §2.1.
- The Wikidata `sameAs` on `areaServed` (Q878, the United Arab Emirates) was verified on wikidata.org on 2026-10-05 (S4).
