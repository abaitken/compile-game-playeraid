import re
from pathlib import Path
from collections import deque

LINK_PATTERN = re.compile(r'\[([^\]]+)\]\(([^)]+)\)')
HEADING_PATTERN = re.compile(r'^(#{1,6})\s+(.*)$')
INCLUDE_PATTERN = re.compile(r'\{%(.*?)%\}')

def expand_includes(content, current_file):
    """
    Replace {%file%} with the contents of that file.

    Paths are resolved relative to the current markdown file.
    """

    def replace_include(match):
        include_name = match.group(1).strip()

        include_path = (
            current_file.parent / include_name
        ).resolve()

        if not include_path.exists():
            return (
                f"\n<!-- INCLUDE NOT FOUND: "
                f"{include_name} -->\n"
            )

        try:
            return include_path.read_text(
                encoding="utf-8"
            )
        except Exception as ex:
            return (
                f"\n<!-- FAILED TO READ: "
                f"{include_name}: {ex} -->\n"
            )

    return INCLUDE_PATTERN.sub(
        replace_include,
        content
    )
    
def github_anchor(text):
    """
    Convert a heading into a GitHub anchor.
    """
    text = text.strip().lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'\s+', '-', text)
    return text


def file_anchor(path):
    """
    Generate a unique anchor for a file.
    """
    return f"file-{path.stem.lower()}"


def process_content(content, current_file):
    """
    Rewrite markdown links for the combined document.
    """

    def replace_link(match):
        text = match.group(1)
        target = match.group(2)

        if target.startswith(("http://", "https://", "mailto:")):
            return match.group(0)

        # file.md#heading
        if ".md" in target.lower():
            parts = target.split("#", 1)

            md_file = parts[0]
            heading = parts[1] if len(parts) > 1 else None

            target_path = Path(md_file)

            anchor = f"#{file_anchor(target_path)}"

            if heading:
                anchor = f"#{file_anchor(target_path)}-{github_anchor(heading)}"

            return f"[{text}]({anchor})"

        return match.group(0)

    return LINK_PATTERN.sub(replace_link, content)


def extract_links(content):
    """
    Return markdown file references.
    """
    results = []

    for _, target in LINK_PATTERN.findall(content):

        if target.startswith(("http://", "https://", "mailto:")):
            continue

        target = target.split("#", 1)[0]

        if target.lower().endswith(".md"):
            results.append(target)

    return results


def crawl(start_file, output_file):
    queue = deque([Path(start_file).resolve()])
    visited = set()

    output_parts = []

    while queue:
        current = queue.popleft()

        if current in visited:
            continue

        if not current.exists():
            print(f"WARNING: Missing file: {current}")
            continue

        visited.add(current)

        print(f"Processing {current}")

        content = current.read_text(encoding="utf-8")

        content = expand_includes(
            content,
            current
        )
        
        #
        # Queue discovered markdown files
        #
        for link in extract_links(content):
            target = (current.parent / link).resolve()

            if target not in visited:
                queue.append(target)

        #
        # Add file separator and anchor
        #
        output_parts.append("")
        output_parts.append("---")
        output_parts.append("")
        output_parts.append(
            f'<a id="{file_anchor(current)}"></a>'
        )
        #output_parts.append("")
        #output_parts.append(f"<!-- Source: {current} -->")
        #output_parts.append("")

        #
        # Add anchors for headings
        #
        lines = []

        for line in content.splitlines():

            match = HEADING_PATTERN.match(line)

            if match:
                heading = match.group(2).strip()

                lines.append(
                    f'<a id="{file_anchor(current)}-{github_anchor(heading)}"></a>'
                )

            lines.append(line)

        rewritten = process_content(
            "\n".join(lines),
            current
        )

        output_parts.append(rewritten)

    Path(output_file).write_text(
        "\n".join(output_parts),
        encoding="utf-8"
    )

    print(f"\nCombined document written to: {output_file}")
    print(f"Files processed: {len(visited)}")


if __name__ == "__main__":
    crawl(
        start_file="../src/topics/index.md",
        output_file="../src/topics/complete.md"
    )
