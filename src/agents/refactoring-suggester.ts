import type { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';
export const refactoringSuggester: AgentDefinition= {
    description: 'Recommends archetectural improvements and refactoring opportunities',
    prompt:'Use the Skill tool to load .claude/skills/javascript-best-practices/SKILL.md before analysis. Review the provided code and recommended architectural improvements, refactoring opportunities, and ways to improve code structure and maintainability.',
    model: 'haiku',
    tools:['Read', 'Grep', 'Glob', 'Skill', 'mcp__github'],
};