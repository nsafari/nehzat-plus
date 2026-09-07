using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_study_path_accommodations")]
public class StudyPathAccommodation
{
    public int Id { get; set; }

    public int StudyPathId { get; set; }
    [ForeignKey(nameof(StudyPathId))]
    public StudyPath StudyPath { get; set; } = null!;

    public int AccommodationId { get; set; }
    [ForeignKey(nameof(AccommodationId))]
    public Accommodation Accommodation { get; set; } = null!;
}