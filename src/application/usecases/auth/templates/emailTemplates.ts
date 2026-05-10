export const getResetPasswordDetails = (link: string) => {
  return {
    subject: "Reset Your FitTribe Password",
    htmlContent: `
            <div style="font-family: sans-serif; padding: 20px; line-height: 1.6; color: #333;">
                <h2 style="color: #1a73e8;">Password Reset Request</h2>
                <p>You requested to reset your password for your FitTribe account. Click the button below to proceed:</p>
                <div style="margin: 30px 0;">
                    <a href="${link}" 
                       target="_blank" 
                       style="background-color: #1a73e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                       Reset Your Password
                    </a>
                </div>
                <p>If you didn’t request this, you can safely ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
                <p style="font-size: 0.8em; color: #777;">This link will expire in 15 minutes.</p>
            </div>
        `
  };
};