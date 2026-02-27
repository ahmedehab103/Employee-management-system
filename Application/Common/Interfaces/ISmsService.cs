using System.Threading.Tasks;

namespace EmployeeManagement.Application.Common.Interfaces
{
    public interface ISmsService
    {
        Task SendMessage(string phoneNumber, string message);
    }
}
