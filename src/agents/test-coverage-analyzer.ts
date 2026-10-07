import type { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';
export const testCoverageAnalyzer: AgentDefinition = {
    description: 'Analyzes test coverage and identifies untested code paths',
    prompt: 'Use the Skill tool to load .claude/skills/javascript-best-practices/SKILL.md when reviewing JavaScript/TypeScript code. Analyze test coverage and identify untested code paths.',
    tools: ['Read', 'Grep', 'Glob', 'Skill', 'mcp__github'], 
    model: 'inherit',
};