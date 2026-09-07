using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities.Quran
{
    /// <summary>
    /// ارزیابی ۸ بُعدی دارایی متربی
    /// </summary>
    [Table("Nehzat_quran_asset_evaluations")]
    public class QuranAssetEvaluation
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
        /// حلقه قرآنی
        /// </summary>
        public int RingId { get; set; }

        [ForeignKey(nameof(RingId))]
        public QuranRing Ring { get; set; } = null!;

        /// <summary>
        /// ارزیاب‌کننده (مربی)
        /// </summary>
        public int EvaluatorUserId { get; set; }

        [ForeignKey(nameof(EvaluatorUserId))]
        public User Evaluator { get; set; } = null!;

        /// <summary>
        /// تاریخ ارزیابی
        /// </summary>
        public DateTime EvaluationDate { get; set; }

        // ========== ۸ بُعد ارزیابی ==========

        /// <summary>
        /// بُعد ۱: حفظ (تعداد صفحات/سوره‌های حفظ‌شده)
        /// </summary>
        public int MemorizationScore { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string? MemorizationNotes { get; set; }

        /// <summary>
        /// بُعد ۲: مهارت آوایی (روخوانی، تجوید، ترتیل)
        /// </summary>
        public int PhoneticSkillScore { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string? PhoneticSkillNotes { get; set; }

        /// <summary>
        /// بُعد ۳: پایه زبانی (لغت، صرف، نحو)
        /// </summary>
        public int LinguisticFoundationScore { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string? LinguisticFoundationNotes { get; set; }

        /// <summary>
        /// بُعد ۴: درک معنایی (ترجمه، مفاهیم)
        /// </summary>
        public int SemanticComprehensionScore { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string? SemanticComprehensionNotes { get; set; }

        /// <summary>
        /// بُعد ۵: تدبر و کتابت
        /// </summary>
        public int TadabborWritingScore { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string? TadabborWritingNotes { get; set; }

        /// <summary>
        /// بُعد ۶: توان روزانه (سرعت و استمرار)
        /// </summary>
        public int DailyThroughputScore { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string? DailyThroughputNotes { get; set; }

        /// <summary>
        /// بُعد ۷: پشتیبانی محیطی (خانواده، استماع روزانه)
        /// </summary>
        public int EnvironmentalSupportScore { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string? EnvironmentalSupportNotes { get; set; }

        /// <summary>
        /// بُعد ۸: انگیزه و هویت
        /// </summary>
        public int MotivationIdentityScore { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string? MotivationIdentityNotes { get; set; }

        // ========== جمع‌بندی ==========

        /// <summary>
        /// نمره کل (میانگین ۸ بُعد)
        /// </summary>
        public int TotalScore { get; set; }

        /// <summary>
        /// دسته سرعت پیشنهادی بر اساس ارزیابی
        /// </summary>
        [Column(TypeName = "nvarchar(50)")]
        public string SuggestedSpeedCategory { get; set; } = string.Empty;

        /// <summary>
        /// حلقه پیشنهادی
        /// </summary>
        public int? SuggestedRingId { get; set; }

        /// <summary>
        /// توضیحات کلی
        /// </summary>
        [Column(TypeName = "text")]
        public string? GeneralNotes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
