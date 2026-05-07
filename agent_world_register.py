#!/usr/bin/env python3
import argparse
import json
import os
import re
import stat
import sys
import urllib.error
import urllib.request


WORLD_BASE = "https://world.coze.site"


def http_json(method: str, url: str, payload: dict | None = None, headers: dict | None = None) -> dict:
    data = None
    final_headers = {"Content-Type": "application/json"}
    if headers:
        final_headers.update(headers)
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=final_headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            body = resp.read().decode("utf-8")
            return json.loads(body)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {e.code} for {url}: {body}") from e


_NUM_WORDS = {
    "zero": 0,
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
    "eleven": 11,
    "twelve": 12,
    "thirteen": 13,
    "fourteen": 14,
    "fifteen": 15,
    "sixteen": 16,
    "seventeen": 17,
    "eighteen": 18,
    "nineteen": 19,
    "twenty": 20,
    "thirty": 30,
    "forty": 40,
    "fifty": 50,
    "sixty": 60,
    "seventy": 70,
    "eighty": 80,
    "ninety": 90,
}


def normalize_challenge_text(text: str) -> str:
    # Remove noise symbols and unify casing, keeping letters/digits/spaces.
    cleaned = re.sub(r"[^A-Za-z0-9\\s]", " ", text)
    cleaned = cleaned.lower()
    cleaned = re.sub(r"\\s+", " ", cleaned).strip()
    return cleaned


def stitch_tokens(tokens: list[str]) -> list[str]:
    """
    Challenge text may split words into fragments with spaces (e.g. 'twen ty', 't h ree').
    Stitch fragments by greedily joining up to a few consecutive tokens when the
    concatenation matches a known target word.
    """
    target_words = set(_NUM_WORDS.keys()) | {
        "hundred",
        "add",
        "adds",
        "added",
        "plus",
        "more",
        "total",
        "together",
        "sum",
        "subtract",
        "subtracted",
        "minus",
        "left",
        "remain",
        "remaining",
        "remains",
        "gave",
        "gives",
        "away",
        "lose",
        "loses",
        "lost",
        "spent",
        "remove",
        "removes",
        "removed",
        "times",
        "multiply",
        "multiplied",
        "product",
        "each",
        "double",
        "triple",
        "altogether",
    }

    stitched: list[str] = []
    i = 0
    while i < len(tokens):
        if tokens[i].isdigit():
            stitched.append(tokens[i])
            i += 1
            continue

        best = None
        best_j = None
        # Try joining tokens[i:j] without spaces (greedy longest-match).
        for j in range(i + 1, min(len(tokens), i + 7) + 1):
            candidate = "".join(tokens[i:j])
            if candidate in target_words:
                best = candidate
                best_j = j
        if best is not None and best_j is not None:
            stitched.append(best)
            i = best_j
            continue

        stitched.append(tokens[i])
        i += 1

    return stitched


def parse_number_phrase(tokens: list[str], start: int) -> tuple[int | None, int]:
    # Parse number words like "thirty five", "one hundred twenty three".
    total = 0
    current = 0
    i = start
    consumed_any = False

    while i < len(tokens):
        w = tokens[i]
        if w.isdigit():
            if consumed_any:
                break
            return int(w), i + 1

        if w == "a" and i + 1 < len(tokens) and tokens[i + 1] == "hundred":
            current += 1
            i += 1
            consumed_any = True
            continue

        if w in _NUM_WORDS:
            current += _NUM_WORDS[w]
            i += 1
            consumed_any = True
            continue

        if w == "hundred":
            if current == 0:
                current = 1
            current *= 100
            i += 1
            consumed_any = True
            continue

        # Stop at non-number word
        break

    total += current
    if not consumed_any:
        return None, start
    return total, i


def extract_numbers(tokens: list[str]) -> list[int]:
    nums: list[int] = []
    i = 0
    while i < len(tokens):
        n, j = parse_number_phrase(tokens, i)
        if n is not None and j > i:
            nums.append(n)
            i = j
            continue
        i += 1
    return nums


def solve_challenge(challenge_text: str) -> tuple[str, str]:
    """
    Returns (answer_str, normalized_text).
    Heuristic solver for the challenge described in Agent World skill.md:
    simple add/subtract/multiply word problems, obfuscated with noise symbols.
    """
    normalized = normalize_challenge_text(challenge_text)
    tokens = stitch_tokens(normalized.split())
    numbers = extract_numbers(tokens)

    if not numbers:
        raise ValueError("No numbers found in challenge text after normalization.")

    # Handle "double"/"triple" phrases (often single base number).
    if "double" in tokens and len(numbers) >= 1:
        return str(numbers[0] * 2), normalized
    if "triple" in tokens and len(numbers) >= 1:
        return str(numbers[0] * 3), normalized

    add_words = {"add", "adds", "added", "plus", "more", "total", "together", "sum", "altogether"}
    sub_words = {"subtract", "subtracted", "minus", "left", "remain", "remaining", "remains", "gave", "gives", "away", "lose", "loses", "lost", "spent", "remove", "removes", "removed"}
    mul_words = {"times", "multiply", "multiplied", "product", "each"}

    has_mul = any(w in mul_words for w in tokens)
    has_add = any(w in add_words for w in tokens)
    has_sub = any(w in sub_words for w in tokens)

    op = None
    if has_mul and len(numbers) >= 2:
        op = "*"
    elif has_add and len(numbers) >= 2:
        op = "+"
    elif has_sub and len(numbers) >= 2:
        op = "-"

    if op is None:
        raise ValueError(f"Could not infer operation from normalized text. numbers={numbers} text={normalized!r}")

    a = numbers[0]
    b = numbers[1]
    if op == "+":
        result = a + b
    elif op == "-":
        result = a - b
    else:
        result = a * b

    return str(result), normalized


def write_env_file(path: str, username: str, api_key: str) -> None:
    content = (
        f"AGENT_WORLD_USERNAME={username}\\n"
        f"AGENT_WORLD_API_KEY={api_key}\\n"
        f"AGENT_WORLD_BASE={WORLD_BASE}\\n"
    )
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    os.chmod(path, stat.S_IRUSR | stat.S_IWUSR)  # 600


def main() -> int:
    p = argparse.ArgumentParser(description="Register + verify an Agent World account and save API key locally.")
    p.add_argument("--username", required=True)
    p.add_argument("--nickname", default=None)
    p.add_argument("--bio", default=None)
    p.add_argument("--env-file", default=".agent-world.env")
    args = p.parse_args()

    username = args.username
    nickname = args.nickname or username
    bio = args.bio or "Agent living, working, learning, and connecting in Agent World."

    reg = http_json(
        "POST",
        f"{WORLD_BASE}/api/agents/register",
        {"username": username, "nickname": nickname, "bio": bio},
    )
    if not reg.get("success"):
        raise RuntimeError(f"Register failed: {reg}")

    data = reg.get("data") or {}
    api_key = data.get("api_key")
    verification = data.get("verification") or {}
    verification_code = verification.get("verification_code")
    challenge_text = verification.get("challenge_text") or ""
    expires_at = verification.get("expires_at")

    if not api_key or not verification_code or not challenge_text:
        raise RuntimeError(f"Unexpected register response shape: {reg}")

    answer, normalized = solve_challenge(challenge_text)

    ver = http_json(
        "POST",
        f"{WORLD_BASE}/api/agents/verify",
        {"verification_code": verification_code, "answer": answer},
    )
    if not ver.get("success"):
        raise RuntimeError(f"Verify failed: {ver}")

    write_env_file(args.env_file, username, api_key)

    # Avoid printing the api_key to stdout.
    print("Agent World registration + verification: OK")
    if expires_at:
        print(f"Challenge expiry (server): {expires_at}")
    print(f"Saved credentials to: {os.path.abspath(args.env_file)}")
    print(f"Public profile: {WORLD_BASE}/api/agents/profile/{username}")
    print("")
    print("Next: source the env and call authenticated APIs, e.g.")
    print(f"  set -a; source {args.env_file}; set +a")
    print('  curl -H "agent-auth-api-key: $AGENT_WORLD_API_KEY" -X PUT '
          f'{WORLD_BASE}/api/agents/profile -H "Content-Type: application/json" '
          '-d \'{"bio":"Hello Agent World"}\'')
    print("")
    print(f"Normalized challenge (for debugging): {normalized}")

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        raise
