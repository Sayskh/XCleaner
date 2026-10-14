#!/usr/bin/env python3
import json
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

# ponytail: fa0311 is a bot that scrapes x.com JS bundles daily. If it goes stale,
# add nirholas/XActions as fallback source (regex on its generated JS file).
SOURCE_URL = "https://raw.githubusercontent.com/fa0311/TwitterInternalAPIDocument/develop/docs/json/GraphQL.json"
OPS = ["UserTweetsAndReplies", "DeleteTweet", "DeleteRetweet", "Likes", "UnfavoriteTweet"]

try:
    req = urllib.request.Request(SOURCE_URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        doc = json.load(resp)
except Exception as e:
    print(f"Error fetching upstream GraphQL.json: {e}", file=sys.stderr)
    sys.exit(1)

upstream = {}
for entry in doc:
    exp = entry.get("exports", {})
    if exp.get("operationName") and exp.get("queryId"):
        upstream[exp["operationName"]] = exp["queryId"]

ids_file = Path(__file__).resolve().parents[2] / "src" / "core" / "ids.json"
if not ids_file.exists():
    print("src/core/ids.json not found!", file=sys.stderr)
    sys.exit(1)

current = json.loads(ids_file.read_text(encoding="utf-8"))
changed = False

for op in OPS:
    value = upstream.get(op)
    if not value:
        print(f"Warning: {op} not found upstream. Retaining existing ID.", file=sys.stderr)
    elif current.get(op) != value:
        print(f"Update {op}: {current.get(op)} -> {value}")
        current[op] = value
        changed = True

if changed:
    current["updatedAt"] = datetime.now(timezone.utc).isoformat()
    ids_file.write_text(json.dumps(current, indent=2) + "\n", encoding="utf-8")
    print("src/core/ids.json updated successfully.")
else:
    print("All query IDs in src/core/ids.json are already up to date.")
