using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities.Quran
{
    /// <summary>
    /// مصاحبه مربی (۱۸ سوال)
    /// </summary>
    [Table("Nehzat_coach_interviews")]
    public class CoachInterview
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        /// <summary>
        /// مربی
        /// </summary>
        public int CoachUserId { get; set; }

        [ForeignKey(nameof(CoachUserId))]
        public User Coach { get; set; } = null!;

        /// <summary>
        /// حلقه
        /// </summary>
        public int RingId { get; set; }

        [ForeignKey(nameof(RingId))]
        public QuranRing Ring { get; set; } = null!;

        /// <summary>
        /// تاریخ مصاحبه
        /// </summary>
        public DateTime InterviewDate { get; set; }

        // ========== سوالات مصاحبه (JSON) ==========

        /// <summary>
        /// Q1: فرایند امسالت را گام به گام بنویس
        /// </summary>
        [Column(TypeName = "text")]
        public string? Q1_ProcessSteps { get; set; }

        /// <summary>
        /// Q2: لایه لفظی چگونه آموزش داده می‌شود؟
        /// </summary>
        [Column(TypeName = "text")]
        public string? Q2_PhoneticLayer { get; set; }

        /// <summary>
        /// Q3: لایه ترجمه و مفاهیم چگونه؟
        /// </summary>
        [Column(TypeName = "text")]
        public string? Q3_TranslationLayer { get; set; }

        /// <summary>
        /// Q4: دسته‌بندی سرعت متربیان
        /// </summary>
        [Column(TypeName = "text")]
        public string? Q4_SpeedCategories { get; set; }

        /// <summary>
        /// Q5: چالش‌های اصلی
        /// </summary>
        [Column(TypeName = "text")]
        public string? Q5_MainChallenges { get; set; }

        /// <summary>
        /// Q6: راهکارهای فعلی
        /// </summary>
        [Column(TypeName = "text")]
        public string? Q6_CurrentSolutions { get; set; }

        /// <summary>
        /// Q7: وضعیت استماع روزانه
        /// </summary>
        [Column(TypeName = "text")]
        public string? Q7_DailyListening { get; set; }

        /// <summary>
        /// Q8: وضعیت حفظ
        /// </summary>
        [Column(TypeName = "text")]
        public string? Q8_Memorization { get; set; }

        /// <summary>
        /// Q9: وضعیت تجوید و ترتیل
        /// </summary>
        [Column(TypeName = "text")]
        public string? Q9_Tajweed { get; set; }

        /// <summary>
        /// Q10: وضعیت لغت و صرف
        /// </summary>
        [Column(TypeName = "text")]
        public string? Q10_Vocabulary { get; set; }

        /// <summary>
        /// Q11: وضعیت نحو
        /// </summary>
        [Column(TypeName = "text")]
        public string? Q11_Syntax { get; set; }

        /// <summary>
        /// Q12: وضعیت تدبر
        /// </summary>
        [Column(TypeName = "text")]
        public string? Q12_Tadabbor { get; set; }

        /// <summary>
        /// Q13: وضعیت کتابت
        /// </summary>
        [Column(TypeName = "text")]
        public string? Q13_Writing { get; set; }

        /// <summary>
        /// Q14: ارائه به مربی (تعداد و کیفیت)
        /// </summary>
        [Column(TypeName = "text")]
        public string? Q14_Presentations { get; set; }

        /// <summary>
        /// Q15: مباحثه و مقایسه
        /// </summary>
        [Column(TypeName = "text")]
        public string? Q15_Discussions { get; set; }

        /// <summary>
        /// Q16: گزارش به والدین
        /// </summary>
        [Column(TypeName = "text")]
        public string? Q16_ParentReports { get; set; }

        /// <summary>
        /// Q17: منابع و کتاب‌ها
        /// </summary>
        [Column(TypeName = "text")]
        public string? Q17_Resources { get; set; }

        /// <summary>
        /// Q18: نیازها و کمبودها
        /// </summary>
        [Column(TypeName = "text")]
        public string? Q18_Needs { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
