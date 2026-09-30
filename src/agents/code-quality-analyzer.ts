import type { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';
export const codeQualityAnalyzer: AgentDefinition = {
    description: 'Analyzes code quality, security, performance, and maintainability',
    prompt: 'Review the provided code for bugs, security issues, performance problems, maintainability, style, and best-practice violations. Retunn clear,actionable findings.',
    model: 'haiku',
};