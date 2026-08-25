using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities.Quran
{
    /// <summary>
    /// ۹ حلقه قرآنی: نوآموز۱، نوآموز۲، Ring۱ تا Ring۷
    /// </summary>
    [Table("Nehzat_quran_rings")]
    public class QuranRing
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        /// <summary>
        /// کد حلقه: NOAVOMOZ_1, NOAVOMOZ_2, RING_1, ..., RING_7
        /// </summary>
        [Column(TypeName = "nvarchar(50)")]
        public string Code { get; set; } = string.Empty;

        /// <summary>
        /// نام فارسی: حلقه اول نوآموز، حلقه دوم نوآموز، حلقه اول قاسم/سکینه، ...
        /// </summary>
        [Column(TypeName = "nvarchar(200)")]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// توضیحات حلقه
        /// </summary>
        [Column(TypeName = "nvarchar(2000)")]
        public string? Description { get; set; }

        /// <summary>
        /// گروه سنی: علی‌اصغر/رقیه (زیر ۷)، قاسم/سکینه (۷-۹)، عمومی
        /// </summary>
        [Column(TypeName = "nvarchar(50)")]
        public string AgeGroup { get; set; } = string.Empty;

        /// <summary>
        /// جنسیت: پسر، دختر، مختلط
        /// </summary>
        [Column(TypeName = "nvarchar(20)")]
        public string? Gender { get; set; }

        /// <summary>
        /// ترتیب نمایش (۱ تا ۹)
        /// </summary>
        public int SortOrder { get; set; }

        /// <summary>
        /// حداقل سن ورود
        /// </summary>
        public int? MinAge { get; set; }

        /// <summary>
        /// حداکثر سن ورود
        /// </summary>
        public int? MaxAge { get; set; }

        /// <summary>
        /// حلقه فعال است
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// آیا این حلقه مسیر تخصصی دارد (حلقه ۴ به بعد)
        /// </summary>
        public bool HasSpecializedPath { get; set; }

        /// <summary>
        /// تعداد زنگ‌های تخصصی (برای حلقه ۴+: ۲-۳)
        /// </summary>
        public int? SpecializedPeriods { get; set; }

        /// <summary>
        /// درصد وقت تخصصی (برای حلقه ۴+: ۵۰-۷۰٪)
        /// </summary>
        public int? SpecializedTimePercent { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<QuranRingSession> Sessions { get; set; } = new List<QuranRingSession>();
        public ICollection<QuranRingSurah> RingSurahs { get; set; } = new List<QuranRingSurah>();
        public ICollection<QuranRingResource> Resources { get; set; } = new List<QuranRingResource>();
    }
}
