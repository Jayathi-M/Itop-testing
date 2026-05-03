using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;
using Xception.AI.Modules.DynamicPlatform.Domain.Entities;

namespace Xception.AI.Modules.DynamicPlatform.Infrastructure.Configuration
{
    public class ColumnsConfiguration : IEntityTypeConfiguration<ColumnsEntity>
    {
        public void Configure(EntityTypeBuilder<ColumnsEntity> entity)
        {
            entity.ToTable("columns");

            entity.HasKey(e => e.id);

            entity.Property(e => e.id)
                  .UseIdentityAlwaysColumn();

            entity.Property(e => e.table_schema)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(e => e.table_name)
                 .IsRequired()
                 .HasMaxLength(500);

            entity.Property(e => e.column_name)
                 .IsRequired()
                 .HasMaxLength(500);

            entity.Property(e => e.column_default)
                 .HasDefaultValueSql("100")
                 .IsRequired()
                 .HasMaxLength(100); // I have doubt

            entity.Property(e => e.is_nullable)
                 .IsRequired()
                 .HasMaxLength(5);

            entity.Property(e => e.data_type)
                  .IsRequired()
                  .HasMaxLength(20);

            entity.Property(e => e.character_maximum_length);

            entity.Property(e => e.numeric_precision);

            entity.Property(e => e.numeric_scale);

            entity.Property(e => e.label_name)
                  .HasMaxLength(500);

            entity.Property(e => e.lookup_table_name)
                  .HasMaxLength(500);

            entity.Property(e => e.lookup_text_field)
                  .HasMaxLength(500);

            entity.Property(e => e.lookup_value_field)
                  .HasMaxLength(500);

            entity.Property(e => e.lookup_filter)
                  .HasColumnType("text");

            entity.Property(e => e.is_active)
                  .HasDefaultValue(true);

            entity.Property(e => e.is_dynamic)
                  .HasDefaultValue(true);

            entity.Property(e => e.is_displaylist)
                  .HasDefaultValue(false);
            /*
            entity.HasOne<EmployeeMasterEntity>()                 // reference type only
              .WithMany()
              .HasForeignKey(e => e.CreatedBy)
              .OnDelete(DeleteBehavior.Restrict);*/
        }
    }
}
