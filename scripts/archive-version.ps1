<#
  archive-version.ps1 — آرشیو خودکار تگ‌های گیت در docs/PROJECT_INVENTORY.md
  ---------------------------------------------------------------
  نسخه ۲ — بهبود یافته با:
    ✅ گروه‌بندی کامیت‌ها بر اساس نوع (ویژگی، اصلاح، بازسازی، ...)
    ✅ به‌روزرسانی خودکار برچسب سکشن‌ها بر اساس مسیر تغییریافته
    ✅ آمار تغییرات فایل (تعداد فایل‌ها و خطوط)

  - با هر push (توسط git hook پیش‌پوش) یا اجرای دستی، تگ‌های جدید گیت را پیدا می‌کند
  - سربرگ فایل (نسخه جاری) را به آخرین تگ به‌روز می‌کند
  - اگر تگ جدیدی نباشد، هیچ کاری نمی‌کند (بدون خطا، بدون پیام)
  - اجرای دستی:  powershell -NoProfile -ExecutionPolicy Bypass -File scripts/archive-version.ps1
  - پیش‌نمایش:    powershell -NoProfile -ExecutionPolicy Bypass -File scripts/archive-version.ps1 -WhatIf
#>
param([switch]$WhatIf)

$ErrorActionPreference = 'SilentlyContinue'
$root = git rev-parse --show-toplevel 2>$null
if (-not $root) { exit 0 }
Set-Location $root

$mdPath = Join-Path $root 'docs/PROJECT_INVENTORY.md'
if (-not (Test-Path -LiteralPath $mdPath)) { exit 0 }

$content = [IO.File]::ReadAllText($mdPath, [Text.Encoding]::UTF8)

# ─── نسخه فعلی آرشیو از سربرگ ───────────────────────────────────────
$m = [regex]::Match($content, 'نسخه:\*\*\s*v?([0-9]+\.[0-9]+\.[0-9]+)')
if (-not $m.Success) { exit 0 }
$archived = $m.Groups[1].Value

# ─── همه تگ‌ها به ترتیب زمانی ───────────────────────────────────────
$tags = @(git tag --sort=creatordate)
if ($tags.Count -eq 0) { exit 0 }

$idx = [Array]::IndexOf($tags, "v$archived")
if ($idx -lt 0) { $idx = [Array]::IndexOf($tags, $archived) }
if ($idx -lt 0 -or $idx -ge $tags.Count - 1) { exit 0 }

$newTags = @($tags[($idx + 1)..($tags.Count - 1)])
if ($newTags.Count -eq 0) { exit 0 }

# ─── نقشه مسیر فایل → شماره سکشن ─────────────────────────────────────
# سکشن‌های اصلی docs/PROJECT_INVENTORY.md:
#   1=معماری, 2=صفحات, 3=shared, 4=هسته, 5=کنترلرها, 6=موجودیت‌ها,
#   7=سرویس‌ها, 8=زیرساخت, 9=استایل, 10=موبایل, 11=تست, 13=مستندات
function Get-SectionFromPath {
    param([string]$path)
    # تست — اولویت بالاتر (قبل از مسیر والد)
    if ($path -match '\.spec\.|\.test\.') { return @(11) }
    # مستندات
    if ($path -match '^docs/') { return @(13) }
    # فرانت‌اند
    if ($path -match '^frontend/src/app/features/shared/') { return @(3) }
    if ($path -match '^frontend/src/app/features/') { return @(2) }
    if ($path -match '^frontend/src/app/core/') { return @(4) }
    if ($path -match '^frontend/src/styles|^frontend/src/.+\.css$') { return @(9) }
    if ($path -match '^frontend/capacitor|^android/') { return @(10) }
    if ($path -match '^frontend/') { return @(2) }  # سایر فرانت
    # بک‌اند
    if ($path -match 'Controllers/') { return @(5) }
    if ($path -match 'Entities/') { return @(6) }
    if ($path -match 'Services/') { return @(7) }
    if ($path -match 'Interfaces/|DTOs/') { return @(7) }
    if ($path -match 'Data/|Seeders/|Middleware/|Clients/') { return @(8) }
    if ($path -match 'Program\.cs|appsettings') { return @(1) }
    return @()
}

# ─── نام فارسی هر نوع کامیت ──────────────────────────────────────────
function Get-PersianCategory {
    param([string]$msg)
    if ($msg -match '^feat[(!]')        { return 'ویژگی‌ها' }
    if ($msg -match '^fix[(!]')          { return 'اصلاحات' }
    if ($msg -match '^refactor[(!]')     { return 'بازسازی' }
    if ($msg -match '^perf[(!]')         { return 'بهینه‌سازی' }
    if ($msg -match '^docs[(!]')         { return 'مستندات' }
    if ($msg -match '^test[(!]')         { return 'تست' }
    if ($msg -match '^style[(!]')        { return 'ظاهر' }
    if ($msg -match '^ci[(!]')           { return 'CI/CD' }
    if ($msg -match '^build[(!]')        { return 'ساخت' }
    if ($msg -match '^chore[(!]')        { return 'نگهداری' }
    if ($msg -match '^revert[(!]')       { return 'بازگشت' }
    return 'سایر'
}

# ─── ساخت سکشن تغییرات برای هر تگ جدید ────────────────────────────────
$sections = @()
$sectionUpdates = @{}  # sectionNum → latestTag (برای به‌روزرسانی برچسب)
$prev = "v$archived"

foreach ($t in $newTags) {
  $date = (git log -1 --format=%cs $t 2>$null)
  if (-not $date) { $date = Get-Date -Format 'yyyy-MM-dd' }

  # ── گروه‌بندی کامیت‌ها بر اساس نوع ──
  $commits = @(git log "$prev..$t" --no-merges --format='%s' 2>$null)
  $count = $commits.Count

  # آمار تغییرات فایل
  $diffStat = (git diff --stat "$prev..$t" 2>$null | Select-Object -Last 1)
  $changedFiles = @(git diff --name-only "$prev..$t" 2>$null)

  # گروه‌بندی کامیت‌ها
  $groups = @{}
  foreach ($c in $commits) {
    $cat = Get-PersianCategory $c
    if (-not $groups.ContainsKey($cat)) { $groups[$cat] = @() }
    $groups[$cat] += $c
  }

  # ترتیب نمایش دسته‌ها
  $catOrder = @('ویژگی‌ها', 'اصلاحات', 'بازسازی', 'بهینه‌سازی', 'مستندات', 'تست', 'ظاهر', 'CI/CD', 'ساخت', 'نگهداری', 'بازگشت', 'سایر')

  # ── نگاشت فایل → سکشن (برای به‌روزرسانی برچسب) ──
  foreach ($f in $changedFiles) {
    $secs = Get-SectionFromPath $f
    foreach ($s in $secs) {
      if ($s -gt 0) { $sectionUpdates[$s] = $t }
    }
  }

  # ── ساخت خروجی ──
  $sb2 = New-Object System.Text.StringBuilder
  [void]$sb2.Append("`r`n### نسخه $t — $date ($count کامیت)`r`n")

  if ($diffStat) {
    [void]$sb2.Append("> $diffStat`r`n")
  }

  if ($count -eq 0) {
    [void]$sb2.Append("- (بدون کامیت جدید — فقط تگ)`r`n")
  } else {
    foreach ($cat in $catOrder) {
      if (-not $groups.ContainsKey($cat)) { continue }
      $items = $groups[$cat]
      [void]$sb2.Append("`r`n#### $cat ($($items.Count))`r`n")
      foreach ($c in $items) {
        [void]$sb2.Append("- $c`r`n")
      }
    }
  }
  $sections += $sb2.ToString()
  $prev = $t
}

# ─── ترکیب خروجی ──────────────────────────────────────────────────────
$lastTag = $newTags[-1]

# به‌روزرسانی سربرگ: نسخه + تاریخ
$headerNew = $m.Value.Replace("v$archived", $lastTag)
if ($headerNew -eq $m.Value) { $headerNew = $m.Value.Replace($archived, $lastTag) }

$newContent = $content + "`r`n## تغییرات نسخه $lastTag — خودکار (archive-version.ps1)`r`n" + ($sections -join '')
$newContent = $newContent.Replace($m.Value, $headerNew)
$newContent = [regex]::Replace($newContent, '(نسخه:\*\*\s*v?' + [regex]::Escape($lastTag) + '[^`]*?—\s*)\d{4}-\d{2}-\d{2}', '${1}' + (Get-Date -Format 'yyyy-MM-dd'))

# ─── تبدیل کاراکتر فارسی/لاتین به عدد ASCII ───────────────────────────
function CharToAsciiDigit {
    param([char]$c)
    $code = [int]$c
    # ارقام لاتین 0-9
    if ($code -ge 48 -and $code -le 57) { return [string]$c }
    # ارقام عربی/فارسی ۰-۹ (U+06F0 - U+06F9)
    if ($code -ge 0x06F0 -and $code -le 0x06F9) { return [string]($code - 0x06F0) }
    return $null
}

function Extract-SectionNumber {
    param([string]$line)
    # خطوطی که با "## " شروع می‌شوند: "## ۱. عنوان" یا "## 15. عنوان"
    if (-not $line.StartsWith('## ')) { return -1 }
    $afterHash = $line.Substring(3)  # بعد از "## "
    $digits = ''
    foreach ($c in $afterHash.ToCharArray()) {
      $d = CharToAsciiDigit $c
      if ($d -ne $null) { $digits += $d }
      elseif ($digits.Length -gt 0) { break }  # اولین نقطه = پایان شماره
    }
    if ($digits.Length -eq 0) { return -1 }
    $num = 0
    if ([int]::TryParse($digits, [ref]$num)) { return $num }
    return -1
}

# ─── به‌روزرسانی برچسب سکشن‌ها ─────────────────────────────────────────
# هر سکشنی که در محدوده تگ‌های جدید تغییر کرده، برچسبش به آخرین نسخه مربوطه آپدیت می‌شود
if ($sectionUpdates.Count -gt 0) {
  $lines = $newContent -split "`r?`n"
  $inSection = -1
  for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    # تشخیص شروع سکشن جدید
    $secNum = Extract-SectionNumber $line
    if ($secNum -gt 0) { $inSection = $secNum }
    # به‌روزرسانی برچسب در صورت تطابق
    if ($inSection -gt 0 -and $sectionUpdates.ContainsKey($inSection)) {
      if ($line -match '^\s*> آخرین تغییر:\s*v?[0-9]+\.[0-9]+\.[0-9]+') {
        $lines[$i] = $line -replace 'v?[0-9]+\.[0-9]+\.[0-9]+', $sectionUpdates[$inSection]
      }
    }
  }
  $newContent = $lines -join "`r`n"
}

# ─── خروجی ─────────────────────────────────────────────────────────────
if ($WhatIf) {
  Write-Output "Archived: v$archived -> $lastTag ($($newTags.Count) tag(s))"
  if ($sectionUpdates.Count -gt 0) {
    Write-Output "`nSection labels updated:"
    foreach ($kv in $sectionUpdates.GetEnumerator() | Sort-Object { $_.Key }) {
      Write-Output "  Section $($kv.Key) -> $($kv.Value)"
    }
  }
  Write-Output ($sections -join '')
  exit 0
}

[IO.File]::WriteAllText($mdPath, $newContent, [Text.UTF8Encoding]::new($false))
Write-Output "Archived $lastTag ($($newTags.Count) tag(s)) into docs/PROJECT_INVENTORY.md"
if ($sectionUpdates.Count -gt 0) {
  Write-Output "Updated section labels: $($sectionUpdates.Keys -join ', ')"
}
exit 0
