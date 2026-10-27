/* Story Hunt, content data.
   Edit this file to change beats, topics or the research prompt.
   Nothing else needs touching to swap a topic. */

var PADLET = "https://padlet.com/clarkg25/story-hunt-activity-s024v5311e6vqyxqtrfp";
var GNOMI_URL = "https://www.gnomi.com/en/news-ai-agent";

/* The prompt students take to all three search methods.
   {TOPIC} is replaced with each topic's promptName. */
var PROMPT_TEMPLATE = "Find me the most recent articles related to {TOPIC}. I want to collect background research for a news story I am writing. Please provide examples from reputable sources from the past month.";

var METHODS = [
  {id:"overview", name:"Google AI Overview", note:"The summary Google puts at the top of the results page. Read only that."},
  {id:"google",   name:"Google Search",      note:"Skip the AI Overview and go to first 3 results. We want the plain search engine results"},
  {id:"chat",     name:"An AI chatbot",      note:"Gemini, ChatGPT or Claude."},
  {id:"agent",    name:"An AI news agent",   note:"GNOMI, Manus or WorkBuddy."}
];

var BEATS = [
  {id:"hk",   name:"Local HK",      icon:"ico-hk",
   blurb:"Hong Kong stories. Government papers, Legco filings, and the people who live next to the project."},
  {id:"tech", name:"Tech",          icon:"ico-tech",
   blurb:"Companies, products and model policy. Announcements written to be quoted."},
  {id:"eco",  name:"Eco News",      icon:"ico-eco",
   blurb:"Climate, energy and cities. Targets are easy to announce and hard to fund."},
  {id:"intl", name:"International", icon:"ico-intl",
   blurb:"Politics, security and regulation across borders. Verification is the whole job."}
];

/* short is the label printed on the wheel segment, two lines max */
var TOPICS = [
  {beat:"hk", short:["Island waste","facility fire"],
   title:"Massive Fire Outbreak at Artificial Island Waste Management Facility",
   promptName:"the massive fire outbreak at the artificial island waste management facility",
   brief:"A major fire broke out at the waste facility on the artificial island. We have the official statement and a lot of phone video. I need to know what actually burned and what went into the air.",
   tension:"Compare the official incident statement, air quality monitoring data for those hours, and the facility's own environmental filings."},
  {beat:"hk", short:["Hong Kong","Sixes 2026"],
   title:"Top story lines leading into Hong Kong Sixes 2026",
   promptName:"top story lines leading into Hong Kong Sixes 2026",
   brief:"Everyone files a tournament preview. I want the story underneath the preview. Who pays for this event and who gets the benefit.",
   tension:"Compare the organiser's press material, tourism funding announcements, and past attendance and broadcast figures."},
  {beat:"hk", short:["Northern","Metropolis"],
   title:"Northern Metropolis buildout, cost and timeline slippage",
   promptName:"the Northern Metropolis buildout, its cost and timeline slippage",
   brief:"The Northern Metropolis has moved its deadlines again. Find out what changed, what it costs now, and who holds the land it runs through.",
   tension:"Compare policy address commitments, Legislative Council funding papers, and developer land holdings and share filings."},
  {beat:"hk", short:["AI and fintech","talent push"],
   title:"Hong Kong's AI and fintech talent push",
   promptName:"Hong Kong's AI and fintech talent push",
   brief:"The city keeps announcing schemes to bring in tech talent. Bring me the retention number, not the application number.",
   tension:"Compare the scheme announcements, immigration application data, and independent surveys on how long arrivals actually stay."},

  {beat:"tech", short:["iPhone Duo","rollout"],
   title:"iPhone Duo rollout with new CEO",
   promptName:"the iPhone Duo rollout under a new CEO",
   brief:"A new flagship product and a new chief executive in the same cycle. Separate the product story from the leadership story, then tell me where the two meet.",
   tension:"Compare the launch material, supply chain reporting, and investor filings or analyst notes on what the company has committed to."},
  {beat:"tech", short:["Anthropic","IPO strategy"],
   title:"Anthropic upcoming IPO strategy",
   promptName:"Anthropic's upcoming IPO strategy",
   brief:"There is a lot of noise about an AI company going public. I want to know what is documented and what is speculation dressed as reporting.",
   tension:"Compare company statements, financial press reporting, and anonymously sourced scoops. Mark which claims have a named source."},
  {beat:"tech", short:["AI versus","doctors"],
   title:"AI outperforms doctors, reading the medical claim",
   promptName:"claims that AI outperforms doctors",
   brief:"Another study says a model beats clinicians. Read the study, not the press release, and tell me what it actually measured.",
   tension:"Compare the university press release, the paper or preprint itself, the sample size and peer review status, and any clinician response."},
  {beat:"tech", short:["Open weights","versus closed"],
   title:"Open weights versus closed models",
   promptName:"open weights versus closed models",
   brief:"This is a policy fight dressed up as a technical argument. Work out who is arguing for what, and what each side gains if they win.",
   tension:"Compare company position papers, government consultation submissions, and researcher commentary. Track the funding behind each voice."},

  {beat:"eco", short:["Urban","decarbonization"],
   title:"Urban decarbonization and the drive for resilient cities",
   promptName:"urban decarbonization and the drive for resilient cities",
   brief:"Cities keep publishing climate targets. Tell me which ones have a budget line behind them and which ones are a press release with a date on it.",
   tension:"Compare the city climate plan, the budget documents that fund it, and independent progress audits."},
  {beat:"eco", short:["Data centre","power and water"],
   title:"AI data centre buildout and local power or water fights",
   promptName:"AI data centre buildout and local power or water fights",
   brief:"A data centre lands in a town and the utility bill moves. Pick one specific place and follow the paperwork.",
   tension:"Compare the company announcement, utility regulator filings, and local council or community records."},
  {beat:"eco", short:["Carbon credit","credibility"],
   title:"Carbon credit market credibility",
   promptName:"carbon credit market credibility",
   brief:"Offsets that did not deliver. Find one registry, one project and one auditor, then follow the claim back to whoever signed it off.",
   tension:"Compare the project developer's claims, the registry listing, and investigative or academic review of the methodology."},
  {beat:"eco", short:["Typhoon and","heat adaptation"],
   title:"Typhoon and extreme heat adaptation in dense Asian cities",
   promptName:"typhoon and extreme heat adaptation in dense Asian cities",
   brief:"Adaptation spending is rising. I want to know whether it buys concrete or warning systems, and who is still left outside the protection.",
   tension:"Compare government adaptation budgets, meteorological agency data, and reporting on who the measures do not cover."},

  {beat:"intl", short:["Paris","clashes"],
   title:"Widespread clashes erupt in Paris amid nationwide demonstrations",
   promptName:"widespread clashes in Paris amid nationwide demonstrations",
   brief:"Protest coverage goes stale within a day. Find the cause underneath it, and verify the footage before you build anything on it.",
   tension:"Compare wire reporting, official statements, organiser or union statements, and geolocated video."},
  {beat:"intl", short:["Year end","global ballots"],
   title:"Upcoming major end-of-year global ballots",
   promptName:"upcoming major end-of-year global ballots",
   brief:"Several countries vote before the year closes. Pick one and tell me what is at stake beyond who is ahead.",
   tension:"Compare electoral commission material, party platforms, and the methodology behind the polling everyone is quoting."},
  {beat:"intl", short:["AI rules","coming into force"],
   title:"AI rules coming into force",
   promptName:"AI rules coming into force",
   brief:"Rules are arriving in phases across several jurisdictions. I need to know what is binding, from when, and on whom.",
   tension:"Compare the legal text or official guidance, industry lobbying submissions, and legal analysis of what the text actually requires."},
  {beat:"intl", short:["Undersea","cable cuts"],
   title:"Undersea cable cuts and chokepoint security",
   promptName:"undersea cable cuts and chokepoint security",
   brief:"Cables keep getting cut and attribution is the hard part. Tell me what is confirmed, what is inferred, and who is doing the inferring.",
   tension:"Compare cable operator statements, national investigation findings, ship tracking data, and security analyst commentary."}
];

var SRC_TYPES = ["News report","Corporate announcement","Government or policy document","Academic paper or preprint","Data or database","Interview or first-hand account","Other"];
