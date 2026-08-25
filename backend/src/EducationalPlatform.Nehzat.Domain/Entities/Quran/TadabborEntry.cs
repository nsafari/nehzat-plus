using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities.Quran
{
    /// <summary>
    /// ثبت تدبر دانش‌آموز: تشخیص کلمه در بین مترادف‌ها، چرایی استعمال
    /// </summary>
    [Table("Nehzat_tadabbor_entries")]
    public class TadabborEntry
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
        /// آیه مرتبط
        /// </summary>
        public int? AyahId { get; set; }

        [ForeignKey(nameof(AyahId))]
        public Ayah? Ayah { get; set; }

        /// <summary>
        /// سوره
        /// </summary>
        public int? SurahId { get; set; }

        [ForeignKey(nameof(SurahId))]
        public Surah? Surah { get; set; }

        /// <summary>
        /// شماره آیه
        /// </summary>
        public int? AyahNumber { get; set; }

        /// <summary>
        /// کلمه مورد تدبر
        /// </summary>
        [Column(TypeName = "nvarchar(200)")]
        public string Word { get; set; } = string.Empty;

        /// <summary>
        /// چرا این لفظ استفاده شده؟
        /// </summary>
        [Column(TypeName = "text")]
        public string WhyThisWord { get; set; } = string.Empty;

        /// <summary>
        /// مترادف‌های ممکن (JSON array)
        /// </summary>
        [Column(TypeName = "text")]
        public string? SynonymsJson { get; set; }

        /// <summary>
        /// تفاوت با مترادف‌ها
        /// </summary>
        [Column(TypeName = "text")]
        public string? DifferenceFromSynonyms { get; set; }

        /// <summary>
        /// ارجاع به تفسیر جلالین
        /// </summary>
        [Column(TypeName = "text")]
        public string? JalalainReference { get; set; }

        /// <summary>
        /// یادداشت متربی
        /// </summary>
        [Column(TypeName = "text")]
        public string? StudentNote { get; set; }

        /// <summary>
        /// یادداشت مربی
        /// </summary>
        [Column(TypeName = "text")]
        public string? CoachNote { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
