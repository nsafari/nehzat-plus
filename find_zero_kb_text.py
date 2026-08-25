#!/usr/bin/env python3
import os
import shutil
import json
from pathlib import Path

E_ROOT = Path(r"E:\Tarbyatemorabbi")
TARGET_DIR = E_ROOT / "ZeroKB_Text_Duplicates_Audio"

AUDIO_EXTS = {'.mp3', '.mp4', '.m4a', '.aac', '.wav', '.ogg', '.MP3', '.MP4', '.M4A', '.AAC', '.WAV', '.OGG'}
TEXT_EXTS = {'.txt', '.srt', '.md'}

def find_zero_kb_text_duplicates():
    TARGET_DIR.mkdir(exist_ok=True)
    
    with open('dedup_report_E.json', 'r', encoding='utf-8') as f:
        report = json.load(f)
    
    results = []
    copied_count = 0
    
    for dup_group in report['duplicates']:
        hash_val = dup_group['hash']
        
        for file_info in dup_group['files']:
            audio_path = E_ROOT / file_info['path']
            if not audio_path.exists():
                continue
            
            if audio_path.suffix not in AUDIO_EXTS:
                continue
            
            has_zero_kb_text = False
            zero_kb_text_file = None
            
            for text_ext in TEXT_EXTS:
                text_path = audio_path.with_suffix(text_ext)
                if text_path.exists():
                    text_size = text_path.stat().st_size
                    if text_size == 0:
                        has_zero_kb_text = True
                        zero_kb_text_file = str(text_path.relative_to(E_ROOT))
                        break
            
            if has_zero_kb_text:
                target_name = f"{hash_val[:8]}_{audio_path.name}"
                target_path = TARGET_DIR / target_name
                
                try:
                    shutil.copy2(audio_path, target_path)
                    copied_count += 1
                    results.append({
                        'audio_file': str(audio_path.relative_to(E_ROOT)),
                        'zero_kb_text_file': zero_kb_text_file,
                        'audio_size_mb': round(audio_path.stat().st_size / 1024 / 1024, 2),
                        'hash': hash_val,
                        'copied_to': str(target_path.relative_to(E_ROOT))
                    })
                except Exception:
                    pass
    
    with open('zero_kb_text_duplicates.json', 'w', encoding='utf-8') as f:
        json.dump({
            'total_found': len(results),
            'target_folder': str(TARGET_DIR),
            'files': results
        }, f, ensure_ascii=False, indent=2)
    
    print(f"Done. Found {len(results)} AUDIO files with 0 KB text sidecars.")
    print(f"Copied to: {TARGET_DIR}")

if __name__ == '__main__':
    find_zero_kb_text_duplicates()