"""Build the standalone offline HTML from editable project files.
Usage: python build.py
No extra Python dependencies are needed.
"""
from pathlib import Path
root=Path(__file__).resolve().parent
html=(root/'index.template.html').read_text(encoding='utf-8')
for key,path in {'STYLE':'style.css','DATA':'data.js','EXPLAIN':'explain.js','SOLVER':'solver.js','TRAIN':'training.js','APP':'app.js','MATHJAX':'vendor/tex-svg.js'}.items():
    html=html.replace(f'/* INJECT_{key} */',(root/path).read_text(encoding='utf-8'))
(root/'index.html').write_text(html,encoding='utf-8')
print('Creado:',root/'index.html')
