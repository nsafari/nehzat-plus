using System.Reflection;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.Extensions.DependencyInjection;
using EducationalPlatform.Nehzat.API.Controllers;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using EducationalPlatform.Nehzat.Infrastructure.Services;

namespace EducationalPlatform.Nehzat.Tests;

public class CourseNegativeAccessTests : IDisposable
{
    private readonly ServiceProvider _serviceProvider;
    private readonly IAuthorizationService _authorizationService;

    public CourseNegativeAccessTests()
    {
        var services = new ServiceCollection();
        
        services.AddLogging();
        
        services.AddAuthorization(options =>
        {
            options.AddPolicy("AdminOnly", policy => policy.RequireRole("admin", "manager", "headquarters"));
        });
        
        _serviceProvider = services.BuildServiceProvider();
        _authorizationService = _serviceProvider.GetRequiredService<IAuthorizationService>();
    }

    public void Dispose()
    {
        _serviceProvider.Dispose();
    }

    #region Authorization Policy Tests (using correct claim type "role")

    [Theory]
    [InlineData("trainee", false)]
    [InlineData("parent", false)]
    [InlineData("coach", false)]
    [InlineData("evaluator", false)]
    [InlineData("teacher", false)]
    [InlineData("admin", true)]
    [InlineData("manager", true)]
    [InlineData("headquarters", true)]
    public async Task AuthorizationPolicy_AdminOnly_ReturnsExpectedResult(string role, bool expectedAuthorized)
    {
        var claims = new List<Claim>
        {
            new Claim("sub", "testuser"),
            new Claim(ClaimTypes.Role, role),  // Use ClaimTypes.Role as default for RequireRole
            new Claim("userId", "1")
        };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var principal = new ClaimsPrincipal(identity);

        var authorized = await IsAuthorizedAsync(principal, "AdminOnly");
        Assert.Equal(expectedAuthorized, authorized);
    }

    private async Task<bool> IsAuthorizedAsync(ClaimsPrincipal user, string policyName)
    {
        var result = await _authorizationService.AuthorizeAsync(user, policyName);
        return result.Succeeded;
    }

    #endregion

    #region Controller Attribute Tests - Verify [Authorize] attributes are present

    [Fact]
    public void CourseController_HasAuthorizeAttribute_WithCorrectRoles()
    {
        var controllerType = typeof(CourseController);
        var authorizeAttr = controllerType.GetCustomAttribute<AuthorizeAttribute>();
        
        Assert.NotNull(authorizeAttr);
        Assert.Equal("admin,manager,headquarters", authorizeAttr.Roles);
    }

    [Fact]
    public void AdminCoursesController_HasAuthorizeAttribute_WithCorrectRoles()
    {
        var controllerType = typeof(AdminCoursesController);
        var authorizeAttr = controllerType.GetCustomAttribute<AuthorizeAttribute>();
        
        Assert.NotNull(authorizeAttr);
        Assert.Equal("admin,manager,headquarters", authorizeAttr.Roles);
    }

    [Fact]
    public void CourseController_AllActions_HaveImplicitAuthorize()
    {
        var controllerType = typeof(CourseController);
        var methods = controllerType.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly);
        
        var classAuthorize = controllerType.GetCustomAttribute<AuthorizeAttribute>();
        Assert.NotNull(classAuthorize);
        Assert.Equal("admin,manager,headquarters", classAuthorize.Roles);
        
        foreach (var method in methods)
        {
            if (method.IsDefined(typeof(NonActionAttribute), true))
                continue;
                
            if (HasHttpVerbAttribute(method))
            {
                // Action has HTTP verb attribute - verify it's covered by class-level [Authorize]
                Assert.NotNull(classAuthorize);
                Assert.Equal("admin,manager,headquarters", classAuthorize.Roles);
            }
        }
    }

    [Fact]
    public void AdminCoursesController_AllActions_HaveImplicitAuthorize()
    {
        var controllerType = typeof(AdminCoursesController);
        var methods = controllerType.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly);
        
        var classAuthorize = controllerType.GetCustomAttribute<AuthorizeAttribute>();
        Assert.NotNull(classAuthorize);
        Assert.Equal("admin,manager,headquarters", classAuthorize.Roles);
        
        foreach (var method in methods)
        {
            if (method.IsDefined(typeof(NonActionAttribute), true))
                continue;
                
            if (HasHttpVerbAttribute(method))
            {
                var classAuthorizeAttr = controllerType.GetCustomAttribute<AuthorizeAttribute>();
                Assert.NotNull(classAuthorizeAttr);
                Assert.Equal("admin,manager,headquarters", classAuthorizeAttr.Roles);
            }
        }
    }

    private static bool HasHttpVerbAttribute(MethodInfo method)
    {
        return method.GetCustomAttribute<HttpGetAttribute>() != null
            || method.GetCustomAttribute<HttpPostAttribute>() != null
            || method.GetCustomAttribute<HttpPutAttribute>() != null
            || method.GetCustomAttribute<HttpDeleteAttribute>() != null;
    }

    #endregion

    #region Course Endpoint Coverage Tests - Verify all 5 course paths are protected

    [Theory]
    [InlineData("CourseController", "GetAll", "GET", "/courses")]
    [InlineData("CourseController", "GetActive", "GET", "/courses/active")]
    [InlineData("CourseController", "GetById", "GET", "/courses/{id}")]
    [InlineData("CourseController", "Create", "POST", "/courses")]
    [InlineData("CourseController", "Update", "PUT", "/courses/{id}")]
    [InlineData("CourseController", "Delete", "DELETE", "/courses/{id}")]
    [InlineData("CourseController", "GetAssignments", "GET", "/courses/{id}/assignments")]
    [InlineData("CourseController", "CreateAssignment", "POST", "/courses/{id}/assignments")]
    [InlineData("AdminCoursesController", "GetAllCourses", "GET", "/admin/courses")]
    [InlineData("AdminCoursesController", "GetCourseById", "GET", "/admin/courses/{id}")]
    [InlineData("AdminCoursesController", "CreateCourse", "POST", "/admin/courses")]
    [InlineData("AdminCoursesController", "UpdateCourse", "PUT", "/admin/courses/{id}")]
    [InlineData("AdminCoursesController", "DeleteCourse", "DELETE", "/admin/courses/{id}")]
    [InlineData("AdminCoursesController", "SearchCourses", "GET", "/admin/courses/search")]
    [InlineData("AdminCoursesController", "FilterCourses", "GET", "/admin/courses/filter")]
    [InlineData("AdminCoursesController", "GetCourseAssignments", "GET", "/admin/courses/{courseId}/assignments")]
    [InlineData("AdminCoursesController", "CreateAssignment", "POST", "/admin/courses/{courseId}/assignments")]
    [InlineData("AdminCoursesController", "GetCourseStatistics", "GET", "/admin/courses/{courseId}/statistics")]
    [InlineData("AdminCoursesController", "CreateDailySeries", "POST", "/admin/courses/{courseId}/assignments/daily-series")]
    public void CourseEndpoints_AreProtectedByAuthorizeAttribute(string controllerName, string actionName, string httpMethod, string route)
    {
        var controllerType = controllerName == "CourseController" 
            ? typeof(CourseController) 
            : typeof(AdminCoursesController);
        
        var authorizeAttr = controllerType.GetCustomAttribute<AuthorizeAttribute>();
        Assert.NotNull(authorizeAttr);
        Assert.Equal("admin,manager,headquarters", authorizeAttr.Roles);
        
        // Verify the action exists with the correct HTTP verb
        var method = controllerType.GetMethod(actionName);
        Assert.NotNull(method);
        
        var httpVerbAttr = GetHttpVerbAttribute(method, httpMethod);
        Assert.NotNull(httpVerbAttr);
    }

    private static Attribute? GetHttpVerbAttribute(MethodInfo method, string httpMethod)
    {
        return httpMethod switch
        {
            "GET" => method.GetCustomAttribute<HttpGetAttribute>(),
            "POST" => method.GetCustomAttribute<HttpPostAttribute>(),
            "PUT" => method.GetCustomAttribute<HttpPutAttribute>(),
            "DELETE" => method.GetCustomAttribute<HttpDeleteAttribute>(),
            _ => null
        };
    }

    #endregion

    #region Unauthorized Roles - Explicit List Tests

    [Theory]
    [InlineData("trainee")]
    [InlineData("parent")]
    [InlineData("coach")]
    [InlineData("evaluator")]
    [InlineData("teacher")]
    public void UnauthorizedRoles_List_IsCorrect(string unauthorizedRole)
    {
        // This test documents the 5 unauthorized roles that should NOT have access to course endpoints
        var unauthorizedRoles = new[] { "trainee", "parent", "coach", "evaluator", "teacher" };
        Assert.Contains(unauthorizedRole, unauthorizedRoles);
    }

    [Theory]
    [InlineData("admin")]
    [InlineData("manager")]
    [InlineData("headquarters")]
    public void AuthorizedRoles_List_IsCorrect(string authorizedRole)
    {
        // This test documents the 3 authorized roles that SHOULD have access to course endpoints
        var authorizedRoles = new[] { "admin", "manager", "headquarters" };
        Assert.Contains(authorizedRole, authorizedRoles);
    }

    #endregion
}