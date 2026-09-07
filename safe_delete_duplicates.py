#!/usr/bin/env python3
"""
Safe duplicate deletion script for E:\Tarbyatemorabbi
- Dry-run by default
- Requires explicit confirmation
- Keeps canonical files (in organized folders), deletes from "New folder*" paths
- Full audit logging
"""

import json
import os
import shutil
from pathlib import Path
from datetime import datetime

E_ROOT = Path(r"E:\Tarbyatemorabbi")
REPORT_PATH = Path("dedup_report_E.json")
LOG_DIR = E_ROOT / "Duplicate_Deletion_Logs"
LOG_DIR.mkdir(exist_ok=True)

# Canonical path prefixes (keep these)
CANONICAL_PREFIXES = [
    "01-دوره تربیت مربی-",
    "02-دوره تربیت مربی-",
    "03-دوره تربیت مربی-",
    "04-دوره تربیت مربی-",
    "05-دوره تربیت مربی-",
    "06-جلسات مربیان-",
    "07-جلسات مربیان-",
    "08-جلسات مربیان-",
    "09-جلسات مربیان-",
    "10-متفرقه",
    "11-دوره تربیت مربی-",
    "12-دوره تربیت مربی-",
    "13-دوره تربیت مربی-",
    "14-دوره تربیت مربی-",
    "15-جلسات تربیت مربی",
    "16-دانلود تربیت مربی",
    "17-دوره تربیت مربی-",
    "25-آموزش مربیان-",
    "27-دوره تربیت مربی-",
    "28-جلسات مربیان-",
    "29-تربیت ماندگار",
    "پادکست  پاپیروس",
    "محتوای آموزشی",
    "بدایة العربیه",
    "نهضت تربیتی حضرت",
    "معماری-سامانه-تربیت-مربی",
]

# Paths to prefer deleting (non-canonical)
DELETE_PREFERRED_PREFIXES = [
    "New folder",
    "New folder (2)",
    "audio.mp3",  # root audio.mp3 - keep one in canonical location
]

def is_canonical(path_str):
    """Check if path is in a canonical/organized folder"""
    for prefix in CANONICAL_PREFIXES:
        if path_str.startswith(prefix):
            return True
    return False

def is_delete_preferred(path_str):
    """Check if path is in a folder we prefer to delete from"""
    for prefix in DELETE_PREFERRED_PREFIXES:
        if path_str.startswith(prefix):
            return True
    return False

def select_file_to_keep(files):
    """
    Select which file to KEEP from a duplicate group.
    Priority: canonical path > shorter path > first occurrence
    """
    canonical_files = [f for f in files if is_canonical(f['path'])]
    if canonical_files:
        # Prefer the one with shortest relative path (less nested)
        return min(canonical_files, key=lambda x: len(x['path']))
    
    # No canonical - prefer non-"New folder" paths
    non_new_folder = [f for f in files if not is_delete_preferred(f['path'])]
    if non_new_folder:
        return min(non_new_folder, key=lambda x: len(x['path']))
    
    # All are in New folder - keep the one with shortest path
    return min(files, key=lambda x: len(x['path']))

def analyze_duplicates():
    """Analyze all duplicate groups and create deletion plan"""
    with open(REPORT_PATH, 'r', encoding='utf-8') as f:
        report = json.load(f)
    
    deletion_plan = []
    total_space_saved = 0
    
    for group in report['duplicates']:
        if group['count'] <= 1:
            continue
        
        keep_file = select_file_to_keep(group['files'])
        delete_files = [f for f in group['files'] if f != keep_file]
        
        if not delete_files:
            continue
        
        group_plan = {
            'hash': group['hash'],
            'size_mb': group['size_mb'],
            'keep': {
                'path': keep_file['path'],
                'name': keep_file['name'],
                'reason': 'canonical' if is_canonical(keep_file['path']) else 'shortest_path'
            },
            'delete': []
        }
        
        for df in delete_files:
            full_path = E_ROOT / df['path']
            exists = full_path.exists()
            size_mb = round(full_path.stat().st_size / 1024 / 1024, 2) if exists else 0
            group_plan['delete'].append({
                'path': df['path'],
                'name': df['name'],
                'exists': exists,
                'size_mb': size_mb,
                'reason': 'duplicate_in_new_folder' if is_delete_preferred(df['path']) else 'duplicate_non_canonical'
            })
            total_space_saved += size_mb
        
        deletion_plan.append(group_plan)
    
    return deletion_plan, total_space_saved

def dry_run():
    """Show what would be deleted without actually deleting"""
    plan, total_space = analyze_duplicates()
    
    # Show top 20 by space saved
    plan_sorted = sorted(plan, key=lambda x: sum(d['size_mb'] for d in x['delete']), reverse=True)
    
    # Write full plan to file (avoid console encoding issues)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    plan_file = LOG_DIR / f"deletion_plan_{timestamp}.json"
    with open(plan_file, 'w', encoding='utf-8') as f:
        json.dump({
            'timestamp': timestamp,
            'total_groups': len(plan),
            'total_files_to_delete': sum(len(g['delete']) for g in plan),
            'total_space_mb': round(total_space, 1),
            'plan': plan
        }, f, ensure_ascii=False, indent=2)
    
    # Print summary to console (ASCII only)
    print("=" * 70)
    print("DRY RUN - DUPLICATE DELETION PLAN")
    print("=" * 70)
    print(f"Total duplicate groups with actionable deletions: {len(plan)}")
    print(f"Total space that would be freed: {total_space:.1f} MB ({total_space/1024:.2f} GB)")
    print()
    
    print("TOP 20 GROUPS BY SPACE SAVED:")
    print("-" * 70)
    for i, group in enumerate(plan_sorted[:20]):
        space = sum(d['size_mb'] for d in group['delete'])
        print(f"\n{i+1}. Group: {group['hash'][:16]}... ({group['size_mb']:.1f} MB each)")
        print(f"   KEEP: {group['keep']['reason']}")
        for d in group['delete']:
            status = "EXISTS" if d['exists'] else "MISSING"
            print(f"   DELETE: {d['reason']} ({d['size_mb']:.1f} MB) - {status}")
    
    # Summary by folder
    print("\n" + "=" * 70)
    print("SUMMARY BY FOLDER TO DELETE FROM:")
    print("-" * 70)
    folder_stats = {}
    for group in plan:
        for d in group['delete']:
            if d['exists']:
                folder = str(Path(d['path']).parent)
                if folder not in folder_stats:
                    folder_stats[folder] = {'count': 0, 'size_mb': 0}
                folder_stats[folder]['count'] += 1
                folder_stats[folder]['size_mb'] += d['size_mb']
    
    for folder, stats in sorted(folder_stats.items(), key=lambda x: x[1]['size_mb'], reverse=True)[:30]:
        print(f"  {folder}: {stats['count']} files, {stats['size_mb']:.1f} MB")
    
    print(f"\nFull plan saved to: {plan_file}")
    return plan, plan_file

def execute_deletion(plan_file):
    """Execute the deletion plan"""
    with open(plan_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    plan = data['plan']
    deleted = []
    failed = []
    total_freed = 0
    
    print("\n" + "=" * 70)
    print("EXECUTING DELETION...")
    print("=" * 70)
    
    for group in plan:
        for d in group['delete']:
            if not d['exists']:
                continue
            full_path = E_ROOT / d['path']
            try:
                # Move to recycle bin equivalent (hidden folder) instead of permanent delete
                trash_dir = E_ROOT / ".Trash_Duplicates" / datetime.now().strftime("%Y%m%d")
                trash_dir.mkdir(parents=True, exist_ok=True)
                trash_path = trash_dir / d['name']
                
                # Handle name collisions in trash
                counter = 1
                while trash_path.exists():
                    stem = Path(d['name']).stem
                    suffix = Path(d['name']).suffix
                    trash_path = trash_dir / f"{stem}_{counter}{suffix}"
                    counter += 1
                
                shutil.move(str(full_path), str(trash_path))
                freed = d['size_mb']
                total_freed += freed
                deleted.append({
                    'original_path': d['path'],
                    'trash_path': str(trash_path.relative_to(E_ROOT)),
                    'size_mb': freed
                })
                print(f"  MOVED TO TRASH: {d['path']} ({freed:.1f} MB)")
            except Exception as e:
                failed.append({
                    'path': d['path'],
                    'error': str(e)
                })
                print(f"  FAILED: {d['path']} - {e}")
    
    # Save execution log
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    log_file = LOG_DIR / f"deletion_log_{timestamp}.json"
    with open(log_file, 'w', encoding='utf-8') as f:
        json.dump({
            'timestamp': timestamp,
            'plan_file': str(plan_file),
            'deleted_count': len(deleted),
            'failed_count': len(failed),
            'total_freed_mb': round(total_freed, 1),
            'deleted': deleted,
            'failed': failed
        }, f, ensure_ascii=False, indent=2)
    
    print(f"\n{'=' * 70}")
    print(f"DELETION COMPLETE")
    print(f"  Files moved to trash: {len(deleted)}")
    print(f"  Failed: {len(failed)}")
    print(f"  Space freed: {total_freed:.1f} MB ({total_freed/1024:.2f} GB)")
    print(f"  Trash location: E:\\Tarbyatemorabbi\\.Trash_Duplicates\\")
    print(f"  Log saved to: {log_file}")
    print(f"{'=' * 70}")

def main():
    import sys
    
    print("=" * 70)
    print("SAFE DUPLICATE DELETION TOOL")
    print("=" * 70)
    
    # Step 1: Dry run
    plan, plan_file = dry_run()
    
    if not plan:
        print("No duplicates to delete.")
        return
    
    # Step 2: Ask for confirmation
    print("\n" + "=" * 70)
    print("CONFIRMATION REQUIRED")
    print("=" * 70)
    print("This will MOVE duplicate files to a trash folder (.Trash_Duplicates)")
    print("Files are NOT permanently deleted - they can be restored from trash.")
    print()
    
    # Show summary again
    total_files = sum(len(g['delete']) for g in plan)
    total_space = sum(d['size_mb'] for g in plan for d in g['delete'] if d['exists'])
    print(f"Files to move: {total_files}")
    print(f"Space to free: {total_space:.1f} MB")
    print()
    
    # Double confirmation
    confirm1 = input("Type 'YES' to proceed with moving files to trash: ").strip()
    if confirm1 != 'YES':
        print("Cancelled. No files were moved.")
        return
    
    confirm2 = input("Are you absolutely sure? Type 'CONFIRM' to execute: ").strip()
    if confirm2 != 'CONFIRM':
        print("Cancelled. No files were moved.")
        return
    
    # Step 3: Execute
    execute_deletion(plan_file)

if __name__ == '__main__':
    main()