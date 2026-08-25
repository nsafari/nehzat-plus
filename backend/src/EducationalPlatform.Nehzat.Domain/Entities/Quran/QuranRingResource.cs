using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities.Quran
{
    /// <summary>
    /// منابع هر حلقه (کتاب‌ها، جزوات، صوت‌ها)
    /// </summary>
    [Table("Nehzat_quran_ring_resources")]
    public class QuranRingResource
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int RingId { get; set; }

        [ForeignKey(nameof(RingId))]
        public QuranRing Ring { get; set; } = null!;

        /// <summary>
        /// عنوان منبع
        /// </summary>
        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// نوع منبع: BOOK, AUDIO, WORKSHEET, VIDEO
        /// </summary>
        [Column(TypeName = "nvarchar(50)")]
        public string ResourceType { get; set; } = "BOOK";

        /// <summary>
        /// توضیحات
        /// </summary>
        [Column(TypeName = "nvarchar(2000)")]
        public string? Description { get; set; }

        /// <summary>
        /// لینک یا فایل
        /// </summary>
        [Column(TypeName = "nvarchar(500)")]
        public string? Url { get; set; }

        /// <summary>
        /// آیا منبع اصلی است (جزوه ترجمه جزء ۳۰، ...)
        /// </summary>
        public bool IsPrimary { get; set; }

        public int SortOrder { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
