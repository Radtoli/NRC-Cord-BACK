import { ObjectId } from "mongodb";
import { UserRepository } from "../../../shared/Repositories/implementation/UserRepository";
import { UserNotFoundError } from "../Errors/UserErrors";

export class DeleteUserService {
  constructor(private userRepository: UserRepository) { }

  async execute(id: string): Promise<void> {
    if (!ObjectId.isValid(id)) {
      throw new UserNotFoundError();
    }

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundError();
    }

    await this.userRepository.delete(id);
  }
}