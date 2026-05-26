import { IFetchAllUsersUseCase } from "application/interfaces/user/i-fetch-all-users.usecase";
import { inject, injectable } from "tsyringe";
import { I_USER_REPO_TOKEN, IUserRepo } from "domain/repositories/IUserRepo";
import { FetchAllUsersQueryInput, FetchAllUsersResponseDTO, FetchAllUsersResponseSchema } from "application/dto/management/user-management/all-users.dto";
import { HttpStatus } from "utils/HttpStatus";
import { AppError } from "domain/errors/AppError";
import { UserMapper } from "application/mappers/user-mapper";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class FetchAllUsersUseCase implements IFetchAllUsersUseCase {

  constructor(
    @inject(I_USER_REPO_TOKEN)
    private readonly _userRepository: IUserRepo
  ) { }

  async execute(queryInput: FetchAllUsersQueryInput): Promise<FetchAllUsersResponseDTO> {

    const { limit, currentPage, filter } = queryInput;

    if (currentPage <= 0 || limit <= 0) {
      throw new AppError(ERROR_MESSAGES.INVALID_PAGINATION, HttpStatus.BAD_REQUEST);
    }

    const { data, totalCount } = await this._userRepository.findAllUsers(
      currentPage,
      limit,
      filter || {}
    );

    return FetchAllUsersResponseSchema.parse({
      data: data.map(user => UserMapper.toUserResponseDTO(user)),
      totalPages: Math.ceil(totalCount / limit),
      currentPage,
      totalCount
    });
  }
}