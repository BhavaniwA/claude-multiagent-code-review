import type { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';
export const refactoringSuggester: AgentDefinition= {
    description: 'Recommends archetectural improvements and refactoring opportunities',
    prompt:'Review the provided code and recommended architectural improvements, refactoring opportunities, and ways to improve code structure and maintainability.',
    model: 'haiku',
};