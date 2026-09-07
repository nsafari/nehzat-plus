using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities.Quran
{
    /// <summary>
    /// مصاحبه متربی (۱۹ سوال)
    /// </summary>
    [Table("Nehzat_student_interviews")]
    public class StudentInterview
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
        /// حلقه
        /// </summary>
        public int RingId { get; set; }

        [ForeignKey(nameof(RingId))]
        public QuranRing Ring { get; set; } = null!;

        /// <summary>
        /// مصاحبه‌کننده (مربی)
        /// </summary>
        public int InterviewerUserId { get; set; }

        [ForeignKey(nameof(InterviewerUserId))]
        public User Interviewer { get; set; } = null!;

        /// <summary>
        /// تاریخ مصاحبه
        /// </summary>
        public DateTime InterviewDate { get; set; }

        // ========== سوالات مصاحبه ==========

        /// <summary>
        /// S1: هر روز چقدر قرآن گوش می‌دهی؟
        /// </summary>
        [Column(TypeName = "text")]
        public string? S1_DailyListening { get; set; }

        /// <summary>
        /// S2: با خانواده گوش می‌دهی؟
        /// </summary>
        [Column(TypeName = "text")]
        public string? S2_FamilyListening { get; set; }

        /// <summary>
        /// S3: چه سوره‌هایی حفظ هستی؟
        /// </summary>
        [Column(TypeName = "text")]
        public string? S3_MemorizedSurahs { get; set; }

        /// <summary>
        /// S4: فرایند روزانه‌ات چیست؟
        /// </summary>
        [Column(TypeName = "text")]
        public string? S4_DailyProcess { get; set; }

        /// <summary>
        /// S5: چقدر وقت می‌گذاری؟
        /// </summary>
        [Column(TypeName = "text")]
        public string? S5_TimeSpent { get; set; }

        /// <summary>
        /// S6: چه چیزی برایت سخت است؟
        /// </summary>
        [Column(TypeName = "text")]
        public string? S6_Difficulties { get; set; }

        /// <summary>
        /// S7: چه چیزی برایت آسان است؟
        /// </summary>
        [Column(TypeName = "text")]
        public string? S7_EasyParts { get; set; }

        /// <summary>
        /// S8: خودت را در کدام دسته سرعت می‌بینی؟
        /// </summary>
        [Column(TypeName = "text")]
        public string? S8_SelfSpeedCategory { get; set; }

        /// <summary>
        /// S9: انگیزه‌ات چیست؟
        /// </summary>
        [Column(TypeName = "text")]
        public string? S9_Motivation { get; set; }

        /// <summary>
        /// S10: هدفت چیست؟
        /// </summary>
        [Column(TypeName = "text")]
        public string? S10_Goal { get; set; }

        /// <summary>
        /// S11: آیا تدبر می‌کنی؟
        /// </summary>
        [Column(TypeName = "text")]
        public string? S11_Tadabbor { get; set; }

        /// <summary>
        /// S12: آیا می‌نویسی؟
        /// </summary>
        [Column(TypeName = "text")]
        public string? S12_Writing { get; set; }

        /// <summary>
        /// S13: چه کتاب‌هایی می‌خوانی؟
        /// </summary>
        [Column(TypeName = "text")]
        public string? S13_Books { get; set; }

        /// <summary>
        /// S14: آیا مباحثه می‌کنی؟
        /// </summary>
        [Column(TypeName = "text")]
        public string? S14_Discussion { get; set; }

        /// <summary>
        /// S15: چند بار ارائه داده‌ای؟
        /// </summary>
        [Column(TypeName = "text")]
        public string? S15_Presentations { get; set; }

        /// <summary>
        /// S16: نظر خانواده چیست؟
        /// </summary>
        [Column(TypeName = "text")]
        public string? S16_FamilyOpinion { get; set; }

        /// <summary>
        /// S17: چه کمکی نیاز داری؟
        /// </summary>
        [Column(TypeName = "text")]
        public string? S17_Needs { get; set; }

        /// <summary>
        /// S18: آیا از مسیرت راضی هستی؟
        /// </summary>
        [Column(TypeName = "text")]
        public string? S18_Satisfaction { get; set; }

        /// <summary>
        /// S19: پیشنهادت چیست؟
        /// </summary>
        [Column(TypeName = "text")]
        public string? S19_Suggestion { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
