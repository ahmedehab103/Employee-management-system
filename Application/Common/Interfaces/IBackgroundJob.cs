using System.Threading.Tasks;

namespace EmployeeManagement.Application.Common.Interfaces
{
    public interface IBackgroundJob
    {
        public string CronRate();

        public Task Handle();
    }
}
