import requests
from bs4 import BeautifulSoup
from pathlib import Path
import json
import re

url = "https://corpus.quran.com/wordbyword.jsp?chapter=71&verse=1"
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
response = requests.get(url, headers=headers, timeout=30)

soup = BeautifulSoup(response.text, 'html.parser')

# Save full HTML
Path(r"D:\nehzat-plus\nehzat-plus\docs\quran-analysis\debug_full.html").write_text(response.text, encoding="utf-8")

# Find content div
content = soup.find("div", class_="content")
if content:
    Path(r"D:\nehzat-plus\nehzat-plus\docs\quran-analysis\debug_content.html").write_text(content.prettify(), encoding="utf-8")

# Try to find word entries - look for anchor tags with verse:word patterns
anchors = soup.find_all("a", attrs={"name": True})
word_anchors = [a for a in anchors if re.match(r'\(\d+:\d+:\d+\)', str(a.get("name", "")))]

results = []
for anchor in word_anchors:
    name = anchor.get("name", "")
    parent = anchor.parent
    if parent:
        text = parent.get_text(separator="\n", strip=True)
        results.append({"name": name, "text": text[:500]})

Path(r"D:\nehzat-plus\nehzat-plus\docs\quran-analysis\debug_anchors.json").write_text(
    json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8"
)

# Also search for elements containing POS-like text
all_elements = soup.find_all(string=re.compile(r'[A-Z]{2,5}\s*\?\s'))
pos_lines = []
for el in all_elements:
    parent = el.parent
    pos_lines.append({
        "tag": parent.name if parent else "none",
        "class": parent.get("class", []) if parent else [],
        "text": str(el).strip()
    })

Path(r"D:\nehzat-plus\nehzat-plus\docs\quran-analysis\debug_pos_lines.json").write_text(
    json.dumps(pos_lines, ensure_ascii=False, indent=2), encoding="utf-8"
)

# Find spans with Arabic text
spans = soup.find_all("span")
arabic_spans = [s for s in spans if any('\u0600' <= c <= '\u06FF' for c in s.get_text())]
arabic_data = []
for s in arabic_spans:
    arabic_data.append({
        "class": s.get("class", []),
        "text": s.get_text().strip(),
        "parent_class": s.parent.get("class", []) if s.parent else []
    })

Path(r"D:\nehzat-plus\nehzat-plus\docs\quran-analysis\debug_arabic_spans.json").write_text(
    json.dumps(arabic_data, ensure_ascii=False, indent=2), encoding="utf-8"
)

print("Done - check debug_*.html and debug_*.json files")