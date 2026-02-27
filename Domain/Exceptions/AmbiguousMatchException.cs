namespace EmployeeManagement.Domain.Exceptions
{
    public class AmbiguousMatchException : DomainException
    {
        public AmbiguousMatchException(string message) : base(message) { }
    }
}
