using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_training_courses")]
public class TrainingCourse
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(255)")]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(255)")]
    public string? Slug { get; set; }

    [Column(TypeName = "nvarchar(max)")]
    public string? Description { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string AcademicYear { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(20)")]
    public string Status { get; set; } = "Draft";

    public int? MaxEnrollment { get; set; }

    [Column(TypeName = "date")]
    public DateTime? StartDate { get; set; }

    [Column(TypeName = "date")]
    public DateTime? EndDate { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<TrainingStage> Stages { get; set; } = new List<TrainingStage>();
    public ICollection<TrainingEnrollment> Enrollments { get; set; } = new List<TrainingEnrollment>();
}
