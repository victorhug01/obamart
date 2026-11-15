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
        public DbSet<Divida> Divida => Set<Divida>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var entityCliente = modelBuilder.Entity<Cliente>();

            entityCliente.ToTable("cliente");
            entityCliente.HasKey(c => c.Id);
            entityCliente.Property(c => c.Id).HasColumnName("cliente_id");
            entityCliente.Property(c => c.Nome).HasColumnName("cliente_nome");
            entityCliente.Property(c => c.Cpf).HasColumnName("cliente_cpf");
            entityCliente.Property(c => c.DataNascimento).HasColumnName("cliente_datanascimento");
            entityCliente.Property(c => c.Email).HasColumnName("cliente_email");
            entityCliente.HasIndex(c => c.Cpf).IsUnique().HasDatabaseName("ux_cliente_cpf");

            var entityDivida = modelBuilder.Entity<Divida>();

            entityDivida.ToTable("divida");
            entityDivida.HasKey(d => d.Id);
            entityDivida.Property(d => d.Id).HasColumnName("divida_id");
            entityDivida.Property(d => d.ClienteId).HasColumnName("cliente_id");
            entityDivida.Property(d => d.Valor).HasColumnName("divida_valor");
            entityDivida.Property(d => d.Situacao).HasColumnName("divida_situacao");
            entityDivida.Property(d => d.DataCriacao).HasColumnName("divida_datacriacao");
            entityDivida.Property(d => d.DataPagamento).HasColumnName("divida_datapagamento");
            entityDivida.HasOne<Cliente>().WithMany().HasForeignKey(d => d.ClienteId);
            entityDivida.HasIndex(d => d.ClienteId).IsUnique()
                .HasFilter("NOT divida_situacao").HasDatabaseName("ux_divida_cliente_aberta");

            base.OnModelCreating(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!string.IsNullOrEmpty(connectionString))
            {
                optionsBuilder.UseNpgsql(connectionString).LogTo(message => Debug.WriteLine(message))
                    .EnableSensitiveDataLogging()
                    .EnableDetailedErrors();
            }

            base.OnConfiguring(optionsBuilder);
        }
    }
}
