#!/usr/bin/env bash
# Veronica installer
# Usage: curl -fsSL https://raw.githubusercontent.com/locchh/veronica/main/scripts/install.sh | bash

set -euo pipefail

INSTALL_DIR="${VERONICA_DIR:-$HOME/.veronica}"
BIN_DIR="${VERONICA_BIN:-$HOME/.local/bin}"
REPO_URL="${VERONICA_REPO:-https://github.com/locchh/veronica.git}"

echo "Installing Veronica..."

# 1. Ensure Bun is available
if ! command -v bun >/dev/null 2>&1; then
    echo "  Bun not found — installing..."
    curl -fsSL https://bun.sh/install | bash
    # Make bun available for the rest of this script without restarting the shell
    export PATH="$HOME/.bun/bin:$PATH"
fi

# 2. Clone the repo (or pull if already present)
if [ -d "$INSTALL_DIR/.git" ]; then
    echo "  Updating existing install at $INSTALL_DIR..."
    git -C "$INSTALL_DIR" pull --ff-only
else
    echo "  Cloning to $INSTALL_DIR..."
    git clone --depth 1 "$REPO_URL" "$INSTALL_DIR"
fi

# 3. Install dependencies
echo "  Installing dependencies..."
(cd "$INSTALL_DIR" && bun install)

# 4. Create the wrapper command in PATH
mkdir -p "$BIN_DIR"
cat > "$BIN_DIR/veronica" <<EOF
#!/usr/bin/env bash
exec bun run "$INSTALL_DIR/index.ts" "\$@"
EOF
chmod +x "$BIN_DIR/veronica"

echo
echo "✓ Veronica installed"
echo "  source: $INSTALL_DIR"
echo "  command: $BIN_DIR/veronica"

# 5. Warn if BIN_DIR is not in PATH
case ":$PATH:" in
    *":$BIN_DIR:"*) ;;
    *)
        echo
        echo "⚠  $BIN_DIR is not in your PATH."
        echo "   Add this line to your ~/.bashrc or ~/.zshrc:"
        echo
        echo "     export PATH=\"$BIN_DIR:\$PATH\""
        echo
        ;;
esac
