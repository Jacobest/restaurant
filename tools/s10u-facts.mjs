// What we know about S10U (Sideways10Up) and its AI Studio, with the source and how sure we are.
// Last checked: 7 October 2026. Re-check s10u.co.za before changing this file.
// Evidence levels:
//   site  = stated on S10U's own website (read through a page summariser, so wording is paraphrased)
//   dash  = seen in a screenshot of the real S10U inbox supplied by the owner
//   meta  = from Meta's official WhatsApp Business Platform documentation
//   infer = our inference, not stated by anyone
//   none  = not published anywhere we could find
export const CHECKED = '7 October 2026';
export const SITE = 'https://s10u.co.za';

export const GROUPS = [
  { title: 'Channels', facts: [
    ['site', 'WhatsApp Business API is the main channel. The platform page also lists web chat, email, SMS, and AI voice/phone with speech-to-text and chat-to-call hand-over.', '/enterprise-communications-platform/'],
    ['site', 'AI Studio page names WhatsApp, website and in-app chat.', '/s10u-ai-studio/'],
    ['none', 'Instagram and Facebook Messenger as AI Studio channels were not found.', ''],
  ] },
  { title: 'Messaging and broadcasts', facts: [
    ['site', 'WhatsApp broadcast campaigns sent from the web or “API-synced”, scheduled or immediate, with link tracking, automatic opt-out and a built-in template library.', '/s10u-ai-studio/'],
    ['dash', 'The inbox offers “Select Template” when a conversation is closed (the 24-hour window has ended).', ''],
  ] },
  { title: 'Workflow builder', facts: [
    ['site', 'Drag-and-drop, no code: menus, buttons, carousels, variables, routing by what the customer types, and triggers from external events such as CRM and bookings.', '/s10u-ai-studio/'],
    ['site', 'Workflow examples on the platform page: qualify leads, assign consultants by rules, track SLAs, schedule bookings and reminders, escalate when needed.', '/enterprise-communications-platform/'],
  ] },
  { title: 'AI chatbots and models', facts: [
    ['site', 'Chatbots are trained on your content and FAQs through an editable training screen. 11 languages, several intents in one message, and hand-over to a live agent.', '/s10u-ai-studio/'],
    ['site', 'Models named: OpenAI GPT-4o, GPT-4 and GPT-3.5, private or on-premise LLMs, and fine-tuned models, with “multi-LLM routing” and per-task switching. This is the only page that names models.', '/enterprise-communications-platform/'],
    ['dash', 'Each chat has an AI Summary with a Regenerate button, and bot replies are labelled “Bot”.', ''],
    ['none', 'Whether you can bring your own AI key, or use Google or Anthropic models, was not found.', ''],
  ] },
  { title: 'Inbox and dashboard', facts: [
    ['site', 'One inbox across channels: assignment, reassignment, escalation, tags, history, live sentiment tracking, and images, locations and files.', '/s10u-ai-studio/'],
    ['dash', 'Tabs: Chats, Orders, Appointments, Contacts, Groups. Side menu: Home, Inbox, Analytics.', ''],
    ['dash', 'Contact list with “Select All”, search by name, email or phone, filters, and bulk actions. Chat status “Open”. Channel and team drop-downs above each chat, plus translate and tag icons.', ''],
    ['dash', 'Visitor Profile pane: AI Summary, User Details, Device Properties, Private Notes, Starred Messages.', ''],
    ['site', 'Analytics dashboard: automation coverage, response times, conversion and revenue attribution. Also SLA tracking, audit logging and role-based access.', '/enterprise-communications-platform/'],
  ] },
  { title: 'Payments', facts: [
    ['site', 'In-chat payment requests and hosted checkout: cards, EFT and vouchers, tokenised, described as POPIA-compliant.', '/s10u-ai-studio/'],
    ['none', 'Which payment gateways sit behind this (Yoco, PayFast, Paystack, Ozow, Peach) is not published.', ''],
  ] },
  { title: 'Integrations', facts: [
    ['site', 'The platform page says “80+ integrations”, listed only as categories: CRM (two-way), ERP, eCommerce, helpdesk, marketing platforms, payment gateways, custom systems and SIP telephony.', '/enterprise-communications-platform/'],
    ['site', 'Actions named: create or update CRM records, pull customer history, check inventory or pricing, trigger workflows, create support tickets, take payments.', '/enterprise-communications-platform/'],
    ['site', 'Security named: OAuth 2.0, API keys and webhook signature verification. So an API with webhooks exists, but there are no public docs.', '/enterprise-communications-platform/'],
    ['site', 'One blog post says S10U connects the accounting platforms Sage and Xero.', '/the-hidden-cost-of-fragmented-tools-and-how-sa-businesses-are-finally-fixing-it/'],
    ['site', 'Case studies: the bank study used “the bank’s existing CRM”. The healthcare study ran reminders, refills, lab results and surveys “without complex hospital-level system integrations”.', '/case-studies/'],
    ['none', 'No product names for CRM, ERP, calendar, Google Sheets, Shopify, WooCommerce, Zapier, Make, n8n or MCP were found. No integrations page exists (it returns 404).', ''],
    ['infer', 'A market article on S10U’s site names HubSpot, Salesforce, Zoho, Ozow, Peach, PayFast and Clickatell Chat 2 Pay. It is general commentary, so do not treat these as S10U connectors.', '/whatsapp-commerce-south-africa-2026-selling-inside-the-chat/'],
  ] },
  { title: 'Security, data and hosting', facts: [
    ['site', 'Customer data is stored on South African servers (AWS Cape Town). The client is responsible for its own users’ privacy compliance.', '/ai-studio-terms/'],
    ['site', '99.5% uptime target. Support by email, Monday to Friday, 9:00 to 17:00 SAST.', '/ai-studio-terms/'],
    ['site', 'Encryption, audit logging and template compliance controls are listed. POPIA and “global data regulations” are mentioned.', '/enterprise-communications-platform/'],
    ['infer', 'If an OpenAI model answers a chat, message text is sent outside South Africa. That is a cross-border transfer under POPIA. Ask S10U how this is handled and whether the private-LLM option keeps data in South Africa.', ''],
  ] },
  { title: 'Related S10U products', facts: [
    ['site', 'S10U CRM: built on SuiteCRM, with a REST API, custom modules, workflow automation, lead and opportunity management, email logging and campaigns.', '/power-your-growth-with-a-smarter-simpler-crm/'],
    ['site', 'Tenji online HR assistant: leave, payslips, policies, onboarding. Works with Salesforce, HubSpot, BambooHR, Jira, Microsoft Teams and WhatsApp.', '/always-online-hr-assistant/'],
    ['site', 'Also listed: Mass Communication (bulk email and SMS), Progressive Web App, Event Management, Custom Development, Email Branding, Social Media Management.', '/services/'],
    ['infer', 'Custom Development is the likely route for any integration that has no ready connector. Confirm cost and time with S10U.', '/custom-development/'],
  ] },
  { title: 'Company and proof', facts: [
    ['site', 'Sideways10Up, Kempton Park, Gauteng. Shows a “Meta Business Partner” badge. info@s10u.co.za, +27 11 970 1119.', '/'],
    ['none', 'The Meta partner tier (Tech Provider or Solution Partner) is not stated. We could not reach Meta’s partner directory. Public profiles list about 13 to 14 staff and a company age that varies by source (2015 or 2019).', ''],
    ['site', 'Eight sector case studies (PDF). Reported results include: NPS +32% (automotive), help-desk calls -20% (call centre), 98% of enrolment target (education), late payments -19% (financial), missed consultations -28% (healthcare), CSAT 87% (insurance), conversion up 13% to 15% (retail; the page and the PDF differ), app abandonment -27% (technology).', '/case-studies/'],
    ['none', 'No pricing, plan names, reseller programme, reviews or independent case studies were found.', ''],
  ] },
];

export const META_RULES = [
  ['Cloud API only', 'Meta ended its On-Premises API in October 2025. Everything now runs on the Cloud API, hosted by Meta.', 'https://developers.facebook.com/docs/whatsapp/on-premises/sunset'],
  ['Onboarding a business', 'A partner uses “Embedded Signup” to create the customer’s WhatsApp Business Account. The customer adds a payment method. Numbers already on the WhatsApp Business app can be moved across if the partner supports it.', 'https://developers.facebook.com/docs/whatsapp/embedded-signup/overview'],
  ['24-hour window and templates', 'After a customer writes, you can reply freely for 24 hours. After that, only pre-approved templates (marketing, utility, authentication) can be sent. Opt-in is required.', 'https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/overview'],
  ['Pricing', 'Charged per delivered template message, by category and country, since 1 July 2025. Marketing is always charged. Utility templates are free inside the 24-hour window. Normal replies inside the window are free. South Africa has its own rate card, quoted in US dollars, euros and similar, not rand. Check Meta’s current rate card before quoting a price.', 'https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing'],
  ['Click-to-WhatsApp ads', 'A customer who starts a chat from an ad or page button opens a free 72-hour window, if you reply within 24 hours.', 'https://developers.facebook.com/docs/whatsapp/pricing'],
  ['Rules for AI bots', 'Meta’s terms (section 4.7, updated 23 September 2026) stop companies whose main product is a general AI assistant from using the platform. A bot built for one business’s customer service is allowed. Chat data cannot be used to train general AI models.', 'https://www.facebook.com/legal/Meta-Terms-for-WhatsApp-Business-Platform'],
  ['Payments inside WhatsApp', 'Native in-chat payments are documented for India, Brazil and Singapore, not South Africa. Here the practical route is a payment link in a button.', 'https://developers.facebook.com/docs/whatsapp/cloud-api/payments-api'],
  ['Forms inside WhatsApp (Flows)', 'WhatsApp Flows show forms and pickers inside the chat, for example date pickers or sign-up forms. They need business verification, and some Flows call your own server for live data. Ask S10U if it supports them.', 'https://developers.facebook.com/docs/whatsapp/flows/overview'],
  ['Sending limits and quality', 'New numbers start at 250 customers a day outside the 24-hour window. Business verification lifts this to 2 000, then it grows with good quality. Many blocks or reports lower the quality rating and can pause templates.', 'https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits'],
  ['Green tick', 'Meta decides who gets the official business tick. We found no official checklist, so never promise it.', ''],
];

export const ROUTES = [
  ['1. A ready connector in S10U', 'The cleanest option. S10U says it has 80+ integrations by category. Ask for the exact list.'],
  ['2. S10U custom development or its API', 'S10U offers custom development and mentions API keys, OAuth 2.0 and signed webhooks. Ask for the docs, and the cost of a custom link.'],
  ['3. An automation tool (Make, n8n or Zapier)', 'Works if S10U can send and receive webhooks. n8n can be self-hosted, which helps with POPIA. S10U does not mention any of these tools, so confirm.'],
  ['4. Staff in the loop (the easy option)', 'The bot collects the details and a person confirms in the inbox. Most demos work this way on day one.'],
];

export const QUESTIONS = [
  'Which are the 80+ integrations, by name? Please confirm Google Calendar, Google Sheets, Outlook, HubSpot, Zoho, Xero, Sage, WooCommerce, Shopify, Yoco, PayFast, Paystack, Ozow, Dineplan and the main South African practice-management systems.',
  'Is each integration a ready connector, or custom work by S10U? What does a custom integration cost and how long does it take?',
  'Can we see the API and webhook documentation? Can an outside tool (Make, n8n, Zapier) call S10U and receive events from it?',
  'Which payment gateways power in-chat payments, and what are the fees?',
  'What is S10U’s Meta role (Tech Provider or Solution Partner)? Who pays Meta’s message fees, in which currency, and is there a mark-up?',
  'What are the platform and set-up prices, per plan?',
  'Can we choose other AI models or bring our own AI key? Where is chat text processed, and how is cross-border transfer handled for POPIA? What does the private-LLM option involve?',
  'Are web chat, SMS and AI voice included in the plan? Is Instagram or Messenger supported?',
  'Are WhatsApp Flows (forms), catalogue messages and carousels supported?',
  'Support is Monday to Friday 9:00 to 17:00. What is available for businesses that trade evenings and weekends?',
];
