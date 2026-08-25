#!/usr/bin/env python3
import hashlib
import shutil
import json
from pathlib import Path

E_ROOT = Path(r"E:\Tarbyatemorabbi")
G_ROOT = Path("G:/")

AUDIO_EXTS = {'.mp3', '.mp4', '.m4a', '.aac', '.wav', '.ogg', '.MP3', '.MP4', '.M4A', '.AAC', '.WAV', '.OGG'}

def get_audio_files(root):
    files = []
    for p in root.rglob('*'):
        if p.is_file() and p.suffix in AUDIO_EXTS:
            try:
                stat = p.stat()
                size = stat.st_size
                h = hashlib.sha256()
                with open(p, 'rb') as f:
                    h.update(f.read(65536))
                    f.seek(max(0, size - 65536))
                    h.update(f.read(65536))
                    h.update(str(size).encode())
                files.append({
                    'path': str(p),
                    'rel_path': str(p.relative_to(root)),
                    'size': size,
                    'hash': h.hexdigest(),
                    'name': p.name,
                    'root': str(root)
                })
            except Exception as e:
                pass
    return files

def main():
    print("Scanning E:\\Tarbyatemorabbi...")
    e_files = get_audio_files(E_ROOT)
    print(f"Found {len(e_files)} audio files in E")

    print(f"Scanning {G_ROOT} (full recursive)...")
    g_files = get_audio_files(G_ROOT)
    print(f"Found {len(g_files)} audio files in G")

    e_lookup = {(f['size'], f['hash']): f for f in e_files}
    g_lookup = {(f['size'], f['hash']): f for f in g_files}

    matches = []
    for key, e_info in e_lookup.items():
        if key in g_lookup:
            g_info = g_lookup[key]
            matches.append({
                'e_file': e_info,
                'g_file': g_info,
                'size': key[0],
                'hash': key[1]
            })

    print(f"\nFound {len(matches)} exact matches by size+hash")

    copied = 0
    for m in matches:
        e_audio = Path(m['e_file']['path'])
        g_audio = Path(m['g_file']['path'])
        g_dir = g_audio.parent

        for ext in ['.txt', '.srt', '.md']:
            e_sidecar = e_audio.with_suffix(ext)
            if e_sidecar.exists():
                g_sidecar = g_dir / (g_audio.stem + ext)
                try:
                    shutil.copy2(e_sidecar, g_sidecar)
                    copied += 1
                except Exception:
                    pass

    print(f"\nDone. Copied {copied} sidecar files.")

    report = {
        'total_e_files': len(e_files),
        'total_g_files': len(g_files),
        'matches': len(matches),
        'sidecars_copied': copied,
        'match_details': [
            {
                'e_path': m['e_file']['rel_path'],
                'g_path': m['g_file']['rel_path'],
                'g_root': m['g_file']['root'],
                'size_mb': round(m['size'] / 1024 / 1024, 2),
                'hash': m['hash'][:16] + '...'
            }
            for m in matches
        ]
    }
    with open('match_report_full.json', 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    print("Report saved to match_report_full.json")

if __name__ == '__main__':
    main()