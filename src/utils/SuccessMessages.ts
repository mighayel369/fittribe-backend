export const SUCCESS_MESSAGES = {
  ADMIN: {
    LOGIN: "Admin login successful",
    USER_RETRIEVED: "Users retrieved successfully",
    USER_DETAILS: "User details retrieved successfully",
    TRAINERS_RETRIEVED: "Trainers retrieved successfully",
    TRAINER_DETAILS: "Trainer details retrieved successfully",
    WALLET_RETRIEVED: "Wallet and transactions retrieved successfully",
    DASHBOARD_FETCHED: "Dashboard data fetched successfully",
  },
  SERVICE: {
    CREATED: "Service created successfully",
    FETCHED: "Services fetched successfully",
    UPDATED: "Service updated successfully",
    DELETED: "Service deleted successfully",
    DETAILS: "Service details retrieved successfully",
    LISTED: "Service listed successfully",
    UNLISTED: "Service unlisted successfully",
    SERVICE_STATUS_UPDATED: (status: boolean) => `Service ${status ? "Listed" : "Unlisted"} Successfully`
  },
  USER: {
    USER_REGISTERED: "User registered successfully",
    RESET_LINK_SENTED: "Sent an reset link in your email",
    PASSWORD_UPDATED: "Password updated successfully! Please log in.",
    USER_DETAILS_FETCHED: 'User Details Fetched Successfully',
    USER_REVIEW_SUBMITTED: "Review submitted successfully",
    USER_STATUS_UPDATED:"User status got updated"
  },
  TRAINER: {
    TRAINERS_LISTED: 'All Trainers Listed Successfully',
    TRAINER_DETAILS_FETCHED: 'Trainer Details Fetched Successfully',
    TRAINER_SLOTS_FETCHED: 'All Available Trainer Slots Are Fetched Successfully',
    REAPPLY_SUCCESSFULL: "Reapplied Successfully. Awaiting Verification.",
    TRAINER_WEEKLY_SLOT_UPDATED: "Weekly availability updated successfully",
    TRAINER_REVIEW_FETCHED: "Review fetched successfully",
    TRAINER_REVIEW_FLAGGED: "Review flaged successfully",
    TRAINER_VERIFIED:"Trainer got verified",
    TRAINER_APPROVAL:(action:string)=>`Trainer account got ${action}`
  },
  AUTH: {
    LOGOUT_SUCCESS: "Logot Successfull",
    PASSWORD_UPDATED: "Password updated successfully",
    TRAINER_REGISTERATION_SUCCESSFULL: "Trainer registration initiated. Pending admin approval.",
    LOGIN_SUCCESSFULL: 'Logged Successfully!',
    AUTHORIZED_SUCCESSFULLY: "Authorized successfully!",
    OTP_SENDED: "A New OTP has been sent to your email."
  },
  PROFILE: {
    PROFILE_PICTURE_UPDATED: "Profile photo updated successfully",
    PROFILE_DATA_UPDATED: "Your Profile Updated Successfully",
  },
  WALLET: {
    WALLET_DETAILS_FETCHED: "Wallet and transactions retrieved"
  },
  BOOKING: {
    USER_BOOKINGS: 'All Available User Bookings Fetched Successfully',
    BOOKING_CANCELLED: "Booking cancelled and refund processed",
    RESCHEDULE_REQUEST_INITIATED: "Reschedule request submitted to trainer successfully.",
    RESCHEDULE_BOOKING_REQUEST_DECLINED: "Reschedule request declined",
    BOOKING_DETAILS_FETCHED: 'Booking Details Fetched Successfully',
    BOOKING_SUCCESSFULL: "Payment verified and booking created successfully",
    TRAINER_BOOKING_SUCCESSFULL: "Booking confirmed and funds released to wallet balance.",
    TRAINER_DECLINED_BOOKING: "Booking declined and payment refunded to client wallet.",
    RESCHEDULE_PROCCESSED: (action: string) => `Reschedule request has been ${action === 'approve' ? 'accepted' : 'rejected'}.`,
    BOOKINGS_FETCHED: 'All Bookings Fetched Successfully',
    BOOKING_PENDING_FETCHED: 'Fetched All Pending Booking Requests',
    MARKED_AS_COMPLETED: "Session marked As Completed",
    RESCHEDULE_BOOKING_ACCEPTED: "Reschedule request accepted successfully"
  },
  PAYMENT: {
    PAYMENT_REQUEST_INITIATED: 'Payment Got Initiated Successfully',
    PAYMENT_SUCCESS: 'Your Payment Is Successfully Completed'
  },
  DASHBOARD: {
    DASHBOARD_DATA_FETCHED: "Dashboard Data Fetched Fuccessfully",
    TRAINER_APPOINTMENT_DATA: "Appointments Fetched Successfully"
  },
  LEAVE: {
    LEAVE_APPLIED_SUCCESSFULLY: 'Leave Applied Successfully',
    LEAVE_WITHDRAWN: "Leave request withdrawn successfully",
    UPDATE_LEAVE_STATUS: (status: string) => `Leave request has been ${status} successfully.`
  },
  CHAT: {
    CHAT_MESSAGED_FETCHED: "Messages fetched successfully",
    MARKED_ALL_MESSAGES_AS_READ: "Marked All Your Messages As Read",
    CHAT_ESTABLIASHED: "Established chats fetched successfully",
    NON_ESTABLISHED_CLIENTS_FETCHED: "Discovery clients fetched successfully",
    ESTABLISHED_CLIENTS_CHATS_FETCHED: "Established chats fetched successfully",
    FILE_UPLOADED: "File uploaded successfully"
  },
  PROGRAMS: {
    ACTIVE_PROGRAMS_FETCHED: "Active programs discovered",
    ONBOARD_NEW_PROGRAM: "Fitness program onboarded successfully",
    FETCHED_ALL_PROGRAMS: "Program inventory retrieved",
    PROGRAM_UPDATED: "Program specifications updated",
    PROGRAM_ARCHIEVED: "Program has been archived",
    PROGRAM_STATUS_UPDATED: (isPublished: boolean) => `Program is now ${isPublished ? 'Published' : 'Hidden'}`,
    PROGRAM_DETAILS_FETCHED: "Program details retrieved"
  },
  NOTIFICATION: {
    MARKED_AS_READ: "Notification marked as read",
    NOTIFICATION_FETCHED_SUCCESSFULLY: "Notification fetched successfully",
    ALL_MARKED_AS_READ: "All Notification marked as read"
  },
  SLOT: {
    SLOT_FETCHED_SUCCESSFULLY: "Slots fetched successfully",
    SLOT_FULLY_BOOKED: "Fully booked for today.",
    TRAINER_ON_LEAVE: "Trainer is currently on leave for this date.",
    NO_AVAILABILITY_SET: "No availability set."
  }
};