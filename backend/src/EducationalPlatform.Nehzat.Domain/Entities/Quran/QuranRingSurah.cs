using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities.Quran
{
    /// <summary>
    /// اتصال حلقه به سوره‌های مرتبط (مثلاً حلقه ۱: نوح+حشر)
    /// </summary>
    [Table("Nehzat_quran_ring_surahs")]
    public class QuranRingSurah
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int RingId { get; set; }

        [ForeignKey(nameof(RingId))]
        public QuranRing Ring { get; set; } = null!;

        public int SurahId { get; set; }

        [ForeignKey(nameof(SurahId))]
        public Surah Surah { get; set; } = null!;

        /// <summary>
        /// نوع فعالیت: MEMORIZATION, LISTENING, TRANSLATION, REVIEW
        /// </summary>
        [Column(TypeName = "nvarchar(50)")]
        public string ActivityType { get; set; } = "MEMORIZATION";

        /// <summary>
        /// ترتیب
        /// </summary>
        public int SortOrder { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
