import json
from pathlib import Path
from collections import Counter, defaultdict

BASE = Path(__file__).parent

with open(BASE / "corpus_pos_raw.json", "r", encoding="utf-8") as f:
    words = json.load(f)

with open(r"D:\nehzat-plus\nehzat-plus\docs\quran-analysis\01-text-4-surahs.md", "r", encoding="utf-8") as f:
    text_content = f.read()

# Parse text content for verse counts
verse_counts = {}
for line in text_content.split('\n'):
    line = line.strip()
    if line.startswith('سورة') or line.startswith('Surat'):
        current_surah = line
    elif line and not line.startswith('#') and not line.startswith('سورة') and not line.startswith('---'):
        import re
        if re.match(r'^\d+', line):
            verse_num = int(re.match(r'^(\d+)', line).group(1))
            if current_surah not in verse_counts:
                verse_counts[current_surah] = 0
            verse_counts[current_surah] = max(verse_counts[current_surah], verse_num)

surah_names = {71: "نوح (Nuh)", 59: "حشر (Al-Hashr)", 48: "فتح (Al-Fath)", 49: "حجرات (Al-Hujurat)"}
surah_verses = {71: 28, 59: 24, 48: 29, 49: 18}

# POS tag categories for grouping
POS_CATEGORIES = {
    "اسم (Noun)": ["N", "PN", "REL", "DEM", "LOC", "T"],
    "فعل (Verb)": ["V", "IMPV"],
    "ضمیر (Pronoun)": ["PRON", "PRO"],
    "حرف (Particle)": ["P", "CONJ", "ACC", "NEG", "SUB", "EMPH", "COND", "REM", "RSLT",
                       "CERT", "PREV", "FUT", "RET", "CAUS", "EXP", "AMD", "INTG", "VOC",
                       "RES", "CIRC", "PRP"],
    "صفت (Adjective)": ["ADJ"],
}

def get_category(pos):
    for cat, tags in POS_CATEGORIES.items():
        if pos in tags:
            return cat
    return "سایر (Other)"

def pos_label(code):
    labels = {
        "N": "اسم", "PN": "اسم علم", "REL": "اسم موصول", "DEM": "ضمیر اشاره",
        "LOC": "اسم مکان", "T": "اسم زمان", "V": "فعل", "IMPV": "فعل امر",
        "PRON": "ضمیر", "PRO": "ضمیر متصل", "P": "حرف جر", "CONJ": "حرف عطف",
        "ACC": "حرف نصب", "NEG": "نفی", "SUB": "حرف مصدری", "EMPH": "تکید",
        "COND": "شرطی", "REM": "部队", "RSLT": "نتیجه", "CERT": "یقین",
        "PREV": "سبقت", "FUT": "استقبال", "RET": "رجوع", "CAUS": "سببیت",
        "EXP": "استثناء", "AMD": "صله", "INTG": "استفهام", "VOC": "نداء",
        "RES": "限额", "CIRC": "حال", "PRP": "علت", "ADJ": "صفت"
    }
    return labels.get(code, code)

output_lines = []
def p(s=""):
    output_lines.append(s)

p("# گزارش تحلیل قرآنی ۴ سوره")
p()
p(f"**منبع داده**: Quranic Arabic Corpus (corpus.quran.com) — برچسب‌گذاری POS واقعی")
p(f"**تعداد کل کلمات**: {len(words)}")
p(f"**سوره‌ها**: نوح (۷۱)، حشر (۵۹)، فتح (۴۸)، حجرات (۴۹)")
p()
p("---")
p()

# Section 1: Overall Statistics
p("## ۱. آمار کلی")
p()
p("| سوره | شماره | تعداد آیات | تعداد کلمات | کلمات یکتا | نسبت تنوع |")
p("|------|-------|-----------|------------|-----------|-----------|")

for surah_num in [71, 59, 48, 49]:
    surah_words = [w for w in words if w["surah"] == surah_num]
    unique = len(set(w["transliteration"] for w in surah_words if w["transliteration"]))
    total = len(surah_words)
    ttr = unique / total if total > 0 else 0
    p(f"| {surah_names[surah_num]} | {surah_num} | {surah_verses[surah_num]} | {total} | {unique} | {ttr:.3f} |")

p(f"| **مجموع** | — | {sum(surah_verses.values())} | {len(words)} | {len(set(w['transliteration'] for w in words if w['transliteration']))} | — |")
p()

# Section 2: POS Distribution
p("## ۲. توزیع کلمات بر اساس نقش دستوری (POS)")
p()
p("### ۲.۱. توزیع کلی")
p()

pos_counter = Counter()
for w in words:
    for tag in w.get("pos_tags", []):
        pos_counter[tag["pos"]] += 1

p("| نقش دستوری | کد | تعداد | درصد |")
p("|------------|-----|-------|------|")
for pos, count in pos_counter.most_common():
    pct = count / len(words) * 100
    p(f"| {pos_label(pos)} | {pos} | {count} | {pct:.1f}% |")

p()
p("### ۲.۲. توزیع بر اساس دسته‌بندی")
p()

cat_counter = Counter()
for w in words:
    for tag in w.get("pos_tags", []):
        cat = get_category(tag["pos"])
        cat_counter[cat] += 1

p("| دسته‌بندی | تعداد | درصد |")
p("|----------|-------|------|")
for cat, count in cat_counter.most_common():
    pct = count / len(words) * 100
    p(f"| {cat} | {count} | {pct:.1f}% |")

p()

# Section 3: Per-Surah POS Distribution
p("## ۳. توزیع نقش دستوری در هر سوره")
p()

for surah_num in [71, 59, 48, 49]:
    surah_words = [w for w in words if w["surah"] == surah_num]
    surah_pos = Counter()
    for w in surah_words:
        for tag in w.get("pos_tags", []):
            surah_pos[tag["pos"]] += 1
    
    p(f"### {surah_names[surah_num]}")
    p()
    p("| نقش | تعداد | درصد |")
    p("|-----|-------|------|")
    for pos, count in surah_pos.most_common(10):
        pct = count / len(surah_words) * 100
        p(f"| {pos_label(pos)} ({pos}) | {count} | {pct:.1f}% |")
    p()

# Section 4: Word Frequencies
p("## ۴. پرتکرارترین کلمات")
p()
p("### ۴.۱. بر اساس ترجمه انگلیسی")
p()

trans_counter = Counter()
for w in words:
    t = w.get("translation", "").strip()
    if t:
        trans_counter[t] += 1

p("| رتبه | ترجمه | تعداد |")
p("|------|-------|-------|")
for rank, (trans, count) in enumerate(trans_counter.most_common(25), 1):
    p(f"| {rank} | {trans} | {count} |")

p()
p("### ۴.۲. بر اساس تلفظ")
p()

phon_counter = Counter()
for w in words:
    ph = w.get("transliteration", "").strip()
    if ph:
        phon_counter[ph] += 1

p("| رتبه | تلفظ | تعداد |")
p("|------|------|-------|")
for rank, (phon, count) in enumerate(phon_counter.most_common(25), 1):
    p(f"| {rank} | {phon} | {count} |")

p()

# Section 5: Verb Analysis
p("## ۵. تحلیل افعال")
p()
p("### ۵.۱. افعال بر اساس زمان/نحو")
p()

verb_forms = Counter()
for w in words:
    for tag in w.get("pos_tags", []):
        if tag["pos"] == "V":
            desc = tag.get("description", "")
            form = "ساده"
            if "perfect" in desc:
                form = "ماضی (perfect)"
            elif "imperfect" in desc:
                if "subjunctive" in desc:
                    form = " مضارع منصوبي (subjunctive)"
                elif "jussive" in desc:
                    form = "مضارع مجزوم (jussive)"
                else:
                    form = "مضارع (imperfect)"
            elif "imperative" in desc:
                form = "امر (imperative)"
            elif "participle" in desc:
                form = "اسم فاعل/مفعول (participle)"
            
            person = ""
            if "1st person" in desc:
                person = "متکلم"
            elif "2nd person" in desc:
                person = "مخاطب"
            elif "3rd person" in desc:
                person = "غائب"
            
            gender = ""
            if "masculine" in desc:
                gender = "مذکر"
            elif "feminine" in desc:
                gender = "مؤنث"
            
            number = ""
            if "singular" in desc:
                number = "مفرد"
            elif "plural" in desc:
                number = "جمع"
            
            verb_forms[f"{form} - {person} {gender} {number}"] += 1

p("| صورت فعل | تعداد |")
p("|---------|-------|")
for form, count in verb_forms.most_common(15):
    p(f"| {form} | {count} |")

p()
p("### ۵.۲. افعال پرتکرار")
p()

verb_trans = Counter()
for w in words:
    for tag in w.get("pos_tags", []):
        if tag["pos"] == "V":
            t = w.get("translation", "").strip()
            if t:
                verb_trans[t] += 1

p("| رتبه | ترجمه فعل | تعداد |")
p("|------|----------|-------|")
for rank, (trans, count) in enumerate(verb_trans.most_common(15), 1):
    p(f"| {rank} | {trans} | {count} |")

p()

# Section 6: Noun Analysis
p("## ۶. تحلیل اسم‌ها")
p()

noun_types = Counter()
for w in words:
    for tag in w.get("pos_tags", []):
        if tag["pos"] in ["N", "PN", "REL", "DEM", "LOC", "T"]:
            noun_types[tag["pos"]] += 1

p("### ۶.۱. انواع اسم‌ها")
p()
p("| نوع | کد | تعداد |")
p("|-----|-----|-------|")
for ntype, count in noun_types.most_common():
    p(f"| {pos_label(ntype)} | {ntype} | {count} |")

p()
p("### ۶.۲. اسم‌های علم پرتکرار")
p()

proper_nouns = Counter()
for w in words:
    for tag in w.get("pos_tags", []):
        if tag["pos"] == "PN":
            t = w.get("translation", "").strip()
            if t:
                proper_nouns[t] += 1

p("| رتبه | اسم علم | تعداد |")
p("|------|---------|-------|")
for rank, (pn, count) in enumerate(proper_nouns.most_common(15), 1):
    p(f"| {rank} | {pn} | {count} |")

p()

# Section 7: Particle Analysis
p("## ۷. تحلیل حروف")
p()

particle_types = Counter()
for w in words:
    for tag in w.get("pos_tags", []):
        if get_category(tag["pos"]) == "حرف (Particle)":
            particle_types[tag["pos"]] += 1

p("| نوع حرف | کد | تعداد |")
p("|---------|-----|-------|")
for ptype, count in particle_types.most_common():
    p(f"| {pos_label(ptype)} | {ptype} | {count} |")

p()

# Section 8: Verse-level Analysis
p("## ۸. تحلیل سطح آیه")
p()

for surah_num in [71, 59, 48, 49]:
    surah_words = [w for w in words if w["surah"] == surah_num]
    verse_data = defaultdict(list)
    for w in surah_words:
        verse_data[w["verse"]].append(w)
    
    verse_lengths = [len(vw) for vw in verse_data.values()]
    avg_len = sum(verse_lengths) / len(verse_lengths) if verse_lengths else 0
    max_len = max(verse_lengths) if verse_lengths else 0
    min_len = min(verse_lengths) if verse_lengths else 0
    
    p(f"### {surah_names[surah_num]}")
    p()
    p(f"- تعداد آیات: {len(verse_data)}")
    p(f"- میانگین کلمات در آیه: {avg_len:.1f}")
    p(f"- کوتاه‌ترین آیه: {min_len} کلمه")
    p(f"- بلندترین آیه: {max_len} کلمه")
    p()

p()
p("---")
p()
p("**تاریخ تحلیل**: ۲۰۲۶/۰۸/۲۱")
p("**منبع**: Quranic Arabic Corpus v0.4 (GNU License)")
p("**روش**: استخراج خودکار برچسب‌های POS از صفحات word-by-word سایت corpus.quran.com")

report = '\n'.join(output_lines)
outpath = BASE / "ANALYSIS_REPORT.md"
outpath.write_text(report, encoding="utf-8")
print(f"Report written: {outpath}")
print(f"Total words: {len(words)}")
print(f"Total POS tags: {sum(pos_counter.values())}")
print(f"Unique POS types: {len(pos_counter)}")