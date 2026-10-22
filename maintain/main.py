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

def regenerate_all_topics():
    topics_dir = Path("../src/topics")
    output_file = Path("../src/topics/topics.md")

    with output_file.open("w", encoding="utf-8") as out:
        out.write(f"# All topics\n\n")
        
        for md_file in sorted(topics_dir.glob("*.md")):
            if md_file.name == output_file.name:
                continue
            
            with md_file.open("r", encoding="utf-8") as f:
                first_line = f.readline().strip()

            if first_line.startswith("#"):
                first_line = first_line.lstrip("#").strip()

            out.write(f"- [{first_line}]({md_file.name})\n")
    
    print(f"Regenerated all topics")
    
def main():
    for file_path in Path("../src/topics/").glob("keyword_*.md"):
        print(file_path)
        sort_markdown_list(file_path)

    regenerate_all_topics()
        
    for file_path in Path("../src/topics/").glob("topics.md"):
        print(file_path)
        sort_markdown_list(file_path)
    
main()