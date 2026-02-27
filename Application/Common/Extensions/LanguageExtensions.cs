using System;
using System.Linq;
using EmployeeManagement.Domain.Models;

namespace EmployeeManagement.Application.Common.Extensions
{
    public static class LanguageExtensions
    {
        public static Language ToLang(this string lang) => EnumExtensions.ToArray<Language>()
            .FirstOrDefault(c
                => string.Equals(c.ToString(), lang, StringComparison.InvariantCultureIgnoreCase));
    }
}
