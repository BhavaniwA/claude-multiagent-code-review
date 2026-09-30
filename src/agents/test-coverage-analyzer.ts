import type { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';
export const testCoverageAnalyzer: AgentDefinition = {
    description: 'Analyzes test coverage and identifies untested code paths',
    prompt: 'Analyze test coverage and identify untested code paths',
};