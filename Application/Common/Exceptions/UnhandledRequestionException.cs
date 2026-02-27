using System;

namespace EmployeeManagement.Application.Common.Exceptions
{
    /// <summary>
    /// An exception that should be thrown if an unhandled exception has been thrown.
    /// </summary>
    public class UnhandledRequestException : Exception
    {
        public UnhandledRequestException(string msg, Exception inter) : base(msg, inter) { }
    }
}
