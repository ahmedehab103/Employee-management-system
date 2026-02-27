using System.Collections.Generic;

namespace EmployeeManagement.Application.Common.Models
{
    public class Grouping<T>
    {
        public int Key { get; set; }

        public List<T> Items { get; set; }
    }
}
