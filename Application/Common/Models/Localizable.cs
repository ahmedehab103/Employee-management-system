namespace EmployeeManagement.Application.Common.Models
{
    public class Localizable<T>
    {
        public Localizable(T key, LocalizedStringDto s)
        {
            Key = key;
            LocalizedStringDto = s;
        }

        public T Key { get; set; }
        public LocalizedStringDto LocalizedStringDto { get; set; }
    }
}
