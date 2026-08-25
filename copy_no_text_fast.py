#!/usr/bin/env python3
"""
Copy audio files without matching text sidecar (.txt with same stem).
Uses os.walk for speed on large Windows trees.
"""

import shutil
import os
from pathlib import Path

TARGET_DIR = Path(r"E:\Tarbyatemorabbi\ZeroKB_Text_Duplicates_Audio")
TARGET_DIR.mkdir(exist_ok=True)

SCAN_ROOTS = [
    Path("E:"),
    Path(r"G:\1404"),
    Path(r"G:\Download"),
    Path(r"G:\Bandicam"),
    Path(r"G:\GHBook"),
    Path(r"G:\LDPlayer"),
    Path(r"G:\New folder"),
    Path(r"G:\New folder (2)"),
]

AUDIO_EXT = ('.mp3', '.mp4', '.m4a', '.aac', '.wav', '.ogg', '.flac', '.wma', '.opus', '.webm')
TEXT_EXT = ('.txt', '.srt', '.md')
SKIP_DIR_NAMES = {'.trash_duplicates', '$recycle.bin', 'system volume information', 'zerokb_text_duplicates_audio'}

already_copied_names = set()
if TARGET_DIR.exists():
    for p in TARGET_DIR.rglob('*'):
        if p.is_file() and p.suffix.lower() in AUDIO_EXT:
            already_copied_names.add(p.name.lower())

print(f"Already in target: {len(already_copied_names)} audio filenames")

def _has_text_sidecar(audio_path):
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

def _copy_if_no_text(audio_path):
    if _has_text_sidecar(audio_path):
        return "skipped", audio_path.name
    if audio_path.name.lower() in already_copied_names:
        return "already_copied", audio_path.name
    dest = TARGET_DIR / audio_path.name
    if dest.exists():
        stem = audio_path.stem
        ext = audio_path.suffix
        counter = 1
        while dest.exists():
            dest = TARGET_DIR / f"{stem}_{counter}{ext}"
            counter += 1
    try:
        shutil.copy2(audio_path, dest)
        already_copied_names.add(dest.name.lower())
        return "copied", audio_path.name
    except Exception as e:
        return "error", f"{audio_path.name}:{e}"

def _walk_clean(root):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d.lower() not in SKIP_DIR_NAMES]
        for fname in filenames:
            if fname.lower().endswith(AUDIO_EXT):
                yield Path(dirpath) / fname

def scan_folder(root, label):
    print(f"\nScanning {label}: {root}")
    if not root.exists():
        print("  Folder does not exist")
        return {"copied": 0, "skipped": 0, "error": 0, "already_copied": 0}
    results = {"copied": 0, "skipped": 0, "error": 0, "already_copied": 0}
    count = 0
    for audio_path in _walk_clean(root):
        count += 1
        result, detail = _copy_if_no_text(audio_path)
        results[result] += 1
        if count % 100 == 0:
            print(f"  Processed {count}: copied={results['copied']}, skipped={results['skipped']}, error={results['error']}, already_copied={results['already_copied']}")
    print(f"> {label}: {count} files, copied={results['copied']}")
    return results

all_results = {}
for root in SCAN_ROOTS:
    if root.exists():
        all_results[root] = scan_folder(root, f"{root.drive} ({root.name})")
    else:
        print(f"\n  {root} does not exist, skipping...")

total = {"copied": 0, "skipped": 0, "error": 0, "already_copied": 0}
for r in all_results.values():
    for k in total:
        total[k] += r[k]

print(f"\n{'='*60}")
print("FINAL SUMMARY")
print(f"{'='*60}")
print(f"  Copied:          {total['copied']}")
print(f"  Already had text:{total['skipped']}")
print(f"  Errors:          {total['error']}")
print(f"  Already in target:{total['already_copied']}")
print(f"  Total audio checked: {sum(total.values())}")
print(f"\nTarget folder: {TARGET_DIR}")
if TARGET_DIR.exists():
    target_files = len([f for f in TARGET_DIR.rglob('*') if f.is_file()])
    print(f"  Files in target: {target_files}")
print(f"{'='*60}")
