namespace EmployeeManagement.Domain.Exceptions
{
    public class UnsupportedLanguageException : DomainException
    {
        public UnsupportedLanguageException(string lang)
            : base($"Language \"{lang}\" is unsupported.") { }
    }
}
