namespace LookApp.Business.Identity.Models
{
    public class ChangePasswordRequest
    {
        public string Email { get; set; }

        public string NewPassword { get; set; }
    }
}
