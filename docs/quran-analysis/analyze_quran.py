#!/usr/bin/env python3
"""
Quranic Analysis for 4 Surahs: Nuh (71), Al-Hashr (59), Al-Fath (48), Al-Hujurat (49)

Uses:
1. Quranic Arabic Corpus POS tags (from quran.com API word-by-word)
2. Arabic text normalization
3. Morphological pattern analysis for Quranic Arabic

Outputs:
- word_counts.json: Total, unique, per-surah counts
- pos_distribution.json: POS categories with counts
- word_frequencies.json: Most frequent words per POS
- surah_analysis.json: Detailed per-surah breakdown
"""

import json
import re
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path
from typing import Dict, List, Tuple, Any
import requests
from dataclasses import dataclass, asdict

# ============================================================
# CONFIGURATION
# ============================================================
SURAHS = {
    71: "Nuh",
    59: "Al-Hashr",
    48: "Al-Fath",
    49: "Al-Hujurat"
}

OUTPUT_DIR = Path(__file__).parent
OUTPUT_DIR.mkdir(exist_ok=True)

# Quran.com API endpoints
QURAN_API_BASE = "https://api.quran.com/api/v4"
HEADERS = {"User-Agent": "QuranAnalysis/1.0"}

# ============================================================
# QURANIC ARABIC CORPUS POS TAG MAPPING
# ============================================================
# From https://corpus.quran.com/ - the authoritative source
POS_TAG_MAP = {
    # Nouns
    "N": "noun",
    "PN": "proper_noun",
    "ADJ": "adjective",
    "PRON": "pronoun",
    "VOC": "vocative",
    
    # Verbs
    "V": "verb",
    "IMPV": "imperative",
    
    # Particles
    "P": "preposition",
    "CONJ": "conjunction",
    "SUB": "subordinating_conjunction",
    "ACC": "accusative_particle",
    "EMPH": "emphasis_particle",
    
    # Other
    "INTG": "interrogative",
    "NEG": "negation_particle",
    "FUT": "future_particle",
    "CERT": "certainty_particle",
    "ANS": "answer_particle",
    "EXCL": "exclamation_particle",
    "INTERJ": "interjection",
}

# POS Category Groups for analysis
POS_CATEGORIES = {
    "noun": ["noun", "proper_noun", "adjective", "pronoun", "vocative"],
    "verb": ["verb", "imperative"],
    "particle": [
        "preposition", "conjunction", "subordinating_conjunction",
        "accusative_particle", "emphasis_particle", "interrogative",
        "negation_particle", "future_particle", "certainty_particle",
        "answer_particle", "exclamation_particle", "interjection"
    ]
}

# ============================================================
# ARABIC TEXT NORMALIZATION
# ============================================================
def normalize_arabic(text: str) -> str:
    """Normalize Arabic text for consistent comparison."""
    if not text:
        return ""
    # Normalize Unicode
    text = unicodedata.normalize('NFKC', text)
    # Remove diacritics (tashkeel) for word matching
    text = re.sub(r'[\u064B-\u065F\u0670\u06D6-\u06ED]', '', text)
    # Normalize hamza forms
    text = text.replace('أ', 'ا').replace('إ', 'ا').replace('آ', 'ا')
    text = text.replace('ؤ', 'و').replace('ئ', 'ي')
    # Normalize ta marbuta
    text = text.replace('ة', 'ه')
    # Normalize alif maqsura
    text = text.replace('ى', 'ي')
    return text.strip()

def remove_diacritics(text: str) -> str:
    """Remove only diacritics, keep letters."""
    return re.sub(r'[\u064B-\u065F\u0670]', '', text)

# ============================================================
# MORPHOLOGICAL PATTERN ANALYSIS
# ============================================================
# Common Quranic morphological patterns for POS classification
VERB_PATTERNS = [
    r'^ي\w+ن$',      # yaf'aluna (present plural)
    r'^ت\w+ن$',      # taf'aluna (present plural 2nd)
    r'^ن\w+ن$',      # naf'alu (present 1st plural)
    r'^ا\w+ن$',      # af'alu (present 1st singular)
    r'^\w+و\w+$',    # fa'ala (past) / yaf'alu (present)
    r'^\w+ت$',       # fa'altu (past 1st sg)
    r'^\w+تما$',     # fa'altuma (past dual)
    r'^\w+تم$',      # fa'altum (past 2nd pl masc)
    r'^\w+تن$',      # fa'altunna (past 2nd pl fem)
    r'^\w+وا$',      # fa'alu (past 3rd pl masc)
    r'^\w+نا$',      # fa'alna (past 3rd pl fem / 1st pl)
    r'^س\w+$',       # sa-yaf'alu (future)
    r'^ل\w+$',       # li-yaf'alu (purpose)
    r'^ف\w+$',       # fa-yaf'alu (consecutive)
    r'^و\w+$',       # wa-yaf'alu (conjunction + verb)
]

NOUN_PATTERNS = [
    r'^ال\w+$',      # al- (definite article)
    r'^\w+ة$',       # feminine ending
    r'^\w+ان$',      # dual
    r'^\w+ون$',      # masculine plural
    r'^\w+ين$',      # masculine plural gen/acc
    r'^\w+ات$',      # feminine plural
    r'^م\w+$',       # maf'ul /ismu maf'ul (participle)
    r'^م\w+ة$',      # feminine participle
]

PARTICLE_WORDS = {
    # Prepositions
    'في', 'على', 'إلى', 'من', 'عن', 'مع', 'منذ', 'مذ', 'ك', 'ب', 'ل', 'حتى',
    # Conjunctions
    'و', 'ف', 'ثم', 'أو', 'أم', 'إما', 'لا', 'لكن', 'بل', 'غير', 'سوى',
    # Subordinating
    'أن', 'إن', 'أنّ', 'كأن', 'ليت', 'لعل', 'حتى', 'كي', 'حيث', 'إذا',
    # Accusative particles
    'إنّ', 'أنّ', 'كأنّ', 'ليت', 'لعل',
    # Emphasis
    'إن', 'قد', 'لقد', 'ما', 'لا', 'ما',
    # Negation
    'لا', 'ما', 'لم', 'لما', 'لن', 'غير', 'سوى',
    # Future
    'س', 'سوف',
    # Interrogative
    'أ', 'هل', 'كيف', 'متى', 'أين', 'من', 'ماذا', 'م',
    # Vocative/Calling
    'يا', 'أيا', 'هيا',
    # Other particles
    'ثم', 'قد', 'كاد', 'عسى', 'حقا', 'أجل', 'كلا', 'بلى',
}

PRONOUNS = {
    # Detached
    'أنا', 'نحن', 'أنت', 'أنتما', 'أنتم', 'أنتن', 'هو', 'هما', 'هم', 'هن', 'هي', 'هنّ',
    # Attached (suffixes) - handled via pattern matching
}

PROPER_NOUNS_QURANIC = {
    # From the 4 surahs specifically
    'نوح', 'إبراهيم', 'موسى', 'عيسى', 'محمد', 'آدم', 'نوح', 'هود', 'صالح', 'لوط', 'شعيب',
    'إسماعيل', 'إسحاق', 'يعقوب', 'يوسف', 'أيوب', 'ذو', 'الكفل', 'يونس', 'إدريس', 'ذي',
    'القمر', 'الشمس', 'الليل', 'النهار', 'الأرض', 'السماء', 'الجبال', 'البحر',
    'الجن', 'الإنس', 'الملائكة', 'إبليس', 'آدم', 'حواء',
    # Surah-specific
    'الحشر', 'الفتح', 'الحجرات', 'الجمعة', 'المنافقون', 'التغابن', 'الطلاق', 'التحريم',
    'الملك', 'القلم', 'الحاقة', 'المعارج', 'نوح', 'الجن', 'المزمل', 'المدثر', 'القيامة',
    'الإنسان', 'المرسلات', 'النبأ', 'النازعات', 'عبس', 'التكوير', 'الإنفطار', 'المطففين',
    'الانشقاق', 'البروج', 'الطارق', 'الأعلى', 'الغاشية', 'الفجر', 'البلد', 'الشمس',
    'الليل', 'الضحى', 'الشرح', 'التين', 'العلق', 'القدر', 'البينة', 'الزلزلة', 'العاديات',
    'القارعة', 'التكاثر', 'العصر', 'الهمزة', 'الفيل', 'قريش', 'الماعون', 'الكوثر', 'الكافرون',
    'النصر', 'المسد', 'الإخلاص', 'الفلق', 'الناس',
    # Places, months, etc.
    'مكة', 'المدينة', 'بدر', 'أحد', 'حنين', 'تبوك', 'الحديبية', 'اليرموك', 'القادسية',
    'محرم', 'صفر', 'ربيع', 'جمادى', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو', 'القعدة', 'الحجة',
}

# ============================================================
# DATA FETCHING FROM QURAN.COM API
# ============================================================
def fetch_word_by_word(surah_number: int) -> List[Dict]:
    """Fetch word-by-word data from quran.com API for a surah.
    
    Uses the verses endpoint with words=true to get word-level data
    including Quranic Arabic Corpus POS tags (code_v1 field).
    """
    url = f"{QURAN_API_BASE}/verses/by_chapter/{surah_number}"
    params = {
        "words": "true",
        "word_fields": "text_uthmani,code_v1,position,verse_key,token_id"
    }
    
    response = requests.get(url, params=params, headers=HEADERS, timeout=60)
    if response.status_code != 200:
        print(f"Error fetching surah {surah_number}: {response.status_code}")
        return []
    
    data = response.json()
    verses = data.get("verses", [])
    
    all_words = []
    for verse in verses:
        verse_num = verse.get("verse_number", 0)
        words = verse.get("words", [])
        for w in words:
            w["verse_number"] = verse_num
            all_words.append(w)
    
    return all_words

def fetch_verses(surah_number: int) -> List[Dict]:
    """Fetch verses text for a surah."""
    url = f"{QURAN_API_BASE}/verses/by_chapter/{surah_number}"
    params = {
        "fields": "text_uthmani,verse_number,verse_key"
    }
    response = requests.get(url, params=params, headers=HEADERS, timeout=30)
    if response.status_code == 200:
        return response.json().get("verses", [])
    return []

def fetch_translations(surah_number: int, language: str = "en") -> List[Dict]:
    """Fetch translations for a surah."""
    # Using translation ID 131 (Sahih International)
    url = f"{QURAN_API_BASE}/quran/translations/131"
    params = {
        "chapter_number": surah_number,
        "fields": "text,verse_number,verse_key",
        "per_page": 300
    }
    response = requests.get(url, params=params, headers=HEADERS, timeout=30)
    if response.status_code == 200:
        return response.json().get("translations", [])
    return []

# ============================================================
# POS CLASSIFICATION ENGINE
# ============================================================
class QuranicPOSClassifier:
    """Classifies Quranic Arabic words into POS categories."""
    
    def __init__(self):
        self.cache = {}
        self.compiled_verb_patterns = [re.compile(p) for p in VERB_PATTERNS]
        self.compiled_noun_patterns = [re.compile(p) for p in NOUN_PATTERNS]
    
    def classify(self, word: str, normalized: str, surah: int, verse: int, position: int) -> Dict:
        """Classify a single word."""
        cache_key = (normalized, surah, verse, position)
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        result = {
            "word": word,
            "normalized": normalized,
            "pos": "unknown",
            "pos_category": "unknown",
            "confidence": 0.0,
            "method": "pattern"
        }
        
        # 1. Check known particles (exact match)
        if normalized in PARTICLE_WORDS:
            result["pos"] = "particle"
            result["pos_category"] = "particle"
            result["confidence"] = 0.95
            result["method"] = "particle_list"
            self.cache[cache_key] = result
            return result
        
        # 2. Check pronouns
        if normalized in PRONOUNS:
            result["pos"] = "pronoun"
            result["pos_category"] = "noun"
            result["confidence"] = 0.9
            result["method"] = "pronoun_list"
            self.cache[cache_key] = result
            return result
        
        # 3. Check proper nouns
        if normalized in PROPER_NOUNS_QURANIC:
            result["pos"] = "proper_noun"
            result["pos_category"] = "noun"
            result["confidence"] = 0.85
            result["method"] = "proper_noun_list"
            self.cache[cache_key] = result
            return result
        
        # 4. Check for definite article (al-)
        if normalized.startswith('ال'):
            # Could be noun or adjective
            result["pos"] = "noun"
            result["pos_category"] = "noun"
            result["confidence"] = 0.8
            result["method"] = "definite_article"
            self.cache[cache_key] = result
            return result
        
        # 5. Verb pattern matching
        for pattern in self.compiled_verb_patterns:
            if pattern.match(normalized):
                result["pos"] = "verb"
                result["pos_category"] = "verb"
                result["confidence"] = 0.75
                result["method"] = "verb_pattern"
                self.cache[cache_key] = result
                return result
        
        # 6. Noun pattern matching
        for pattern in self.compiled_noun_patterns:
            if pattern.match(normalized):
                result["pos"] = "noun"
                result["pos_category"] = "noun"
                result["confidence"] = 0.7
                result["method"] = "noun_pattern"
                self.cache[cache_key] = result
                return result
        
        # 7. Heuristic: short words (1-2 letters) often particles
        if len(normalized) <= 2:
            result["pos"] = "particle"
            result["pos_category"] = "particle"
            result["confidence"] = 0.6
            result["method"] = "short_word_heuristic"
            self.cache[cache_key] = result
            return result
        
        # 8. Default to noun (most common in Quran)
        result["pos"] = "noun"
        result["pos_category"] = "noun"
        result["confidence"] = 0.5
        result["method"] = "default_noun"
        self.cache[cache_key] = result
        return result

# ============================================================
# MAIN ANALYSIS PIPELINE
# ============================================================
@dataclass
class WordAnalysis:
    surah: int
    surah_name: str
    verse: int
    position: int
    word_uthmani: str
    word_normalized: str
    pos: str
    pos_category: str
    confidence: float
    method: str

def analyze_surah(surah_number: int, surah_name: str, classifier: QuranicPOSClassifier) -> List[WordAnalysis]:
    """Analyze a complete surah."""
    print(f"\nAnalyzing Surah {surah_number} ({surah_name})...")
    
    # Fetch word-by-word data
    words_data = fetch_word_by_word(surah_number)
    if not words_data:
        print(f"  No word data returned for surah {surah_number}")
        return []
    
    print(f"  Fetched {len(words_data)} words from API")
    
    # Fetch verses for context
    verses = fetch_verses(surah_number)
    verse_texts = {v["verse_number"]: v["text_uthmani"] for v in verses}
    
    analyses = []
    
    for w in words_data:
        verse_num = w.get("verse_number", 0)
        position = w.get("position", 0)
        word_text = w.get("text_uthmani", "")
        code_v1 = w.get("code_v1", "")  # Quranic Arabic Corpus code
        
        normalized = normalize_arabic(word_text)
        
        # Try to extract POS from code_v1 if available
        # code_v1 format: "N|NOUN|NOM|SG|MASC|DEF" etc.
        pos_from_corpus = None
        if code_v1 and '|' in code_v1:
            pos_code = code_v1.split('|')[0]
            pos_from_corpus = POS_TAG_MAP.get(pos_code)
        
        if pos_from_corpus:
            classification = {
                "word": word_text,
                "normalized": normalized,
                "pos": pos_from_corpus,
                "pos_category": get_pos_category(pos_from_corpus),
                "confidence": 0.95,
                "method": "quranic_corpus"
            }
        else:
            classification = classifier.classify(word_text, normalized, surah_number, verse_num, position)
        
        analysis = WordAnalysis(
            surah=surah_number,
            surah_name=surah_name,
            verse=verse_num,
            position=position,
            word_uthmani=word_text,
            word_normalized=normalized,
            pos=classification["pos"],
            pos_category=classification["pos_category"],
            confidence=classification["confidence"],
            method=classification["method"]
        )
        analyses.append(analysis)
    
    print(f"  Classified {len(analyses)} words")
    return analyses

def get_pos_category(pos: str) -> str:
    """Map POS tag to category."""
    for category, pos_list in POS_CATEGORIES.items():
        if pos in pos_list:
            return category
    return "unknown"

# ============================================================
# STATISTICS GENERATION
# ============================================================
def generate_statistics(all_analyses: List[WordAnalysis]) -> Dict[str, Any]:
    """Generate comprehensive statistics."""
    
    # Total counts
    total_words = len(all_analyses)
    unique_words = len(set(a.word_normalized for a in all_analyses))
    
    # Per surah
    surah_stats = {}
    for surah_num, surah_name in SURAHS.items():
        surah_words = [a for a in all_analyses if a.surah == surah_num]
        surah_total = len(surah_words)
        surah_unique = len(set(a.word_normalized for a in surah_words))
        surah_verses = len(set(a.verse for a in surah_words))
        
        surah_stats[surah_name] = {
            "surah_number": surah_num,
            "total_words": surah_total,
            "unique_words": surah_unique,
            "verses": surah_verses,
            "type_token_ratio": round(surah_unique / surah_total, 4) if surah_total > 0 else 0
        }
    
    # POS distribution
    pos_counter = Counter(a.pos for a in all_analyses)
    pos_category_counter = Counter(a.pos_category for a in all_analyses)
    
    # POS per surah
    pos_per_surah = {}
    for surah_num, surah_name in SURAHS.items():
        surah_words = [a for a in all_analyses if a.surah == surah_num]
        pos_per_surah[surah_name] = dict(Counter(a.pos for a in surah_words))
    
    # Word frequencies by POS
    pos_word_freq = defaultdict(Counter)
    for a in all_analyses:
        pos_word_freq[a.pos][a.word_normalized] += 1
    
    # Top words per POS
    top_words_per_pos = {}
    for pos, counter in pos_word_freq.items():
        top_words_per_pos[pos] = [
            {"word": word, "count": count, "normalized": word}
            for word, count in counter.most_common(20)
        ]
    
    # Overall top words
    overall_freq = Counter(a.word_normalized for a in all_analyses)
    top_overall = [
        {"word": word, "count": count}
        for word, count in overall_freq.most_common(50)
    ]
    
    # Method distribution
    method_counter = Counter(a.method for a in all_analyses)
    
    # Confidence stats
    confidences = [a.confidence for a in all_analyses]
    avg_confidence = sum(confidences) / len(confidences) if confidences else 0
    
    return {
        "summary": {
            "total_words": total_words,
            "unique_words": unique_words,
            "type_token_ratio": round(unique_words / total_words, 4) if total_words > 0 else 0,
            "surahs_analyzed": len(SURAHS),
            "average_confidence": round(avg_confidence, 4)
        },
        "surah_statistics": surah_stats,
        "pos_distribution": dict(pos_counter),
        "pos_category_distribution": dict(pos_category_counter),
        "pos_per_surah": pos_per_surah,
        "top_words_per_pos": top_words_per_pos,
        "top_words_overall": top_overall,
        "classification_methods": dict(method_counter)
    }

# ============================================================
# EXPORT FUNCTIONS
# ============================================================
def save_outputs(all_analyses: List[WordAnalysis], stats: Dict[str, Any]):
    """Save all output files."""
    
    # 1. Detailed word list
    words_output = [asdict(a) for a in all_analyses]
    with open(OUTPUT_DIR / "word_analysis.json", "w", encoding="utf-8") as f:
        json.dump(words_output, f, ensure_ascii=False, indent=2)
    
    # 2. Statistics
    with open(OUTPUT_DIR / "analysis_statistics.json", "w", encoding="utf-8") as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)
    
    # 3. Word counts summary
    word_counts = {
        "total": stats["summary"]["total_words"],
        "unique": stats["summary"]["unique_words"],
        "per_surah": {k: v["total_words"] for k, v in stats["surah_statistics"].items()}
    }
    with open(OUTPUT_DIR / "word_counts.json", "w", encoding="utf-8") as f:
        json.dump(word_counts, f, ensure_ascii=False, indent=2)
    
    # 4. POS distribution
    with open(OUTPUT_DIR / "pos_distribution.json", "w", encoding="utf-8") as f:
        json.dump(stats["pos_distribution"], f, ensure_ascii=False, indent=2)
    
    # 5. Word frequencies
    with open(OUTPUT_DIR / "word_frequencies.json", "w", encoding="utf-8") as f:
        json.dump({
            "overall": stats["top_words_overall"],
            "per_pos": stats["top_words_per_pos"]
        }, f, ensure_ascii=False, indent=2)
    
    # 6. Surah analysis
    with open(OUTPUT_DIR / "surah_analysis.json", "w", encoding="utf-8") as f:
        json.dump(stats["surah_statistics"], f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Outputs saved to {OUTPUT_DIR}")
    print(f"   - word_analysis.json ({len(words_output)} entries)")
    print(f"   - analysis_statistics.json")
    print(f"   - word_counts.json")
    print(f"   - pos_distribution.json")
    print(f"   - word_frequencies.json")
    print(f"   - surah_analysis.json")

# ============================================================
# MAIN
# ============================================================
def main():
    print("=" * 60)
    print("QURANIC ANALYSIS - 4 SURAHS")
    print("=" * 60)
    print(f"Surahs: {', '.join(f'{n} ({name})' for n, name in SURAHS.items())}")
    print(f"Source: Quran.com API (Quranic Arabic Corpus POS tags)")
    print("=" * 60)
    
    classifier = QuranicPOSClassifier()
    all_analyses = []
    
    for surah_num, surah_name in SURAHS.items():
        analyses = analyze_surah(surah_num, surah_name, classifier)
        all_analyses.extend(analyses)
    
    print(f"\n{'=' * 60}")
    print(f"TOTAL WORDS ANALYZED: {len(all_analyses)}")
    print(f"{'=' * 60}")
    
    # Fix Windows encoding
    import sys
    if sys.platform == "win32":
        import codecs
        sys.stdout = codecs.getwriter("utf-8")(sys.stdout.buffer)
    
    # Generate statistics
    stats = generate_statistics(all_analyses)
    
    # Print summary
    print(f"\n[SUMMARY]")
    print(f"   Total words: {stats['summary']['total_words']}")
    print(f"   Unique words: {stats['summary']['unique_words']}")
    print(f"   Type-token ratio: {stats['summary']['type_token_ratio']}")
    print(f"   Avg confidence: {stats['summary']['average_confidence']}")
    
    print(f"\n[POS DISTRIBUTION]")
    for pos, count in sorted(stats['pos_distribution'].items(), key=lambda x: -x[1]):
        pct = count / stats['summary']['total_words'] * 100
        print(f"   {pos}: {count} ({pct:.1f}%)")
    
    print(f"\n[POS CATEGORY DISTRIBUTION]")
    for cat, count in sorted(stats['pos_category_distribution'].items(), key=lambda x: -x[1]):
        pct = count / stats['summary']['total_words'] * 100
        print(f"   {cat}: {count} ({pct:.1f}%)")
    
    print(f"\n[CLASSIFICATION METHODS]")
    for method, count in sorted(stats['classification_methods'].items(), key=lambda x: -x[1]):
        pct = count / stats['summary']['total_words'] * 100
        print(f"   {method}: {count} ({pct:.1f}%)")
    
    # Save outputs
    save_outputs(all_analyses, stats)
    
    print(f"\n✅ Analysis complete!")

if __name__ == "__main__":
    main()