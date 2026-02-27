using EmployeeManagement.Domain;
using Microsoft.AspNetCore.Authorization;

namespace API.Attributes
{
    public class RoleAuthorizeAttribute : AuthorizeAttribute
    {
        public RoleAuthorizeAttribute(Role role) : base()
        {
            Roles = role.ToString();
        }
    }
}
