using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_training_enrollments")]
public class TrainingEnrollment
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int UserId { get; set; }

    public int CourseId { get; set; }

    public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;

    [Column(TypeName = "nvarchar(20)")]
    public string Status { get; set; } = "Pending";

    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }

    [ForeignKey(nameof(CourseId))]
    public TrainingCourse? Course { get; set; }

    public ICollection<TrainingProgress> Progresses { get; set; } = new List<TrainingProgress>();
}
