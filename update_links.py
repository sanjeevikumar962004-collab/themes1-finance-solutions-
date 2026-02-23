import os
import glob

files = glob.glob("*.html")
for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()

    lines = content.splitlines()
    new_lines = []
    changed = False
    for line in lines:
        if "href=\"#\"" in line and "data-target" not in line:
            new_lines.append(line.replace("href=\"#\"", "href=\"404.html\""))
            changed = True
        else:
            new_lines.append(line)
            
    if changed:
        with open(file, "w", encoding="utf-8") as f:
            f.write("\n".join(new_lines))
        print(f"Updated {file}")
