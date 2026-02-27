namespace EmployeeManagement.Domain.ValueObjects
{
    public class FullName
    {
        private FullName() { }

        private FullName(string firstName, string lastName)
        {
            FirstName = firstName;
            LastName = lastName;
        }

        public string FirstName { get; set; }
        public string LastName { get; set; }

        public static implicit operator string(FullName fullName) => fullName?.ToString();

        public static explicit operator FullName((string firstName, string lastName) values) => new(values.firstName, values.lastName);

        public override string ToString() => FirstName + " " + LastName;
    }
}
