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
      timestamp: new Date().toISOString()
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
  if (spacingRatio > 0.05 && spacingRatio < 0.2) formattingScore += 40; // good paragraph breaks
  
  // Lists check (bullet points, emojis as bullets, numbers)
  const listRegex = /^([\s]*[-*•+✓👉🚀📍1-9]\s)/m;
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
    timestamp: new Date().toISOString()
  };
}

function cleanOldAutoFixes(content: string): string {
  let cleaned = content.trim();

  // List of all generated hooks to check at start
  const knownHooks = [
    "If you are planning to target Microsoft Fabric Certifications (DP-600 / DP-700 / DP-800), read this first: 🧵",
    "90% of B2B SaaS startups fail at growth because they overlook this one simple system:",
    "Unpopular opinion: 90% of a Product Manager's success is determined before writing a single ticket.",
    "AI isn't replacing developers. Developers who master prompt workflows are replacing developers who don't.",
    "Here is the hard truth about succeeding in Microsoft Fabric certifications & exams in 2026:",
    "Here is the hard truth about succeeding in B2B SaaS growth models in 2026:",
    "Here is the hard truth about succeeding in product management and strategy in 2026:",
    "Here is the hard truth about succeeding in AI integration and dev workflows in 2026:",
    "Here is the hard truth about succeeding in career growth and personal branding in 2026:",
    "Here is the hard truth about succeeding in this industry in 2026:",
    "I've spent 8+ years building products, and this is the biggest mistake I see teams make: 🧵",
    "90% of SaaS companies are failing at product strategy right now.",
    "Unpopular opinion: writing tickets is only 10% of a Product Manager's job.",
    "How we grew our active users by 40% in less than 6 months (the exact breakdown):",
    "Here is the hard truth about B2B SaaS product development:"
  ];

  // List of all generated CTAs to check at end
  const knownCtas = [
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

  // 1. Remove old hooks from the start
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

  // 2. Remove old CTAs from the end
  let ctaRemoved = true;
  while (ctaRemoved) {
    ctaRemoved = false;
    for (const cta of knownCtas) {
      if (cleaned.endsWith(cta)) {
        cleaned = cleaned.substring(0, cleaned.length - cta.length).trim();
        ctaRemoved = true;
      }
      
      // Look for partial CTA match (e.g. if formatting changed it slightly)
      const partialCta = cta.substring(0, 40);
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
  // Always clean up previous generated hooks and CTAs first
  const cleanContent = cleanOldAutoFixes(content);
  const lowerContent = cleanContent.toLowerCase();
  const lines = cleanContent.split('\n').map(l => l.trim()).filter(Boolean);
  
  if (lines.length === 0) return content;

  // Extract core keywords from content to customize fallback templates
  let topicPhrase = "this industry";
  if (lowerContent.includes("fabric") || lowerContent.includes("dp-600") || lowerContent.includes("power bi")) {
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
    if (lowerContent.includes("fabric") || lowerContent.includes("dp-600") || lowerContent.includes("dp-700") || lowerContent.includes("power bi")) {
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
    
    // Prepend or replace first line if it's too short
    if (lines[0].length < 50) {
      lines[0] = hook;
    } else {
      lines.unshift(hook);
    }
    return lines.join('\n\n');
  }

  if (type === 'cta') {
    let cta = "";
    
    if (lowerContent.includes("fabric") || lowerContent.includes("dp-600") || lowerContent.includes("dp-700") || lowerContent.includes("certification")) {
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
    // Add visual formatting by splitting paragraphs and adding emojis to bullet lines
    const formattedLines = lines.map(line => {
      // Check if it's a markdown horizontal rule (like --- or ***)
      const isHorizontalRule = /^[*-]{3,}$/.test(line);
      
      // If line looks like a bullet item but has no emoji, add one (ensure it's not a horizontal rule)
      if ((line.startsWith('-') || line.startsWith('*')) && !isHorizontalRule) {
        return "🚀 " + line.substring(1).trim();
      }
      return line;
    });
    // Join with double carriage returns for LinkedIn styling
    return formattedLines.join('\n\n');
  }

  return content;
}
