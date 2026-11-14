using Microsoft.EntityFrameworkCore;
using obamart.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;

namespace obamart.Contexts
{
    public class ObamartDbContext : DbContext
    {
        private string connectionString;

        public ObamartDbContext(string connString) => this.connectionString = connString;

        public ObamartDbContext(DbContextOptions opt) : base(opt) { }

        public DbSet<Cliente> Cliente => Set<Cliente>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var entityCliente = modelBuilder.Entity<Cliente>();

            entityCliente.ToTable("cliente");
            entityCliente.Property(c => c.Nome).HasColumnName("cliente_nome");
            entityCliente.Property(c => c.Cpf).HasColumnName("cliente_cpf");
            entityCliente.Property(c => c.DataNascimento).HasColumnName("cliente_datanascimento");
            entityCliente.Property(c => c.Email).HasColumnName("cliente_email");
            entityCliente.HasKey("cliente_id");

            base.OnModelCreating(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!string.IsNullOrEmpty(connectionString))
            {
                optionsBuilder.UseNpgsql(connectionString)
                    .LogTo(message => Debug.WriteLine(message))
                    .EnableSensitiveDataLogging()
                    .EnableDetailedErrors();
            }

            base.OnConfiguring(optionsBuilder);
        }
    }
}
