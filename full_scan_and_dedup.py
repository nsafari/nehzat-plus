#!/usr/bin/env python3
import hashlib
import shutil
import json
from pathlib import Path
from collections import defaultdict

E_ROOT = Path(r"E:\Tarbyatemorabbi")
G_ROOTS = [
    Path("G:/صوت نهضت"),
    Path("G:/1404"),
    Path("G:/_halgheh"),
    Path("G:/Download"),
    Path("G:/Bandicam"),
    Path("G:/Quran_001_604"),
]

AUDIO_EXTS = {'.mp3', '.mp4', '.m4a', '.aac', '.wav', '.ogg', '.MP3', '.MP4', '.M4A', '.AAC', '.WAV', '.OGG'}

def get_audio_files(root):
    files = []
    if not root.exists():
        return files
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
            except Exception:
                pass
    return files

def get_all_files_by_hash(root):
    """Get all files (not just audio) grouped by hash for dedup"""
    files_by_hash = defaultdict(list)
    if not root.exists():
        return files_by_hash
    for p in root.rglob('*'):
        if p.is_file():
            try:
                stat = p.stat()
                size = stat.st_size
                h = hashlib.sha256()
                with open(p, 'rb') as f:
                    h.update(f.read(65536))
                    f.seek(max(0, size - 65536))
                    h.update(f.read(65536))
                    h.update(str(size).encode())
                files_by_hash[h.hexdigest()].append({
                    'path': str(p),
                    'rel_path': str(p.relative_to(root)),
                    'size': size,
                    'name': p.name
                })
            except Exception:
                pass
    return files_by_hash

def main():
    print("=" * 60)
    print("PHASE 1: Scan E and G for audio matching")
    print("=" * 60)
    
    print("Scanning E:\\Tarbyatemorabbi...")
    e_audio = get_audio_files(E_ROOT)
    print(f"Found {len(e_audio)} audio files in E")

    all_g_audio = []
    for g_root in G_ROOTS:
        if g_root.exists():
            print(f"Scanning {g_root}...")
            g_files = get_audio_files(g_root)
            print(f"  Found {len(g_files)} audio files")
            all_g_audio.extend(g_files)
        else:
            print(f"Skipping {g_root} (not found)")

    print(f"Total G audio files: {len(all_g_audio)}")

    e_lookup = {(f['size'], f['hash']): f for f in e_audio}
    g_lookup = {(f['size'], f['hash']): f for f in all_g_audio}

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

    print(f"\nFound {len(matches)} exact audio matches by size+hash")

    copied = 0
    for m in matches:
        e_audio_path = Path(m['e_file']['path'])
        g_audio_path = Path(m['g_file']['path'])
        g_dir = g_audio_path.parent

        for ext in ['.txt', '.srt', '.md']:
            e_sidecar = e_audio_path.with_suffix(ext)
            if e_sidecar.exists():
                g_sidecar = g_dir / (g_audio_path.stem + ext)
                try:
                    shutil.copy2(e_sidecar, g_sidecar)
                    copied += 1
                except Exception:
                    pass

    print(f"Copied {copied} sidecar files to G locations")

    match_report = {
        'total_e_audio': len(e_audio),
        'total_g_audio': len(all_g_audio),
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
        json.dump(match_report, f, ensure_ascii=False, indent=2)
    print("Match report saved to match_report_full.json")

    print("\n" + "=" * 60)
    print("PHASE 2: Find duplicates in E (all file types)")
    print("=" * 60)
    
    e_all_files = get_all_files_by_hash(E_ROOT)
    total_files = sum(len(v) for v in e_all_files.values())
    print(f"Total files in E: {total_files}")
    print(f"Unique hashes: {len(e_all_files)}")
    
    duplicates = []
    for hash_val, files in e_all_files.items():
        if len(files) > 1:
            duplicates.append({
                'hash': hash_val,
                'count': len(files),
                'size_mb': round(files[0]['size'] / 1024 / 1024, 2),
                'files': [{'path': f['rel_path'], 'name': f['name']} for f in files]
            })
    
    duplicates.sort(key=lambda x: x['size_mb'], reverse=True)
    print(f"\nFound {len(duplicates)} duplicate groups")
    print(f"Total duplicate files: {sum(d['count'] for d in duplicates)}")
    print(f"Wasted space (approx): {sum(d['size_mb'] * (d['count'] - 1) for d in duplicates):.1f} MB")
    
    # Show top 20 largest duplicate groups
    print("\nTop 20 largest duplicate groups:")
    for i, d in enumerate(duplicates[:20]):
        print(f"  {i+1}. {d['size_mb']:.1f} MB x {d['count']} = {d['size_mb'] * d['count']:.1f} MB total")
        for f in d['files'][:3]:
            try:
                print(f"      {f['path']}")
            except:
                print(f"      [path with unicode chars]")
        if len(d['files']) > 3:
            print(f"      ... and {len(d['files']) - 3} more")

    dedup_report = {
        'total_files_scanned': total_files,
        'unique_hashes': len(e_all_files),
        'duplicate_groups': len(duplicates),
        'total_duplicate_files': sum(d['count'] for d in duplicates),
        'wasted_space_mb': round(sum(d['size_mb'] * (d['count'] - 1) for d in duplicates), 1),
        'duplicates': duplicates
    }
    with open('dedup_report_E.json', 'w', encoding='utf-8') as f:
        json.dump(dedup_report, f, ensure_ascii=False, indent=2)
    print("\nDedup report saved to dedup_report_E.json")

    print("\n" + "=" * 60)
    print("PHASE 3: Update metadata JSON with new match results")
    print("=" * 60)
    
    # Load existing metadata
    metadata_path = Path("E_Tarbyatemorabbi_Metadata.json")
    if metadata_path.exists():
        with open(metadata_path, 'r', encoding='utf-8') as f:
            metadata = json.load(f)
        
        # Update statistics
        metadata['statistics']['total_audio_files_scanned_E'] = len(e_audio)
        metadata['statistics']['total_audio_files_scanned_G'] = len(all_g_audio)
        metadata['statistics']['exact_matches_E_G'] = len(matches)
        metadata['statistics']['sidecars_copied_to_G'] = copied
        
        # Add new match details
        metadata['cross_drive_matches'] = match_report['match_details']
        
        # Add duplicate info
        metadata['duplicates_in_E'] = {
            'groups': len(duplicates),
            'total_duplicate_files': sum(d['count'] for d in duplicates),
            'wasted_space_mb': round(sum(d['size_mb'] * (d['count'] - 1) for d in duplicates), 1),
            'top_20': duplicates[:20]
        }
        
        # Update scan timestamp
        from datetime import datetime
        metadata['last_full_scan'] = datetime.now().isoformat()
        
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, ensure_ascii=False, indent=2)
        print(f"Updated metadata: {metadata_path}")
    else:
        print(f"Metadata file not found: {metadata_path}")

    print("\n" + "=" * 60)
    print("ALL PHASES COMPLETE")
    print("=" * 60)

if __name__ == '__main__':
    main()