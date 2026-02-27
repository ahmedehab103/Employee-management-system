namespace EmployeeManagement.Application.Common
{
    public static class Constants
    {
        public const string SuspensionKey = "SUSPENSION";

        public const  int CardMaxLength       = 16;
        public const  int CvvMaxLength        = 3;
        public static int CacheExpirationTime = 5;


        #region General

        public const string EnvironmentVariableName = "DOTNET_ENVIRONMENT";
        public const string SpaProxyBaseUrlName     = "SPA_BASE_URL";

        public const int MaxUrlLength = 65519;

        #endregion

        #region Validation

        public const int IdMaxLength   = 320;
        public const int MacMaxLength  = 17;
        public const int NameMaxLength = 32;
        public const int UriMaxLength  = 38;

        // User
        public const int MinPassword     = 8;
        public const int MaxPassword     = 100;
        public const int MaxUserName     = 50;
        public const int MaxEmailAddress = 256;
        public const int MinPhoneNumber  = 5;
        public const int MaxPhoneNumber  = 24;

        #endregion

        #region Validation

        public const int LocalizedStringMaxLength     = 256;
        public const int AnswerMaxLength              = 1024;
        public const int MessageContentMaxLength      = 65519;
        public const int NotificationDetailsMaxLength = 254;

        #endregion
    }
}
