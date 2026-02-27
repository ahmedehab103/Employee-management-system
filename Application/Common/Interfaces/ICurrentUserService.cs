using System;
using System.Collections.Generic;

namespace EmployeeManagement.Application.Common.Interfaces
{
    public interface ICurrentUserService
    {
        public string Id { get; }
        public string UserName { get; }
        public string Email { get; }
        public bool IsAuthenticated { get; }
        public bool IsAdmin { get; }

        public List<Guid> CompaniesIds { get; }
    }
}
