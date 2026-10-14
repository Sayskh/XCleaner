#!/usr/bin/env python3
import json
import re
import sys
import urllib.request
from pathlib import Path
from datetime import datetime, timezone

SOURCE_URL = "https://raw.githubusercontent.com/nirholas/XActions/main/src/scrapers/twitter/http/x-endpoints.generated.js"

try:
    req = urllib.request.Request(SOURCE_URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        upstream = resp.read().decode("utf-8")
except Exception as e:
    print(f"Error fetching upstream endpoints: {e}", file=sys.stderr)
    sys.exit(1)

def find_id(op_name):
    m = re.search(rf'\"{op_name}\":\s*Object\.freeze\(\{{\s*queryId:\s*\"([^\"]+)\"', upstream)
    if not m:
        m = re.search(rf'{op_name}:\s*Object\.freeze\(\{{\s*queryId:\s*\"([^\"]+)\"', upstream)
    return m.group(1) if m else None

ops = {
    "UserTweetsAndReplies": find_id("UserTweetsAndReplies"),
    "DeleteTweet": find_id("DeleteTweet"),
    "DeleteRetweet": find_id("DeleteRetweet"),
    "Likes": find_id("Likes"),
    "UnfavoriteTweet": find_id("UnfavoriteTweet")
}

missing = [k for k, v in ops.items() if not v]
if missing:
    print(f"Warning: could not resolve all IDs from upstream ({missing}). Retaining existing IDs for missing ops.", file=sys.stderr)

ROOT = Path(__file__).resolve().parents[2]
ids_file = ROOT / "src" / "core" / "ids.json"
if not ids_file.exists():
    print("src/core/ids.json not found!", file=sys.stderr)
    sys.exit(1)

current = json.loads(ids_file.read_text(encoding="utf-8"))
changed = False

for k, v in ops.items():
    if v and current.get(k) != v:
        print(f"Update {k}: {current.get(k)} -> {v}")
        current[k] = v
        changed = True

if changed:
    current["updatedAt"] = datetime.now(timezone.utc).isoformat()
    ids_file.write_text(json.dumps(current, indent=2) + "\n", encoding="utf-8")
    print("src/core/ids.json updated successfully.")
else:
    print("All query IDs in src/core/ids.json are already up-to-date.")
