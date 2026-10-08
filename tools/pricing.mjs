// WhatsApp Business Platform prices used by the private sales cost cards (uc/<slug>/cost.html).
// RE-CHECK EVERY MONTH. Meta can change rates up to quarterly. Last checked: 8 October 2026.
//
// What Meta's own pages say (read 8 Oct 2026):
//   - Pricing is per delivered message since 1 July 2025. The business pays. Messages a user sends are never charged.
//   - From 1 October 2026 Meta charges for service messages (free-form replies inside the 24-hour customer service window)
//     and for utility templates sent inside that window. Service rates equal the utility/authentication rate for each market.
//     Source: developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages
//   - Free entry point window (click-to-WhatsApp ad or Facebook page button): 72 hours, every message type is free.
//   - Marketing templates are always charged. Utility and authentication get volume tiers. Service has no tiers.
//   - Rate cards are CSV/PDF files in USD, EUR, GBP and others. There is no rand rate card.
//
// What we could NOT read from Meta's own pages (so it carries a warning on the card):
//   - The South African numbers below come from a2ztech.co.za (3 Sept 2026) and flowcall.co, which cite Meta's rate card.
//     Older articles quote utility at 0.0076: that was the rate before 1 Oct 2026.
//   - "1,000 free service messages per business phone number per month": reported by a2ztech.co.za and by a search summary
//     that attributes it to Meta's pricing page. The page text we could read did not show it. Treat as unconfirmed.
export const PRICING = {
  checked: '8 October 2026',
  currency: 'USD',
  fx: 16.03, // rand per US dollar, 3 Sept 2026 (a2ztech). The card lets the user change it.
  rates: { marketing: 0.0379, utility: 0.0095, authentication: 0.0095, service: 0.0095, authenticationInternational: 0.02 },
  freeServiceMessages: 1000, // per business phone number per month: UNCONFIRMED
  vat: 0.15,
  freeEntryHours: 72,
  sources: [
    ['Meta: pricing on the WhatsApp Business Platform', 'https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing'],
    ['Meta: upcoming pricing updates for service and utility messages', 'https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages'],
    ['a2z Tech: WhatsApp Business pricing changes for South Africa (3 Sept 2026)', 'https://a2ztech.co.za/insights/a2z-insights-whatsapp-business-pricing-public-facing'],
    ['MyBroadband: every reply will cost 12 cents (19 Aug 2026, older figures)', 'https://mybroadband.co.za/news/business/662921-big-change-coming-for-whatsapp-business-in-south-africa-where-every-reply-will-cost-12-cents.html'],
  ],
};
