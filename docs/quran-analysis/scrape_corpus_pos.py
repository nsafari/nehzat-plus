#!/usr/bin/env python3
"""
Scrape Quranic Arabic Corpus POS tags from corpus.quran.com
Word-by-word pages for 4 Surahs: Nuh (71), Al-Hashr (59), Al-Fath (48), Al-Hujurat (49)
"""

import re
import json
import time
import requests
from pathlib import Path
from bs4 import BeautifulSoup
from typing import Dict, List, Any
from dataclasses import dataclass, asdict

SURAHS = {
    71: ("Nuh", 28),
    59: ("Al-Hashr", 24),
    48: ("Al-Fath", 29),
    49: ("Al-Hujurat", 18)
}

OUTPUT_DIR = Path(__file__).parent
BASE_URL = "https://corpus.quran.com/wordbyword.jsp"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

@dataclass
class WordPOS:
    surah: int
    verse: int
    word_index: int
    arabic: str
    transliteration: str
    translation: str
    pos_tags: List[Dict[str, str]]  # [{"pos": "ACC", "desc": "accusative particle"}, ...]

def parse_word_entry(text: str) -> Dict[str, Any]:
    """Parse a word entry from the corpus page."""
    # Pattern: (71:1:1) inn? Indeed, We ACC ? accusative particle PRON ? 1st person plural object pronoun
    lines = text.strip().split('\n')
    if not lines:
        return None
    
    # First line: (71:1:1)
    header_match = re.match(r'\((\d+):(\d+):(\d+)\)', lines[0])
    if not header_match:
        return None
    
    surah = int(header_match.group(1))
    verse = int(header_match.group(2))
    word_index = int(header_match.group(3))
    
    # Find arabic text (usually in the middle with unicode chars)
    arabic = ""
    transliteration = ""
    translation = ""
    pos_tags = []
    
    # The structure varies, let's parse more carefully
    # Looking for lines with POS tags like "ACC ? accusative particle"
    
    for line in lines[1:]:
        line = line.strip()
        if not line:
            continue
        
        # Check for POS tags pattern: "TAG ? description"
        pos_match = re.match(r'^([A-Z]{2,5})\s*\?\s*(.+)$', line)
        if pos_match:
            pos_tags.append({
                "pos": pos_match.group(1),
                "description": pos_match.group(2).strip()
            })
        elif not transliteration and re.match(r'^[a-z\?\-\']+$', line):
            transliteration = line
        elif not translation and any(c.isalpha() for c in line) and '?' not in line:
            # Could be translation
            if not arabic and any('\u0600' <= c <= '\u06FF' for c in line):
                arabic = line
            else:
                translation = line
        elif any('\u0600' <= c <= '\u06FF' for c in line) and not arabic:
            arabic = line
    
    return {
        "surah": surah,
        "verse": verse,
        "word_index": word_index,
        "arabic": arabic,
        "transliteration": transliteration,
        "translation": translation,
        "pos_tags": pos_tags
    }

def fetch_surah_page(surah: int, verse: int, max_retries: int = 3) -> str:
    """Fetch a single verse page with retries."""
    url = f"{BASE_URL}?chapter={surah}&verse={verse}"
    for attempt in range(max_retries):
        try:
            response = requests.get(url, headers=HEADERS, timeout=30)
            if response.status_code == 200:
                return response.text
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
                continue
            print(f"  Error fetching {surah}:{verse} (attempt {attempt+1}): {e}")
    return ""

def extract_words_from_html(html: str) -> List[Dict]:
    """Extract word data from the corpus morphologyTable."""
    soup = BeautifulSoup(html, 'html.parser')
    words = []
    
    table = soup.find("table", class_="morphologyTable")
    if not table:
        return words
    
    rows = table.find_all("tr")
    for row in rows:
        if row.find("td", class_="head3"):
            continue
        
        cells = row.find_all("td")
        if len(cells) < 3:
            continue
        
        location_span = cells[0].find("span", class_="location")
        if not location_span:
            continue
        
        loc_text = location_span.get_text(strip=True)
        loc_match = re.match(r'\((\d+):(\d+):(\d+)\)', loc_text)
        if not loc_match:
            continue
        
        surah = int(loc_match.group(1))
        verse = int(loc_match.group(2))
        word_index = int(loc_match.group(3))
        
        phonetic_span = cells[0].find("span", class_="phonetic")
        transliteration = phonetic_span.get_text(strip=True) if phonetic_span else ""
        
        cell0_text = cells[0].get_text(separator="\n", strip=True)
        lines = cell0_text.split("\n")
        translation = lines[-1] if len(lines) > 1 else ""
        
        pos_tags = []
        for b_tag in cells[2].find_all("b"):
            pos_code = b_tag.get_text(strip=True)
            desc_text = ""
            next_sibling = b_tag.next_sibling
            if next_sibling:
                desc_text = str(next_sibling).strip().lstrip("–").lstrip("-").lstrip("—").strip()
                if desc_text.startswith("&ndash;") or desc_text.startswith("–"):
                    desc_text = desc_text.lstrip("&ndash;").lstrip("–").lstrip("-").strip()
            pos_tags.append({"pos": pos_code, "description": desc_text})
        
        words.append({
            "surah": surah,
            "verse": verse,
            "word_index": word_index,
            "arabic": "",
            "transliteration": transliteration,
            "translation": translation,
            "pos_tags": pos_tags
        })
    
    return words

def scrape_all_surahs():
    existing_file = OUTPUT_DIR / "corpus_pos_raw.json"
    all_words = []
    
    if existing_file.exists():
        with open(existing_file, "r", encoding="utf-8") as f:
            all_words = json.load(f)
        valid_words = [w for w in all_words if w.get("pos_tags")]
        if valid_words:
            all_words = valid_words
            print(f"Resuming: {len(all_words)} words with POS tags already scraped")
        else:
            all_words = []
            print("Old data has no POS tags - re-scraping from scratch")
    
    for surah_num, (surah_name, verse_count) in SURAHS.items():
        print(f"\nScraping Surah {surah_num} ({surah_name}) - {verse_count} verses...")
        
        for verse_num in range(1, verse_count + 1):
            verse_words = [w for w in all_words if w["surah"] == surah_num and w["verse"] == verse_num]
            if verse_words and any(w.get("pos_tags") for w in verse_words):
                print(f"  Verse {verse_num}/{verse_count}... SKIPPED ({len(verse_words)} words)")
                continue
            
            print(f"  Verse {verse_num}/{verse_count}...", end=" ", flush=True)
            
            html = fetch_surah_page(surah_num, verse_num)
            if not html:
                print("FAILED")
                continue
            
            words = extract_words_from_html(html)
            if words:
                for w in words:
                    w["surah_name"] = surah_name
                all_words.extend(words)
                print(f"OK ({len(words)} words)")
                
                with open(existing_file, "w", encoding="utf-8") as f:
                    json.dump(all_words, f, ensure_ascii=False, indent=2)
            else:
                print("NO WORDS")
            
            time.sleep(1)
    
    return all_words

def main():
    print("=" * 60)
    print("SCRAPING QURANIC ARABIC CORPUS POS TAGS")
    print("=" * 60)
    
    all_words = scrape_all_surahs()
    
    print(f"\n{'=' * 60}")
    print(f"TOTAL WORDS SCRAPED: {len(all_words)}")
    print(f"{'=' * 60}")
    
    # Save raw data
    with open(OUTPUT_DIR / "corpus_pos_raw.json", "w", encoding="utf-8") as f:
        json.dump(all_words, f, ensure_ascii=False, indent=2)
    
    print(f"\n[OK] Saved to {OUTPUT_DIR}/corpus_pos_raw.json")
    
    # Also create a simplified mapping
    pos_mapping = {}
    for w in all_words:
        key = f"{w['surah']}:{w['verse']}:{w['word_index']}"
        pos_mapping[key] = {
            "arabic": w["arabic"],
            "transliteration": w["transliteration"],
            "pos_tags": w["pos_tags"]
        }
    
    with open(OUTPUT_DIR / "corpus_pos_mapping.json", "w", encoding="utf-8") as f:
        json.dump(pos_mapping, f, ensure_ascii=False, indent=2)
    
    print(f"[OK] Saved mapping to {OUTPUT_DIR}/corpus_pos_mapping.json")

if __name__ == "__main__":
    main()