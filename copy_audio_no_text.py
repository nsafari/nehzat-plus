#!/usr/bin/env python3
"""
Copy all audio files that have NO matching text sidecar (.txt, .srt, .md) 
to a single folder in E:\Tarbyatemorabbi
"""

import shutil
from pathlib import Path

E_ROOT = Path(r"E:\Tarbyatemorabbi")
AUDIO_EXTS = {'.mp3', '.mp4', '.m4a', '.aac', '.wav', '.ogg', '.MP3', '.MP4', '.M4A', '.AAC', '.WAV', '.OGG'}
TEXT_EXTS = {'.txt', '.srt', '.md'}

# Target folder
TARGET = E_ROOT / "Audio_Without_Text"
TARGET.mkdir(exist_ok=True)

print(f"Target folder: {TARGET}")

count = 0
skipped = 0  # already has text
dupes = 0    # already in target

for p in E_ROOT.rglob('*'):
    if not p.is_file():
        continue
    if p.suffix not in AUDIO_EXTS:
        continue
    
    # Check if any text sidecar exists with same stem
    has_text = False
    for text_ext in TEXT_EXTS:
        text_path = p.with_suffix(text_ext)
        if text_path.exists() and text_path.stat().st_size > 0:
            has_text = True
            break
    
    if has_text:
        skipped += 1
        continue
    
    # Copy to target
    dest = TARGET / p.name
    # Handle duplicates
    if dest.exists():
        stem = p.stem
        ext = p.suffix
        counter = 1
        while dest.exists():
            dest = TARGET / f"{stem}_{counter}{ext}"
            counter += 1
        dupes += 1
    
    try:
        shutil.copy2(p, dest)
        count += 1
        if count % 50 == 0:
            print(f"  Copied {count}...")
    except Exception as e:
        print(f"  Error copying {p.name}: {e}")

print(f"\n{'='*50}")
print(f"COMPLETE")
print(f"  Copied: {count} audio files without text")
print(f"  Already had text: {skipped}")
print(f"  Duplicates (in target): {dupes}")
print(f"  Target: {TARGET}")
print(f"{'='*50}")