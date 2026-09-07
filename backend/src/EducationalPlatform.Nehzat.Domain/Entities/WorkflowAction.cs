using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("workflow_actions", Schema = "nehzat")]
public class WorkflowAction
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int RequestId { get; set; }

    [ForeignKey(nameof(RequestId))]
    public WorkflowRequest Request { get; set; } = null!;

    public int StepId { get; set; }

    [ForeignKey(nameof(StepId))]
    public WorkflowStep Step { get; set; } = null!;

    public int ActorId { get; set; }

    [Column(TypeName = "nvarchar(50)")]
    public string Action { get; set; } = "approve";

    [Column(TypeName = "nvarchar(1000)")]
    public string Comment { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}