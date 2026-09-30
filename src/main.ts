import * as dotenv from 'dotenv';
import { CodeReviewOrchestrator } from './orchestrator.js';
import { ReportGenerator } from './utils/report-generator.js';
import { promises as fs } from 'fs';
import path from 'path';
import { ostring } from 'zod';
// Load environment variables
dotenv.config();

/**
 * Main entry point for the Claude Multi-Agent Code Review System
 * Usage: npm run dev <owner> <repo> <pr-number>
 */
async function main() {
  const [owner, repo, prStr] = process.argv.slice(2);
  if (!owner || !repo || !prStr) {
    console.error('Usage: npm run dev <owner> <repo> <pr-number>');
    process.exit(1);
  }

  const prNumber = Number(prStr);

  if (!Number.isInteger(prNumber) || prNumber <= 0) {
    console.error('PR number must be a positive integer.');
    process.exit(1);
  }

  const hasAnthropicAuth = Boolean(process.env.ANTHROPIC_API_KEY);
  const hasBedrockAuth = Boolean(process.env.AWS_ACCESS_KEY_ID) && Boolean(process.env.AWS_SECRET_ACCESS_KEY);

  if (!hasAnthropicAuth && ! hasBedrockAuth) {
    console.error(
      'Authentication required: set ANTHROPIC_API_KEY or AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY.'
    );
    process.exit(1);
  }

  const model = process.env.ANTHROPIC_MODEL;

  if (!model) {
    console.error('ANTHROPIC_MODEL environment variable is required.');
    process.exit(1);
  } 

  if (hasBedrockAuth) {
    if (!process.env.AWS_REGION) {
      console.error('AWS_REGION is required when using Bedrock authentication.');
      process.exit(1);
    }
    console.log('Using AWS Bedrock authentication');
  } else {
    console.log('Using Anthropic API authentication');
  }
   // TO
  // DO: Validate command line arguments
  // - Check if owner, repo, and prStr are provided
  // - Convert prStr to number and validate it's a valid integer
  // - Exit with error message if validation fails

  // TODO: Validate authentication (choose ONE method)
  // Students must have either:
  //   - ANTHROPIC_API_KEY environment variable, OR
  //   - AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY for Bedrock
  //
  // If using AWS Bedrock:
  //   - Verify AWS_REGION is set
  //   - Log: "🔐 Using AWS Bedrock authentication"
  // If using Anthropic API:
  //   - Log: "🔐 Using Anthropic API authentication"
  // If neither method is configured:
  //   - Exit with clear error message showing both options

  // TODO: Validate ANTHROPIC_MODEL environment variable
  // This is REQUIRED for both authentication methods
  // - For AWS Bedrock: us.anthropic.claude-sonnet-4-5-20250929-v1:0
  // - For Anthropic API: claude-sonnet-4-5-20250929
  // Exit with error if not set

  console.log('start here', owner, repo, prStr)
  try {
    const orchestrator = new CodeReviewOrchestrator({ model });
    const report = await orchestrator.reviewPullRequest(owner, repo, prNumber);
    const generator = new ReportGenerator();
    await fs.mkdir('reports', { recursive: true });
    const markdown = generator.generateMarkdownReport(report);
    const html = generator.generateHTMLReport(report);
    const json = generator.generateJSONReport(report);
    await fs.writeFile(path.join('reports', `${owner}-${repo}-pr-${prNumber}.md`), markdown);
    await fs.writeFile(path.join('reports', `${owner}-${repo}-pr-${prNumber}.html`), html);
    await fs.writeFile(path.join('reports', `${owner}-${repo}-pr-${prNumber}.json`), json);
    // TODO: Create orchestrator instance
    // TODO: Call .reviewPullRequest(owner, repo, prNumber);
    // TODO: Generate formatted reports using ReportGenerator
    // Hint: Use ReportGenerator to create Markdown, HTML, and JSON reports
    // Save reports to 'reports/' directory with appropriate filenames
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
