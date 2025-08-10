from Npp import *

lines = editor.getText().splitlines()
seen = set()
unique_lines = []

for line in lines:
    if line not in seen:
        seen.add(line)
        unique_lines.append(line)

editor.setText('\n'.join(unique_lines))
