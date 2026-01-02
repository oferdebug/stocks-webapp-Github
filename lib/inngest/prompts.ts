export const PERSONALIZED_WELCOME_EMAIL_PROMPT = `Generate a personalized welcome paragraph for a new user.

User profile:
{{userProfile}}

CONTEXT:
This paragraph appears AFTER "Welcome aboard [name]" and BEFORE a static section that says "Here's what you can do right now:" with action items. Your content must flow naturally between these elements.

WRITING REQUIREMENTS:
1. Write 2-3 sentences (40-60 words total)
2. Do NOT start with "Welcome" - use alternatives like:
   - "Perfect timing!"
   - "Great to have you!"
   - "You're all set!"
   - "Thanks for joining NextTrade!"

3. MUST reference at least 2 of these from their profile:
   - Their investment goals
   - Their risk tolerance level (conservative/moderate/aggressive)
   - Their preferred industry/sector
   - Their country/region

4. End the paragraph in a way that leads naturally into "Here's what you can do right now:"

TONE:
- Warm and welcoming
- Confident but not pushy
- Show you understand THEIR specific situation

FORMATTING:
- Return ONLY plain text (no HTML tags)
- No markdown, no code blocks, no backticks
- Just the paragraph text itself

GOOD EXAMPLES:

For aggressive tech investor:
"Perfect timing! With your high risk tolerance and focus on technology growth, our platform is ideal for spotting the next big thing. We're excited to help you capitalize on these dynamic market opportunities."

For conservative retirement planner:
"Great to have you! Your conservative approach to retirement planning is smart — we'll help you track stable dividend stocks and make informed decisions without the noise. Building long-term wealth starts with the right tools."

For new investor in healthcare:
"Thanks for joining NextTrade! As you begin your investment journey with a focus on healthcare stocks, we've got the perfect tools to help you learn and grow. Our easy-to-use alerts will keep you informed without overwhelming you."

NOW generate a personalized paragraph for the user profile above.`;

export const NEWS_SUMMARY_EMAIL_PROMPT = `Generate HTML content for a market news summary email that will be inserted into the NEWS_SUMMARY_EMAIL_TEMPLATE at the {{newsContent}} placeholder.

News data to summarize:
{{newsData}}

CRITICAL FORMATTING REQUIREMENTS:
- Return ONLY clean HTML content with NO markdown, NO code blocks, NO backticks
- Structure content with clear sections using proper HTML headings and paragraphs
- Use these specific CSS classes and styles to match the email template:

SECTION HEADINGS (for categories like "Market Highlights", "Top Movers", etc.):
<h3 class="mobile-news-title dark-text" style="margin: 30px 0 15px 0; font-size: 18px; font-weight: 600; color: #f8f9fa; line-height: 1.3;">Section Title</h3>

PARAGRAPHS (for news content):
<p class="mobile-text dark-text-secondary" style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">Content goes here</p>

STOCK/COMPANY MENTIONS:
<strong style="color: #34d399;">Stock Symbol</strong> for ticker symbols
<strong style="color: #CCDADC;">Company Name</strong> for company names

PERFORMANCE INDICATORS:
Use 📈 for gains, 📉 for losses, 📊 for neutral/mixed

NEWS ARTICLE STRUCTURE:
For each individual news item within a section, use this structure:
1. Article container with visual styling and icon
2. Article title as a subheading
3. Key takeaways in bullet points (2-3 actionable insights)
4. "What this means" section for context
5. "Read more" link to the original article
6. Visual divider between articles

ARTICLE CONTAINER:
<div class="dark-info-box" style="background-color: #212328; padding: 24px; margin: 20px 0; border-radius: 8px;">

ARTICLE TITLES:
<h4 class="dark-text" style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #FFFFFF; line-height: 1.4;">
Article Title Here
</h4>

BULLET POINTS (minimum 3 concise insights):
<ul style="margin: 16px 0 20px 0; padding-left: 0; margin-left: 0; list-style: none;">
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; padding: 0; margin-left: 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #34d399; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>Clear, concise explanation in simple terms.
  </li>
</ul>

INSIGHT SECTION:
<div style="background-color: #141414; border: 1px solid #374151; padding: 15px; border-radius: 6px; margin: 16px 0;">
<p class="dark-text-secondary" style="margin: 0; font-size: 14px; color: #CCDADC; line-height: 1.4;">💡 <strong style="color: #FDD458;">Bottom Line:</strong> Simple explanation of why this matters.</p>
</div>

READ MORE BUTTON:
<div style="margin: 20px 0 0 0;">
<a href="ARTICLE_URL" style="color: #34d399; text-decoration: none; font-weight: 500; font-size: 14px;" target="_blank" rel="noopener noreferrer">Read Full Story →</a>
</div>

Content guidelines:
- Use PLAIN ENGLISH for regular people
- Use 📈/📉/📊 icons correctly
- Focus on practical, actionable insights
- Prioritize brevity and scannability`;