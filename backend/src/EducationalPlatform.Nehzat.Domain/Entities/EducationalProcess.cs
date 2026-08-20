using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

/// <summary>
/// تعریف فرآیند آموزشی - لینک بین Workflow و نوع رویداد آموزشی
/// </summary>
[Table("Nehzat_educational_processes")]
public class EducationalProcess
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    /// <summary>
    /// شناسه WorkflowDefinition مرتبط
    /// </summary>
    public int WorkflowId { get; set; }

    [ForeignKey(nameof(WorkflowId))]
    public WorkflowDefinition Workflow { get; set; } = null!;

    /// <summary>
    /// نوع رویداد آموزشی (Course, Enrollment, Submission, Content, Grade)
    /// </summary>
    [Column(TypeName = "nvarchar(50)")]
    public string EntityType { get; set; } = string.Empty;

    /// <summary>
    /// نام فرآیند به فارسی
    /// </summary>
    [Column(TypeName = "nvarchar(200)")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// توضیحات فرآیند
    /// </summary>
    [Column(TypeName = "nvarchar(2000)")]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// آیا فرآیند فعال است
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// آیا به صورت خودکار ایجاد درخواست می‌کند
    /// </summary>
    public bool AutoTrigger { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
