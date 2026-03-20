using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MySql.Data.MySqlClient;

namespace YourApp.Controllers
{
    // ─────────────────────────────────────────────
    //  REQUEST / RESPONSE MODELS
    // ─────────────────────────────────────────────
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public bool   Success  { get; set; }
        public string Message  { get; set; } = string.Empty;
        public string Token    { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
    }

    // ─────────────────────────────────────────────
    //  LOGIN CONTROLLER
    // ─────────────────────────────────────────────
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _config;

        public LoginController(IConfiguration config)
        {
            _config = config;
        }

        // POST: api/Login
        [HttpPost]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // ── 1. Basic validation ────────────────────────────────────
            if (string.IsNullOrWhiteSpace(request.Username) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new LoginResponse
                {
                    Success = false,
                    Message = "Username and password are required."
                });
            }

            // ── 2. Check credentials in DB ─────────────────────────────
            var user = GetUserFromDb(request.Username, request.Password);

            if (user == null)
            {
                return Unauthorized(new LoginResponse
                {
                    Success = false,
                    Message = "Invalid Employee ID or Password."
                });
            }

            // ── 3. Generate JWT token ──────────────────────────────────
            string token = GenerateJwtToken(user.Username);

            return Ok(new LoginResponse
            {
                Success  = true,
                Message  = "Login successful.",
                Token    = token,
                Username = user.Username
            });
        }

        // GET: api/Login/test
        [HttpGet("test")]
        public IActionResult Test()
        {
            var dbHost = Environment.GetEnvironmentVariable("DB_HOST");
            var dbPort = Environment.GetEnvironmentVariable("DB_PORT") ?? "3306";
            var dbName = Environment.GetEnvironmentVariable("DB_NAME");
            var dbUser = Environment.GetEnvironmentVariable("DB_USER");
            var dbPass = Environment.GetEnvironmentVariable("DB_PASSWORD");

            string connStr = (dbHost != null)
                ? $"Server={dbHost};Port={dbPort};Database={dbName};User={dbUser};Password={dbPass};"
                : _config.GetConnectionString("DefaultConnection")!;

            try
            {
                using var conn = new MySqlConnection(connStr);
                conn.Open();
                var cmd = new MySqlCommand("SELECT COUNT(*) FROM `employee data`", conn);
                var count = cmd.ExecuteScalar();
                return Ok(new { status = "Connected!", host = dbHost, database = dbName, rowCount = count });
            }
            catch (Exception ex)
            {
                return Ok(new { status = "Failed!", error = ex.Message, host = dbHost, database = dbName });
            }
        }

        // ─────────────────────────────────────────────
        //  DB LOOKUP — checks EmpID + Password in `Employee Data` table
        // ─────────────────────────────────────────────
        private UserRecord? GetUserFromDb(string empId, string password)
        {
            var dbHost = Environment.GetEnvironmentVariable("DB_HOST");
            var dbPort = Environment.GetEnvironmentVariable("DB_PORT") ?? "3306";
            var dbName = Environment.GetEnvironmentVariable("DB_NAME");
            var dbUser = Environment.GetEnvironmentVariable("DB_USER");
            var dbPass = Environment.GetEnvironmentVariable("DB_PASSWORD");

            string connStr = (dbHost != null)
                ? $"Server={dbHost};Port={dbPort};Database={dbName};User={dbUser};Password={dbPass};"
                : _config.GetConnectionString("DefaultConnection")!;

            Console.WriteLine($"[DB] Connecting to: Server={dbHost};Port={dbPort};Database={dbName};User={dbUser}");
            Console.WriteLine($"[DB] EmpID={empId}");

            using var conn = new MySqlConnection(connStr);

            try
            {
                conn.Open();
                Console.WriteLine("[DB] Connection opened successfully");

                string query = @"
                    SELECT EmpID
                    FROM   `employee data`
                    WHERE  EmpID    = @EmpID
                    AND  Password = @Password
                    LIMIT 1";

                using var cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@EmpID",    empId);
                cmd.Parameters.AddWithValue("@Password", password);

                using var reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    Console.WriteLine("[DB] User found!");
                    return new UserRecord
                    {
                        Username = reader["EmpID"].ToString()!
                    };
                }

                Console.WriteLine("[DB] No user matched the credentials");
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[DB Error] {ex.Message}");
                Console.WriteLine($"[DB Error] {ex.StackTrace}");
                return null;
            }
        }

        // ─────────────────────────────────────────────
        //  JWT TOKEN GENERATOR
        // ─────────────────────────────────────────────
        private string GenerateJwtToken(string username)
        {
            string jwtKey   = _config["Jwt:Key"]!;
            string issuer   = _config["Jwt:Issuer"]!;
            string audience = _config["Jwt:Audience"]!;
            int    expiry   = int.Parse(_config["Jwt:ExpiryMinutes"] ?? "60");

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer:             issuer,
                audience:           audience,
                claims:             claims,
                expires:            DateTime.UtcNow.AddMinutes(expiry),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    // ─────────────────────────────────────────────
    //  INTERNAL MODEL
    // ─────────────────────────────────────────────
    internal class UserRecord
    {
        public string Username { get; set; } = string.Empty;
    }
}