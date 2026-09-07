#!/usr/bin/env python3
import json
import shutil
from pathlib import Path
from datetime import datetime

E_ROOT = Path(r"E:\Tarbyatemorabbi")
LOG_DIR = E_ROOT / "Duplicate_Deletion_Logs"

plan_file = LOG_DIR / "deletion_plan_20260824_101520.json"

with open(plan_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

plan = data['plan']

deleted = []
failed = []
total_freed = 0

for group in plan:
    for d in group['delete']:
        if not d['exists']:
            continue
        full_path = E_ROOT / d['path']
        try:
            trash_dir = E_ROOT / ".Trash_Duplicates" / datetime.now().strftime("%Y%m%d")
            trash_dir.mkdir(parents=True, exist_ok=True)
            trash_path = trash_dir / d['name']
            
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
        except Exception as e:
            failed.append({'path': d['path'], 'error': str(e)})

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

print(f"Done. Deleted: {len(deleted)}, Failed: {len(failed)}, Freed: {total_freed:.1f} MB")
print(f"Log: {log_file}")