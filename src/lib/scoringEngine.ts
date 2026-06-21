// Heuristic LinkedIn Content Scoring Engine based on PRD specifications

import { PostAnalysis } from "./mockDb";

export function analyzePostContent(content: string): PostAnalysis {
  const cleanContent = content.trim();
  const lines = cleanContent.split('\n').map(l => l.trim()).filter(Boolean);
  const words = cleanContent.split(/\s+/).filter(Boolean);
  
  if (words.length < 5) {
    return {
      id: Math.random().toString(36).substring(7),
      content,
      score: 10,
      breakdown: { hook: 0, readability: 10, authority: 0, emotional: 0, formatting: 10, cta: 0, hashtags: 0, trend: 0 },
      metrics: { likes: 0, comments: 0, shares: 0, reach: 0, virality: 'Low' },
      suggestions: ["Content is too short to evaluate. Please write a post of at least 15-20 words."],
      timestamp: new Date().toISOString(),
      scrollStopperScore: 0,
      hookExplanations: {
        curiosity: false,
        statistic: false,
        contrarian: false,
        question: false,
        recommendation: "Please write a longer post."
      },
      potentialIssues: ["Content is too short"],
      missingElements: ["Story", "Social Proof", "Statistic", "Customer Insight"],
      audienceMatch: { founders: 30, creators: 30, recruiters: 30 }
    };
  }

  // 1. Hook Quality (20% weight, max 100 subscore)
  let hookScore = 50;
  const firstLine = lines[0] || "";
  const secondLine = lines[1] || "";
  const firstTwoLines = (firstLine + " " + secondLine).toLowerCase();
  
  // Good hook signs
  if (firstLine.includes('?') || firstLine.includes('!')) hookScore += 15;
  if (/\d+/.test(firstLine)) hookScore += 15; // Numbers/stats
  
  // Contrarian/Authority triggers
  const hookTriggers = ['unpopular opinion', 'stop doing', 'mistake', 'secret', 'how I', 'how we', 'lessons', 'never', 'everyone is', 'truth about'];
  hookTriggers.forEach(t => {
    if (firstTwoLines.includes(t)) hookScore += 15;
  });
  
  // Hook length penalty (ideal is punchy: 30-90 chars)
  if (firstLine.length > 120) hookScore -= 20;
  if (firstLine.length < 20) hookScore -= 10;
  hookScore = Math.min(100, Math.max(0, hookScore));

  // Heuristic Hook Detections
  const curiosityKeywords = ['secret', 'unpopular', 'lessons', 'hidden', 'reveal', 'behind the scenes', 'how to', 'how i', 'how we', 'one shift', 'changes everything', 'blueprint', 'framework', 'loop', 'system', 'mistake'];
  const hasCuriosity = curiosityKeywords.some(k => firstTwoLines.includes(k));
  
  const hasStatistic = /\d+/.test(firstTwoLines);
  
  const contrarianKeywords = ['unpopular opinion', 'stop doing', 'everyone is wrong', 'wrong about', 'mistake', 'truth about', 'never', 'fail', 'hate', 'waste of time', 'holding you back', 'failing'];
  const hasContrarian = contrarianKeywords.some(k => firstTwoLines.includes(k));
  
  const hasQuestion = firstLine.includes('?') || secondLine.includes('?');
  
  let hookRecommendation = "";
  if (!hasStatistic) {
    hookRecommendation = "Add a number-based claim or statistic (e.g. '90% of SaaS startups fail').";
  } else if (!hasCuriosity) {
    hookRecommendation = "Add a curiosity gap or teaser to make the reader click 'see more'.";
  } else if (!hasContrarian) {
    hookRecommendation = "Introduce a contrarian angle to disrupt the user's feed scanning.";
  } else if (!hasQuestion) {
    hookRecommendation = "Try adding a question to invoke direct reader engagement.";
  } else {
    hookRecommendation = "Hook looks highly optimized! Monitor reach in live updates.";
  }

  // 2. Readability (15% weight, max 100 subscore)
  let readabilityScore = 70;
  // Paragraph length (big block of text = bad readability)
  const paragraphLengths = cleanContent.split('\n\n').map(p => p.split(/\s+/).filter(Boolean).length);
  const hasDenseParagraphs = paragraphLengths.some(len => len > 45);
  if (hasDenseParagraphs) readabilityScore -= 25;
  
  // Average sentence length
  const averageWordLength = words.reduce((acc, w) => acc + w.length, 0) / words.length;
  if (averageWordLength > 6.2) readabilityScore -= 15; // too academic
  if (words.length > 250) readabilityScore -= 10; // overly long posts need high formatting
  readabilityScore = Math.min(100, Math.max(0, readabilityScore));

  // 3. Authority (15% weight, max 100 subscore)
  let authorityScore = 50;
  const authorityKeywords = [
    'framework', 'metrics', 'revenue', 'launch', 'scale', 'system', 'strategy',
    'roi', 'engineered', 'led team', 'workflow', 'lessons learned', 'data',
    'insights', 'optimization', 'tactics', 'blueprint', 'results', 'playbook'
  ];
  let authorityMatches = 0;
  authorityKeywords.forEach(k => {
    if (cleanContent.toLowerCase().includes(k)) {
      authorityMatches++;
    }
  });
  authorityScore += authorityMatches * 12;
  if (words.length > 150 && authorityMatches === 0) authorityScore -= 20;
  authorityScore = Math.min(100, Math.max(0, authorityScore));

  // 4. Emotional Impact (15% weight, max 100 subscore)
  let emotionalScore = 50;
  const emotionalKeywords = [
    'fail', 'broke', 'struggle', 'success', 'growth', 'pain', 'excited',
    'heart', 'regret', 'proud', 'journey', 'mistake', 'scared', 'growth',
    'transform', 'dream', 'culture', 'burnout', 'passion', 'honest'
  ];
  let emotionalMatches = 0;
  emotionalKeywords.forEach(k => {
    if (cleanContent.toLowerCase().includes(k)) {
      emotionalMatches++;
    }
  });
  emotionalScore += emotionalMatches * 10;
  // Emoji usage (adds emotion if moderate)
  const emojiRegex = /[\uD800-\uDFFF\u2600-\u27BF]/g;
  const emojiCount = (cleanContent.match(emojiRegex) || []).length;
  if (emojiCount >= 1 && emojiCount <= 6) emotionalScore += 10;
  if (emojiCount > 12) emotionalScore -= 15; // Spammy
  emotionalScore = Math.min(100, Math.max(0, emotionalScore));

  // 5. Formatting (10% weight, max 100 subscore)
  let formattingScore = 40;
  // Spacing / line breaks
  const lineCount = cleanContent.split('\n').length;
  const spacingRatio = lineCount / words.length;
  if (spacingRatio > 0.05 && spacingRatio < 0.35) formattingScore += 40; // good paragraph breaks
  
  // Lists check (bullet points, emojis as bullets, numbers)
  const listRegex = /^([\s]*[-*•+✓👉🚀📍1-9]\s)/mu;
  if (listRegex.test(cleanContent)) {
    formattingScore += 20;
  }
  formattingScore = Math.min(100, Math.max(0, formattingScore));

  // 6. CTA Quality (10% weight, max 100 subscore)
  let ctaScore = 30;
  
  // Filter out any trailing lines at the end that only contain hashtags
  const linesWithoutTrailingHashtags = [...lines];
  while (linesWithoutTrailingHashtags.length > 0) {
    const lastIdx = linesWithoutTrailingHashtags.length - 1;
    const line = linesWithoutTrailingHashtags[lastIdx];
    const tokens = line.split(/\s+/).filter(Boolean);
    const isAllHashtags = tokens.length > 0 && tokens.every(token => 
      token.startsWith('#') || token.toLowerCase().startsWith('hashtag#')
    );
    if (isAllHashtags) {
      linesWithoutTrailingHashtags.pop();
    } else {
      break;
    }
  }

  const lastLine = linesWithoutTrailingHashtags[linesWithoutTrailingHashtags.length - 1] || "";
  const lastTwoLines = (linesWithoutTrailingHashtags[linesWithoutTrailingHashtags.length - 2] || "") + " " + lastLine;
  
  const ctaIndicators = [
    'what do you think', 'agree?', 'comment below', 'repost', 'share your',
    'thoughts?', 'subscribe', 'link in', 'get the guide', 'dm me', 'check out',
    'which one', 'targeting', 'preparing', 'your take', 'your thoughts', 'do you'
  ];
  let hasCta = false;
  ctaIndicators.forEach(cta => {
    if (lastTwoLines.toLowerCase().includes(cta)) {
      hasCta = true;
    }
  });
  if (hasCta) ctaScore += 50;
  if (lastLine.includes('?') || lastTwoLines.includes('?')) ctaScore += 20;
  ctaScore = Math.min(100, Math.max(0, ctaScore));

  // 7. Hashtags (5% weight, max 100 subscore)
  let hashtagScore = 50;
  const hashtags = (cleanContent.match(/(?:hashtag)?#\w+/gi) || []);
  const hashtagCount = hashtags.length;
  if (hashtagCount >= 2 && hashtagCount <= 5) hashtagScore = 100;
  else if (hashtagCount === 1) hashtagScore = 75;
  else if (hashtagCount === 0) hashtagScore = 40;
  else if (hashtagCount > 5) hashtagScore = 100 - (hashtagCount - 5) * 15; // penalty
  hashtagScore = Math.min(100, Math.max(0, hashtagScore));

  // 8. Trend Relevance (10% weight, max 100 subscore)
  let trendScore = 40;
  const trendKeywords = [
    'ai', 'artificial intelligence', 'saas', 'generative', 'llm', 'chatgpt',
    'product led', 'plg', 'remotely', 'wfh', 'layoff', 'solopreneur', 'founder',
    'b2b marketing', 'growth marketing', 'nocode', 'typescript', 'gpt', 'recruiter'
  ];
  let trendMatches = 0;
  trendKeywords.forEach(t => {
    if (cleanContent.toLowerCase().includes(t)) {
      trendMatches++;
    }
  });
  trendScore += trendMatches * 15;
  trendScore = Math.min(100, Math.max(0, trendScore));

  // Calculate Weighted Final Score (0 - 100)
  const score = Math.round(
    (hookScore * 0.20) +
    (readabilityScore * 0.15) +
    (authorityScore * 0.15) +
    (emotionalScore * 0.15) +
    (formattingScore * 0.10) +
    (ctaScore * 0.10) +
    (hashtagScore * 0.05) +
    (trendScore * 0.10)
  );

  // Suggestions generation
  const suggestions: string[] = [];
  if (hookScore < 70) {
    suggestions.push("Hook could be punchier. Add a statistic, a numbers-based claim, or a contrarian question in your very first sentence.");
  }
  if (readabilityScore < 70) {
    suggestions.push("Paragraphs are a bit dense. LinkedIn readers scan rapidly: break down blocks of text longer than 3 lines into single lines or bullet points.");
  }
  if (authorityScore < 60) {
    suggestions.push("Boost credibility by incorporating metrics, a framework name, or details of a specific ROI/results achieved.");
  }
  if (emotionalScore < 65) {
    suggestions.push("Inject emotional stakes. Add words highlighting the personal challenge (e.g., 'struggle', 'burnout', 'failed') to connect with readers.");
  }
  if (formattingScore < 70) {
    suggestions.push("Add visual formatting like list markers (e.g., 🚀, ✓, or -) and white space to help the reader read down the page.");
  }
  if (ctaScore < 60) {
    suggestions.push("Add a direct Call to Action (CTA) at the end. Ask a specific question, suggest reposting, or tell users to check out a link.");
  }
  if (hashtagCount === 0) {
    suggestions.push("Add 2-3 relevant hashtags (e.g. #ProductManagement #SaaS) to help search indexes catalog your post.");
  } else if (hashtagCount > 5) {
    suggestions.push("Reduce hashtags. Using more than 5 hashtags looks spammy and can trigger spam filters in the LinkedIn feed.");
  }
  if (trendScore < 50) {
    suggestions.push("Try to connect your post to wider industry trends (like PLG growth models, AI integration, or work culture changes) to capture viral momentum.");
  }

  // Base suggestions list if everything is perfect
  if (suggestions.length === 0) {
    suggestions.push("Your formatting, hook, and layout are pristine! Consider timing your publish when your target timezone is most active.");
  }

  // Calculate engagement estimates based on the final score
  let baseReach = Math.round(Math.pow(score / 10, 2.5) * 50);
  let baseLikes = Math.round(baseReach * 0.02);
  let baseComments = Math.round(baseLikes * 0.25);
  let baseShares = Math.round(baseLikes * 0.06);

  // Random variance to make calculations look authentic but deterministic for identical text
  const textHash = cleanContent.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const varianceFactor = 0.8 + ((textHash % 40) / 100); // 0.8 to 1.2

  const likes = Math.max(1, Math.round(baseLikes * varianceFactor));
  const comments = Math.max(0, Math.round(baseComments * varianceFactor));
  const shares = Math.max(0, Math.round(baseShares * varianceFactor));
  const reach = Math.max(likes * 10, Math.round(baseReach * varianceFactor));

  // Determine virality
  let virality: 'Low' | 'Medium' | 'High' | 'Viral' = 'Low';
  if (score >= 85) virality = 'Viral';
  else if (score >= 70) virality = 'High';
  else if (score >= 50) virality = 'Medium';

  // Potential Issues Heuristics
  const potentialIssues: string[] = [];
  if (hookScore < 65 && firstLine.length < 35 && !hasStatistic && !hasQuestion) {
    potentialIssues.push("Generic opening");
  }
  const earlyProductKeywords = ['product', 'software', 'app', 'our platform', 'saas', 'tool', 'client', 'checkout', 'api', 'dashboard'];
  if (earlyProductKeywords.some(k => firstTwoLines.includes(k))) {
    potentialIssues.push("Product mention too early");
  }
  if (emotionalScore < 55) {
    potentialIssues.push("Weak emotional trigger");
  }
  if (ctaScore < 55) {
    potentialIssues.push("Broad CTA");
  }

  // Missing Elements Heuristics
  const missingElements: string[] = [];
  
  // 1. Story
  const storyKeywords = ['journey', 'years ago', 'i spent', 'i was', 'rock bottom', 'failed', 'crashed', 'struggle', 'burnout', 'passion', 'honest'];
  const hasStory = storyKeywords.some(k => cleanContent.toLowerCase().includes(k));
  if (!hasStory) {
    missingElements.push("Story");
  }
  
  // 2. Social Proof (accurate check based on user request)
  const socialProofKeywords = [
    'case study', 'testimonial', 'customer quote', 'client review', 'proof of concept',
    'recommendation letter', 'client says', 'customer says'
  ];
  let hasSocialProof = socialProofKeywords.some(k => cleanContent.toLowerCase().includes(k));
  if (!hasSocialProof) {
    // Regex matching numbers with growth/revenue terms or symbols
    const metricRegex = /\b\d+(?:[\d,.]*(?:k|m|%|\+))?\s*(?:mrr|arr|usd|gbp|eur|\$|users|clients|followers|customers|subscribers|revenue|growth|views|impressions|reposts|shares|conversion|saved|earned|boosted)\b/i;
    const dollarRegex = /\$\d+(?:[\d,.]*(?:k|m)?)?\b/i;
    if (metricRegex.test(cleanContent) || dollarRegex.test(cleanContent)) {
      hasSocialProof = true;
    }
  }
  if (!hasSocialProof) {
    missingElements.push("Social Proof");
  }
  
  // 3. Statistic
  const hasStatisticElement = /\d+/.test(cleanContent);
  if (!hasStatisticElement) {
    missingElements.push("Statistic");
  }
  
  // 4. Customer Insight (accurate check based on user request)
  const insightKeywords = [
    'pain point', 'frustration', 'struggle to', 'hard to', 'never know if',
    'don\'t know how', 'tired of', 'frustrated with', 'waste hours', 'waste time',
    'waste money', 'biggest challenge', 'biggest mistake'
  ];
  let hasCustomerInsight = insightKeywords.some(k => cleanContent.toLowerCase().includes(k));
  if (!hasCustomerInsight) {
    const insightRegex = /\b(?:creators|founders|recruiters|managers|developers|users|people|clients|customers|professionals)\b[^.?!]{0,100}?\b(?:spend|struggle|fail|worry|skip|look|want|need|forget|miss|ignore|value|waste|care|seek)\b/i;
    if (insightRegex.test(cleanContent)) {
      hasCustomerInsight = true;
    }
  }
  if (!hasCustomerInsight) {
    missingElements.push("Customer Insight");
  }

  // Audience Fit Heuristics
  const foundersKeywords = ['founder', 'saas', 'startup', 'vc', 'valuation', 'funding', 'business', 'mrr', 'arr', 'revenue', 'scale', 'growth', 'product strategy'];
  const creatorsKeywords = ['creator', 'content', 'post', 'link', 'engagement', 'audience', 'linkedin', 'brand', 'personal', 'publish', 'hook', 'writing'];
  const recruitersKeywords = ['recruiter', 'job', 'career', 'candidate', 'resume', 'hiring', 'hire', 'scrum', 'ats', 'talent', 'certified', 'certifications', 'skills'];
  
  let foundersScore = 40;
  foundersKeywords.forEach(k => { if (cleanContent.toLowerCase().includes(k)) foundersScore += 12; });
  let creatorsScore = 35;
  creatorsKeywords.forEach(k => { if (cleanContent.toLowerCase().includes(k)) creatorsScore += 12; });
  let recruitersScore = 30;
  recruitersKeywords.forEach(k => { if (cleanContent.toLowerCase().includes(k)) recruitersScore += 12; });

  const foundersMatch = Math.min(98, Math.max(20, foundersScore));
  const creatorsMatch = Math.min(98, Math.max(20, creatorsScore));
  const recruitersMatch = Math.min(98, Math.max(20, recruitersScore));

  // Personal Brand Signals calculation
  const hasExpClaim = /(?:i built|years? experience|years? of building|i spent|led team|i've spent)/i.test(cleanContent);
  const hasMetrics = /\b\d+(?:%|k|m|\+)?\b/.test(cleanContent);
  const hasFramework = /(?:framework|system|playbook|blueprint|loop|method|workflow)/i.test(cleanContent);
  
  let pbAuthority = 50;
  if (hasExpClaim) pbAuthority += 15;
  if (hasMetrics) pbAuthority += 15;
  if (authorityScore >= 70) pbAuthority += 20;
  pbAuthority = Math.min(100, Math.max(0, pbAuthority));

  let pbExpertise = 45;
  if (hasFramework) pbExpertise += 15;
  if (trendScore >= 60) pbExpertise += 20;
  const industryTerms = ['plg', 'saas', 'llm', 'react', 'fintech', 'api', 'optimization', 'strategy', 'b2b', 'product', 'marketing', 'conversion'];
  let industryTermsMatch = 0;
  industryTerms.forEach(t => { if (cleanContent.toLowerCase().includes(t)) industryTermsMatch++; });
  pbExpertise += Math.min(20, industryTermsMatch * 7);
  pbExpertise = Math.min(100, Math.max(0, pbExpertise));

  let pbUniqueness = 50;
  if (hasContrarian) pbUniqueness += 20;
  if (emojiCount >= 1 && emojiCount <= 4) pbUniqueness += 15;
  if (readabilityScore >= 80) pbUniqueness += 15;
  pbUniqueness = Math.min(100, Math.max(0, pbUniqueness));

  let pbTrust = 40;
  if (hasSocialProof) pbTrust += 25;
  if (hasStatisticElement) pbTrust += 20;
  if (hasStory) pbTrust += 15;
  pbTrust = Math.min(100, Math.max(0, pbTrust));

  const personalBrandScore = Math.round((pbAuthority * 0.3) + (pbExpertise * 0.3) + (pbUniqueness * 0.2) + (pbTrust * 0.2));

  // Transparency report criteria check
  const sentenceLengthCheck = averageWordLength <= 5.8;
  const paragraphBreaksCheck = !hasDenseParagraphs;
  const punchyFormattingCheck = words.length <= 250;

  const frameworkNameCheck = hasFramework;
  const metricsProvidedCheck = hasMetrics;
  const experienceClaimCheck = hasExpClaim;

  const emotionalWordsCheck = emotionalMatches > 0;
  const moderateEmojisCheck = emojiCount >= 1 && emojiCount <= 6;
  const authenticToneCheck = /(?:journey|struggle|failed|burnout|passion|honest|story)/i.test(cleanContent);

  const lowFrictionPromptCheck = /(?:comment|drop a|select|choose|reply with|option|repost)/i.test(lastTwoLines);
  const engagementQuestionCheck = lastTwoLines.includes('?');
  const explicitNextStepCheck = /(?:dm me|link|get the|subscribe|check out|read the)/i.test(lastTwoLines);

  return {
    id: Math.random().toString(36).substring(7),
    content,
    score,
    breakdown: {
      hook: hookScore,
      readability: readabilityScore,
      authority: authorityScore,
      emotional: emotionalScore,
      formatting: formattingScore,
      cta: ctaScore,
      hashtags: hashtagScore,
      trend: trendScore
    },
    metrics: { likes, comments, shares, reach, virality },
    suggestions,
    timestamp: new Date().toISOString(),
    scrollStopperScore: hookScore,
    hookExplanations: {
      curiosity: hasCuriosity,
      statistic: hasStatistic,
      contrarian: hasContrarian,
      question: hasQuestion,
      recommendation: hookRecommendation
    },
    potentialIssues,
    missingElements,
    audienceMatch: {
      founders: foundersMatch,
      creators: creatorsMatch,
      recruiters: recruitersMatch
    },
    personalBrandScore,
    personalBrandSignals: {
      authority: pbAuthority,
      expertise: pbExpertise,
      uniqueness: pbUniqueness,
      trust: pbTrust
    },
    transparencyReport: {
      hook: {
        curiosity: hasCuriosity,
        statistic: hasStatistic,
        contrarian: hasContrarian,
        question: hasQuestion
      },
      readability: {
        sentenceLength: sentenceLengthCheck,
        paragraphBreaks: paragraphBreaksCheck,
        punchyFormatting: punchyFormattingCheck
      },
      authority: {
        frameworkName: frameworkNameCheck,
        metricsProvided: metricsProvidedCheck,
        experienceClaim: experienceClaimCheck
      },
      emotional: {
        emotionalWords: emotionalWordsCheck,
        moderateEmojis: moderateEmojisCheck,
        authenticTone: authenticToneCheck
      },
      cta: {
        lowFrictionPrompt: lowFrictionPromptCheck,
        engagementQuestion: engagementQuestionCheck,
        explicitNextStep: explicitNextStepCheck
      }
    }
  };
}

function cleanOldHooks(content: string): string {
  let cleaned = content.trim();

  // List of all generated hooks to check at start
  const knownHooks = [
    "90% of creators fail to grow on LinkedIn because they miss this simple system:",
    "Most creators spend hours writing LinkedIn posts, but 90% fail to generate any real reach because they miss this simple system:",
    "If you are planning to target Microsoft Fabric Certifications (DP-600 / DP-700 / DP-800), read this first: 🧵",
    "90% of B2B SaaS startups fail at growth because they overlook this one simple system:",
    "Unpopular opinion: 90% of a Product Manager's success is determined before writing a single ticket.",
    "AI isn't replacing developers. Developers who master prompt workflows are replacing developers who don't.",
    "Here is the hard truth about succeeding in Microsoft Fabric certifications & exams in 2026:",
    "Here is the hard truth about succeeding in B2B SaaS growth models in 2026:",
    "Here is the hard truth about succeeding in product management and strategy in 2026:",
    "Here is the hard truth about succeeding in AI integration and dev workflows in 2026:",
    "Here is the hard truth about succeeding in career growth and personal branding in 2026:",
    "Here is the hard truth about succeeding in LinkedIn growth and personal branding in 2026:",
    "Here is the hard truth about succeeding in this industry in 2026:",
    "I've spent 8+ years building products, and this is the biggest mistake I see teams make: 🧵",
    "90% of SaaS companies are failing at product strategy right now.",
    "Unpopular opinion: writing tickets is only 10% of a Product Manager's job.",
    "How we grew our active users by 40% in less than 6 months (the exact breakdown):",
    "Here is the hard truth about B2B SaaS product development:"
  ];

  // Remove old hooks from the start
  let hookRemoved = true;
  while (hookRemoved) {
    hookRemoved = false;
    for (const hook of knownHooks) {
      if (cleaned.startsWith(hook)) {
        cleaned = cleaned.substring(hook.length).trim();
        hookRemoved = true;
      }
    }
  }

  return cleaned.trim();
}

function cleanOldCtas(content: string): string {
  let cleaned = content.trim();

  // List of all generated CTAs to check at end
  const knownCtas = [
    "What's the single biggest challenge you face when writing LinkedIn content? Let's discuss in the comments below! If you found this useful, feel free to Repost ♻️",
    "Are you preparing for DP-600, DP-700, or DP-800? Which strategy will you try first?\n\n💬 Drop your target certification in the comments and let's discuss!",
    "Are you preparing for DP-600, DP-700, or DP-800? Which strategy will you try first?\n💬 Drop your target certification in the comments and let's discuss!",
    "What's your #1 playbook for scaling B2B SaaS? Let's discuss in the comments below! If you found this useful, feel free to Repost ♻️",
    "How do you balance strategic roadmapping with execution? Let's discuss in the comments! 👇",
    "How are you using AI in your daily dev workflow? Let's share tips in the comments! 👇",
    "What is your take on this? Are you seeing a similar trend in your industry?\n\n💬 Drop your thoughts in the comments below!",
    "If you found this useful, feel free to Repost ♻️ to help others in your network!",
    "I dive deeper into B2B growth models in my weekly newsletter. Link to subscribe is in the first comment! 👇",
    "Which of these strategies will you try first? Let's discuss in the comments.",
    "What's your take on this? Are you seeing a similar trend in your industry?\n💬 Drop your thoughts in the comments below!"
  ];

  // Remove old CTAs from the end
  let ctaRemoved = true;
  while (ctaRemoved) {
    ctaRemoved = false;
    for (const cta of knownCtas) {
      if (cleaned.endsWith(cta)) {
        cleaned = cleaned.substring(0, cleaned.length - cta.length).trim();
        ctaRemoved = true;
      }
      
      // Look for partial CTA match (e.g. if formatting changed it slightly)
      const partialCta = cta.substring(0, 65);
      const lastIndex = cleaned.lastIndexOf(partialCta);
      if (lastIndex !== -1 && lastIndex > cleaned.length - 250) {
        cleaned = cleaned.substring(0, lastIndex).trim();
        ctaRemoved = true;
      }
    }

    // Strip trailing separator remnants (e.g., --- or 🚀 --)
    const separators = ["---", "🚀 --", "--", "🚀 ---"];
    for (const sep of separators) {
      if (cleaned.endsWith(sep)) {
        cleaned = cleaned.substring(0, cleaned.length - sep.length).trim();
        ctaRemoved = true;
      }
    }
  }

  return cleaned.trim();
}

export function autoFixPost(content: string, type: 'hook' | 'cta' | 'format'): string {
  // Only clean the specific auto-fix type to allow compounding fixes
  let cleanContent = "";
  if (type === 'hook') {
    cleanContent = cleanOldHooks(content);
  } else if (type === 'cta') {
    cleanContent = cleanOldCtas(content);
  } else {
    cleanContent = content; // do not remove hook or CTA when just formatting spacing
  }

  const lowerContent = cleanContent.toLowerCase();
  
  if (!cleanContent.trim()) return content;

  // Extract core keywords from content to customize fallback templates
  let topicPhrase = "this industry";
  if (lowerContent.includes("linkedin") || lowerContent.includes("personal brand") || lowerContent.includes("creator") || lowerContent.includes("postiq") || lowerContent.includes("outreach") || lowerContent.includes("audience")) {
    topicPhrase = "LinkedIn growth and personal branding";
  } else if (lowerContent.includes("fabric") || lowerContent.includes("dp-600") || lowerContent.includes("power bi")) {
    topicPhrase = "Microsoft Fabric certifications & exams";
  } else if (lowerContent.includes("saas") || lowerContent.includes("growth") || lowerContent.includes("b2b")) {
    topicPhrase = "B2B SaaS growth models";
  } else if (lowerContent.includes("product manager") || lowerContent.includes("product strategy") || lowerContent.includes("roadmap")) {
    topicPhrase = "product management and strategy";
  } else if (lowerContent.includes("ai") || lowerContent.includes("llm") || lowerContent.includes("prompt")) {
    topicPhrase = "AI integration and dev workflows";
  } else if (lowerContent.includes("career") || lowerContent.includes("job") || lowerContent.includes("resume")) {
    topicPhrase = "career growth and personal branding";
  }

  if (type === 'hook') {
    let hook = "";
    
    // Check specific topics
    if (lowerContent.includes("linkedin") || lowerContent.includes("personal brand") || lowerContent.includes("creator") || lowerContent.includes("postiq")) {
      hook = "90% of creators fail to grow on LinkedIn because they miss this simple system:";
    } else if (lowerContent.includes("fabric") || lowerContent.includes("dp-600") || lowerContent.includes("dp-700") || lowerContent.includes("power bi")) {
      hook = "If you are planning to target Microsoft Fabric Certifications (DP-600 / DP-700 / DP-800), read this first: 🧵";
    } else if (lowerContent.includes("saas") || lowerContent.includes("growth")) {
      hook = "90% of B2B SaaS startups fail at growth because they overlook this one simple system:";
    } else if (lowerContent.includes("product manager") || lowerContent.includes("product strategy")) {
      hook = "Unpopular opinion: 90% of a Product Manager's success is determined before writing a single ticket.";
    } else if (lowerContent.includes("ai") || lowerContent.includes("llm")) {
      hook = "AI isn't replacing developers. Developers who master prompt workflows are replacing developers who don't.";
    } else {
      // Fallback topic phrase hook
      hook = `Here is the hard truth about succeeding in ${topicPhrase} in 2026:`;
    }
    
    // We split by paragraph (double newline) to keep list items within paragraph single-spaced
    const paragraphs = cleanContent.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    if (paragraphs.length > 0) {
      if (paragraphs[0].length < 50) {
        paragraphs[0] = hook;
      } else {
        paragraphs.unshift(hook);
      }
      return paragraphs.join('\n\n');
    }
    return hook + "\n\n" + cleanContent;
  }

  if (type === 'cta') {
    let cta = "";
    
    if (lowerContent.includes("linkedin") || lowerContent.includes("personal brand") || lowerContent.includes("creator") || lowerContent.includes("postiq")) {
      cta = "What's the single biggest challenge you face when writing LinkedIn content? Let's discuss in the comments below! If you found this useful, feel free to Repost ♻️";
    } else if (lowerContent.includes("fabric") || lowerContent.includes("dp-600") || lowerContent.includes("dp-700") || lowerContent.includes("certification")) {
      cta = "Are you preparing for DP-600, DP-700, or DP-800? Which strategy will you try first?\n\n💬 Drop your target certification in the comments and let's discuss!";
    } else if (lowerContent.includes("saas") || lowerContent.includes("growth") || lowerContent.includes("b2b")) {
      cta = "What's your #1 playbook for scaling B2B SaaS? Let's discuss in the comments below! If you found this useful, feel free to Repost ♻️";
    } else if (lowerContent.includes("product manager") || lowerContent.includes("product strategy")) {
      cta = "How do you balance strategic roadmapping with execution? Let's discuss in the comments! 👇";
    } else if (lowerContent.includes("ai") || lowerContent.includes("llm")) {
      cta = "How are you using AI in your daily dev workflow? Let's share tips in the comments! 👇";
    } else {
      cta = `What is your take on ${topicPhrase}? Let's discuss in the comments below! If you found this helpful, feel free to Repost ♻️`;
    }
    return cleanContent + "\n\n---\n\n" + cta;
  }

  if (type === 'format') {
    // Split into all non-empty lines
    const lines = cleanContent.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return cleanContent;

    const output: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      // Convert standard bullet markers like - or * to 🚀 if not already done
      const isHorizontalRule = /^[*-]{3,}$/.test(line);
      if ((line.startsWith('-') || line.startsWith('*')) && !isHorizontalRule) {
        line = "🚀 " + line.substring(1).trim();
      }
      
      output.push(line);
      
      if (i < lines.length - 1) {
        const nextLine = lines[i + 1];
        
        // Check if current or next line is a bullet / list item
        const currentIsBullet = /^([🚀\-*•+✓✔▪▫–—○●◽◾]|\d+\.)/u.test(line);
        const nextIsBullet = /^([🚀\-*•+✓✔▪▫–—○●◽◾]|\d+\.)/u.test(nextLine);
        const currentIsHeader = line.endsWith(':');
        
        let keepSingleSpaced = false;
        
        // Keep single spaced if:
        // 1. Both lines are bullet list items
        if (currentIsBullet && nextIsBullet) {
          keepSingleSpaced = true;
        }
        // 2. Current line is a list introduction (ends with :) and next line is a bullet
        if (currentIsHeader && nextIsBullet) {
          keepSingleSpaced = true;
        }
        
        if (!keepSingleSpaced) {
          output.push(""); // Insert double space
        }
      }
    }
    
    return output.join('\n');
  }

  return content;
}
