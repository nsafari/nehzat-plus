using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("workflow_requests", Schema = "nehzat")]
public class WorkflowRequest
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int WorkflowId { get; set; }

    [ForeignKey(nameof(WorkflowId))]
    public WorkflowDefinition Workflow { get; set; } = null!;

    [Column(TypeName = "nvarchar(200)")]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(2000)")]
    public string Description { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(50)")]
    public string Status { get; set; } = "pending";

    public int? CurrentStepId { get; set; }

    [ForeignKey(nameof(CurrentStepId))]
    public WorkflowStep? CurrentStep { get; set; }

    public int CreatedBy { get; set; }

    [ForeignKey(nameof(CreatedBy))]
    public User Creator { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<WorkflowAction> Actions { get; set; } = new List<WorkflowAction>();
}