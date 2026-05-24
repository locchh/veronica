# veronica

[aitmpl](https://www.aitmpl.com/) is great for enhancing [Claude Code](https://claude.com/product/claude-code), but plugins (skills, agents, hooks, MCP servers, LSP servers, etc.) accumulate over time. I think that in each phase of a project, we should have a set of plugins relevant to that phase only. The accumulated plugins can feel overwhelming. So, inspired by Veronica — a mobile service module deployed from a Stark Industries satellite — I created this project. The idea is that I can define armors of plugins for specific requirements, and when I need them, I can activate them. An armor is not only about coding but also about other tasks like research, writing, or sometimes just chatting.

<p align="center"><img src="assets/fecb89565fd7e35e76e9f4d29c5d7a25.gif" alt="veronica" /></p>
<p align="center"><em>"I'm calling in Veronica."</em></p>

## Setup

```bash
# 1. Install
curl -fsSL https://raw.githubusercontent.com/locchh/veronica/main/scripts/install.sh | bash

# 2. Kick off TUI
veronica

# 3. Select your armor

# 4. Done!
```

## Update

```bash
veronica --update
```

Pulls the latest code from GitHub and reinstalls dependencies.

## Related to

[What is Veronica](https://marvelcinematicuniverse.fandom.com/wiki/Veronica)

[AI Templates](https://www.aitmpl.com/)

[Explore the .claude directory](https://code.claude.com/docs/en/claude-directory)

[Claude Code Memory](https://code.claude.com/docs/en/memory)

[any-buddy](https://github.com/cpaczek/any-buddy)

[claude-desktop-buddy](https://github.com/anthropics/claude-desktop-buddy)