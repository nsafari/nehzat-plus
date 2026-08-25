#!/usr/bin/env python3
"""Diagnose only: count audio files without text that are NOT yet in target. No copying."""
import os
import sys
from pathlib import Path

# Fix console encoding for Persian folder names
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

TARGET_DIR = Path(r"E:\Tarbyatemorabbi\ZeroKB_Text_Duplicates_Audio")
AUDIO_EXT = ('.mp3', '.mp4', '.m4a', '.aac', '.wav', '.ogg', '.flac', '.wma', '.opus', '.webm')
TEXT_EXT = ('.txt', '.srt', '.md')
SKIP_DIR_NAMES = {'.trash_duplicates', '$recycle.bin', 'system volume information', 'zerokb_text_duplicates_audio'}

already_copied = set()
if TARGET_DIR.exists():
    for p in TARGET_DIR.rglob('*'):
        if p.is_file() and p.suffix.lower() in AUDIO_EXT:
            already_copied.add(p.name.lower())
print(f"Target has {len(already_copied)} audio filenames")

def has_text(audio_path):
    stem = audio_path.stem
    parent = audio_path.parent
    for ext in TEXT_EXT:
        cp = parent / f"{stem}{ext}"
        try:
            if cp.exists() and cp.stat().st_size > 0:
                return True
        except OSError:
            pass
    return False

def diag_dir(dirpath):
    total = no_text = need_copy = 0
    for dirpath_, dirnames, filenames in os.walk(dirpath):
        dirnames[:] = [d for d in dirnames if d.lower() not in SKIP_DIR_NAMES]
        for fname in filenames:
            if fname.lower().endswith(AUDIO_EXT):
                total += 1
                ap = Path(dirpath_) / fname
                if not has_text(ap):
                    no_text += 1
                    if ap.name.lower() not in already_copied:
                        need_copy += 1
    return total, no_text, need_copy

# Discover E: subdirs that contain audio
print("\n=== E: subdirs ===")
grand = {"total": 0, "no_text": 0, "need_copy": 0}
try:
    for entry in os.listdir(r"E:"):
        full = os.path.join(r"E:", entry)
        if not os.path.isdir(full):
            continue
        if entry.lower() in SKIP_DIR_NAMES:
            continue
        t, n, c = diag_dir(full)
        if t > 0:
            print(f"  {entry!r}: total={t} no_text={n} need_copy={c}")
            grand["total"] += t; grand["no_text"] += n; grand["need_copy"] += c
except Exception as e:
    print(f"  E: error: {e}")

# G: roots
G_ROOTS = [r"G:\1404", r"G:\Download", r"G:\Bandicam", r"G:\GHBook", r"G:\LDPlayer", r"G:\New folder", r"G:\New folder (2)"]
print("\n=== G: roots ===")
for g in G_ROOTS:
    if not os.path.isdir(g):
        continue
    t, n, c = diag_dir(g)
    print(f"  {g}: total={t} no_text={n} need_copy={c}")
    grand["total"] += t; grand["no_text"] += n; grand["need_copy"] += c

print(f"\n=== GRAND TOTAL === total={grand['total']} no_text={grand['no_text']} need_copy={grand['need_copy']}")
