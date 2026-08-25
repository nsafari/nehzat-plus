import json
from pathlib import Path

with open(r'D:\nehzat-plus\nehzat-plus\docs\quran-analysis\corpus_pos_raw.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

output = []
output.append(f"Total words: {len(data)}")
output.append(f"With POS tags: {sum(1 for w in data if w.get('pos_tags'))}")
output.append(f"With transliteration: {sum(1 for w in data if w.get('transliteration'))}")

output.append("\n=== FIRST 10 WORDS ===")
for w in data[:10]:
    output.append(f"  {w['surah']}:{w['verse']}:{w['word_index']} - {w['transliteration']} - {w['translation']} - {w['pos_tags']}")

pos_counter = {}
for w in data:
    for tag in w.get('pos_tags', []):
        p = tag.get('pos', 'unknown')
        pos_counter[p] = pos_counter.get(p, 0) + 1

output.append("\n=== POS TAG DISTRIBUTION ===")
for pos, count in sorted(pos_counter.items(), key=lambda x: -x[1]):
    output.append(f"  {pos}: {count}")

output.append("\n=== SAMPLE VERSES (71:1) ===")
for w in data:
    if w['surah'] == 71 and w['verse'] == 1:
        output.append(f"  {w['word_index']}. {w['transliteration']} ({w['translation']}) -> {w['pos_tags']}")

outpath = Path(r'D:\nehzat-plus\nehzat-plus\docs\quran-analysis\corpus_check.txt')
outpath.write_text('\n'.join(output), encoding='utf-8')
print(f"Written to {outpath}")