import { container } from "tsyringe";


import { IDBDatasource, I_DBDATASOURCE_TOKEN } from "domain/repositories/IDBDatasource";
import { IUserRepo, I_USER_REPO_TOKEN } from "domain/repositories/IUserRepo";
import { IAdminRepo, I_ADMIN_REPO_TOKEN } from "domain/repositories/IAdminRepo";
import { ITrainerRepo, I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";
import { IProgramRepo, I_PROGRAM_REPO_TOKEN } from "domain/repositories/IProgramRepo";
import { ISlotRepo, I_SLOT_REPO_TOKEN } from "domain/repositories/ISlotRepo";
import { IWalletRepo, I_WALLET_REPO_TOKEN } from "domain/repositories/IWalletRepo";
import { IBookingRepo, I_BOOKING_REPO_TOKEN } from "domain/repositories/IBookingRepo";
import { ILeaveRepo, I_LEAVE_REPO_TOKEN } from "domain/repositories/ILeaveRepo";
import { INotificationRepo, I_NOTIFICATION_REPO_TOKEN } from "domain/repositories/INotifctionRepo";
import { IChatRepo, I_CHAT_REPO_TOKEN } from "domain/repositories/IChatRepo";
import { IMessageRepo, I_MESSAGE_REPO_TOKEN } from "domain/repositories/IMessageRepo";
import { IReviewRepo, I_REVIEW_REPO_TOKEN } from "domain/repositories/IReviewRepo";

import { IPasswordHasher, I_PASSWORD_HASHER_TOKEN } from "domain/services/IPasswordHasher";
import { IOtpService, I_OTP_SERVICE_TOKEN } from "domain/services/IOtpService";
import { IGoogleAuthService, I_GOOGLE_AUTH_SERVICE_TOKEN } from "domain/services/IGoogleAuthService";
import { IPasswordResetService, I_PASSWORD_RESET_SERVICE_TOKEN } from "domain/services/IPasswordResetService";
import { ICloudinaryService, I_CLOUDINARY_SERVICE_TOKEN } from "domain/services/ICloudinaryService";
import { IPaymentService, I_PAYMENT_SERVICE_TOKEN } from "domain/services/IPaymentService";
import { IJwtService, I_JWT_SERVICE_TOKEN } from "domain/services/i-jwt.service";
import { INotificationService, I_NOTIFICATION_SERVICE_TOKEN } from "domain/services/i-notification.service";
import { IChatService, I_CHAT_SERVICE_TOKEN } from "domain/services/i-chat-service";
import { ISocketService, I_SOCKET_SERVICE_TOKEN } from "domain/services/i-socket-service";

import { I_CLIENT_REGISTER_USECASE_TOKEN, I_TRAINER_REGISTER_USECASE_TOKEN, IRegisterUseCase } from "application/interfaces/auth/i-register.usecase";
import { I_ADMIN_LOGIN_USECASE_TOKEN, I_CLIENT_LOGIN_USECASE_TOKEN, I_TRAINER_LOGIN_USECASE_TOKEN, ILoginUseCase } from "application/interfaces/auth/i-login.usecase";
import { IVerifySession, I_VERIFY_CLIENT_SESSION_TOKEN, I_VERIFY_TRAINER_SESSION_TOKEN } from "application/interfaces/auth/i-verify-session.usecase";
import { I_CLIENT_CHANGE_PASSWORD_USECASE_TOKEN, I_RESET_PASSWORD_TOKEN, I_TRAINER_CHANGE_PASSWORD_USECASE_TOKEN, IChangePasswordUseCase } from "application/interfaces/auth/i-change-password.usecase";
import { I_CLIENT_PASSWORD_RESET_USECASE_TOKEN, ISendPasswordResetLinkUseCase } from "application/interfaces/auth/i-send-password-reset-link.usecase";

import { IReapplyTrainer, I_REAPPLY_TRAINER_TOKEN } from "application/interfaces/trainer/i-reapply-trainer.usecase";
import { IFetchTrainerDetails, I_FETCH_TRAINER_DETAILS_ADMIN_TOKEN, I_FETCH_TRAINER_DETAILS_CLIENT_TOKEN, I_FETCH_TRAINER_DETAILS_TOKEN } from "application/interfaces/trainer/i-fetch-trainer-details.usecase";
import { IUpdateTrainerProfileUseCase, I_UPDATE_TRAINER_PROFILE_TOKEN } from "application/interfaces/trainer/i-update-trainer-profile.usecase";
import { I_FETCH_ALL_CLIENT_TRAINERS_TOKEN, I_FETCH_ALL_PENDING_TRAINERS_TOKEN, I_FETCH_ALL_TRAINERS_TOKEN, IFetchAllTrainersUseCase } from "application/interfaces/trainer/i-fetch-all-trainers.usecase";
import { I_HANDLE_TRAINER_APPROVAL_TOKEN, IHandleTrainerApproval } from "application/interfaces/trainer/i-handle-trainer-approval.usecase";

import { I_UPDATE_USER_PROFILE_TOKEN, IUpdateUserProfileUseCase } from "application/interfaces/user/i-update-user-profile.usecase";
import { I_FETCH_USER_DETAILS_ADMIN_TOKEN, I_FETCH_USER_PROFILE_TOKEN, IFetchUserDetailsUseCase } from "application/interfaces/user/i-fetch-user-details.usecase";
import { I_FETCH_ALL_USERS_TOKEN, IFetchAllUsersUseCase } from "application/interfaces/user/i-fetch-all-users.usecase";

import { I_UPDATE_STATUS_TOKEN, I_UPDATE_USER_STATUS_TOKEN, IUpdateStatus } from "application/interfaces/common/i-update-status.usecase";
import { IUpdateProfilePicture, I_UPDATE_CLIENT_PROFILE_PICTURE_TOKEN, I_UPDATE_TRAINER_PROFILE_PICTURE_TOKEN } from "application/interfaces/common/i-update-profile-picture.usecase";

import { I_ONBOARD_NEW_PROGRAM_TOKEN, IOnboardNewProgram } from "application/interfaces/program/i-onboard-new-program";
import { I_FETCH_PROGRAM_DETAILS_TOKEN, IFetchProgramDetails } from "application/interfaces/program/i-program-details";
import { I_MODIFY_PROGRAM_SPECS_TOKEN, IModifyProgramSpecs } from "application/interfaces/program/i-modify-program-specs";
import { I_ARCHIVE_PROGRAM_TOKEN, IArchiveProgram } from "application/interfaces/program/i-archive-program";
import { I_FETCH_PROGRAM_INVENTORY_TOKEN, IFetchProgramInventory } from "application/interfaces/program/i-fetch-program-summary";
import { I_EXPLORE_PROGRAMS_TOKEN, IExplorePrograms } from "application/interfaces/program/i-explore-programs";
import { I_TOGGLE_PROGRAM_VISIBILITY_TOKEN, IToggleProgramVisibility } from "application/interfaces/program/i-toggle-program-visibility";

import { I_BOOK_SESSION_WITH_TRAINER_TOKEN, IBookSessionWithTrainer } from "application/interfaces/booking/i-book-session-with-trainer.usecase";
import { I_CANCEL_BOOKING_TOKEN, ICancelBooking } from "application/interfaces/booking/i-cancel-booking.usecase";
import { I_FETCH_ADMIN_BOOKING_DETAILS_TOKEN, I_FETCH_CLIENT_BOOKING_DETAILS_TOKEN, I_FETCH_TRAINER_BOOKING_DETAILS_TOKEN, IFetchBookingDetails } from "application/interfaces/booking/i-fetch-booking-details.usecase";
import { I_FETCH_ADMIN_ALL_BOOKINGS_TOKEN, I_FETCH_TRAINER_ALL_BOOKINGS_TOKEN, I_FETCH_TRAINER_PENDING_BOOKINGS_TOKEN, I_FETCH_TRAINER_RESCHEDULE_REQUESTS_TOKEN, I_FETCH_USER_ALL_BOOKINGS_TOKEN, IFetchAllBookingsUseCase } from "application/interfaces/booking/i-fetch-all-bookings.usecase";
import { I_REQUEST_BOOKING_RESCHEDULE_TOKEN, I_TRAINER_RESCHEDULE_BOOKING_TOKEN, IRequestBookingRescheduleUseCase } from "application/interfaces/booking/i-request-booking-reschedule.usecase";
import { I_ACCEPT_RESCHEDULE_REQUEST_TOKEN, I_DECLINE_RESCHEDULE_REQUEST_TOKEN, IProcessTrainerRescheduleUseCase } from "application/interfaces/booking/i-process-trainer-reschedule.usecase";
import { I_CONFIRM_BOOKING_USE_CASE_TOKEN, IConfirmBookingUseCase } from "application/interfaces/booking/i-confirm-booking.usecase";
import { I_DECLINE_BOOKING_USE_CASE_TOKEN, IDeclineBookingUseCase } from "application/interfaces/booking/i-decline-booking-request.usecase";
import { I_MARK_AS_COMPLETE_TOKEN, IMarkAsComplete } from "application/interfaces/booking/i-mark-as-complete";
import { I_GET_MEET_LINK_TOKEN, IGetMeetLink } from "application/interfaces/booking/i-get-meetlink.usecase";
import { IFetchAdminBookingsMetrics,I_ADMIN_BOOKING_DASHBOARD_METRICS } from "application/interfaces/booking/i-fetch-admin-bookings.metrics";


import { I_INITIATE_ONLINE_PAYMENT_TOKEN, IInitiateOnlinePayment } from "application/interfaces/payment/i-initiate-online-payment.usecase";
import { I_VERIFY_ONLINE_PAYMENT_TOKEN, IVeirfyOnlinePayment } from "application/interfaces/payment/i-verify-online-payment.usecase";

import { I_FETCH_TRAINER_AVAILABLE_SLOTS_TOKEN, IFetchTrainerAvailableSlotsUseCase } from "application/interfaces/slot/i-fetch-trainer-available-slots.usecase";
import { IUpdateTrainerWeeklyAvailabilityUseCase, I_UPDATE_TRAINER_WEEKLY_AVAILABILITY_TOKEN } from "application/interfaces/slot/i-update-trainer-weekly-availability.usecase";
import { IGetTrainerSlotConfigurationUseCase, I_GET_TRAINER_SLOT_CONFIGURATION_TOKEN } from "application/interfaces/slot/i-get-trainer-slot-configuration.usecase";

import { I_GET_WALLET_USE_CASE_TOKEN, IGetWalletUseCase } from "application/interfaces/wallet/IGetWalletUseCase";

import { IApplyLeaveRequest, I_APPLY_LEAVE_REQUEST_TOKEN } from "application/interfaces/leave/i-apply-leave-requests.usecase";
import { IWithdrawLeaveRequest, I_WITHDRAW_LEAVE_REQUEST_TOKEN } from "application/interfaces/leave/i-withdraw-leave-request";
import { IUpdateLeaveStatus, I_UPDATE_LEAVE_STATUS_TOKEN } from "application/interfaces/leave/i-update-leave-status";
import { IFetchAllLeaveRequests, I_FETCH_ALL_ADMIN_LEAVE_REQUESTS_TOKEN, I_FETCH_ALL_TRAINER_LEAVE_REQUESTS_TOKEN } from "application/interfaces/leave/i-fetch-all-leave-requests";
import { IGetAdminLeaveMetrics, I_GET_ADMIN_LEAVE_METRICS_TOKEN } from "application/interfaces/leave/i-admin-leave-metrics";
import { ITrainerLeaveMetrics, I_GET_TRAINER_LEAVE_METRICS_TOKEN } from "application/interfaces/leave/i-trainer-leave-metrics";
import { IExportLeaveReport,I_EXPORT_LEAVE_REPORT_TOKEN } from "application/interfaces/leave/i-export-leave-resport";

import { I_ADMIN_DASHBOARD_TOKEN, IAdminDashboard } from "application/interfaces/dashboard/i-admin-dashboard.usecase";
import { ITrainerDashBoard, I_TRAINER_DASHBOARD_TOKEN } from "application/interfaces/dashboard/i-trainer-dashboard.usecase";
import { ITrainerDashBoardAppointments, I_TRAINER_DASHBOARD_APPOINTMENTS_TOKEN } from "application/interfaces/dashboard/i-trainer-dashboard-appointment.usecase";
import { I_EXPORT_ADMIN_PLATFORM_REPORT_TOKEN, IExportAdminPlatformReport } from "application/interfaces/dashboard/i-export-admin-platform-report";

import { I_ADD_REVIEW_TOKEN, IAddReview } from "application/interfaces/review/i-add-review";
import { I_FLAG_REVIEW_TOKEN, IFlagReview } from "application/interfaces/review/i-flag-review";
import { I_GET_TRAINER_REVIEW_LISTS_TOKEN, IGetTrainerReviewLists } from "application/interfaces/review/i-get-trainer-review-lists";
import { I_GET_ADMIN_REVIEW_LISTS_TOKEN, IGetAdminReviewLists } from "application/interfaces/review/i-get-admin-review-list";

import { ISendMessage, I_SEND_MESSAGE_TOKEN } from "application/interfaces/chat/i-send-message";
import { I_MARK_MESSAGE_AS_READ_TOKEN, IMarkMessageAsRead } from "application/interfaces/chat/i-mark-as-read";
import { I_GET_CHAT_ID_TOKEN, IGetChatId } from "application/interfaces/chat/i-get-chat-id";
import { I_GET_MESSAGES_TOKEN, IgetMessages } from "application/interfaces/chat/i-get-messages";
import { I_FETCH_ESTABLISHED_CLIENT_CHAT_LIST_TOKEN, I_FETCH_ESTABLISHED_TRAINER_CHAT_LIST_TOKEN, I_FETCH_NON_ESTABLISHED_TRAINER_CHAT_LIST_TOKEN, IFetchChatList } from "application/interfaces/chat/i-fetch-chat-list";

import { I_RESEND_OTP_TOKEN, IReSendOtpUseCase } from "application/interfaces/public/i-resend-otp.usecase";
import { I_VERIFY_TRAINER_ACCOUNT_TOKEN, I_VERIFY_USER_ACCOUNT_TOKEN, IVerifyAccountUseCase } from "application/interfaces/public/i-verify-otp.usecase";
import { I_REFRESH_ACCESS_TOKEN_TOKEN, IRefreshAccessTokenUseCase } from "application/interfaces/public/i-refresh-access-token.usecase";
import { I_MARK_ALL_NOTIFICATIONS_AS_READ_TOKEN,I_MARK_NOTIFICATION_AS_READ_TOKEN, IMarkAsRead } from "application/interfaces/notification/i-mark-as-read";
import { I_GET_ALL_NOTIFICATIONS_TOKEN, IGetNotification } from "application/interfaces/notification/i-get-notifications";


import { DBDatasourceImpl } from "infrastructure/database/repositories/DBDatasourceImpl";
import { UserRepoImpl } from "infrastructure/database/repositories/UserRepoImpl";
import { AdminRepoImpl } from "infrastructure/database/repositories/AdminRepoImpl";
import { TrainerRepoImpl } from "infrastructure/database/repositories/TrainerRepoImpl";
import { ProgramRepoImpl } from "infrastructure/database/repositories/ProgramRepoImpl";
import { SlotRepoImpl } from "infrastructure/database/repositories/SlotImpl";
import { WalletRepoImpl } from "infrastructure/database/repositories/WalletRepoImpl";
import { BookingRepoImpl } from "infrastructure/database/repositories/BookingRepoImpl";
import { LeaveRepository } from "infrastructure/database/repositories/LeaveRepository";
import { NotificationRepository } from "infrastructure/database/repositories/NotificationRepoImpl";
import { ChatRepoImpl } from "infrastructure/database/repositories/ChatRepoImpl";
import { MessageRepoImpl } from "infrastructure/database/repositories/MessageRepoImpl";
import { ReviewRepoImpl } from "infrastructure/database/repositories/ReviewRepoImpl";

import { PasswordHasherImpl } from "infrastructure/services/PasswordHasherService";
import { OtpService } from "infrastructure/services/OtpService";
import { GoogleAuthServiceImpl } from "infrastructure/services/GoogleAuthService";
import { PasswordResetServiceImpl } from "infrastructure/services/PasswordResetService";
import { CloudinaryService } from "infrastructure/services/CloudinaryService";
import { PaymentService } from "infrastructure/services/PaymentService";
import { JwtService } from "infrastructure/services/jwt.service";
import { SocketNotificationService } from "infrastructure/services/socket-notification.service";
import { SocketChatService } from "infrastructure/services/chat-service";
import { SocketService } from "infrastructure/services/socket-service";

import { AdminLoginUsecase } from "application/usecases/auth/admin-login.usecase";
import { TrainerLoginUseCase } from "application/usecases/auth/trainer-login.usecase";
import { UserLoginUseCase } from "application/usecases/auth/user-login.usecase";
import { TrainerRegisterUseCase } from "application/usecases/auth/trainer-register.usecase";
import { UserRegisterUseCase } from "application/usecases/auth/user-register.usecase";
import { VerifyClientSession } from "application/usecases/auth/verify-session.usecase";
import { VerifyTrainerSession } from "application/usecases/auth/verify-trainer-session";
import { ChangeUserPasswordUseCase } from "application/usecases/auth/change-user-password.usecase";
import { SendPasswordResetLinkUseCase } from "application/usecases/auth/send-password-reset-link.usecase";
import { ResetPasswordUseCase } from "application/usecases/auth/change-password-token.usecase";

import { ReapplyTrainerUseCase } from "application/usecases/trainer/trainer-reapply.usecase";
import { FetchTrainerDetailsForAdmin } from "application/usecases/trainer/fetch-trainer-details.admin.usecase";
import { FetchTrainerDetailsForClient } from "application/usecases/trainer/fetch-trainer-detailes.client.usecase";
import { FetchTrainerProfileUseCase } from "application/usecases/trainer/fetch-trainer-profile.usecase";
import { UpdateTrainerProfileUseCase } from "application/usecases/trainer/update-trainer-profile.usecase";
import { FetchAllTrainersUseCase } from "application/usecases/trainer/fetch-all-trainers.usecase";
import { FetchAllClientTrainersUseCase } from "application/usecases/trainer/fetch-all-client-trainers.usecase";
import { FetchAllPendingTrainers } from "application/usecases/trainer/fetch-all-pending-trainers.usecase";
import { HandleTrainerApproval } from "application/usecases/trainer/handle-trainer-approval.usecase";
import { UpdateTrainerProfilePicture } from "application/usecases/trainer/update-trainer-profile-picture.usecase";

import { UpdateUserProfileUseCase } from "application/usecases/user/update-user-profile.usecase";
import { FetchUserDetailsForAdmin } from "application/usecases/user/fetch-user-details.admin.usecase";
import { FetchUserProfileUseCase } from "application/usecases/user/fetch-user-profile.usecase";
import { FetchAllUsersUseCase } from "application/usecases/user/fetch-all-users-usecase";
import { UpdateUserStatusUseCase } from "application/usecases/user/update-user-status.uscase";
import { UpdateUserProfilePicture } from "application/usecases/user/update-user-profile-picture.usecase.";

import { UpdateTrainerStatusUseCase } from "application/usecases/trainer/update-trainer-status.usecase";

import { OnboardNewProgram } from "application/usecases/program/onboard-new-program";
import { FetchProgramDetails } from "application/usecases/program/fetch-program-details";
import { ModifyProgramSpecs } from "application/usecases/program/modify-program-specs";
import { ArchiveProgram } from "application/usecases/program/archived-program";
import { FetchProgramInventory } from "application/usecases/program/fetch-programs-inventory";
import { ExplorePrograms } from "application/usecases/program/explore-programs";
import { ToggleProgramVisibilityUseCase } from "application/usecases/program/toggle-program-visibility";

import { OnlineBookingUseCase } from "application/usecases/booking/online-booking.usecase";
import { CancelUserBookingUseCase } from "application/usecases/booking/user-booking-cancelation.usecase";
import { FetchBookingDetailsForClient } from "application/usecases/booking/fetch-booking-details.user";
import { FetchBookingDetailsForTrainer } from "application/usecases/booking/fetch-booking-details.trainer";
import { FetchUserAllBookings } from "application/usecases/booking/fetch-all-user-bookings.usecase";
import { FetchTrainerAllBookings } from "application/usecases/booking/fetch-all-trainer-booking.usecase";
import { FetchTrainerAllPendingBookings } from "application/usecases/booking/fetch-all-trainer-pending-booking.usecase";
import { FetchTrainerAllRescheduleBookings } from "application/usecases/booking/fetch-all-trainer-reschedule-bookings.usecase";
import { RequestBookingRescheduleUseCase } from "application/usecases/booking/reschedule-request-booking.usecase";
import { RescheduleBookingByTrainer } from "application/usecases/booking/reschedule-by-trainer.usecase";
import { AcceptRescheduleBookingRequest } from "application/usecases/booking/accept-reschedule-booking-request";
import { RejectRescheduleUseCase } from "application/usecases/booking/decline-reschedule-booking-request";
import { ConfirmBookingUseCase } from "application/usecases/booking/confirm-client-booking-usecase";
import { DeclineBookingUseCase } from "application/usecases/booking/decline-booking-requests.usecase";
import { MarkAsComplete } from "application/usecases/booking/mark-as-complete.usecase";
import { StartSessionUseCase } from "application/usecases/booking/start-session.usecase";
import { FetchAllBookingsAdmin } from "application/usecases/booking/fetch-all-bookings-admin.usecase";
import { FetchAdminBookingDashboardMetrics } from "application/usecases/booking/fetch-admin-bookings-dashboard-metrics";
import { FetchAdminBookingDetails } from "application/usecases/booking/fetch-admin-booking-details";


import { InitiateOnlinePaymentUseCase } from "application/usecases/payment/initiate-online-payment.usecase";
import { VerifyOnlinePaymentUsecase } from "application/usecases/payment/verify-online-payment.usecase";

import { FetchTrainerAvailableSlotsUseCase } from "application/usecases/slot/fetch-trainer-available-slots.usecase";
import { UpdateTrainerWeeklyAvailabilityUseCase } from "application/usecases/slot/update-trainer-weekly-availability.usecase";
import { GetTrainerSlotConfigurationUseCase } from "application/usecases/slot/get-trainer-slot-configuration.usecase.ts";

import { GetWalletUseCase } from "application/usecases/wallet/get-wallet-usecase";

import { ApplyLeaveRequests } from "application/usecases/leave/apply-leave-requests.usecase";
import { WithdrawLeaveRequest } from "application/usecases/leave/withdraw-leave-request";
import { UpdateLeaveStatus } from "application/usecases/leave/update-leave-status";
import { FetchAllAdminLeaveRequests } from "application/usecases/leave/fetch-all-admin-leave-requests";
import { FetchAllTrainerLeaveRequests } from "application/usecases/leave/fetch-all-trainer-leave-requests";
import { GetAdminLeaveMetrics } from "application/usecases/leave/get-admin-leave-metrics";
import { GetTrainerLeaveMetrics } from "application/usecases/leave/get-trainer-leave-metrics";
import { ExportLeaveReport } from "application/usecases/leave/export-leave-report";

import { AdminDashboardUsecase } from "application/usecases/dashboard/admin-dashboard.usecase";
import { TrainerDashboardUsecase } from "application/usecases/dashboard/trainer-dashboard.usecase";
import { TrainerDashboardAppointmentUsecase } from "application/usecases/dashboard/trainer-dashboard-appointments.usecase";
import { ExportAdminDashboardReport } from "application/usecases/dashboard/export-admin-platform-report";

import { AddReviewUseCase } from "application/usecases/review/add-review.usecase";
import { FlagReviewUseCase } from "application/usecases/review/flag-review.usecase";
import { GetTrainerReviewsList } from "application/usecases/review/get-trainer-reviews-list";
import { GetAdminReviewsList } from "application/usecases/review/get-admin-reviews-list";

import { SendMessage } from "application/usecases/chat/send-message";
import { MarkMessageAsRead } from "application/usecases/chat/mark-as-read";
import { GetChatId } from "application/usecases/chat/get-chatId";
import { getMessage } from "application/usecases/chat/get-message";
import { FetchNonEstablishedTrainerChatList } from "application/usecases/chat/fetch-non-established-trainer-chat-list";
import { FetchEstablishedTrainerChatList } from "application/usecases/chat/fetch-established-trainer-chat-list";
import { FetchEstablishedClientChatList } from "application/usecases/chat/fetch-established-client-chat-lits.ts";

import { ReSendOtpUseCase } from "application/usecases/public/resend-otp.usecase";
import { VerifyUserAccountUseCase } from "application/usecases/public/verify-client-otp.usecase";
import { VerifyTrainerAccountUseCase } from "application/usecases/public/verify-trainer-otp.usecase";
import { RefreshAccessTokenUseCase } from "application/usecases/public/refresh-access-token.usecase";
import { MarkAllAsRead } from "application/usecases/notification/mark-all-as-read";
import { MarkAsRead } from "application/usecases/notification/mark-as-read";
import { GetAllNotification } from "application/usecases/notification/get-all-notifications";
import { ChangeTrainerPasswordUseCase } from "application/usecases/auth/chage-trainer-password.usecase";






container.registerSingleton<ISocketService>(I_SOCKET_SERVICE_TOKEN, SocketService);
container.registerSingleton<IChatService>(I_CHAT_SERVICE_TOKEN, SocketChatService);
container.registerSingleton<INotificationService>(I_NOTIFICATION_SERVICE_TOKEN, SocketNotificationService);

container.register<IDBDatasource>(I_DBDATASOURCE_TOKEN, { useClass: DBDatasourceImpl });
container.register<IUserRepo>(I_USER_REPO_TOKEN, { useClass: UserRepoImpl });
container.register<IAdminRepo>(I_ADMIN_REPO_TOKEN, { useClass: AdminRepoImpl });
container.register<ITrainerRepo>(I_TRAINER_REPO_TOKEN, { useClass: TrainerRepoImpl });
container.register<IProgramRepo>(I_PROGRAM_REPO_TOKEN, { useClass: ProgramRepoImpl });
container.register<ISlotRepo>(I_SLOT_REPO_TOKEN, { useClass: SlotRepoImpl });
container.register<IWalletRepo>(I_WALLET_REPO_TOKEN, { useClass: WalletRepoImpl });
container.register<IBookingRepo>(I_BOOKING_REPO_TOKEN, { useClass: BookingRepoImpl });
container.register<ILeaveRepo>(I_LEAVE_REPO_TOKEN, { useClass: LeaveRepository });
container.register<INotificationRepo>(I_NOTIFICATION_REPO_TOKEN, { useClass: NotificationRepository });
container.register<IChatRepo>(I_CHAT_REPO_TOKEN, { useClass: ChatRepoImpl });
container.register<IMessageRepo>(I_MESSAGE_REPO_TOKEN, { useClass: MessageRepoImpl });
container.register<IReviewRepo>(I_REVIEW_REPO_TOKEN, { useClass: ReviewRepoImpl });


container.register<IPasswordHasher>(I_PASSWORD_HASHER_TOKEN, { useClass: PasswordHasherImpl });
container.register<IOtpService>(I_OTP_SERVICE_TOKEN, { useClass: OtpService });
container.register<IGoogleAuthService>(I_GOOGLE_AUTH_SERVICE_TOKEN, { useClass: GoogleAuthServiceImpl });
container.register<IPasswordResetService>(I_PASSWORD_RESET_SERVICE_TOKEN, { useClass: PasswordResetServiceImpl });
container.register<ICloudinaryService>(I_CLOUDINARY_SERVICE_TOKEN, { useClass: CloudinaryService });
container.register<IPaymentService>(I_PAYMENT_SERVICE_TOKEN, { useClass: PaymentService });
container.register<IJwtService>(I_JWT_SERVICE_TOKEN, { useClass: JwtService });


container.register<ILoginUseCase>(I_ADMIN_LOGIN_USECASE_TOKEN, { useClass: AdminLoginUsecase });
container.register<ILoginUseCase>(I_TRAINER_LOGIN_USECASE_TOKEN, { useClass: TrainerLoginUseCase });
container.register<ILoginUseCase>(I_CLIENT_LOGIN_USECASE_TOKEN, { useClass: UserLoginUseCase });
container.register<IRegisterUseCase<any>>(I_TRAINER_REGISTER_USECASE_TOKEN, { useClass: TrainerRegisterUseCase });
container.register<IRegisterUseCase<any>>(I_CLIENT_REGISTER_USECASE_TOKEN, { useClass: UserRegisterUseCase });
container.register<IVerifySession<any>>(I_VERIFY_CLIENT_SESSION_TOKEN, { useClass: VerifyClientSession });
container.register<IVerifySession<any>>(I_VERIFY_TRAINER_SESSION_TOKEN, { useClass: VerifyTrainerSession });
container.register<IChangePasswordUseCase<any>>(I_CLIENT_CHANGE_PASSWORD_USECASE_TOKEN, { useClass: ChangeUserPasswordUseCase });
container.register<ISendPasswordResetLinkUseCase>(I_CLIENT_PASSWORD_RESET_USECASE_TOKEN, { useClass: SendPasswordResetLinkUseCase });
container.register<IChangePasswordUseCase<any>>(I_RESET_PASSWORD_TOKEN, { useClass: ResetPasswordUseCase });
container.register<IChangePasswordUseCase<any>>(I_TRAINER_CHANGE_PASSWORD_USECASE_TOKEN, { useClass: ChangeTrainerPasswordUseCase });

container.register<IReapplyTrainer>(I_REAPPLY_TRAINER_TOKEN, { useClass: ReapplyTrainerUseCase });
container.register<IFetchTrainerDetails<any>>(I_FETCH_TRAINER_DETAILS_ADMIN_TOKEN, { useClass: FetchTrainerDetailsForAdmin });
container.register<IFetchTrainerDetails<any>>(I_FETCH_TRAINER_DETAILS_CLIENT_TOKEN, { useClass: FetchTrainerDetailsForClient });
container.register<IFetchTrainerDetails<any>>(I_FETCH_TRAINER_DETAILS_TOKEN, { useClass: FetchTrainerProfileUseCase });
container.register<IUpdateTrainerProfileUseCase>(I_UPDATE_TRAINER_PROFILE_TOKEN, { useClass: UpdateTrainerProfileUseCase });
container.register<IFetchAllTrainersUseCase<any>>(I_FETCH_ALL_TRAINERS_TOKEN, { useClass: FetchAllTrainersUseCase });
container.register<IFetchAllTrainersUseCase<any>>(I_FETCH_ALL_CLIENT_TRAINERS_TOKEN, { useClass: FetchAllClientTrainersUseCase });
container.register<IFetchAllTrainersUseCase<any>>(I_FETCH_ALL_PENDING_TRAINERS_TOKEN, { useClass: FetchAllPendingTrainers });
container.register<IHandleTrainerApproval>(I_HANDLE_TRAINER_APPROVAL_TOKEN, { useClass: HandleTrainerApproval });
container.register<IUpdateProfilePicture>(I_UPDATE_TRAINER_PROFILE_PICTURE_TOKEN, { useClass: UpdateTrainerProfilePicture });
container.register<IUpdateStatus>(I_UPDATE_STATUS_TOKEN, { useClass: UpdateTrainerStatusUseCase });


container.register<IUpdateUserProfileUseCase>(I_UPDATE_USER_PROFILE_TOKEN, { useClass: UpdateUserProfileUseCase });
container.register<IFetchUserDetailsUseCase<any>>(I_FETCH_USER_DETAILS_ADMIN_TOKEN, { useClass: FetchUserDetailsForAdmin });
container.register<IFetchUserDetailsUseCase<any>>(I_FETCH_USER_PROFILE_TOKEN, { useClass: FetchUserProfileUseCase });
container.register<IFetchAllUsersUseCase>(I_FETCH_ALL_USERS_TOKEN, { useClass: FetchAllUsersUseCase });
container.register<IUpdateStatus>(I_UPDATE_USER_STATUS_TOKEN, { useClass: UpdateUserStatusUseCase });
container.register<IUpdateProfilePicture>(I_UPDATE_CLIENT_PROFILE_PICTURE_TOKEN, { useClass: UpdateUserProfilePicture });


container.register<IOnboardNewProgram>(I_ONBOARD_NEW_PROGRAM_TOKEN, { useClass: OnboardNewProgram });
container.register<IFetchProgramDetails>(I_FETCH_PROGRAM_DETAILS_TOKEN, { useClass: FetchProgramDetails });
container.register<IModifyProgramSpecs>(I_MODIFY_PROGRAM_SPECS_TOKEN, { useClass: ModifyProgramSpecs });
container.register<IArchiveProgram>(I_ARCHIVE_PROGRAM_TOKEN, { useClass: ArchiveProgram });
container.register<IFetchProgramInventory>(I_FETCH_PROGRAM_INVENTORY_TOKEN, { useClass: FetchProgramInventory });
container.register<IExplorePrograms>(I_EXPLORE_PROGRAMS_TOKEN, { useClass: ExplorePrograms });
container.register<IToggleProgramVisibility>(I_TOGGLE_PROGRAM_VISIBILITY_TOKEN, { useClass: ToggleProgramVisibilityUseCase });


container.register<IBookSessionWithTrainer>(I_BOOK_SESSION_WITH_TRAINER_TOKEN, { useClass: OnlineBookingUseCase });
container.register<ICancelBooking>(I_CANCEL_BOOKING_TOKEN, { useClass: CancelUserBookingUseCase });
container.register<IFetchBookingDetails<any>>(I_FETCH_CLIENT_BOOKING_DETAILS_TOKEN, { useClass: FetchBookingDetailsForClient });
container.register<IFetchBookingDetails<any>>(I_FETCH_TRAINER_BOOKING_DETAILS_TOKEN, { useClass: FetchBookingDetailsForTrainer });
container.register<IFetchAllBookingsUseCase<any, any>>(I_FETCH_USER_ALL_BOOKINGS_TOKEN, { useClass: FetchUserAllBookings });
container.register<IFetchAllBookingsUseCase<any, any>>(I_FETCH_TRAINER_ALL_BOOKINGS_TOKEN, { useClass: FetchTrainerAllBookings });
container.register<IFetchAllBookingsUseCase<any, any>>(I_FETCH_TRAINER_PENDING_BOOKINGS_TOKEN, { useClass: FetchTrainerAllPendingBookings });
container.register<IFetchAllBookingsUseCase<any, any>>(I_FETCH_TRAINER_RESCHEDULE_REQUESTS_TOKEN, { useClass: FetchTrainerAllRescheduleBookings });
container.register<IFetchAllBookingsUseCase<any, any>>(I_FETCH_ADMIN_ALL_BOOKINGS_TOKEN, { useClass: FetchAllBookingsAdmin });
container.register<IRequestBookingRescheduleUseCase>(I_REQUEST_BOOKING_RESCHEDULE_TOKEN, { useClass: RequestBookingRescheduleUseCase });
container.register<IRequestBookingRescheduleUseCase>(I_TRAINER_RESCHEDULE_BOOKING_TOKEN, { useClass: RescheduleBookingByTrainer });
container.register<IProcessTrainerRescheduleUseCase>(I_ACCEPT_RESCHEDULE_REQUEST_TOKEN, { useClass: AcceptRescheduleBookingRequest });
container.register<IProcessTrainerRescheduleUseCase>(I_DECLINE_RESCHEDULE_REQUEST_TOKEN, { useClass: RejectRescheduleUseCase });
container.register<IConfirmBookingUseCase>(I_CONFIRM_BOOKING_USE_CASE_TOKEN, { useClass: ConfirmBookingUseCase });
container.register<IDeclineBookingUseCase>(I_DECLINE_BOOKING_USE_CASE_TOKEN, { useClass: DeclineBookingUseCase });
container.register<IMarkAsComplete>(I_MARK_AS_COMPLETE_TOKEN, { useClass: MarkAsComplete });
container.register<IGetMeetLink>(I_GET_MEET_LINK_TOKEN, { useClass: StartSessionUseCase });
container.register<IFetchAdminBookingsMetrics>(I_ADMIN_BOOKING_DASHBOARD_METRICS, { useClass: FetchAdminBookingDashboardMetrics });
container.register<IFetchBookingDetails<any>>(I_FETCH_ADMIN_BOOKING_DETAILS_TOKEN, { useClass: FetchAdminBookingDetails });


container.register<IInitiateOnlinePayment>(I_INITIATE_ONLINE_PAYMENT_TOKEN, { useClass: InitiateOnlinePaymentUseCase });
container.register<IVeirfyOnlinePayment>(I_VERIFY_ONLINE_PAYMENT_TOKEN, { useClass: VerifyOnlinePaymentUsecase });


container.register<IFetchTrainerAvailableSlotsUseCase>(I_FETCH_TRAINER_AVAILABLE_SLOTS_TOKEN, { useClass: FetchTrainerAvailableSlotsUseCase });

container.register<IGetTrainerSlotConfigurationUseCase>(I_GET_TRAINER_SLOT_CONFIGURATION_TOKEN,{ useClass: GetTrainerSlotConfigurationUseCase });

container.register<IUpdateTrainerWeeklyAvailabilityUseCase>(I_UPDATE_TRAINER_WEEKLY_AVAILABILITY_TOKEN,{ useClass: UpdateTrainerWeeklyAvailabilityUseCase });

container.register<IGetWalletUseCase>(I_GET_WALLET_USE_CASE_TOKEN, { useClass: GetWalletUseCase });




container.register<IApplyLeaveRequest>(I_APPLY_LEAVE_REQUEST_TOKEN, { useClass: ApplyLeaveRequests });
container.register<IFetchAllLeaveRequests<any>>(I_FETCH_ALL_TRAINER_LEAVE_REQUESTS_TOKEN, { useClass: FetchAllTrainerLeaveRequests })
container.register<IFetchAllLeaveRequests<any>>(I_FETCH_ALL_ADMIN_LEAVE_REQUESTS_TOKEN, { useClass: FetchAllAdminLeaveRequests})
container.register<IUpdateLeaveStatus>(I_UPDATE_LEAVE_STATUS_TOKEN, { useClass: UpdateLeaveStatus })
container.register<ITrainerLeaveMetrics>(I_GET_TRAINER_LEAVE_METRICS_TOKEN, { useClass: GetTrainerLeaveMetrics });
container.register<IWithdrawLeaveRequest>(I_WITHDRAW_LEAVE_REQUEST_TOKEN, { useClass: WithdrawLeaveRequest });
container.register<IGetAdminLeaveMetrics>(I_GET_ADMIN_LEAVE_METRICS_TOKEN, { useClass: GetAdminLeaveMetrics });
container.register<IExportLeaveReport>(I_EXPORT_LEAVE_REPORT_TOKEN, { useClass: ExportLeaveReport });

container.register<IAdminDashboard>(I_ADMIN_DASHBOARD_TOKEN, { useClass: AdminDashboardUsecase });
container.register<ITrainerDashBoard>(I_TRAINER_DASHBOARD_TOKEN,{ useClass: TrainerDashboardUsecase});

container.register<ITrainerDashBoardAppointments>(I_TRAINER_DASHBOARD_APPOINTMENTS_TOKEN,{ useClass: TrainerDashboardAppointmentUsecase });
container.register<IExportAdminPlatformReport>(I_EXPORT_ADMIN_PLATFORM_REPORT_TOKEN, { useClass: ExportAdminDashboardReport });


container.register<IAddReview>(I_ADD_REVIEW_TOKEN, { useClass: AddReviewUseCase });
container.register<IFlagReview>(I_FLAG_REVIEW_TOKEN, { useClass: FlagReviewUseCase });
container.register<IGetTrainerReviewLists>(I_GET_TRAINER_REVIEW_LISTS_TOKEN, { useClass: GetTrainerReviewsList });
container.register<IGetAdminReviewLists>(I_GET_ADMIN_REVIEW_LISTS_TOKEN, { useClass: GetAdminReviewsList });


container.register<ISendMessage>(I_SEND_MESSAGE_TOKEN, { useClass: SendMessage });
container.register<IMarkMessageAsRead>(I_MARK_MESSAGE_AS_READ_TOKEN, { useClass: MarkMessageAsRead });
container.register<IGetChatId>(I_GET_CHAT_ID_TOKEN, { useClass: GetChatId });
container.register<IgetMessages>(I_GET_MESSAGES_TOKEN, { useClass: getMessage });
container.register<IFetchChatList<any,any>>(I_FETCH_NON_ESTABLISHED_TRAINER_CHAT_LIST_TOKEN, { useClass: FetchNonEstablishedTrainerChatList });
container.register<IFetchChatList<any,any>>(I_FETCH_ESTABLISHED_TRAINER_CHAT_LIST_TOKEN, { useClass: FetchEstablishedTrainerChatList });
container.register<IFetchChatList<any,any>>(I_FETCH_ESTABLISHED_CLIENT_CHAT_LIST_TOKEN, { useClass: FetchEstablishedClientChatList });

container.register<IReSendOtpUseCase>(I_RESEND_OTP_TOKEN, { useClass: ReSendOtpUseCase });
container.register<IVerifyAccountUseCase>(I_VERIFY_USER_ACCOUNT_TOKEN, { useClass: VerifyUserAccountUseCase });
container.register<IVerifyAccountUseCase>(I_VERIFY_TRAINER_ACCOUNT_TOKEN, { useClass: VerifyTrainerAccountUseCase });
container.register<IRefreshAccessTokenUseCase>(I_REFRESH_ACCESS_TOKEN_TOKEN, { useClass: RefreshAccessTokenUseCase });
container.register<IMarkAsRead>(I_MARK_ALL_NOTIFICATIONS_AS_READ_TOKEN, { useClass: MarkAllAsRead });
container.register<IMarkAsRead>(I_MARK_NOTIFICATION_AS_READ_TOKEN, { useClass: MarkAsRead });
container.register<IGetNotification>(I_GET_ALL_NOTIFICATIONS_TOKEN, { useClass: GetAllNotification });