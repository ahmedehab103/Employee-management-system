using EmployeeManagement.Application.Common.Enums;

namespace EmployeeManagement.Infrastructure.Identity.Models
{
    public class IdentityOptions
    {
        private JwtConfig _jwtConfig = new();

        private PasswordOptions _password = new();

        public bool RestrictSingleLogin { get; set; } = false;
        public bool LogoutOnNewLogin { get; set; } = false;
        public bool RestrictSingleDevice { get; set; } = false;
        public bool NumericVerificationToken { get; set; } = false;
        public int NumericTokenLength { get; set; } = 6;
        public int SessionExpirationPeriod { get; set; } = 24;
        public bool RequireConfirmedEmail { get; set; } = true;
        public bool RequireConfirmedPhoneNumber { get; set; } = false;
        public bool RequireUniqueEmail { get; set; } = true;
        public bool LockoutOnFailure { get; set; } = true;
        public int TokenExpirationPeriod { get; set; } = 60;
        public int TokenResetPeriod { get; set; } = 5;
        public PhoneNumberCode[] AcceptedCodes { get; set; }

        public PasswordOptions Password { get => _password ?? new PasswordOptions(); set => _password = value; }
        public JwtConfig JwtConfig { get => _jwtConfig ?? new JwtConfig(); set => _jwtConfig = value; }
    }
}
