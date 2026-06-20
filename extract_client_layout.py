import json

transcript_path = r"C:\Users\sable\.gemini\antigravity-ide\brain\c355ed42-0a98-4a80-b3e1-861c93308aed\.system_generated\logs\transcript.jsonl"

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            step_idx = data.get("step_index")
            # If the tool call was a view_file of ClientLayout.tsx and was successful
            if data.get("type") == "VIEW_FILE" and "ClientLayoutProps" in data.get("content", ""):
                content = data["content"]
                if "621" in content or "619" in content or len(content) > 10000:
                    print(f"Found large VIEW_FILE content in step {step_idx}, length={len(content)}")
                    # Write to file
                    with open(f"extracted_step_{step_idx}.tsx", "w", encoding="utf-8") as out:
                        out.write(content)
        except Exception as e:
            pass
