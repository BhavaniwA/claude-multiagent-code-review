import type { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';
export const codeQualityAnalyzer: AgentDefinition = {
    description: 'Analyzes code quality, security, performance, and maintainability',
    prompt: 'Use the Skill tool to load. claude/skills/javascript-best-practices/SKILL.md before analysis. Review the provided code for bugs, security issues, performance problems, maintainability, style, and best-practice violations. Return clear, actionable findings.',
    model: 'haiku',
    tools: ['Read', 'Grep', 'Glob', 'Skill', 'mcp__github'],
};