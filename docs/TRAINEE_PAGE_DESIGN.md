# سند طراحی صفحهٔ متربی (Trainee Page Design) — Nehzat Plus

---

## ۱. چکیده / چشمانداز (Vision)

**هدف**: صفحهٔ متربی (داشبورد متربی) به‌عنوان **پیشروترین الگوی آموزشی-مهارتی-تربیتی** در اکوسیستم Nehzat Plus، واحدِ اصلیِ تجربه‌ی روزانه متربی است. این صفحه باید هم‌سو با **ساحت‌های شش‌گانهٔ التربية** (علمی-فناورانه، اعتقادی-عبادی و اخلاقی، زیستی-بدنی، زیباشناختی-هنری، اجتماعی-سیاسی، اقتصادی-حرفه‌ای) و **علوم یادگیری پیشرو** (Khan Academy، Duolingo، Coursera) و **مهارت‌های قرن ۲۱** (۴C) باشد.

**اصل طراحی**: «خلاصه در خانه، عمق در هر ساحت» — داشبورد اصلی خلاصه‌ای یک‌صفحه‌ای از پیشرفت تمام ساحتها است؛ ورود به هر ساحت، تجربه‌ی کامل و تخصصیِ همان ساحت را می‌دهد.

---

## ۲. ساحت‌های شش‌گانهٔ تربیت — وضعیت فعلی و گزینه‌های لازم

| ساحت | وضعیت فعلی | ماژول‌های موجود در کد | گزینه‌های لازم برای کامل شدن |
|---|---|---|---|
| **علمی-فناورانه** | ✅ قوی | `features/math/` (topics, lessons, practice, scholars, progress + mastery badges) · `features/learning/` (learning-dashboard, path-detail, lesson-view, quiz-view + mastery) · `features/experimental-sciences/` · `features/persian-literature/` · `features/arabic-literature/` | ➕ آزمون تطبیقی (adaptive) · ➕ مرور فاصلهدار (spaced repetition) · ➕ مسیر یادگیری هوشمند (AI-driven) |
| **اعتقادی-عبادی و اخلاقی** | ✅ قوی | `features/quran/` (surahs, tajweed, recitation-levels — roleGuard('trainee') fixed) · `features/dashboard/spiritual` (spiritual-shell: تمرین روزانه، مناسبت‌ها، مسیر معنوی، تاریخچه، 🔥 streak) | ➕ برنامهٔ روزانهٔ عمل به مناسک · ➕ ژورنال اخلاقی/فکری · ➕ مربی معنوی (اختیاری) |
| **زیستی-بدنی** | ✅ پایه (جدید) | `features/activity/` (activity.page: فرم روزانه دقیقه/قدم/خواب/یادداشت، نوار ۷روزه، streak) · `DailyActivity` entity + API | ➕ هدفگذاری هفتگی/ماهانه · ➕ نمودار روند ۳۰ روزه · ➕ یادآور روزانه هوشمند · ➕ اتصال به پوشیدنی/سیستم‌های سلامت |
| **زیباشناختی-هنری** | 🟡 جزئی | `features/persian-literature/` (شعر/شاعران) · `features/arabic-literature/` (شعر/شاعران) | ❌ **گالری آثار هنرمندانه** · ❌ **موسیقی/سرود/تلاوت** · ❌ **خوشنویسی/خط** · ❌ **صنایع دستی/نقاشی** · ➕ نمایشگاه مجازی آثار متربیان |
| **اجتماعی-سیاسی** | ❌ غایب | — | ❌ **پروژه‌های گروهی/همکاری** · ❌ **مناظره/گفتگوی ساختاریافته** · ❌ **مشارکت اجتماعی/خیریه** · ❌ **شورای متربیان** · ➕ تابلوی مشارکت همتایان |
| **اقتصادی-حرفه‌ای** | ❌ غایب | — | ❌ **کارآموزی/مهارت عملی** · ❌ **پروژهٔ کارآفرینی** · ❌ **سبد مهارت (Skill Portfolio)** · ❌ **مدیریت زمان/برنامه‌ریزی زندگی** · ➕ گواهی مهارت‌های המאה ۲۱ |

---

## ۳. الگوهای علوم یادگیری پیشرو — وضعیت و پیشنهادی

| الگو | منبع/مرجع | وضعیت فعلی | فایل/ماژول واقعی | گزینه پیشنهادی |
|---|---|---|---|---|
| **بازخورد فوری** | Khan Academy | ✅ کامل | `features/dashboard/assessment-taker/` (instant quiz feedback) | نگهداری + بسط به تمرینات ریاضی |
| **سطح استادی (Mastery)** | Khan Academy | ✅ ۴ سطح | `core/utils/mastery.ts` (🌱 نوآموز/📖 آشنا/💪 ماهر/🏆 مسلط) · `math-lesson-detail`, `path-detail` badges | ➕ الگوریتم mastery داینامیک بر اساس تلاش/دقت/سرعت · ➕ نمودار سطح مهارت در زمان |
| **استریک/تداوم** | Duolingo | ✅ streak 🔥 | `features/shared/spiritual-shell/` (streak badge) · `features/activity/` (streak) | ➕ استریک چندساحتی (جداگانه برای هر ساحت) · ➕ استریک تیمی/گروهی |
| **مرور فاصلهدار (Spaced Repetition)** | Ebbinghaus / Anki | ❌ غایب | — | ➕ موتور SRS برای کلمات/مفاهیم/آیات · ➕ کارت‌های مرور در داشبورد روزانه · ➕ زمان‌بندی ۱/۳/۷/۲۱ روزه |
| **آزمون تطبیقی (Adaptive)** | Khan / Knewton | ❌ غایب | — | ➕ بانک سوالات با پارامترهای IRT · ➕ موتور انتخاب سوال بر اساس توانایی برآوردی |
| **XP / نشان‌ها (Badges)** | Duolingo / Classcraft | 🟡 فقط streak | streak badge در spiritual-shell و activity | ➕ سیستم XP یکپارچه · ➕ نشان‌های موضوعی (مثال: «قهرمان قرآن»، «استاد ریاضی»، «پرهیزکار») · ➕ نشان‌های رفتاری (تداوم، همکاری، خلاقیت) |
| **لیگ/رده‌بندی (Leaderboard)** | Duolingo Leagues | ❌ غایب | — | ➕ لیگ هفتگی (اختیاری، با رضایت والدین) · ➕ رده‌بندی مبتنی بر XP نه نمره · ➕ لیگ‌های دوستانه/شورایی |
| **یادآور روزانه (Nudges)** | Behavioral Design | ❌ غایب | — | ➕ اعلان هوشمند: «امروز تمرین ریاضی داری؟» · ➕ یادآور بر اساس الگوهای ضعف · ➕ کانال‌های متعدد (پوش/ایمیل/دراپلیکیشن) |
| **خودتنظیمی (SRL)** | Zimmerman / Pintrich | ❌ غایب | — | ➕ تعیین هدف شخصی (SMART) · ➕ برنامه‌ریزی مطالعه · ➕ بازتاب هفتگی (واکنش به پیشرفت) · ➕ نظارت بر استراتژی‌ها |
| **پرونده رشد (Portfolio)** | Seesaw / Google Sites | ❌ غایب | — | ➕ آرشیو آثار (صوت/تصویر/متن) · ➕ نمودار رشد بلندمدت · ➕ اشتراک‌گذاری با مربی/والدین |

---

## ۴. مهارت‌های قرن ۲۱ (۴Cs) — گزینه‌های ملموس UI

| مهارت | گزینه در صفحهٔ متربی |
|---|---|
| **تفکر نقادانه (Critical Thinking)** | ➕ چالش‌های هفتگی «مسئله‌باز» (Open-ended Problems) · ➕ توضیح راهحل (صوتی/متنی) · ➕ ارزیابی همتایان راهحل |
| **خلاقیت (Creativity)** | ➕ پروژه‌های اختیاری: نقاشی، ساخت، نویسندگی، کدنویسی · ➕ آپلود اثر + گالری عمومی کلاس · ➕ مسابقات خلاقیت ماهانه |
| **ارتباط (Communication)** | ➕ ارائهٔ صوتی/ویدیویی برای تکالیف (بسط ضبط صوت فعلی) · ➕ گفتگوی ساختاریافته با مربی (Feedback Loop) · ➕ دفترچه یادداشت اشتراکی |
| **همکاری (Collaboration)** | ➕ پروژه‌های گروهی (۲-۴ نفره) با وظایف تقسیم‌شده · ➕ تابلوی مشارکت همتایان · ➕ بازخورد ۳۶۰° (Peer Review) |

---

## ۵. ساختار پیشنهادی صفحهٔ متربی

```text
🏠 داشبورد متربی (/dashboard)
├── 📊 خلاصهٔ روز
│   ├── 🔥 استریک روزانه (همگانی/ساحتی)
│   ├── ⭐ XP کل + نوار پیشرفت سطح
│   ├── 🎯 رادار ۶ ساحتی (SVG radar chart)
│   ├── 📝 اهداف شخصی امروز (SRL)
│   └── 🔔 یادآورهای هوشمند (ناج)
│
├── 🗓️ برنامهٔ روزانه یکپارچه (Timeline)
│   ├── تکالیف (تایم‌لاین موجود)
│   ├── تمرین معنوی (spiritual-shell tab)
│   ├── فعالیت بدنی (activity page)
│   └── مرور فاصلهدار (SRS cards)
│
├── 🧠 مسیر یادگیری (Adaptive)
│   ├── سطح استادی (Mastery) درسی
│   ├── پیشنهادی هوشمند (Next Best Action)
│   └── آزمون تطبیقی
│
├── 🏅 دستاوردها
│   ├── نشان‌های موضوعی/رفتاری
│   ├── لیگ هفتگی (اختیاری)
│   └── گواهی مهارت‌ها
│
├── 📁 پرونده رشد (Portfolio)
│   ├── آرشیو آثار
│   ├── نمودار رشد طولانی‌مدت
│   └── اشتراک‌گذاری با مربی/والدین
│
└── ۶ تب ساحتی (عمق در هر ساحت)
    ├── 📐 علمی-فناورانه → /math + /learning + /experimental-sciences
    ├── 📜 اعتقادی-عبادی → /dashboard/spiritual + /quran
    ├── 🏃 زیستی-بدنی → /activity
    ├── 🎨 زیباشناختی-هنری → /arts (جدید)
    ├── 🤝 اجتماعی-سیاسی → /social (جدید)
    └── 💼 اقتصادی-حرفه‌ای → /career (جدید)
```

### توضیح بخش‌های اصلی

| بخش | جزئیات | وضعیت فعلی |
|---|---|---|
| **خلاصهٔ روز** |Radar chart ۶ محوره (ساحتی) + XP + Streak + Goals | Radar ❌، XP ❌، Streak ✅، Goals ❌ |
| **برنامهٔ روزانه** | تایم‌لاین یکپارچه تکالیف + معنوی + بدنی + SRS | تکالیف ✅، معنوی ✅، بدنی ✅، SRS ❌ |
| **مسیر یادگیری** | Mastery badges + adaptive next action | Mastery ✅، Adaptive ❌ |
| **دستاوردها** | Badges + Leagues + Certificates | Streak ✅، بقیه ❌ |
| **پرونده رشد** | Artifacts + Long-term chart + Sharing | ❌ همه |
| **۶ تب ساحتی** | Deep-dive هر ساحت | ۳/۶ موجود |

---

## ۶. وضعیت فعلی کد (Gap Analysis) — مبتنی بر فایل‌های واقعی

### ✅ ساخته شده (Verified by reading actual files)

| ویژگی | فایل/مسیر واقعی | توضیح |
|---|---|---|
| **داشبورد متربی اصلی** | `frontend/src/app/features/dashboard/dashboard.component.ts` + `.html` + `.scss` | Header nav (مسیر معنوی/ریاضیات/فعالیت بدنی)، sidebar دروس فعال، quran/math progress widgets، assignment timeline با dots رنگی، biweekly chart، training steps، audio recorder با listen-gate ≥85%، submissions grid |
| **مسیر معنوی (Spiritual)** | `features/shared/spiritual-shell/` (component.ts/html/scss) | 🔥 streak badge، tabs: تمرین روزانه/مناسبت‌ها/مسیر معنوی/تاریخچه/قرآن/ریاضیات |
| **فعالیت بدنی (Activity)** | `features/activity/` (activity.routes.ts, activity.component.ts/html/scss) | فرم روزانه (دقیقه/قدم/خواب/یادداشت)، نوار ۷روزه، streak، RTL `--lp-*` styles |
| **قرآن (دسترسی متربی)** | `features/quran/quran.routes.ts` | roleGuard('trainee') روی surahs/tajweed/recitation (fixed) |
| **ریاضیات + یادگیری + Mastery** | `features/math/` + `features/learning/` + `core/utils/mastery.ts` | ۴ سطح mastery (🌱/📖/💪/🏆)، badges روی math-lesson-detail و path-detail، math-practice persist attempts/score |
| **بازخورد فوری Quiz** | `features/dashboard/assessment-taker/` | Khan-style instant feedback per question |
| **رینم‌های زبانی** | کل پروژه | «دانش‌آموز» → «متربی» (۳۹۴ مورد)، «پنل» → «داشبورد» (role-home) |
| **بک‌اند DailyActivity** | `backend/src/.../Domain/Entities/DailyActivity.cs` + Controller/API | Entity، DTOs، Service، Controller `physical-activity`، claims-based userId، unique index، streak |

### ❌ کم / ناقص (Gap)

| گپ | اولویت | دلیل |
|---|---|---|
| **XP + نشان‌ها (Badges)** | بالا | موتور انگیزشی مرکزی؛ پایه لیگ/گواهی |
| **رادار ۶ ساحتی در داشبورد** | بالا | دید یک‌صفحه‌ای پیشرفت همه ساحتها |
| **مرور فاصلهدار (SRS)** | بالا | حفظ یادگیری بلندمدت (علمی/قرآن/واژگان) |
| **آزمون تطبیقی (Adaptive)** | متوسط | شخصی‌سازی سطح چالش |
| **یادآور هوشمند روزانه** | متوسط | افزایش تداوم (retention) |
| **ساحت هنری (Arts module)** | متوسط | پوشش ساحت زیباشناختی |
| **ساحت اجتماعی (Social/Collab)** | پایین | مهارت همکاری/ارتباط |
| **ساحت حرفه‌ای (Career/Portfolio)** | پایین | مهارت اقتصادی-حرفه‌ای |
| **خودتنظیمی (SRL: Goals/Reflection)** | بالا | توانمندی برتر قرن ۲۱ |
| **پرونده رشد (Portfolio)** | متوسط | مستندسازی رشد بلندمدت |

---

## ۷. معماری فنی پیشنهادی

### الگوی لایه‌ای موجود (Clean Architecture — محقق در کد)

```
Backend (ASP.NET Core 10):
  Domain/Entities           → POCOs + [Table("Nehzat_*")]
  Application/DTOs          → C# records (CreateXxxRequest, UpdateXxxRequest)
  Application/Interfaces    → IXxxService (Task<T> async)
  Infrastructure/Services   → XxxService : IXxxService (AppDbContext)
  API/Controllers           → [ApiController][Route("xxx")][Authorize]
  Program.cs                → AddScoped<IXxxService, XxxService>; MapControllers()

Frontend (Angular 21 Standalone):
  core/models/*.ts          → TS interfaces (camelCase)
  core/services/lesson-planner-api.interface.ts → abstract methods (Observable)
  core/services/http-lesson-planner-api.service.ts → HttpClient impl (this.url('/path'))
  core/services/mock-lesson-planner-api.service.ts → in-memory + delayed(...)
  features/xxx/             → standalone components, lazy routes, --lp-* SCSS, RTL
```

### Entityهای پیشنهادی برای فازهای آینده

| Entity پیشنهادی | جدول (Nehzat_*) | فیلدهای کلیدی | ساحت وابسته |
|---|---|---|---|
| `XpBadge` | `Nehzat_xp_badges` | id, code, name, description, icon, xpValue, category, criteriaJson | همه (motor انگیزشی) |
| `UserXp` | `Nehzat_user_xp` | id, userId, totalXp, currentLevel, updatedAt | همه |
| `DailyPracticeGoal` | `Nehzat_daily_practice_goals` | id, userId, goalDate, subject, targetMinutes, achievedMinutes, status | علمی، زیستی |
| `SpacedRepetitionCard` | `Nehzat_spaced_repetition_cards` | id, userId, contentType, contentId, question, answer, nextReviewAt, interval, easeFactor | علمی، اعتقادی |
| `PortfolioItem` | `Nehzat_portfolio_items` | id, userId, title, type (audio/image/video/text), fileUrl, description, tags, createdAt, isPublic | همه (Portfolio) |
| `CollaborationProject` | `Nehzat_collab_projects` | id, title, description, ownerId, memberIds (JSON), status, deadline | اجتماعی |
| `SkillCertificate` | `Nehzat_skill_certificates` | id, userId, skillCode, level, issuedAt, verifierId, certificateUrl | اقتصادی-حرفه‌ای |

---

## ۸. نقشهٔ راه اجرا (Roadmap) — فازبندی با اولویت

### فاز ۱: موتور انگیزشی و دید یک‌صفحه‌ای (هفته ۱-۲)
| محدوده | فایل‌های هدف | معیار قبولی |
|---|---|---|
| XP System + Badges | `core/utils/xp.ts` (جدید), `core/models/*.ts`, `mock-lesson-planner-api.service.ts`, `dashboard.component.html/ts` (XP bar + badge ribbon) | XP جمع می‌شود، نشان‌ها در داشبورد دیده می‌شوند، API mock کار می‌کند |
| Radar ۶ ساحتی | `dashboard.component.html/ts` (SVG radar chart), progress service برای aggregate | نمودار ۶ محوره با مقیاس ۰-۱۰۰% در هدر داشبورد |
| Streak چندساحتی | `spiritual-shell` + `activity` unify streak service | سه استریک جداگانه (علمی/معنوی/بدنی) + استریک همگانی |

### فاز ۲: مرور فاصلهدار و یادآور (هفته ۳-۴)
| محدوده | فایل‌های هدف | معیار قبولی |
|---|---|---|
| SRS Engine | `core/utils/srs.ts` (SM-2 algorithm), `SpacedRepetitionCard` entity + API, `dashboard` SRS card row | کارت‌های مرور در داشبورد روزانه ظاهر می‌شوند، الگوریتم SM-2 کار می‌کند |
| یادآور روزانه | `core/services/notification.service.ts` + browser Push API یا in-app toast | اعلان صبحانه: «امروز X دقیقه تمرین Y داری» |

### فاز ۳: آزمون تطبیقی و مسیر یادگیری هوشمند (هفته ۵-۶)
| محدوده | فایل‌های هدف | معیار قبولی |
|---|---|---|
| Adaptive Quiz | IRT parameter bank در mock/DB, `adaptive-engine.ts`, `math-practice` integration | سختی سوال بر اساس mastery level کاربر تنظیم می‌شود |
| Next Best Action | Recommendation engine (rule-based v1) | کارت «پیشنهاد بعدی» در داشبورد |

### فاز ۴: ساحت هنری (هفته ۷-۸)
| ماژول جدید | مسیر | معیار |
|---|---|---|
| `features/arts/` | `/arts` (gallery, music, calligraphy, crafts) | آپلود اثر، گالری کلاس، نظر همتایان |

### فاز ۵: ساحت اجتماعی/همکاری (هفته ۹-۱۰)
| ماژول جدید | مسیر | معیار |
|---|---|---|
| `features/social/` | `/social` (projects, discussions, peer-review) | پروژه گروهی با وظایف، تابلوی مشارکت |

### فاز ۶: ساحت حرفه‌ای + پرونده رشد (هفته ۱۱-۱۲)
| ماژول جدید | مسیر | معیار |
|---|---|---|
| `features/career/` + `features/portfolio/` | `/career`, `/portfolio` | سبد مهارت، گواهی، آرشیو آثار، اشتراک‌گذاری |

---

## ۹. معیارهای موفقیت (KPIs)

| KPI | هدف | ابزار اندازه‌گیری |
|---|---|---|
| **نرخ تداوم ۷ روزه (D7 Retention)** | ≥ ۶۰٪ | Mixpanel/Amplitude/GA4 event `session_start` |
| **نرخ تکمیل تکالیف** | ≥ ۸۵٪ | `AssignmentSubmission` status = completed / total |
| **پوشش ساحت‌ها** | هر متربی حداقل ۴/۶ ساحت فعال/هفته | Radar chart aggregate ≥ 4 non-zero axes |
| **میانگین XP هفته‌ای** | روند صعودی ۱۰٪ ماهانه | `UserXp` aggregate |
| **نرخ بازگشت SRS** | ≥ ۷۰٪ کارت‌ها در موعد مرور شوند | `SpacedRepetitionCard.nextReviewAt` compliance |
| **رضایت مربی/والدین** | NPS ≥ ۴۰ | نظرسنجی ربع‌ساله |

---

## ۱۰. ریسک‌ها و ملاحظات

| ریسک | کاهش‌ریسک (Mitigation) |
|---|---|
| **شلوغی داشبورد (Overload)** | اصل «خلاصه در خانه، عمق در تب» — داشبورد فقط KPIها + Radar + ۳ کارت اصلی؛ جزئیات در تب‌های ساحتی |
| **فشار بر متربی (Gamification overdose)** | XP/نشان‌ها **اختیاری** و مخفی‌پذیر؛ تمرکز روی Mastery/Streak ذاتی؛ والدین کنترل دید 리그‌ها |
| **نقش والدین/مربی (سه‌جانبه بودن)** | هر метریک در `student-progress` برای والد/مربی قابل مشاهده باشد؛ گزارش هفتگی اتوماتیک ایمیل/پوش |
| **حریم خصوصی** | Portfolio پیش‌فرض private؛ اشتراک‌گذاری explicit opt-in؛ GDPR/قانون حفاظت داده‌های ایران |
| **EnsureCreated / بدون Migration** | Entityهای جدید با `EnsureCreated()` سازگار باشند؛ `--seed` برای داده‌های اولیه؛ Migration در نسخه‌های آتی |
| **عملکرد (Performance)** | Lazy-load تمام feature modules؛ OnPush change detection؛ virtual scroll برای لیست‌های طولانی؛ caching API responses |

---

## phụ lục: متغیرهای CSS واقعی (`--lp-*`) استفاده‌شده در UI متربی

(استخراج‌شده با `grep -r --lp- frontend/src` و بررسی `dashboard.component.scss`, `spiritual-shell.component.scss`, `activity.component.scss`)

| متغیر | مقدار نمونه | کاربرد |
|---|---|---|
| `--lp-bg` | `#f6f3ed` | پس‌زمینه صفحه |
| `--lp-surface` | `#fff` | کارت‌ها، مودال‌ها |
| `--lp-surface-alt` | `#faf8f0` | سطرهای جداول/لیست |
| `--lp-text` | `#1e1b14` | متن اصلی |
| `--lp-muted` | `#7a7468` | متن ثانویه/مuted |
| `--lp-border` | `#ddd5c5` | حاشیه کارت‌ها/جداول |
| `--lp-primary` | `#1a6b3c` | دکمه‌های اصلی، لینک‌ها |
| `--lp-primary-hover` | `#14522d` | hover دکمه اصلی |
| `--lp-primary-light` | `#e8f5ee` | پس‌زمینه‌های تأکیدی سبز |
| `--lp-accent-blue` | `#2d5a8a` | رنگ ثانویه (آبی) |
| `--lp-accent` | `#c0392b` | رنگ تأکیدی قرمز |
| `--lp-danger` | `#b91c1c` | خطا/خطر |
| `--lp-success` | `#1a6b3c` | موفقیت (همان primary) |
| `--lp-gold` | `#b8942e` | طلا/برتر |
| `--lp-gold-hover` | `#9e7d25` | hover طلا |
| `--lp-gold-light` | `#faf3e0` | پس‌زمینه طلا |

> **نکته**: فقط از متغیرهای بالا استفاده شود؛ هرگز `--gold`، `--primary`، `--danger` بدون پیشوند `lp-` استفاده نشود.

---

**سند طراحی کامل شد** — فایل: `docs/TRAINEE_PAGE_DESIGN.md` (خطوط حدود ۷۰۰+، جداول markdown، فارسی RTL)