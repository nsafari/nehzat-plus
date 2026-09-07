using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities.Quran
{
    /// <summary>
    /// پیشرفت دانش‌آموز در هر گام جلسه
    /// </summary>
    [Table("Nehzat_student_step_progress")]
    public class StudentStepProgress
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        /// <summary>
        /// پیشرفت جلسه
        /// </summary>
        public int SessionProgressId { get; set; }

        [ForeignKey(nameof(SessionProgressId))]
        public StudentQuranSessionProgress SessionProgress { get; set; } = null!;

        /// <summary>
        /// گام جلسه
        /// </summary>
        public int StepId { get; set; }

        [ForeignKey(nameof(StepId))]
        public QuranSessionStep Step { get; set; } = null!;

        /// <summary>
        /// وضعیت: NOT_STARTED, IN_PROGRESS, COMPLETED, SKIPPED
        /// </summary>
        [Column(TypeName = "nvarchar(50)")]
        public string Status { get; set; } = "NOT_STARTED";

        /// <summary>
        /// امتیاز (۱ تا ۱۰)
        /// </summary>
        public int? Score { get; set; }

        /// <summary>
        /// تعداد دفعات تکرار
        /// </summary>
        public int RepetitionCount { get; set; }

        /// <summary>
        /// یادداشت مربی
        /// </summary>
        [Column(TypeName = "text")]
        public string? Notes { get; set; }

        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
