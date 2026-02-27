using System;
using System.Linq.Expressions;
using EmployeeManagement.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using static EmployeeManagement.Application.Common.Constants;

namespace EmployeeManagement.Infrastructure.Persistence
{
    public static class Database
    {
        public const string DateTimeOffset = "datetimeoffset";
        public const string Date           = "date";


        public static EntityTypeBuilder<TEntity> OwnsLocalizedString<TEntity>(
            this EntityTypeBuilder<TEntity> entity,
            Expression<Func<TEntity, LocalizedString>> navigationExpression,
            int maxLength = NameMaxLength) where TEntity : class
            => entity.OwnsOne(navigationExpression, c => LocalizedNameTypeBuilder(c, maxLength));

        public static void OwnsOptionalLocalizedString<TEntity, TLocalizedString>(
            this EntityTypeBuilder<TEntity> entity,
            Expression<Func<TEntity, TLocalizedString>> navigationExpression,
            int maxLength = NameMaxLength) where TEntity : class where TLocalizedString : WeakLocalizedString
            => entity.OwnsOne(navigationExpression, c => LocalizedNameMaxLengthTypeBuilder(c, maxLength));

        public static void OwnsLocalizedString<TEntity, TDependentEntity>(
            this OwnedNavigationBuilder<TEntity, TDependentEntity> entity,
            Expression<Func<TDependentEntity, LocalizedString>> navigationExpression,
            int maxLength = NameMaxLength) where TEntity : class where TDependentEntity : class
            => entity.OwnsOne(navigationExpression, c => LocalizedNameTypeBuilder(c, maxLength));

        public static void OwnsOptionalLocalizedString<TEntity, TDependentEntity, TLocalizedString>(
            this OwnedNavigationBuilder<TEntity, TDependentEntity> entity,
            Expression<Func<TDependentEntity, TLocalizedString>> navigationExpression,
            int maxLength = NameMaxLength)
            where TEntity : class where TDependentEntity : class where TLocalizedString : WeakLocalizedString
            => entity.OwnsOne(navigationExpression, c => LocalizedNameMaxLengthTypeBuilder(c, maxLength));


        private static void LocalizedNameTypeBuilder<TEntity>(
            OwnedNavigationBuilder<TEntity, LocalizedString> builder,
            int? maxLength)
            where TEntity : class
        {
            builder.Property(e => e.Ar)
                .IsRequired();

            builder.Property(e => e.En)
                .IsRequired();

            LocalizedNameMaxLengthTypeBuilder(builder, maxLength);
        }

        private static void LocalizedNameMaxLengthTypeBuilder<TEntity, TLocalizedString>(
            OwnedNavigationBuilder<TEntity, TLocalizedString> builder,
            int? maxLength)
            where TEntity : class
            where TLocalizedString : WeakLocalizedString
        {
            if (maxLength is null)
            {
                return;
            }

            builder.Property(e => e.Ar)
                .HasMaxLength((int) maxLength);

            builder.Property(e => e.En)
                .HasMaxLength((int) maxLength);
        }
    }
}
