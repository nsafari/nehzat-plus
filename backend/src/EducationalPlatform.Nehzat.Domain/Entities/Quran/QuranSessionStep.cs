using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities.Quran
{
    /// <summary>
    /// گام‌های هر جلسه: استماع، لغت، صرف، نحو، ترجمه، تدبر، کتابت
    /// </summary>
    [Table("Nehzat_quran_session_steps")]
    public class QuranSessionStep
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        /// <summary>
        /// جلسه مرتبط
        /// </summary>
        public int SessionId { get; set; }

        [ForeignKey(nameof(SessionId))]
        public QuranRingSession Session { get; set; } = null!;

        /// <summary>
        /// نوع گام: LISTENING, VOCABULARY, CONJUGATION, SYNTAX, TRANSLATION, TADABBOR, WRITING
        /// </summary>
        [Column(TypeName = "nvarchar(50)")]
        public string StepType { get; set; } = string.Empty;

        /// <summary>
        /// عنوان گام
        /// </summary>
        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// توضیحات
        /// </summary>
        [Column(TypeName = "nvarchar(2000)")]
        public string? Description { get; set; }

        /// <summary>
        /// ترتیب اجرا (۱ تا ۷)
        /// </summary>
        public int StepOrder { get; set; }

        /// <summary>
        /// مدت زمان تخمینی (دقیقه)
        /// </summary>
        public int EstimatedMinutes { get; set; } = 10;

        /// <summary>
        /// آیا این گام اختیاری است
        /// </summary>
        public bool IsOptional { get; set; }

        /// <summary>
        /// منابع مورد نیاز (JSON)
        /// </summary>
        [Column(TypeName = "text")]
        public string? ResourcesJson { get; set; }

        /// <summary>
        /// معیار تکمیل
        /// </summary>
        [Column(TypeName = "nvarchar(500)")]
        public string? CompletionCriteria { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
