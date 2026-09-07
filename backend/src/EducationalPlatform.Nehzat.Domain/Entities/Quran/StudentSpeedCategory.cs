using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities.Quran
{
    /// <summary>
    /// دسته‌بندی سرعت دانش‌آموز: استقامتی(S)، نیمه‌سرعتی(N)، سرعتی(F)، حفظ نقطه‌ای
    /// </summary>
    [Table("Nehzat_student_speed_categories")]
    public class StudentSpeedCategory
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
        /// دسته فعلی: STAMINA(استقامتی), SEMI_SPEED(نیمه‌سرعتی), SPEED(سرعتی), POINT_MEMORIZATION(حفظ نقطه‌ای)
        /// </summary>
        [Column(TypeName = "nvarchar(50)")]
        public string Category { get; set; } = "STAMINA";

        /// <summary>
        /// سرعت روزانه (خط/روز): ۲، ۳-۴، ۵+
        /// </summary>
        public int DailyLines { get; set; } = 2;

        /// <summary>
        /// تاریخ تعیین دسته
        /// </summary>
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// دسته قبلی (برای ردیابی تغییرات)
        /// </summary>
        [Column(TypeName = "nvarchar(50)")]
        public string? PreviousCategory { get; set; }

        /// <summary>
        /// دلیل تغییر
        /// </summary>
        [Column(TypeName = "nvarchar(500)")]
        public string? ChangeReason { get; set; }

        /// <summary>
        /// نمره تسلط فعلی (۱ تا ۱۰)
        /// </summary>
        public int MasteryScore { get; set; }

        /// <summary>
        /// سرعت واقعی (خط/روز)
        /// </summary>
        public int ActualDailyLines { get; set; }

        /// <summary>
        /// تعداد روزهای فعال از ۱۴ روز
        /// </summary>
        public int ActiveDays { get; set; }

        /// <summary>
        /// تاریخ آخرین ارزیابی
        /// </summary>
        public DateTime LastEvaluationAt { get; set; }

        /// <summary>
        /// آیا واجد شرایط ارتقا است
        /// </summary>
        public bool IsEligibleForPromotion { get; set; }

        /// <summary>
        /// آیا در معرض تنزل است
        /// </summary>
        public bool IsAtRiskOfDemotion { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
