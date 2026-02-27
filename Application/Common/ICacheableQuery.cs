using System;

namespace EmployeeManagement.Application.Common
{
    public interface ICacheableQuery
    {
        bool IsNotCache => false;
        string CacheKey { get; }
        DateTimeOffset? CacheTime => null;
    }
}
