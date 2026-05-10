export const getTrainerStatusTemplate = (subject: string, message: string): string => `
  <div style="font-family: Arial, sans-serif; color: #333; border: 1px solid #eee; padding: 20px;">
    <h2 style="color: #2c3e50;">${subject}</h2>
    <p style="font-size: 16px; line-height: 1.5;">${message}</p>
    <p style="margin-top: 20px; font-size: 12px; color: #777;">FitTribe Administration Team</p>
  </div>
`;