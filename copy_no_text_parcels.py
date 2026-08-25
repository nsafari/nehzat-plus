#!/usr/bin/env python3
"""
Copy audio files without matching text sidecars, in parcels to avoid timeout.
Processes G: first (Telegram exports), then E: if needed.
"""

import hashlib
import shutil
import json
from pathlib import Path

# Config
E_ROOT = Path(r"E:\Tarbyatemorabbi")
G_ROOTS = [
    Path(r"G:\صوت نهضت"),
    Path(r"G:\1404"),
    Path(r"G:\Download"),
    Path(r"G:\Bandicam"),
]
TARGET = E_ROOT / "ZeroKB_Text_Duplicates_Audio"
TARGET.mkdir(exist_ok=True)

AUDIO_EXTS = {'.mp3', '.mp4', '.m4a', '.aac', '.wav', '.ogg', '.MP3', '.MP4', '.M4A', '.AAC', '.WAV', '.OGG'}
TEXT_EXTS = {'.txt', '.srt', '.md'}

# Load already-copied hashes from JSON
JSON_PATH = Path(r"D:\nehzat-plus\nehzat-plus\zero_kb_text_duplicates.json")
already_copied_hashes = set()
if JSON_PATH.exists():
    with open(JSON_PATH) as f:
        data = json.load(f)
    for entry in data.get("files", []):
        already_copied_hashes.add(entry["hash"])

print(f"Already in target: {len(already_copied_hashes)} unique hashes")

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

def has_text_sidecar(audio_path):
    """Check if any text sidecar exists with same stem and >0 size"""
    for text_ext in TEXT_EXTS:
        text_path = audio_path.with_suffix(text_ext)
        if text_path.exists() and text_path.stat().st_size > 0:
            return True, text_path
    return False, None

def copy_if_no_text(audio_path):
    """Copy audio file to target if it has no text sidecar"""
    has_text, text_path = has_text_sidecar(audio_path)
    if has_text:
        return "skipped", audio_path.name
    
    h, size = file_hash(audio_path)
    if not h:
        return "error", audio_path.name
    
    # Skip if already copied (by hash)
    if h in already_copied_hashes:
        return "already_copied", audio_path.name
    
    # Copy to target preserving name
    dest = TARGET / audio_path.name
    # Handle if already exists (different file, same name)
    if dest.exists():
        stem = audio_path.stem
        ext = audio_path.suffix
        counter = 1
        while dest.exists():
            dest = TARGET / f"{stem}_{counter}{ext}"
            counter += 1
    
    try:
        shutil.copy2(audio_path, dest)
        already_copied_hashes.add(h)
        return "copied", audio_path.name
    except Exception as e:
        return "error", f"{audio_path.name}:{e}"

def scan_and_process(root, label):
    """Scan a drive/root and process audio files"""
    print(f"\n{'='*60}")
    print(f"Scanning {label}: {root}")
    print(f"{'='*60}")
    
    results = {"copied": 0, "skipped": 0, "error": 0, "already_copied": 0}
    files_processed = 0
    
    try:
        items = list(root.rglob('*'))
    except Exception as e:
        print(f"Cannot access {root}: {e}")
        return results
    
    for p in items:
        if not p.is_file():
            continue
        if p.suffix not in AUDIO_EXTS:
            continue
        
        result, detail = copy_if_no_text(p)
        files_processed += 1
        
        results[result] += 1
        
        if files_processed % 20 == 0:
            print(f"  Processed {files_processed}: copied={results['copied']}, "
                  f"skipped={results['skipped']}, error={results['error']}, "
                  f"already_copied={results['already_copied']}")
    
    print(f"  → {label} complete: {results}")
    return results

# Process G: drives first
all_g_results = {}
for g_root in G_ROOTS:
    if g_root.exists():
        r = scan_and_process(g_root, f"G: ({g_root.name})")
        all_g_results[g_root] = r
    else:
        print(f"\n{G_ROOTS} does not exist, skipping...")

# Process E:
if E_ROOT.exists():
    r = scan_and_process(E_ROOT, "E:")
    all_g_results["E:"] = r
else:
    print("\nE: does not exist")

# Final summary
print(f"\n{'='*60}")
print("FINAL SUMMARY")
print(f"{'='*60}")
total = {"copied": 0, "skipped": 0, "error": 0, "already_copied": 0}
for r in all_g_results.values():
    for k in total:
        total[k] += r[k]

print(f"  Copied:          {total['copied']}")
print(f"  Already had text:{total['skipped']}")
print(f"  Errors:          {total['error']}")
print(f"  Already in JSON: {total['already_copied']}")
print(f"  Total files checked: {sum(total.values())}")
print(f"\nTarget folder: {TARGET}")
print(f"Files in target: {len(list(TARGET.rglob('*')))} (files only)")
print(f"{'='*60}")