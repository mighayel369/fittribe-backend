import { BOOKING_STATUS } from "utils/Constants";

export interface TrainerBookingDetailsResponseDTO {
    bookingId: string;
    chatId:string|null
    clientId:string;
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    clientProfilePic?: string;
    
    bookedProgram: string;
    bookedDate: Date;
    bookedTime: string;
    sessionDuration: number;
    
    bookingStatus: string;
    totalAmount: number;
    trainerEarning: number;
    paymentStatus: string;
    paymentMethod: string;

    rescheduleRequest?: {
        newDate: Date;
        newTimeSlot: string;
        requestedBy:string,
        requestedAt: Date;
    };
    rejectReason?:string
    meetLink?:string,
    isReviewed?:boolean,
}


export interface UserBookingDetailsResponseDTO {
  bookingId: string;    
  
  bookedProgram: string;
  bookedDate: string;      
  bookedTime: string;    
  sessionDuration: number;
  bookingStatus: BOOKING_STATUS

  trainerId: string;   
  trainerName: string;
  trainerProfilePic?: string;
  trainerExperience: number;
  trainerGender: string;

  totalAmount: number;   
  payment: {
    method: string;     
    status: string;       
  };


  rescheduleRequest?: {
    newDate: string;
    newTimeSlot: string;
    requestedBy:string,
    status: string;
  };
   rejectReason?:string
   meetLink?:string,
   isReviewed?:boolean
}

export interface AdminBookingDetailsResponseDTO{
  bookingId:string
  scheduledDate:string
  scheduledTime:string
  duration:number
  sssionType:string
  bookingStatus:string
  payment:{
    baseRate:number
    platformFee:number
    totalAmount:number
    paymentType:string
  }
  client:{
    name:string
    email:string
    clientId:string
    totalSessions:number
    joinedOn:string
    profilePic:string
  }
  trainer:{
    name:string,
    trainerId:string
    serviceProvided:string
    rating:number
    experience:string
    profilePic:string
  }
}