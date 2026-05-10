export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  SOMETHING_WENT_WRONG: "Something went wrong",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  BAD_REQUEST: "Bad Request",
  NOT_FOUND: "Not Found",
  LOGIN_FAILED: "Login failed",
  EMAIL_EXISTS: "Email Already Exists",
  EMAIL_ALREADY_EXIST: "Email already registered as a user",

  INVALID_CREDENTIALS: "Invalid email or password",
  PASSWORD_INCORRECT: "Password is incorrect",
  ACCOUNT_BLOCKED: "Your account has been blocked",
  ACCOUNT_NOT_VERIFIED: "Your account is not verified",
  IMAGE_FILE_MISSING: "No image file provided",

  USER_FAILED: "User account creation failed",
  USER_VERIFIED: "User Verified",
  USER_NOT_FOUND: "User Not Found",
  USER_BLOCKED: "User account has been blocked",
  OTP_INVALID: "Invalid or expired OTP",
  OTP_GENERATE_ERROR: "Failed to send OTP. Please try again.",
  RESET_LINK_SENT: "Password reset link sent successfully",
  INVALID_RESET_TOKEN: "Invalid or expired reset token",
  PASSWORD_RESET_SUCCESS: "Password has been reset successfully",
  TRAINER_VERIFIED: "Trainer Verified Successfully",
  TRAINER_FAILED: "Trainer account creation failed",
  TRAINER_NOT_VERIFIED: "Trainer Is Not Verified",
  TRAINER_DECLINED: "Trainer declined and deleted successfully",
  TRAINER_NOT_FOUND: "Trainer Not Found",
  TRAINER_BLOCKED: "Trainer Is Blocked",
  CERTIFICATE_MISSING: "Trainer certificate is required.",
  MISSING_REQUIRED_SLOTS_DATA: "Trainer Details and Date are required",
  MISSING_REQUIRED_DATA: 'Missing Required Data.Kindly Check Once More And Try Again !',

  REFRESH_TOKEN_MISSING: "No refresh token provided",
  REFRESH_TOKEN_INVALID: "Invalid refresh token",
  ACCESS_TOKEN_GENERATING_FAILURE: "Access Token Generation error Occured",
  OTP_FAILED: "Creating Otp Failed",

  SERVICE_NOT_FOUND: "The service is not found",
  ACCOUNT_SETUP_FAILED: "Account setup failed",

  PASSWORD_MISSING: "Password is missing",
  CURRENT_PASSWORD_INCORRECT: "Current password is incorrect",

  INVALID_RESET_LINK: "The reset link is invalid or has expired.",
  PROFILE_PICTURE_MISSING: "Profile picture file is missing",
  PROFILE_PICTURE_UPDATION_FAILED: "Profile picture updation got failed! try again.",


  UPDATE_STATUS_FAILED: "Updating the status failed! try again",

  BOOKING_NOT_FOUND: "Booking not found",
  BOOKING_CONFIRMATION_FAILED: (status: string) => `Cannot confirm booking with status: ${status}`,
  BOOKING_DECLINE_FAILED: (status: string) => `Cannot decline booking with status: ${status}`,
  RESCHEDULE_FAILED: (status: string) => `Reschedule not allowed for booking with status: ${status}`,



  PAYMENT_VERIFICATION_FAILED: "Payment security verification failed",

  SLOT_ALREADY_BOOKED: "This slot was just booked by another user.",


  ORDER_CREATION_FAILED: 'Order creation failed',
  INVALID_ACTION: (action: string) => `Action ${action} is invalid`,

  CANCELLATION_TIME_OVER: "Cancellation period expired. Sessions must be cancelled 24h in advance.",
  DECLINE_BOOKING_ERROR: "Booking cannot be declined in its current state",
  PENDING_REQUEST_NOT_FOUND: "No pending request found",

  CHATID_INVALID: "chat id provided is invalid",
  CHAT_ROOM_NOT_FOUND: "Chat room not found",
  LEAVEID_MISSING: "Leave ID missing",
  LEAVE_ALREADY_EXISTED: "You already have an active or pending leave during this period.",

  PROGRAMS_LOADING_ERROR: "Unable to load programs at this time. Please try again later.",
  PROGRAM_NOT_FOUND: "Program not found",
  PROGRAM_UPDATION_FAILED: "Failed to persist updated program",

  TRAINER_ON_LEAVE: "Trainer does not work on this day.",

  FAILED_TO_INITIATE_SLOTS: "Failed to initialize trainer availability",
  INVALID_PAGINATION: "Invalid pagination parameters",
  DASHBOARD_LOADING_ERROR: "Failed to fetch dashboard metrics",
  REASON_NOT_PROVIDED: "reason required",
  BOOKING_NOT_CONFIRMED: "Only confirmed bookings can be marked as complete",

  TRAINER_REVIEWS_NOT_FOUND: "Reviews not found",

  INVALID_SLOT_WINDOW: (day: string, start: string, end: string): string =>
    `Invalid window on ${day}: ${start} to ${end}`,
  OVERLAPPING_AVAILABILITY: (day: string): string =>
    `Overlapping availability detected on ${day}`,

  DATABASE_CONNECTION_ERROR: "Database connection error",

  UPLOAD_CERTIFICATE_FAILED: "Failed to upload trainer certificate",
  UPLOAD_PROFILE_PICTURE_FAILED: "Failed to upload profile picture",
  UPLOAD_PROGRAM_IMAGE_FAILED: "Failed to upload program image",
  UPLOAD_LEAVE_DOCUMENT_FAILED: "Failed to upload leave documents",
  UPLOAD_CHAT_ATTACHMENT_FAILED: "Failed to upload chat attachment",

  GOOGLE_DATA_FETCHING_ERROR:"No data provided by Google",
  PDF_GENERATION_FAILED:"Failed to generate PDF report",
   ACCESS_DENIED:"Access Denied. No token provided."
}
