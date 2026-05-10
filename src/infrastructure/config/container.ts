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

import { ISecurityService,I_SECURITY_SERVICE_TOKEN } from "domain/services/i-security-service";
import { IOtpService, I_OTP_SERVICE_TOKEN } from "domain/services/IOtpService";
import { IGoogleAuthService, I_GOOGLE_AUTH_SERVICE_TOKEN } from "domain/services/IGoogleAuthService";
import { ICloudinaryService, I_CLOUDINARY_SERVICE_TOKEN } from "domain/services/ICloudinaryService";
import { IPaymentService, I_PAYMENT_SERVICE_TOKEN } from "domain/services/IPaymentService";
import { IJwtService, I_JWT_SERVICE_TOKEN } from "domain/services/i-jwt.service";
import { INotificationService, I_NOTIFICATION_SERVICE_TOKEN } from "domain/services/i-notification.service";
import { ISocketService, I_SOCKET_SERVICE_TOKEN } from "domain/services/i-socket-service";
import { IMailService,I_EMAIL_SERVICE_TOKEN } from "domain/services/i-mail-service";
import { I_MEETING_SERVICE_TOKEN, IMeetingService } from "domain/services/i-meeting-service";

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

import { IExportChurnUsers,I_EXPORT_CHURN_USERS } from "application/interfaces/user/i-export-churn-users";

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
import { IUploadChatFiles,I_UPLOAD_CHAT_FILES } from "application/interfaces/chat/i-upload-files";


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
import { LeaveRepository } from "infrastructure/database/repositories/LeaveRepoImpl";
import { NotificationRepository } from "infrastructure/database/repositories/NotificationRepoImpl";
import { ChatRepoImpl } from "infrastructure/database/repositories/ChatRepoImpl";
import { MessageRepoImpl } from "infrastructure/database/repositories/MessageRepoImpl";
import { ReviewRepoImpl } from "infrastructure/database/repositories/ReviewRepoImpl";

import { SecurityServiceImpl } from "infrastructure/services/security-service-impl";
import { OtpService } from "infrastructure/services/otpService/OtpService";
import { GoogleAuthServiceImpl } from "infrastructure/services/GoogleAuthService";
import { CloudinaryService } from "infrastructure/services/CloudinaryService";
import { PaymentService } from "infrastructure/services/PaymentService";
import { JwtService } from "infrastructure/services/jwt.service";
import { SocketNotificationService } from "infrastructure/services/socketService/notification/socket-notification.service";
import { SocketService } from "infrastructure/services/socketService/socket-service";
import { MailService } from "infrastructure/services/mailService/MailService";
import { VideoCallService } from "infrastructure/services/video-call-service";

import { AdminLoginUsecase } from "application/usecases/auth/admin/login";
import { TrainerLoginUseCase } from "application/usecases/auth/trainer/login";
import { UserLoginUseCase } from "application/usecases/auth/user/login";
import { TrainerRegisterUseCase } from "application/usecases/auth/trainer/register";
import { UserRegisterUseCase } from "application/usecases/auth/user/register";
import { VerifyClientSession } from "application/usecases/account/user/verify-session";
import { VerifyTrainerSession } from "application/usecases/account/trainer/verify-session";
import { ChangeUserPasswordUseCase } from "application/usecases/account/user/change-password";
import { SendPasswordResetLinkUseCase } from "application/usecases/auth/shared/send-reset-password-link";
import { ResetPasswordUseCase } from "application/usecases/auth/shared/change-password-token-based";

import { ReapplyTrainerUseCase } from "application/usecases/account/trainer/reapply-as-trainer";
import { FetchTrainerDetailsForAdmin } from "application/usecases/management/trainers/fetch-trainer-details";
import { FetchTrainerDetailsForClient } from "application/usecases/management/public/fetch-public-trainer-details";
import { FetchTrainerProfileUseCase } from "application/usecases/account/trainer/fetch-full-profile";
import { UpdateTrainerProfileUseCase } from "application/usecases/account/trainer/update-profile";
import { FetchAllTrainersUseCase } from "application/usecases/management/trainers/fetch-all-trainers";
import { FetchAllClientTrainersUseCase } from "application/usecases/management/public/fetch-all-public-trainers";
import { FetchAllPendingTrainers } from "application/usecases/management/trainers/fetch-non-verified-trainers";
import { HandleTrainerApproval } from "application/usecases/management/trainers/handle-trainer-verification";
import { UpdateTrainerProfilePicture } from "application/usecases/account/trainer/update-profile-picture";

import { UpdateUserProfileUseCase } from "application/usecases/account/user/update-profile";
import { FetchUserDetailsForAdmin } from "application/usecases/management/users/fetch-user-details";
import { FetchUserProfileUseCase } from "application/usecases/account/user/fetch-full-profile";
import { FetchAllUsersUseCase } from "application/usecases/management/users/fetch-all-users";
import { UpdateUserStatusUseCase } from "application/usecases/management/users/update-user-status";
import { UpdateUserProfilePicture } from "application/usecases/account/user/update-profile-picture";

import { ExportChurnUsers } from "application/usecases/management/users/export-churn-users";

import { UpdateTrainerStatusUseCase } from "application/usecases/management/trainers/update-trainer-status";

import { OnboardNewProgram } from "application/usecases/program/admin/onboard-new-program";
import { FetchProgramDetails } from "application/usecases/program/admin/fetch-program-details";
import { ModifyProgramSpecs } from "application/usecases/program/admin/modify-program-specs";
import { ArchiveProgram } from "application/usecases/program/admin/archived-program";
import { FetchProgramInventory } from "application/usecases/program/admin/fetch-programs-inventory";
import { ExplorePrograms } from "application/usecases/program/public/explore-programs";
import { ToggleProgramVisibilityUseCase } from "application/usecases/program/admin/toggle-program-visibility";

import { CancelUserBookingUseCase } from "application/usecases/booking/user/cancel-booking-session";
import { FetchBookingDetailsForClient } from "application/usecases/booking/user/fetch-booking-details";
import { FetchBookingDetailsForTrainer } from "application/usecases/booking/trainer/fetch-booking-details";
import { FetchUserAllBookings } from "application/usecases/booking/user/fetch-all-bookings";
import { FetchTrainerAllBookings } from "application/usecases/booking/trainer/fetch-all-bookings";
import { FetchTrainerAllPendingBookings } from "application/usecases/booking/trainer/fetch-all-pending-bookings";
import { FetchTrainerAllRescheduleBookings } from "application/usecases/booking/trainer/fetch-all-reschedule-bookings";
import { RequestBookingRescheduleUseCase } from "application/usecases/booking/user/request-session-reschedule";
import { RescheduleBookingByTrainer } from "application/usecases/booking/trainer/reschedule-booking-request";
import { AcceptRescheduleBookingRequest } from "application/usecases/booking/shared/accept-reschedule-request";
import { RejectRescheduleUseCase } from "application/usecases/booking/shared/reject-reschedule-request";
import { ConfirmBookingUseCase } from "application/usecases/booking/trainer/confirm-booking-request";
import { DeclineBookingUseCase } from "application/usecases/booking/trainer/decline-booking-request";
import { MarkAsComplete } from "application/usecases/booking/trainer/mark-booking-as-complete";
import { StartSessionUseCase } from "application/usecases/booking/trainer/start-session";
import { FetchAllBookingsAdmin } from "application/usecases/booking/admin/fetch-all-bookings";
import { FetchAdminBookingDashboardMetrics } from "application/usecases/booking/admin/fetch-booking-dashboard";
import { FetchAdminBookingDetails } from "application/usecases/booking/admin/fetch-booking-details";


import { InitiateOnlinePaymentUseCase } from "application/usecases/payment/initiate-digital-payment";
import { VerifyOnlinePaymentUsecase } from "application/usecases/payment/verify-digital-payment";

import { FetchTrainerAvailableSlotsUseCase } from "application/usecases/schedule/public/fetch-all-available-slots";
import { UpdateTrainerWeeklyAvailabilityUseCase } from "application/usecases/schedule/trainer/update-trainer-weekly-availability.usecase";
import { GetTrainerSlotConfigurationUseCase } from "application/usecases/schedule/trainer/get-trainer-slot-configuration.usecase.ts";

import { GetWalletUseCase } from "application/usecases/wallet/get-wallet";

import { ApplyLeaveRequests } from "application/usecases/leave/trainer/apply-leave-request";
import { WithdrawLeaveRequest } from "application/usecases/leave/trainer/withdraw-leave-request";
import { UpdateLeaveStatus } from "application/usecases/leave/admin/update-leave-status";
import { FetchAllAdminLeaveRequests } from "application/usecases/leave/admin/fet-all-leave-request";
import { FetchAllTrainerLeaveRequests } from "application/usecases/leave/trainer/fetch-all-trainer leave-requests";
import { GetAdminLeaveMetrics } from "application/usecases/leave/admin/get-leave-metrics";
import { GetTrainerLeaveMetrics } from "application/usecases/leave/trainer/get-leave-metrics";
import { ExportLeaveReport } from "application/usecases/leave/admin/export-leave-report";

import { AdminDashboardUsecase } from "application/usecases/dashboard/admin/fetch-dashboard-data";
import { TrainerDashboardUsecase } from "application/usecases/dashboard/trainer/fetch-dashboard-data";
import { TrainerDashboardAppointmentUsecase } from "application/usecases/dashboard/trainer/fetch-appointments";
import { ExportAdminDashboardReport } from "application/usecases/dashboard/admin/export-dashboard-report";

import { AddReviewUseCase } from "application/usecases/review/user/add-review.usecase";
import { FlagReviewUseCase } from "application/usecases/review/admin/flag-review";
import { GetTrainerReviewsList } from "application/usecases/review/trainer/fetch-all-reviews";
import { GetAdminReviewsList } from "application/usecases/review/admin/fetch-all-reviews";

import { SendMessage } from "application/usecases/chat/shared/send-message";
import { MarkMessageAsRead } from "application/usecases/chat/shared/mark-message-as-read";
import { GetChatId } from "application/usecases/chat/shared/get-chatId";
import { GetMessage } from "application/usecases/chat/shared/fetch-chat-messages";
import { FetchNonEstablishedTrainerChatList } from "application/usecases/chat/trainer/fetch-non-chat-list";
import { FetchEstablishedTrainerChatList } from "application/usecases/chat/trainer/fetch-chat-list";
import { FetchEstablishedClientChatList } from "application/usecases/chat/user/fetch-chat-list";
import { UploadChatFile } from "application/usecases/chat/shared/upload-chat-file";

import { ReSendOtpUseCase } from "application/usecases/auth/shared/resend-otp";
import { VerifyUserAccountUseCase } from "application/usecases/auth/user/verify-otp";
import { VerifyTrainerAccountUseCase } from "application/usecases/auth/trainer/verify-otp";
import { RefreshAccessTokenUseCase } from "application/usecases/auth/shared/refresh-token";
import { MarkAllAsRead } from "application/usecases/notification/mark-all-as-read";
import { MarkAsRead } from "application/usecases/notification/mark-as-read";
import { GetAllNotification } from "application/usecases/notification/get-all-notifications";
import { ChangeTrainerPasswordUseCase } from "application/usecases/account/trainer/change-password";
import { OnlineBookingUseCase } from "application/usecases/booking/user/confirm-session-booking";
import { ChatListResponseDTO, ClientChatListRequestDTO, NonEstablishedChatListResponseDTO, TrainerChatListRequestDTO } from "application/dto/chat/chat-list.dto";
import { FetchAdminLeaveResponseDTO, FetchTrainerLeaveResponseDTO } from "application/dto/leave/leave-requests.dto";
import { AdminBookingDetailsResponseDTO, TrainerBookingDetailsResponseDTO, UserBookingDetailsResponseDTO } from "application/dto/booking/fetch-booking-details.dto";
import { FetchAllBookingsListRequestDTO, FetchAllBookingsListResponseDTO, FetchAllTrainerBookingRequestDTO, FetchAllTrainerBookingsResponseDTO, FetchAllTrainerPendingBookingsResponseDTO, FetchAllTrainerRescheduleBookingsResponseDTO, FetchAllUserBookingRequestDTO, FetchAllUserBookingsResponseDTO } from "application/dto/booking/fetch-all-bookings.dto";
import { FetchAllClientTrainersResponseDTO, FetchAllPendingTrainersResponseDTO, FetchAllTrainersResponseDTO } from "application/dto/trainer/fetch-all-trainers.dto";
import { AdminTrainerDetails, TrainerPrivateProfileDTO, UserTrainerViewDTO } from "application/dto/trainer/fetch-trainer-details.dto";
import { ChangePasswordRequestDTO, ResetPasswordTokenBasedDTO } from "application/dto/auth/change-password.dto";
import { ClientSessionDTO, TrainerSessionDTO } from "application/dto/auth/verify-session.dto";
import { TrainerRegisterRequestDTO, UserRegisterRequestDTO } from "application/dto/auth/register.dto";
import { AdminUserDetailDTO, UserProfileDTO } from "application/dto/user/user-details.dto";






container.registerSingleton<ISocketService>(I_SOCKET_SERVICE_TOKEN, SocketService);
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


container.register<ISecurityService>(I_SECURITY_SERVICE_TOKEN, { useClass: SecurityServiceImpl });
container.register<IOtpService>(I_OTP_SERVICE_TOKEN, { useClass: OtpService });
container.register<IGoogleAuthService>(I_GOOGLE_AUTH_SERVICE_TOKEN, { useClass: GoogleAuthServiceImpl });
container.register<ICloudinaryService>(I_CLOUDINARY_SERVICE_TOKEN, { useClass: CloudinaryService });
container.register<IPaymentService>(I_PAYMENT_SERVICE_TOKEN, { useClass: PaymentService });
container.register<IJwtService>(I_JWT_SERVICE_TOKEN, { useClass: JwtService });
container.register<IMailService>(I_EMAIL_SERVICE_TOKEN,{useClass:MailService})
container.register<IMeetingService>(I_MEETING_SERVICE_TOKEN, { useClass: VideoCallService });

container.register<ILoginUseCase>(I_ADMIN_LOGIN_USECASE_TOKEN, { useClass: AdminLoginUsecase });
container.register<ILoginUseCase>(I_TRAINER_LOGIN_USECASE_TOKEN, { useClass: TrainerLoginUseCase });
container.register<ILoginUseCase>(I_CLIENT_LOGIN_USECASE_TOKEN, { useClass: UserLoginUseCase });
container.register<IRegisterUseCase<TrainerRegisterRequestDTO>>(I_TRAINER_REGISTER_USECASE_TOKEN, { useClass: TrainerRegisterUseCase });
container.register<IRegisterUseCase<UserRegisterRequestDTO>>(I_CLIENT_REGISTER_USECASE_TOKEN, { useClass: UserRegisterUseCase });
container.register<IVerifySession<ClientSessionDTO>>(I_VERIFY_CLIENT_SESSION_TOKEN, { useClass: VerifyClientSession });
container.register<IVerifySession<TrainerSessionDTO>>(I_VERIFY_TRAINER_SESSION_TOKEN, { useClass: VerifyTrainerSession });
container.register<IChangePasswordUseCase<ChangePasswordRequestDTO>>(I_CLIENT_CHANGE_PASSWORD_USECASE_TOKEN, { useClass: ChangeUserPasswordUseCase });
container.register<ISendPasswordResetLinkUseCase>(I_CLIENT_PASSWORD_RESET_USECASE_TOKEN, { useClass: SendPasswordResetLinkUseCase });
container.register<IChangePasswordUseCase<ResetPasswordTokenBasedDTO>>(I_RESET_PASSWORD_TOKEN, { useClass: ResetPasswordUseCase });
container.register<IChangePasswordUseCase<ChangePasswordRequestDTO>>(I_TRAINER_CHANGE_PASSWORD_USECASE_TOKEN, { useClass: ChangeTrainerPasswordUseCase });

container.register<IReapplyTrainer>(I_REAPPLY_TRAINER_TOKEN, { useClass: ReapplyTrainerUseCase });
container.register<IFetchTrainerDetails<AdminTrainerDetails>>(I_FETCH_TRAINER_DETAILS_ADMIN_TOKEN, { useClass: FetchTrainerDetailsForAdmin });
container.register<IFetchTrainerDetails<UserTrainerViewDTO>>(I_FETCH_TRAINER_DETAILS_CLIENT_TOKEN, { useClass: FetchTrainerDetailsForClient });
container.register<IFetchTrainerDetails<TrainerPrivateProfileDTO>>(I_FETCH_TRAINER_DETAILS_TOKEN, { useClass: FetchTrainerProfileUseCase });
container.register<IUpdateTrainerProfileUseCase>(I_UPDATE_TRAINER_PROFILE_TOKEN, { useClass: UpdateTrainerProfileUseCase });
container.register<IFetchAllTrainersUseCase<FetchAllTrainersResponseDTO>>(I_FETCH_ALL_TRAINERS_TOKEN, { useClass: FetchAllTrainersUseCase });
container.register<IFetchAllTrainersUseCase<FetchAllClientTrainersResponseDTO>>(I_FETCH_ALL_CLIENT_TRAINERS_TOKEN, { useClass: FetchAllClientTrainersUseCase });
container.register<IFetchAllTrainersUseCase<FetchAllPendingTrainersResponseDTO>>(I_FETCH_ALL_PENDING_TRAINERS_TOKEN, { useClass: FetchAllPendingTrainers });
container.register<IHandleTrainerApproval>(I_HANDLE_TRAINER_APPROVAL_TOKEN, { useClass: HandleTrainerApproval });
container.register<IUpdateProfilePicture>(I_UPDATE_TRAINER_PROFILE_PICTURE_TOKEN, { useClass: UpdateTrainerProfilePicture });
container.register<IUpdateStatus>(I_UPDATE_STATUS_TOKEN, { useClass: UpdateTrainerStatusUseCase });


container.register<IUpdateUserProfileUseCase>(I_UPDATE_USER_PROFILE_TOKEN, { useClass: UpdateUserProfileUseCase });
container.register<IFetchUserDetailsUseCase<AdminUserDetailDTO>>(I_FETCH_USER_DETAILS_ADMIN_TOKEN, { useClass: FetchUserDetailsForAdmin });
container.register<IFetchUserDetailsUseCase<UserProfileDTO>>(I_FETCH_USER_PROFILE_TOKEN, { useClass: FetchUserProfileUseCase });
container.register<IFetchAllUsersUseCase>(I_FETCH_ALL_USERS_TOKEN, { useClass: FetchAllUsersUseCase });
container.register<IUpdateStatus>(I_UPDATE_USER_STATUS_TOKEN, { useClass: UpdateUserStatusUseCase });
container.register<IUpdateProfilePicture>(I_UPDATE_CLIENT_PROFILE_PICTURE_TOKEN, { useClass: UpdateUserProfilePicture });
container.register<IExportChurnUsers>(I_EXPORT_CHURN_USERS, { useClass: ExportChurnUsers });


container.register<IOnboardNewProgram>(I_ONBOARD_NEW_PROGRAM_TOKEN, { useClass: OnboardNewProgram });
container.register<IFetchProgramDetails>(I_FETCH_PROGRAM_DETAILS_TOKEN, { useClass: FetchProgramDetails });
container.register<IModifyProgramSpecs>(I_MODIFY_PROGRAM_SPECS_TOKEN, { useClass: ModifyProgramSpecs });
container.register<IArchiveProgram>(I_ARCHIVE_PROGRAM_TOKEN, { useClass: ArchiveProgram });
container.register<IFetchProgramInventory>(I_FETCH_PROGRAM_INVENTORY_TOKEN, { useClass: FetchProgramInventory });
container.register<IExplorePrograms>(I_EXPLORE_PROGRAMS_TOKEN, { useClass: ExplorePrograms });
container.register<IToggleProgramVisibility>(I_TOGGLE_PROGRAM_VISIBILITY_TOKEN, { useClass: ToggleProgramVisibilityUseCase });


container.register<IBookSessionWithTrainer>(I_BOOK_SESSION_WITH_TRAINER_TOKEN, { useClass: OnlineBookingUseCase  });
container.register<ICancelBooking>(I_CANCEL_BOOKING_TOKEN, { useClass: CancelUserBookingUseCase });
container.register<IFetchBookingDetails<UserBookingDetailsResponseDTO>>(I_FETCH_CLIENT_BOOKING_DETAILS_TOKEN, { useClass: FetchBookingDetailsForClient });
container.register<IFetchBookingDetails<TrainerBookingDetailsResponseDTO>>(I_FETCH_TRAINER_BOOKING_DETAILS_TOKEN, { useClass: FetchBookingDetailsForTrainer });
container.register<IFetchAllBookingsUseCase<FetchAllUserBookingRequestDTO, FetchAllUserBookingsResponseDTO>>(I_FETCH_USER_ALL_BOOKINGS_TOKEN, { useClass: FetchUserAllBookings });
container.register<IFetchAllBookingsUseCase<FetchAllTrainerBookingRequestDTO, FetchAllTrainerBookingsResponseDTO>>(I_FETCH_TRAINER_ALL_BOOKINGS_TOKEN, { useClass: FetchTrainerAllBookings });
container.register<IFetchAllBookingsUseCase<FetchAllTrainerBookingRequestDTO, FetchAllTrainerPendingBookingsResponseDTO>>(I_FETCH_TRAINER_PENDING_BOOKINGS_TOKEN, { useClass: FetchTrainerAllPendingBookings });
container.register<IFetchAllBookingsUseCase<FetchAllTrainerBookingRequestDTO, FetchAllTrainerRescheduleBookingsResponseDTO>>(I_FETCH_TRAINER_RESCHEDULE_REQUESTS_TOKEN, { useClass: FetchTrainerAllRescheduleBookings });
container.register<IFetchAllBookingsUseCase<FetchAllBookingsListRequestDTO, FetchAllBookingsListResponseDTO>>(I_FETCH_ADMIN_ALL_BOOKINGS_TOKEN, { useClass: FetchAllBookingsAdmin });
container.register<IRequestBookingRescheduleUseCase>(I_REQUEST_BOOKING_RESCHEDULE_TOKEN, { useClass: RequestBookingRescheduleUseCase });
container.register<IRequestBookingRescheduleUseCase>(I_TRAINER_RESCHEDULE_BOOKING_TOKEN, { useClass: RescheduleBookingByTrainer });
container.register<IProcessTrainerRescheduleUseCase>(I_ACCEPT_RESCHEDULE_REQUEST_TOKEN, { useClass: AcceptRescheduleBookingRequest });
container.register<IProcessTrainerRescheduleUseCase>(I_DECLINE_RESCHEDULE_REQUEST_TOKEN, { useClass: RejectRescheduleUseCase });
container.register<IConfirmBookingUseCase>(I_CONFIRM_BOOKING_USE_CASE_TOKEN, { useClass: ConfirmBookingUseCase });
container.register<IDeclineBookingUseCase>(I_DECLINE_BOOKING_USE_CASE_TOKEN, { useClass: DeclineBookingUseCase });
container.register<IMarkAsComplete>(I_MARK_AS_COMPLETE_TOKEN, { useClass: MarkAsComplete });
container.register<IGetMeetLink>(I_GET_MEET_LINK_TOKEN, { useClass: StartSessionUseCase });
container.register<IFetchAdminBookingsMetrics>(I_ADMIN_BOOKING_DASHBOARD_METRICS, { useClass: FetchAdminBookingDashboardMetrics });
container.register<IFetchBookingDetails<AdminBookingDetailsResponseDTO>>(I_FETCH_ADMIN_BOOKING_DETAILS_TOKEN, { useClass: FetchAdminBookingDetails });


container.register<IInitiateOnlinePayment>(I_INITIATE_ONLINE_PAYMENT_TOKEN, { useClass: InitiateOnlinePaymentUseCase });
container.register<IVeirfyOnlinePayment>(I_VERIFY_ONLINE_PAYMENT_TOKEN, { useClass: VerifyOnlinePaymentUsecase });


container.register<IFetchTrainerAvailableSlotsUseCase>(I_FETCH_TRAINER_AVAILABLE_SLOTS_TOKEN, { useClass: FetchTrainerAvailableSlotsUseCase });

container.register<IGetTrainerSlotConfigurationUseCase>(I_GET_TRAINER_SLOT_CONFIGURATION_TOKEN,{ useClass: GetTrainerSlotConfigurationUseCase });

container.register<IUpdateTrainerWeeklyAvailabilityUseCase>(I_UPDATE_TRAINER_WEEKLY_AVAILABILITY_TOKEN,{ useClass: UpdateTrainerWeeklyAvailabilityUseCase });

container.register<IGetWalletUseCase>(I_GET_WALLET_USE_CASE_TOKEN, { useClass: GetWalletUseCase });




container.register<IApplyLeaveRequest>(I_APPLY_LEAVE_REQUEST_TOKEN, { useClass: ApplyLeaveRequests });
container.register<IFetchAllLeaveRequests<FetchTrainerLeaveResponseDTO>>(I_FETCH_ALL_TRAINER_LEAVE_REQUESTS_TOKEN, { useClass: FetchAllTrainerLeaveRequests })
container.register<IFetchAllLeaveRequests<FetchAdminLeaveResponseDTO>>(I_FETCH_ALL_ADMIN_LEAVE_REQUESTS_TOKEN, { useClass: FetchAllAdminLeaveRequests})
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
container.register<IgetMessages>(I_GET_MESSAGES_TOKEN, { useClass: GetMessage });
container.register<IFetchChatList<TrainerChatListRequestDTO,NonEstablishedChatListResponseDTO[]>>(I_FETCH_NON_ESTABLISHED_TRAINER_CHAT_LIST_TOKEN, { useClass: FetchNonEstablishedTrainerChatList });
container.register<IFetchChatList<TrainerChatListRequestDTO,ChatListResponseDTO[]>>(I_FETCH_ESTABLISHED_TRAINER_CHAT_LIST_TOKEN, { useClass: FetchEstablishedTrainerChatList });
container.register<IFetchChatList<ClientChatListRequestDTO,ChatListResponseDTO[]>>(I_FETCH_ESTABLISHED_CLIENT_CHAT_LIST_TOKEN, { useClass: FetchEstablishedClientChatList });
container.register<IUploadChatFiles>(I_UPLOAD_CHAT_FILES, { useClass: UploadChatFile });

container.register<IReSendOtpUseCase>(I_RESEND_OTP_TOKEN, { useClass: ReSendOtpUseCase });
container.register<IVerifyAccountUseCase>(I_VERIFY_USER_ACCOUNT_TOKEN, { useClass: VerifyUserAccountUseCase });
container.register<IVerifyAccountUseCase>(I_VERIFY_TRAINER_ACCOUNT_TOKEN, { useClass: VerifyTrainerAccountUseCase });
container.register<IRefreshAccessTokenUseCase>(I_REFRESH_ACCESS_TOKEN_TOKEN, { useClass: RefreshAccessTokenUseCase });
container.register<IMarkAsRead>(I_MARK_ALL_NOTIFICATIONS_AS_READ_TOKEN, { useClass: MarkAllAsRead });
container.register<IMarkAsRead>(I_MARK_NOTIFICATION_AS_READ_TOKEN, { useClass: MarkAsRead });
container.register<IGetNotification>(I_GET_ALL_NOTIFICATIONS_TOKEN, { useClass: GetAllNotification });