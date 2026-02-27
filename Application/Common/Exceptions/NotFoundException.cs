using System;

namespace EmployeeManagement.Application.Common.Exceptions
{
    /// <summary>
    /// An exception that should be thrown if the user is trying to access data that isn't found
    /// </summary>
    public class NotFoundException : Exception
    {
        public NotFoundException()
            : base("Not found") { }

        public NotFoundException(string message)
            : base(message) { }

        public NotFoundException(string message, Exception innerException)
            : base(message, innerException) { }
    }
}
