# Claude Code Subagent System: Comprehensive Guide

**Last Updated:** December 21, 2025
**Version:** 1.0
**Target Audience:** Developers using Claude Code

---

## Table of Contents

1. [Introduction](#introduction)
2. [What is the Task Tool?](#what-is-the-task-tool)
3. [Available Subagent Types](#available-subagent-types)
4. [When to Use Subagents](#when-to-use-subagents)
5. [How to Invoke Subagents](#how-to-invoke-subagents)
6. [Subagent Architecture & Mechanics](#subagent-architecture--mechanics)
7. [Best Practices & Usage Patterns](#best-practices--usage-patterns)
8. [Common Mistakes to Avoid](#common-mistakes-to-avoid)
9. [Performance Considerations](#performance-considerations)
10. [Creating Custom Subagents](#creating-custom-subagents)
11. [Quick Reference](#quick-reference)

---

## Introduction

The Claude Code subagent system enables efficient delegation of complex tasks to specialized AI agents. This guide provides comprehensive documentation on how to effectively use subagents to improve productivity, manage context, and parallelize work.

### Key Benefits

- **Context Isolation**: Each subagent operates in its own 200k token context window
- **Parallel Execution**: Run up to 10 concurrent tasks simultaneously
- **Specialization**: Create domain-specific agents with tailored capabilities
- **Context Preservation**: Prevent context pollution in the main conversation
- **Performance**: Execute multiple investigations or analyses in parallel

---

## What is the Task Tool?

The **Task tool** is Claude Code's primary mechanism for delegating work to specialized subagents.

### Key Characteristics

| Feature | Description |
|---------|-------------|
| **Purpose** | Delegate work to specialized lightweight AI agents |
| **Context Window** | 200k tokens per subagent (isolated from main agent) |
| **Concurrency** | Up to 10 simultaneous tasks with automatic queuing |
| **Entry Cost** | ~20,000 tokens overhead per subagent invocation |
| **Communication** | One-way: subagent returns results to main agent |
| **State** | Stateless - each invocation starts fresh |

### How It Works

```
Main Agent (Your Conversation)
    │
    ├─── Task 1 → Subagent (200k context) → Returns Summary
    ├─── Task 2 → Subagent (200k context) → Returns Summary
    ├─── Task 3 → Subagent (200k context) → Returns Summary
    └─── ...up to 10 concurrent tasks
```

---

## Available Subagent Types

### Built-in Subagents

#### 1. Explore Subagent

**Purpose:** Search and understand codebases without making changes

**Capabilities:**
- Read-only operations (ls, git status, git log, git diff, find, cat)
- Tools: Glob, Grep, Read, Bash (read-only)
- Model: Haiku (token-efficient specialist)

**Thoroughness Levels:**
- **Quick**: Fast searches for targeted lookups
- **Medium**: Balanced exploration for moderate investigations
- **Very thorough**: Comprehensive analysis across multiple locations

**Example Use Cases:**
```
- Finding all files matching a specific pattern
- Understanding code structure across multiple modules
- Locating function definitions and usages
- Checking git history and commit diffs
- Quick codebase reconnaissance
```

**When to Use:**
- Exploring unfamiliar codebases
- Searching for specific patterns across many files
- Understanding architecture without modifying code
- Preventing context bloat from extensive file reading

#### 2. Plan Subagent

**Purpose:** Used automatically in Plan Mode for codebase research

**Capabilities:**
- Activated when Claude enters Plan Mode
- Prevents infinite nesting while gathering context
- Similar to Explore but used specifically for planning

**Note:** Typically invoked automatically; not for manual use

#### 3. General-Purpose Subagent

**Purpose:** Multi-step tasks requiring full tool access

**Capabilities:**
- Access to all tools (Read, Write, Edit, Bash, etc.)
- Can perform code modifications
- Suitable for complex, multi-step implementations

**When to Use:**
- Complex refactoring tasks
- Multi-file modifications
- Implementation of new features
- When you need write access

### Custom Subagents

You can create specialized subagents for:

- **Code Review**: Quality, security, and maintainability analysis
- **Test Writing**: Generating comprehensive test suites
- **Documentation**: Creating/updating project documentation
- **Security Audits**: Vulnerability scanning and analysis
- **Performance Analysis**: Identifying bottlenecks and optimizations
- **Architecture Validation**: Ensuring design patterns are followed
- **DevOps Automation**: Deployment and CI/CD tasks

---

## When to Use Subagents

### Decision Framework

#### ✅ Use Subagents When:

- **Parallel Execution Needed**: Analyzing different modules simultaneously
- **Context Isolation Required**: Preventing heavy investigations from polluting main conversation
- **Specialized Tool Access**: Need specific permissions for certain operations
- **Multi-step Tasks**: Complex operations requiring multiple decision points
- **Large-scale Exploration**: Searching across many files/directories
- **Independent Investigations**: Tasks that don't require holistic context

#### ❌ Don't Use Subagents When:

- **Simple Tasks**: Single-step operations (use main agent)
- **Holistic Reasoning Required**: Cross-system understanding needed
- **Incremental Steps Needed**: Observable, step-by-step progress required
- **Context Continuity Critical**: Subagent needs to remember previous work
- **Token Cost Outweighs Benefit**: Simple tasks don't justify 20k overhead

### Subagents vs Other Features

| Feature | Use When | Don't Use When |
|---------|----------|----------------|
| **Subagents** | Need isolated execution, parallel work, specialized permissions | Simple tasks, holistic reasoning needed |
| **Skills** | Reusable expertise across projects, automatic activation | Need execution isolation, task-specific work |
| **Commands** | Manual control, project shortcuts, deterministic workflows | Need automatic activation |
| **Main Agent** | Cross-system understanding, holistic reasoning, incremental work | Heavy exploration causing context bloat |

---

## How to Invoke Subagents

### 1. Natural Language Invocation (Recommended)

Claude automatically invokes subagents based on task descriptions:

```
"Use the Explore subagent to find all database query locations"

"Delegate to the code-reviewer specialist to check for vulnerabilities"

"Use the test-writer agent to create tests for the authentication module"

"Explore the codebase with Very thorough thoroughness to understand
the API routing structure"
```

### 2. Parallel Execution

Explicitly request parallel execution for multiple tasks:

```
"Explore the codebase using 4 tasks in parallel. Each agent should explore:
- Task 1: Authentication module
- Task 2: API routes
- Task 3: Database schemas
- Task 4: Utility functions"

"Run these 50 tests in parallel"

"Analyze these 8 components simultaneously for performance issues"
```

**Best Practice:** Don't specify parallelism limits - let Claude auto-manage the queue for optimal efficiency.

### 3. Programmatic Invocation (SDK)

When using the Claude Agent SDK:

```typescript
const result = await agent.task({
  subagent_type: 'Explore',
  description: 'Find all API endpoints',
  prompt: 'Search the codebase for all Express route definitions',
  model: 'haiku' // Optional: specify model
});
```

---

## Subagent Architecture & Mechanics

### Stateless Design

**Key Points:**
- Each invocation starts with a clean slate
- No persistent memory across invocations
- Cannot share state with other subagents
- Must explicitly pass context between calls

**Implications:**
```
✅ CORRECT:
Task 1: Search for auth functions → Returns list
Main Agent: Stores list, passes to Task 2
Task 2: Analyze functions from provided list

❌ INCORRECT:
Task 1: Search for auth functions
Task 2: Analyze the functions you found
         ↑ Task 2 doesn't know what Task 1 found!
```

### Context Access

**What Subagents Receive:**
- The specific task/prompt you provide
- File paths you explicitly reference
- Code snippets you include
- Context you pass in the prompt

**What Subagents Don't Receive:**
- Previous conversation history from main agent
- Context accumulated in main conversation
- Information from other running subagents
- Shared state or global variables

### Communication Patterns

#### Pattern 1: Summary Return (Default)
```
Main Agent → Subagent executes → Returns summary → Main Agent continues
```

**Limitation:** May lose critical details in summarization

#### Pattern 2: File-Based Communication (Recommended for Critical Data)
```
Subagent writes results.json → Next task reads results.json → Processes data
```

**Advantages:**
- Preserves all details
- Enables structured handoffs
- Supports JSON for programmatic processing
- More reliable for sequential workflows

### Limitations

**Subagents Cannot:**
- Spawn other subagents (prevents infinite nesting)
- Maintain state between invocations
- Communicate directly with other subagents
- Access main conversation history
- Begin with planning phase (execute immediately)

---

## Best Practices & Usage Patterns

### Pattern 1: Parallel Code Exploration

**Scenario:** Understanding multiple codebase areas quickly

```
Use the Explore subagent to search 4 directories in parallel:
1. Authentication module (src/auth/)
2. API routes (src/routes/)
3. Database schemas (src/models/)
4. Utility functions (src/utils/)

Each should use "Medium" thoroughness and return:
- File structure overview
- Key functions and their purposes
- Dependencies and imports
```

**Benefits:**
- 4x faster than sequential exploration
- Prevents context pollution
- Parallel execution efficiency

### Pattern 2: Focused Investigation

**Scenario:** Deep dive into specific aspect without bloating context

```
Use the Explore subagent with Very thorough thoroughness to:
1. Find all database query locations
2. Identify all API endpoints touching user data
3. List all authentication middleware

Return a structured JSON with:
{
  "queries": [{file, line, query}],
  "endpoints": [{path, method, handler}],
  "middleware": [{name, file, purpose}]
}
```

**Benefits:**
- Clean, structured results
- Main agent stays focused
- No context bloat

### Pattern 3: Master-Clone Architecture (Recommended)

**Approach:**
1. Put all key context in `CLAUDE.md`
2. Let main agent decide when to delegate
3. Use Task/Explore features for self-directed orchestration
4. Main agent maintains holistic awareness

**Benefits:**
- Agent maintains full reasoning capability
- No context gatekeeping
- More reliable and adaptable
- Better overall results

### Pattern 4: Sequential Task Chain with File Handoff

**Scenario:** Multi-step analysis requiring data persistence

```
Step 1 (Explore):
Find all React components using useState
→ Write findings to /tmp/components.json

Step 2 (Analyze):
Read /tmp/components.json
→ Analyze state management patterns
→ Write recommendations to /tmp/recommendations.md

Step 3 (Main Agent):
Read /tmp/recommendations.md
→ Present to user with explanations
```

**Benefits:**
- No data loss in summarization
- Clear handoff between stages
- Preserves all analysis details

---

## Common Mistakes to Avoid

### 1. Context Gatekeeping ❌

**Problem:** Creating specialized subagents that hide context from main agent

```yaml
❌ BAD:
---
name: "File Validator"
description: "Validates all file changes. Must be used before any commits."
---
```

**Result:** Main agent loses holistic reasoning ability and becomes dependent on subagents for basic validation

**Solution:** ✅ Provide context in CLAUDE.md; let main agent orchestrate

---

### 2. Token Abuse Through Over-Chaining ❌

**Problem:** Chaining multiple subagent invocations unnecessarily

```
❌ BAD:
Task 1 (20k overhead): Find files
Task 2 (20k overhead): Read files
Task 3 (20k overhead): Analyze files
Task 4 (20k overhead): Generate report
Total overhead: 80,000 tokens!
```

**Solution:** ✅ Use parallel execution or let main agent handle sequential steps

---

### 3. Over-Specialization ❌

**Problem:** Creating too many highly specialized subagents

```
❌ BAD:
- react-component-validator
- typescript-type-checker
- css-linter
- import-sorter
- comment-validator
...50+ specialized agents
```

**Result:** Brittle, hard to maintain, less effective than well-informed main agent

**Solution:** ✅ Start with Skills; upgrade to subagents only when you need true isolation

---

### 4. Losing Critical Details in Summarization ❌

**Problem:** Relying on summary when details matter

```
❌ BAD:
"Use subagent to find all security vulnerabilities"
→ Returns: "Found 23 issues in various files"
→ Main agent lacks details to fix them!
```

**Solution:** ✅ Request structured output written to a file

```
✅ GOOD:
"Use subagent to find all security vulnerabilities and write
detailed findings to /tmp/security-audit.json with:
{
  "vulnerabilities": [
    {"file": "...", "line": ..., "type": "...", "severity": "...",
     "description": "...", "fix": "..."}
  ]
}"
```

---

### 5. Assuming Persistent State ❌

**Problem:** Expecting subagents to remember previous work

```
❌ BAD:
Task 1: "Find all API routes"
Task 2: "Now analyze the routes you found"
         ↑ Task 2 has no memory of Task 1!
```

**Solution:** ✅ Explicitly pass context

```
✅ GOOD:
Task 1: "Find all API routes and write to /tmp/routes.json"
Main Agent: Reads /tmp/routes.json
Task 2: "Analyze these API routes: [paste routes from file]"
```

---

### 6. Unnecessary Parallelism Limits ❌

**Problem:** Setting explicit parallelism when not needed

```
❌ BAD:
"Run these 50 tasks with parallelism: 5"
→ Runs 5, waits for ALL to complete, then next 5
→ Batch waiting reduces efficiency
```

**Solution:** ✅ Let Claude manage the queue

```
✅ GOOD:
"Run these 50 tasks in parallel"
→ Runs 10 (max), pulls next as each completes
→ More efficient execution
```

---

## Performance Considerations

### Concurrency & Queueing

**Limits:**
- Maximum 10 concurrent tasks
- Automatic queuing for additional tasks
- Dynamic queue pulling (unless parallelism specified)

**Optimization Strategy:**

| Approach | Behavior | Efficiency |
|----------|----------|------------|
| ❌ `parallelism: 5` | Runs 5, waits for all, runs next 5 | Lower |
| ✅ "run in parallel" | Runs 10, pulls next as each completes | Higher |

### Token Costs

**Per-Task Overhead:**
- ~20,000 tokens for context loading
- Separate 200k context window per subagent

**Example:**
```
10 parallel tasks = 200,000 tokens overhead
+ Actual work performed
+ Results returned
```

**When Cost is Justified:**
- Exploring 10+ modules simultaneously (parallelism benefit)
- Preventing 50k+ tokens of context bloat (isolation benefit)
- Complex analysis requiring specialized tools (capability benefit)

**When Cost is Not Justified:**
- Simple grep/read operations (use main agent)
- Tasks adding <5k tokens to context
- Sequential tasks with dependencies

### Performance Best Practices

1. **Use Haiku for Exploration**: Faster and cheaper for read-only tasks
2. **Batch Similar Tasks**: Group related investigations
3. **Prefer Parallel Over Sequential**: When tasks are independent
4. **Use File-Based Communication**: For complex data handoffs
5. **Don't Over-Delegate**: Let main agent handle simple tasks

---

## Creating Custom Subagents

### File Structure

**Location Options:**
- `~/.claude/agents/` - Global agents (all projects)
- `.claude/agents/` - Project-specific agents

### Markdown Format

```markdown
---
name: "Code Review Specialist"
description: "Expert code review specialist. Use for quality, security, and maintainability reviews."
tools:
  - Read
  - Grep
  - Glob
model: "sonnet"
permissionMode: "default"
---

# Code Review Specialist

You are an expert code reviewer with deep expertise in:
- Security vulnerabilities (OWASP Top 10)
- Performance optimization
- Code maintainability
- Best practices and design patterns

## Your Responsibilities

1. **Security Analysis**
   - Check for SQL injection, XSS, CSRF
   - Validate input sanitization
   - Review authentication and authorization

2. **Performance Review**
   - Identify N+1 queries
   - Check for unnecessary re-renders
   - Analyze algorithm complexity

3. **Code Quality**
   - Ensure consistent style
   - Validate error handling
   - Check for code duplication

4. **Best Practices**
   - Follow SOLID principles
   - Ensure proper separation of concerns
   - Validate testing coverage

## Output Format

Provide findings as structured JSON:

```json
{
  "summary": "...",
  "critical": [{issue, file, line, fix}],
  "warnings": [{issue, file, line, suggestion}],
  "recommendations": ["..."]
}
```
```

### Frontmatter Fields

| Field | Description | Example |
|-------|-------------|---------|
| `name` | Display name | "Code Review Specialist" |
| `description` | When to invoke (critical!) | "Use for code quality reviews" |
| `tools` | Available tools (optional) | `[Read, Grep, Glob]` |
| `model` | Claude model to use | `sonnet`, `haiku`, `opus` |
| `permissionMode` | Permission level | `default`, `restricted` |
| `skills` | Associated skills | `[code-review, security]` |

### Example: Test Writer Subagent

```markdown
---
name: "Test Generator"
description: "Generates comprehensive test suites. Use when you need tests written for new features."
tools:
  - Read
  - Glob
  - Write
model: "haiku"
---

# Test Generator

Generate comprehensive, well-structured tests using the project's testing framework.

## Testing Principles

1. Cover happy paths and edge cases
2. Use descriptive test names
3. Follow AAA pattern (Arrange, Act, Assert)
4. Mock external dependencies
5. Ensure tests are isolated and repeatable

## Test Structure

```javascript
describe('FeatureName', () => {
  describe('methodName', () => {
    it('should handle normal case', () => {
      // Arrange
      // Act
      // Assert
    });

    it('should handle edge case', () => {
      // ...
    });

    it('should throw error when invalid', () => {
      // ...
    });
  });
});
```

## Coverage Requirements

- Minimum 80% code coverage
- All public methods tested
- Error conditions validated
- Integration tests for critical paths
```

---

## Quick Reference

### Common Commands

```bash
# Explore codebase in parallel
"Use Explore subagent to search 5 modules in parallel"

# Focused investigation
"Use Explore with Very thorough thoroughness to find all database queries"

# Custom subagent invocation
"Use the code-reviewer subagent to analyze my recent changes"

# Parallel execution
"Run these 20 tests in parallel"

# File-based handoff
"Find all components and write results to /tmp/components.json"
```

### Decision Tree

```
Need to accomplish a task?
│
├─ Simple, single-step? → Use Main Agent
├─ Need holistic understanding? → Use Main Agent
├─ Reusable across projects? → Create Skill
├─ Manual control needed? → Create Command
└─ Complex, isolated, or parallel? → Use Subagent
   │
   ├─ Read-only exploration? → Explore Subagent (Haiku)
   ├─ Custom specialization? → Custom Subagent
   └─ Multi-step implementation? → General-Purpose Subagent
```

### Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Subagent forgot previous work | Stateless design | Pass context explicitly or use file-based storage |
| Lost details in summary | Summary compression | Request structured JSON output to file |
| High token usage | Over-delegation | Use main agent for simple tasks |
| Slow execution | Sequential instead of parallel | Request parallel execution |
| Context gatekeeping | Over-specialized subagents | Use CLAUDE.md + main agent orchestration |

---

## Additional Resources

### Official Documentation
- [Claude Code Subagents Documentation](https://code.claude.com/docs/en/sub-agents)
- [Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)

### Community Guides
- [ClaudeLog - Mechanics & Best Practices](https://claudelog.com/mechanics/task-agent-tools/)
- [Code Centre - Subagent Deep Dive](https://cuong.io/blog/2025/06/24-claude-code-subagent-deep-dive)
- [Medium - Practical Guide to Sub-agents](https://jewelhuq.medium.com/practical-guide-to-mastering-claude-codes-main-agent-and-sub-agents-fd52952dcf00)

### Advanced Topics
- [Multi-agent Parallel Coding Patterns](https://medium.com/@codecentrevibe/claude-code-multi-agent-parallel-coding-83271c4675fa)
- [Parallel Execution with Tembo](https://www.tembo.io/blog/how-to-run-claude-code-in-parallel)
- [Task Tool Performance Optimization](https://smartscope.blog/en/ai-development/claude-code-task-tool-performance-optimization-guide/)

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-21 | Initial comprehensive guide created |

---

## Contributing

Found an issue or have suggestions for improvement? Please update this document following the project's documentation conventions outlined in `CLAUDE.md`.

---

**Last Updated:** December 21, 2025
**Maintained By:** PrepAI Development Team
**License:** Internal Use Only
