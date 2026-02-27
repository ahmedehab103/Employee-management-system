using System;
using System.Threading.Tasks;
using EmployeeManagement.Application.Common.Interfaces;
using Hangfire;

namespace EmployeeManagement.Infrastructure.Jobs.Tests
{
    public class TestExecute : IBackgroundJob
    {
        public string CronRate() => Cron.Never();


        public Task Handle() => Task.FromResult(() => Console.WriteLine("ldasf"));
    }
}
