#!/usr/bin/env python3

from pathlib import Path

def sort_markdown_list(filename):
    lines = Path(filename).read_text(encoding="utf-8").splitlines()

    start = None
    end = None

    for i, line in enumerate(lines):
        stripped = line.lstrip()

        if stripped.startswith(("- ", "* ", "+ ")):
            start = i
            end = i

            for j in range(i + 1, len(lines)):
                stripped = lines[j].lstrip()

                if stripped.startswith(("- ", "* ", "+ ")):
                    end = j
                else:
                    break

            break

    if start is None:
        return

    sorted_items = sorted(
        lines[start:end + 1],
        key=lambda s: s.lower()
    )

    lines[start:end + 1] = sorted_items

    Path(filename).write_text(
        "\n".join(lines) + "\n",
        encoding="utf-8"
    )

    print(f"Sorted list items {start + 1}-{end + 1} in {filename}")

for file_path in Path("../src/topics/").glob("keyword_*.md"):
    print(file_path)
    sort_markdown_list(file_path)
    
for file_path in Path("../src/topics/").glob("topics.md"):
    print(file_path)
    sort_markdown_list(file_path)
