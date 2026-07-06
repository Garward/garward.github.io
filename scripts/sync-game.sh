#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd)"

SOURCE_DIR="${1:-/home/garward/Games/Dev/ClickerRPG}"
DEST_DIR="$REPO_ROOT/games"

require_path() {
    local path="$1"
    if [[ ! -e "$path" ]]; then
        printf 'Missing required path: %s\n' "$path" >&2
        exit 1
    fi
}

require_path "$SOURCE_DIR/index.html"
require_path "$SOURCE_DIR/js"
require_path "$SOURCE_DIR/css"
require_path "$SOURCE_DIR/sprites/characters"
require_path "$SOURCE_DIR/sprites/items"
require_path "$SOURCE_DIR/sprites/monsters"

if [[ "$DEST_DIR" != "$REPO_ROOT/games" ]]; then
    printf 'Refusing to sync to unexpected destination: %s\n' "$DEST_DIR" >&2
    exit 1
fi

printf 'Syncing game from %s\n' "$SOURCE_DIR"
printf 'Destination: %s\n' "$DEST_DIR"

rm -rf -- "$DEST_DIR"
mkdir -p -- "$DEST_DIR/sprites"

rsync -a \
    --exclude 'desktop.ini' \
    --exclude '*Zone.Identifier' \
    "$SOURCE_DIR/index.html" "$DEST_DIR/"

rsync -a --delete \
    --exclude 'desktop.ini' \
    --exclude '*Zone.Identifier' \
    "$SOURCE_DIR/js/" "$DEST_DIR/js/"

rsync -a --delete \
    --exclude 'desktop.ini' \
    --exclude '*Zone.Identifier' \
    "$SOURCE_DIR/css/" "$DEST_DIR/css/"

for sprite_dir in characters items monsters; do
    rsync -a --delete \
        --exclude 'desktop.ini' \
        --exclude '*Zone.Identifier' \
        "$SOURCE_DIR/sprites/$sprite_dir/" "$DEST_DIR/sprites/$sprite_dir/"
done

forbidden_files="$(
    find "$DEST_DIR" -type f \( \
        -iname '*.exe' -o \
        -iname '*.bat' -o \
        -iname '*.ps1' -o \
        -iname '*.vbs' -o \
        -iname '*.epub' -o \
        -iname '*.pdf' -o \
        -iname '*.zip' -o \
        -name 'desktop.ini' -o \
        -name '*Zone.Identifier' -o \
        -name 'nul' \
    \) -print
)"

if [[ -n "$forbidden_files" ]]; then
    printf 'Refusing to publish forbidden files:\n%s\n' "$forbidden_files" >&2
    exit 1
fi

if command -v rg >/dev/null 2>&1; then
    if rg -n -i \
        'Ragnarok|Prontera|Poring|Poporing|Fabre|Lunatic|Baphomet|Osiris|Thanatos|J-Novel|books/|Black Summoner|Faraway Paladin|Realist Hero' \
        "$DEST_DIR"; then
        printf 'Refusing to publish: legacy/copyright-risk terms were found above.\n' >&2
        exit 1
    fi
fi

missing_assets="$(
    while IFS= read -r asset; do
        [[ -f "$DEST_DIR/$asset" ]] || printf '%s\n' "$asset"
    done < <(rg -o 'sprites/(monsters|items|characters)/[A-Za-z0-9_.-]+' "$DEST_DIR" -g '!*.png' | sed 's/^.*sprites/sprites/' | sort -u)
)"

if [[ -n "$missing_assets" ]]; then
    printf 'Refusing to publish: missing referenced assets:\n%s\n' "$missing_assets" >&2
    exit 1
fi

if command -v node >/dev/null 2>&1; then
    find "$DEST_DIR/js" -name '*.js' -print | sort | xargs -n 1 node --check
fi

printf 'Game sync complete. Review with: git -C %q status --short\n' "$REPO_ROOT"
