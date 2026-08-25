using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities.Quran
{
    /// <summary>
    /// پیشرفت دانش‌آموز در هر جلسه
    /// </summary>
    [Table("Nehzat_student_quran_session_progress")]
    public class StudentQuranSessionProgress
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        /// <summary>
        /// دانش‌آموز
        /// </summary>
        public int StudentId { get; set; }

        [ForeignKey(nameof(StudentId))]
        public Student Student { get; set; } = null!;

        /// <summary>
        /// جلسه
        /// </summary>
        public int SessionId { get; set; }

        [ForeignKey(nameof(SessionId))]
        public QuranRingSession Session { get; set; } = null!;

        /// <summary>
        /// وضعیت: NOT_STARTED, IN_PROGRESS, COMPLETED, SKIPPED
        /// </summary>
        [Column(TypeName = "nvarchar(50)")]
        public string Status { get; set; } = "NOT_STARTED";

        /// <summary>
        /// درصد پیشرفت (۰ تا ۱۰۰)
        /// </summary>
        public int ProgressPercent { get; set; }

        /// <summary>
        /// تعداد خطوط حفظ‌شده
        /// </summary>
        public int LinesMemorized { get; set; }

        /// <summary>
        /// تعداد سطوح پیشرفت (هر صفحه = ۱۵ سطح)
        /// </summary>
        public int SurfacesCompleted { get; set; }

        /// <summary>
        /// نمره ارزیابی (اگر جلسه ارزیابی باشد)
        /// </summary>
        public int? AssessmentScore { get; set; }

        /// <summary>
        /// توضیحات مربی
        /// </summary>
        [Column(TypeName = "text")]
        public string? CoachNotes { get; set; }

        /// <summary>
        /// تاریخ شروع
        /// </summary>
        public DateTime? StartedAt { get; set; }

        /// <summary>
        /// تاریخ تکمیل
        /// </summary>
        public DateTime? CompletedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<StudentStepProgress> StepProgress { get; set; } = new List<StudentStepProgress>();
    }
}
