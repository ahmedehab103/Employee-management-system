namespace EmployeeManagement.Application
{
    public interface IApplicationUserService
    {
        public string Id { get; }
        public string UserName { get; }
        public string Email { get; }
    }
}
