import type { ReviewReport } from './types/report-types.js';
import { query } from '@anthropic-ai/claude-agent-sdk';
import { codeQualityAnalyzer, testCoverageAnalyzer, refactoringSuggester } from './agents/index.js';
import { ReviewReportSchema, ReviewReportJSONSchema } from './types/report-types.js';
import { buildOrchestratorPrompt } from './prompts/index.js';
import { mcpServersConfig } from './config/mcp.config.js';
import { copyFileSync } from 'fs';
import { logAgentStart } from './utils/logger';
import { ListChangedOptionsBaseSchema } from '@modelcontextprotocol/sdk/types.js';
export interface OrchestratorOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
}
export class CodeReviewOrchestrator {
  private options: OrchestratorOptions;
  constructor(options: OrchestratorOptions = {}) {
    this.options = options;
  }
  async reviewPullRequest(
    owner: string,
    repo: string,
    prNumber: number
  ): Promise<ReviewReport> {
    const prompt = buildOrchestratorPrompt + '\n\nReview GitHub pull request: ' + owner + '/' + repo + ' PR #' + prNumber + '. Use GitHub MCP and Task to run all three agents and return the complete ReviewReport.'
    const results = await query({
      prompt,
      options: {
        model: this.options.model ?? 'sonnet',
        allowedTools: ['Task', 'mcp__github'],
        agents: {
          codeQualityAnalyzer,
          testCoverageAnalyzer,
          refactoringSuggester,
        },
        mcpServers: mcpServersConfig, outputFormat: {
          type: 'json_schema',
          schema:
          ReviewReportJSONSchema,
        },
      },
    });
    let structuredOutput: unknown;
    for await (const message of results) {
      console.log('RESULT:', (message as any).subtype);
      console.log('STRUCTURED:',(message as any).structured_output);
      console.log('RESULT TEXT:', (message as any).result);
      console.log('ERRORS:', (message as any).errors);
      if (message.type === 'result' && 'subtype' in message && message.subtype === 'success') {
        structuredOutput = message.structured_output;
      }
    }
    return ReviewReportSchema.parse(structuredOutput);
  }
}