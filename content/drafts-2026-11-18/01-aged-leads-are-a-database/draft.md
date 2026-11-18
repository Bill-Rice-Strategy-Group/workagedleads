---
title: "Aged Leads Aren't Leads. They're a Customer Database. Here's How to Let AI Work It."
slug: "aged-leads-customer-database-ai-assistant"
excerpt: "Most agents buy aged leads and expect them to act like fresh leads. They won't. Treat them like a database of past clients instead, and use a $20 AI assistant hooked to a Google Sheet and your Gmail to write each person a personal email. Then you only call the people who write back."
author: bill-rice
category: tactics
primaryKeyword: how to work aged leads with AI
---

<!--
DRAFT, 2026-11-18. Not in Sanity. Bill's idea, written for a non-technical reader.
Before publishing, Bill to check:
  1. "About a dollar a name" in the intro and CTA: APPROVED by Bill 2026-11-18. Keep it.
  2. Connector facts (verified 2026-11-18): Claude and ChatGPT can both send from Gmail
     on paid plans and ask for approval before each send by default.
     Sources: support.claude.com/en/articles/10166901 ; ChatGPT Gmail send since mid-2026.
     Menu names change. The steps below say "Settings, then Connectors" on purpose.
  3. Gmail limits (500 free / 2,000 Workspace) from memory, unchecked. Bill 2026-11-18: fine
     to mention, but the point is a steady manual-like pace, not volume. Copy reflects that.
-->

I get the same email a few times a month. Someone bought a batch of aged leads, called them for two weeks, and wants to know why they "don't work."

When I ask what they expected, the answer is almost always the same. They expected the leads to act like leads: pick up the phone, remember filling out a form, and be ready to talk.

That's the wrong way to think about aged leads. I've always treated them as something else: **a customer database you can buy for about a dollar a name.** Once you think of them that way, the right way to work them gets a lot clearer. And in 2026, an AI assistant that costs $20 a month can do most of the work.

This article shows you how, one step at a time. You don't need to be technical. If you can use Gmail and a Google Sheet, you can set this up in an afternoon.

## Why aged leads don't act like fresh leads

**An aged lead is someone who asked about a product like yours weeks or months ago. They gave their consent to the company that collected the lead, not to you. So you can't text them or put them on an autodialer the way you would a fresh, consented lead. What you can do is email them and treat them like past clients.**

A fresh lead raised their hand an hour ago. An aged lead raised their hand a while back, then life moved on. Some bought already. Some never did. Some are still thinking about it.

Two things are true about every aged lead at once:

1. **They showed real intent.** They looked into a mortgage, a life policy, a new roof. That's more than you know about a random name on a list.
2. **They didn't agree to hear from you.** The consent on the form went to whoever collected the lead. That's why texting aged leads and running them through automated dialers gets agents in trouble. (Our [guide to calling purchased leads](/blog/is-it-legal-to-call-purchased-leads) covers the rules.)

Put those together and you get a list of people who care about what you sell but don't know you yet. That's not a hot lead. That's a database.

## Work them like your past clients

**Think about how good agents treat their past clients. They don't call them every day. They send helpful updates, check in now and then, and stay top of mind. When the client is ready, they reach out first. Do the same with aged leads, and buy enough of them to fill your CRM.**

Your best business usually comes from people who already know you. You stay in touch with them by email. You send them something useful, like a rate update or a checklist. When they're ready, they call you.

You can build that same kind of list on purpose. Buy a few thousand aged leads in your vertical, put them in one place, and start treating them like people you already know.

The old problem was time. Writing a personal email to 2,000 people isn't something one agent can do. A mass email blast is easy, but it reads like spam, and most people ignore it.

That's the part AI changes.

## What an AI assistant can do for you

**Claude and ChatGPT can now connect to your Gmail and to a Google Sheet. Once connected, you can talk to them like you'd talk to an assistant: "Look at my leads, group them, and write each person a short personal email." They write the drafts, you approve them, and they go out from your own email, one at a time.**

In sales, the person who does this work is called a sales development rep, or SDR. Their job is to reach out, find the people who are interested, and hand those people to the closer.

You can now set up an AI to do the SDR's job against your lead list. You give it instructions in plain English. It reads the sheet, sorts the leads into groups, writes a personal email for each person, and keeps track of who wrote back. You stay the closer. You just spend your time calling the people who answered.

A few things make this different from an email blast:

- **Each email is written for one person.** It uses what you know about them, such as their state, the product they asked about, and when they asked.
- **It comes from your normal email address.** It looks like a note from a person because it is one.
- **It goes out slowly.** A few dozen a day, not thousands at once. That keeps your email account in good standing.

## What you need

**You need three things: your leads in a Google Sheet, a paid Claude or ChatGPT plan, and a Gmail or Google Workspace email. The $20-a-month plan of either one is enough to start.**

1. **A Google Sheet with your leads.** Your lead vendor sends a spreadsheet file (usually called a CSV). Open Google Sheets and use File, then Import, to bring it in.
2. **Claude or ChatGPT, on a paid plan.** Both have a plan for about $20 a month, and both can connect to Gmail and Google Drive. If you're going to work a big list every day, the higher plans cost $100 to $200 a month and give you more use. That's still far less than paying a person to do this job.
3. **Gmail or Google Workspace.** The AI sends from this account. If you have a business email through Google Workspace, use that.

That's it. No new software, no developer.

## Step 1: Set up your sheet

**Import your leads into Google Sheets, then add five columns of your own: Segment, Status, Last Emailed, Notes, and Unsubscribed. These columns are how you and the AI keep track of each person.**

Keep the columns your vendor gave you (name, email, phone, state, the date they asked, and anything about what they wanted). Then add these at the end:

| Column | What goes in it |
|---|---|
| Segment | The group the AI puts them in |
| Status | New, Emailed, Replied, Call, Not interested |
| Last Emailed | The date of the last email |
| Notes | Anything they told you in a reply |
| Unsubscribed | "Yes" if they asked you to stop |

Name the sheet something simple, like "Aged Leads Database."

## Step 2: Connect your AI to Gmail and Google Drive

**In Claude or ChatGPT, open Settings, then Connectors (sometimes called Apps). Turn on Gmail and Google Drive and sign in with your Google account. Leave the setting on that asks your approval before each email is sent.**

The exact menu names change from time to time, but the steps are the same in both:

1. Open Settings.
2. Find Connectors or Apps.
3. Turn on **Gmail** and **Google Drive** (in Claude, also turn on **Google Sheets** if you see it listed separately).
4. Sign in with the same Google account that has your sheet and your email.

Both tools ask you to approve each email before it goes out. Keep that turned on. It's your safety net, and it's what keeps this personal.

Before you load real customer data, look in the privacy settings for an option about using your chats to train the AI, and turn it off. These are real people's names and phone numbers. Treat them that way. Our [AI guardrails article](/blog/ai-guardrails-aged-lead-agents) covers this in more detail.

## Step 3: Give your AI its job

**Start a new chat and paste in a short job description. Tell the AI who these people are, where the leads came from, what you sell, and the rules it must follow. This is the single most important step. A clear brief gets you good emails.**

Copy this, fill in the brackets, and paste it in:

> You're my sales assistant. I'm [your name], a [loan officer / insurance agent / roofer] in [your state(s)].
>
> My Google Sheet called "Aged Leads Database" has people who asked about [product] between [month] and [month] on a website. They didn't contact me directly. They don't know who I am yet. Treat them like a list of people I'd like to become my long-term clients, not like hot leads.
>
> Your job: look at the sheet, sort people into useful groups, write short personal emails from me, and help me decide who to call.
>
> Rules for every email:
> - Plain text, under 100 words, written the way I'd talk. No logos, no sales pitch.
> - End with one easy question they can answer in a few words.
> - Never pretend we've spoken before. Never say "as we discussed" or "following up on our call."
> - Never invent rates, prices, deadlines, or say someone qualifies or is approved.
> - Use only facts that are in the sheet.
> - End every email with my mailing address, [address], and the line: "If you'd rather not hear from me, just reply 'stop' and I won't email again."
> - Never email anyone marked "Yes" in the Unsubscribed column.
> - Send no more than [25] emails a day.
>
> Before you do anything, tell me what columns you see in the sheet and how many people are on it.

That last line is a check. If the AI tells you the right number of people and the right columns, it can see your sheet and you're ready.

If you're stuck on what to say, our [prompt library for aged leads](/blog/chatgpt-prompts-aged-leads) has more examples you can borrow.

## Step 4: Ask it to build your groups

**Ask the AI to look at the sheet and suggest four to six groups based on what each person asked about, where they live, and how long ago they asked. Read the groups it suggests and change any that don't make sense. Then have it fill in the Segment column.**

Try something like:

> Look at everyone in the sheet and suggest 4 to 6 groups that would each need a different kind of email. Explain why for each one. Don't write any emails yet.

You'll get back groups that fit your list. Some examples by vertical:

- **Mortgage:** people who asked about a refinance in 2023 when rates were higher; people who asked about a cash-out or home equity loan; first-time buyers who never bought.
- **Insurance:** final expense shoppers over 70; people who asked about term life for a new mortgage or a new baby; people in states where you're licensed versus states where you're not (leave those out).
- **Home services:** people who asked about a roof or HVAC before last winter; people in the zip codes you actually serve.

When the groups look right, say: "Fill in the Segment column with these groups."

## Step 5: Write and send the first emails

**Pick one group. Ask the AI to write emails for the first 10 people, read every one, and fix anything that sounds off. When the drafts sound like you, approve them. Then keep a steady pace of 20 to 25 a day.**

> Write emails for the first 10 people in the "2023 refinance" group. Show me each one before sending.

Read them. Look for two things: does it sound like you, and is every fact true? If something is wrong, tell the AI what to change in plain words ("shorter," "less formal," "don't mention their loan amount"). It learns fast inside a chat.

A good first email for that group might look like this:

> Hi Linda,
>
> You looked into refinancing your Ohio home back in 2023. Rates have moved a fair bit since then. Did you end up refinancing, or is it still on your list?
>
> Mike Torres, NMLS #000000
> [mailing address]
> If you'd rather not hear from me, just reply "stop" and I won't email again.

Short, true, one question. When the drafts are right, approve them and let them send. Then tell the AI to mark those people as "Emailed" with today's date.

**Keep a steady pace.** This system isn't about volume. Send about what you'd send by hand on a good day, 20 to 25 personal emails, every day. The AI does the boring part: reading the sheet, writing each email, keeping track. You do the part that makes money: taking the calls. Steady also keeps your email account healthy. A sudden burst of hundreds of emails looks like spam to Google, even when each one is personal. Gmail does have daily caps (about 500 recipients on a free account, 2,000 on Workspace), but this system never gets near them.

## Step 6: Your 15-minute daily routine

**Each morning, ask the AI to check your inbox for replies from people on the sheet, sum up what each person said, update the sheet, and give you a short call list in order. Then send the day's new emails. You spend the rest of your time on the phone with people who wrote back.**

Paste this in each morning:

> Check my Gmail for replies from anyone on the sheet since yesterday. For each one, tell me in one line what they said, and update their Status and Notes. Mark anyone who said "stop" or "not interested" as Unsubscribed. Then give me a list of who I should call today, most interested first, with the reason. After that, draft today's new emails for the next 25 people.

Here's how to read what comes back:

- **They replied with a question or "yes, call me."** Call today. They asked for it.
- **They replied with something like "not right now."** Mark them for a follow-up email in 60 or 90 days. Don't call.
- **They said stop.** Stop. No more email, no calls. The AI should already have marked them.
- **No reply.** That's normal. Most people won't answer the first email. They stay on your list for the monthly email in Step 7.

A note on clicks and opens: a plain Gmail account doesn't tell you who opened or clicked your email. In this simple setup, **replies are your signal**, and they're the best one anyway. If you outgrow Gmail and want open and click tracking, a CRM with email built in can do that. Our article on [letting email decide who you call](/blog/70-dials-nobody-answers-email-decides-who-you-call) explains how to read those signals.

## Step 7: Keep giving them something useful

**After the first few emails, move everyone to one helpful email a month: a short market update, a tip, or a checklist. This is how you'd treat past clients, and it's what turns a cold list into people who know your name when they're ready to buy.**

Once a month, ask the AI:

> Write a short, useful email for the [group] group about [topic]. No pitch. One practical tip they can use, and one question at the end. Personalize the first line for each person using what's in the sheet.

Ideas that work:

- **Mortgage:** what rates did this month in plain words; a checklist for people thinking about a refinance.
- **Insurance:** what final expense actually covers; three questions to ask before buying term life.
- **Home services:** what to check on your roof before winter; how to tell if your AC is near the end.

Most of the people on your list won't be ready this month. Some will be ready in six months. When they are, you want your name to be the one they remember. That's the whole idea of a database.

## Keep it legal and keep your email healthy

**Email to aged leads is allowed, but you have to follow the federal CAN-SPAM rules: honest subject lines, your mailing address, and a way to opt out that you honor. Don't text these leads. Don't put them on an autodialer. Before you call anyone who didn't ask you to, check them against the Do Not Call list.**

In plain terms:

- **Every email needs** an honest subject line, your real name, your physical mailing address, and a clear way to say stop. Honor every stop request. The law gives you 10 business days, but there's no reason to wait. The [FTC's CAN-SPAM guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business) has the full list.
- **No texting.** Marketing texts need written consent, and the consent on an aged lead went to the company that collected it, not to you. If someone replies "text me," that's different. Save that email.
- **Call by hand.** The calls in this system are you, dialing one person at a time, mostly people who wrote back and asked for it. Don't hand the AI your phone and don't use an AI voice to call aged leads.
- **Scrub before you call.** If you're calling someone who hasn't replied, check the federal and state Do Not Call lists first.
- **Watch your email account.** If replies dry up or emails start bouncing, slow down. Some agents set up a second email address on a separate domain for this outreach so their main business email is never at risk. That's worth doing once you're sending more than a few dozen a day.

This is the way our [Aged Lead Operator's System](/playbook) calls Mode A: manual dialing and plain email, no texting or automation without fresh consent from the person. It's the right place for most agents to start. This article is guidance, not legal advice. For questions about your state, the TCPA lawyers at [Henson Legal](https://www.henson-legal.com/) are who I'd ask.

## Is the $200 plan worth it?

**Start on the $20 plan. If you're working a few thousand leads and running the daily routine every morning, you'll probably hit the usage limit, and the $100 to $200 plans are worth it. Compare that to what a part-time assistant would cost you in a single week.**

The $20 plan is plenty for learning the system and working a few hundred leads. If you're running a list of thousands and talking to the AI every day, you'll start to see messages that you've reached your limit for now. That's the sign to move up.

At $200 a month, you're paying less than $7 a day for an assistant that writes every email, keeps your sheet current, and hands you a call list each morning. No human assistant comes close to that price.

## Fill your database

**The system only works if your database keeps growing. Buy aged leads in small batches you can keep paying for, every week or two, so the AI always has new people to write to.**

Here's the math that makes this work. At about a dollar a name for older leads, $1,000 fills your sheet with roughly a thousand people who already looked into what you sell. Your AI writes to 25 of them a day. In six weeks, every one has a personal email from you. The ones who write back go on your call list. The rest get a useful email from you every month, for as long as they stay on your list.

That's not a pile of leads. That's a client base you're building on purpose.

If you need somewhere to start, [Aged Lead Store](https://agedleadstore.com/all-lead-types/?utm_source=workagedleads&utm_medium=affiliate&utm_campaign=blog-aged-leads-customer-database&utm_content=body-fill-your-database) sells aged mortgage, insurance and home improvement leads in batches small enough to start with (we earn a commission if you buy).

## What to do this week

1. Buy a small batch of aged leads in your vertical, a few hundred to start.
2. Import them into a Google Sheet and add the five columns from Step 1.
3. Sign up for Claude or ChatGPT on the $20 plan and connect Gmail and Google Drive.
4. Paste in the job description from Step 3 and ask the AI to build your groups.
5. Send your first 20 to 25 personal emails, and read every one before it goes.
6. Run the 15-minute morning routine every day, and call the people who write back.
