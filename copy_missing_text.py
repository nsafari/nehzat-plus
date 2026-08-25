#!/usr/bin/env python3
"""
Copy text sidecars (.txt, .srt, .md) to audio files that are missing them.
Uses hash matching to find the correct text file from canonical locations.
"""

import hashlib
import shutil
import json
from pathlib import Path

E_ROOT = Path(r"E:\Tarbyatemorabbi")
G_ROOTS = [
    Path("G:/صوت نهضت"),
    Path("G:/1404"),
    Path("G:/Download"),
    Path("G:/Bandicam"),
]

AUDIO_EXTS = {'.mp3', '.mp4', '.m4a', '.aac', '.wav', '.ogg', '.MP3', '.MP4', '.M4A', '.AAC', '.WAV', '.OGG'}
TEXT_EXTS = {'.txt', '.srt', '.md'}

def file_hash(path):
    """Quick hash: first 64KB + last 64KB + size"""
    try:
        stat = path.stat()
        size = stat.st_size
        h = hashlib.sha256()
        with open(path, 'rb') as f:
            h.update(f.read(65536))
            f.seek(max(0, size - 65536))
            h.update(f.read(65536))
            h.update(str(size).encode())
        return h.hexdigest(), size
    except Exception:
        return None, 0

def main():
    print("Building hash index of all text files in E (canonical)...")
    
    # Index all text files in E by hash
    text_index = {}  # hash -> list of text file paths
    for p in E_ROOT.rglob('*'):
        if p.is_file() and p.suffix in TEXT_EXTS:
            h, size = file_hash(p)
            if h:
                if h not in text_index:
                    text_index[h] = []
                text_index[h].append(p)
    
    print(f"Indexed {len(text_index)} unique text file hashes from E")
    
    # Also index audio files in E by hash to find their text sidecars
    audio_text_map = {}  # audio_hash -> text_path
    for p in E_ROOT.rglob('*'):
        if p.is_file() and p.suffix in AUDIO_EXTS:
            h, size = file_hash(p)
            if h:
                # Check for text sidecars
                for text_ext in TEXT_EXTS:
                    text_path = p.with_suffix(text_ext)
                    if text_path.exists() and text_path.stat().st_size > 0:
                        audio_text_map[h] = text_path
                        break
    
    print(f"Mapped {len(audio_text_map)} audio hashes to their text sidecars in E")
    
    # Now scan all audio files in E and G, copy missing text
    all_roots = [E_ROOT] + G_ROOTS
    copied = 0
    skipped = 0
    not_found = 0
    
    for root in all_roots:
        if not root.exists():
            continue
        print(f"\nScanning {root}...")
        for p in root.rglob('*'):
            if p.is_file() and p.suffix in AUDIO_EXTS:
                # Check if already has text sidecar
                has_text = False
                for text_ext in TEXT_EXTS:
                    text_path = p.with_suffix(text_ext)
                    if text_path.exists() and text_path.stat().st_size > 0:
                        has_text = True
                        break
                
                if has_text:
                    skipped += 1
                    continue
                
                # Find matching text by hash
                h, size = file_hash(p)
                if not h:
                    continue
                
                source_text = None
                if h in audio_text_map:
                    source_text = audio_text_map[h]
                elif h in text_index:
                    # Pick the first text file with this hash
                    source_text = text_index[h][0]
                
                if source_text and source_text.exists():
                    # Copy to audio file location with same stem
                    dest_text = p.with_suffix(source_text.suffix)
                    try:
                        shutil.copy2(source_text, dest_text)
                        copied += 1
                        if copied % 50 == 0:
                            print(f"  Copied {copied}...")
                    except Exception as e:
                        pass
                else:
                    not_found += 1
    
    print(f"\n{'='*50}")
    print(f"COMPLETE")
    print(f"  Copied: {copied} text files")
    print(f"  Already had text: {skipped}")
    print(f"  No matching text found: {not_found}")
    print(f"{'='*50}")

if __name__ == '__main__':
    main()