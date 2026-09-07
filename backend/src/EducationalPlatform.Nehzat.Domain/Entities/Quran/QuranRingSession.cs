using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities.Quran
{
    /// <summary>
    /// جلسات هر حلقه - مثلاً ۷۵ جلسه برای حلقه سوم (جزء ۳۰)
    /// </summary>
    [Table("Nehzat_quran_ring_sessions")]
    public class QuranRingSession
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        /// <summary>
        /// حلقه مرتبط
        /// </summary>
        public int RingId { get; set; }

        [ForeignKey(nameof(RingId))]
        public QuranRing Ring { get; set; } = null!;

        /// <summary>
        /// شماره جلسه (۱ تا ۷۵)
        /// </summary>
        public int SessionNumber { get; set; }

        /// <summary>
        /// عنوان جلسه
        /// </summary>
        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// توضیحات جلسه
        /// </summary>
        [Column(TypeName = "nvarchar(2000)")]
        public string? Description { get; set; }

        /// <summary>
        /// نوع جلسه: REGULAR, ASSESSMENT, REVIEW
        /// </summary>
        [Column(TypeName = "nvarchar(50)")]
        public string SessionType { get; set; } = "REGULAR";

        /// <summary>
        /// صفحه شروع (برای جلسات حفظ)
        /// </summary>
        public int? StartPage { get; set; }

        /// <summary>
        /// صفحه پایان
        /// </summary>
        public int? EndPage { get; set; }

        /// <summary>
        /// سوره شروع
        /// </summary>
        public int? StartSurahId { get; set; }

        /// <summary>
        /// سوره پایان
        /// </summary>
        public int? EndSurahId { get; set; }

        /// <summary>
        /// آیه شروع
        /// </summary>
        public int? StartAyah { get; set; }

        /// <summary>
        /// آیه پایان
        /// </summary>
        public int? EndAyah { get; set; }

        /// <summary>
        /// تعداد سطوح (سطر) — هر صفحه = ۱۵ سطح
        /// </summary>
        public int Surfaces { get; set; }

        /// <summary>
        /// مدت زمان تخمینی (دقیقه)
        /// </summary>
        public int EstimatedMinutes { get; set; } = 30;

        /// <summary>
        /// پیش‌نیاز: شماره جلسه قبل
        /// </summary>
        public int? PrerequisiteSessionId { get; set; }

        /// <summary>
        /// آیا جلسه ارزیابی است (جلسات ۶، ۱۲، ۲۰، ۳۱، ۴۵، ۵۵، ۷۵)
        /// </summary>
        public bool IsAssessment { get; set; }

        /// <summary>
        /// نصف (FirstHalf=1-35, SecondHalf=36-75)
        /// </summary>
        [Column(TypeName = "nvarchar(20)")]
        public string Half { get; set; } = string.Empty;

        /// <summary>
        /// ترتیب نمایش
        /// </summary>
        public int SortOrder { get; set; }

        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<QuranSessionStep> Steps { get; set; } = new List<QuranSessionStep>();
        public ICollection<StudentQuranSessionProgress> StudentProgress { get; set; } = new List<StudentQuranSessionProgress>();
    }
}
