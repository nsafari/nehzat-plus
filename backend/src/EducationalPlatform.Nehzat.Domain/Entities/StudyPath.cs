using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EducationalPlatform.Nehzat.Domain.Constants;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_study_paths")]
public class StudyPath
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Key { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int AgeGroupId { get; set; }
    [ForeignKey(nameof(AgeGroupId))]
    public AgeGroup AgeGroup { get; set; } = null!;

    public int SubjectAreaId { get; set; }
    [ForeignKey(nameof(SubjectAreaId))]
    public SubjectArea SubjectArea { get; set; } = null!;

    [MaxLength(20)]
    public string CognitiveLevel { get; set; } = CognitiveLevels.Awareness;

    public bool IsActive { get; set; } = true;

    public int SortOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<StudyPathStep> Steps { get; set; } = new List<StudyPathStep>();
    public ICollection<StudyPathAccommodation> Accommodations { get; set; } = new List<StudyPathAccommodation>();
}