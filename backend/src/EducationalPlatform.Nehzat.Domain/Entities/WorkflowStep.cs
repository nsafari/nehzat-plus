using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("workflow_steps", Schema = "nehzat")]
public class WorkflowStep
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int WorkflowId { get; set; }

    [ForeignKey(nameof(WorkflowId))]
    public WorkflowDefinition Workflow { get; set; } = null!;

    public int StepOrder { get; set; }

    [Column(TypeName = "nvarchar(200)")]
    public string Name { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(50)")]
    public string RoleRequired { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(50)")]
    public string ActionType { get; set; } = "approve";

    public bool IsFinalStep { get; set; }
}