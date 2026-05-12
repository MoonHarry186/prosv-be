import { User } from '../../models/User';
import { AppError, NotFoundError, UnauthorizedError } from '../../shared/errors';
import { UpdateProfileDto, UpdatePasswordDto, UpdateFcmTokenDto, UserProfile } from './user.types';

function toUserProfile(user: InstanceType<typeof User>): UserProfile {
  return {
    _id: String(user._id),
    email: user.email,
    full_name: user.full_name,
    student_id: user.student_id,
    major: user.major,
    is_verified: user.is_verified,
    notifications_enabled: user.notifications_enabled,
    fcm_token: user.fcm_token,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

async function findOrThrow(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError('User not found');
  return user;
}

export async function getProfile(userId: string): Promise<UserProfile> {
  return toUserProfile(await findOrThrow(userId));
}

export async function updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserProfile> {
  console.log('Updating profile for user:', userId, 'with data:', dto);
  const user = await User.findByIdAndUpdate(userId, dto, { new: true });
  if (!user) throw new NotFoundError('User not found');
  console.log('Updated user from DB:', user);
  return toUserProfile(user);
}

export async function updatePassword(userId: string, dto: UpdatePasswordDto): Promise<void> {
  const user = await User.findById(userId).select('+password_hash');
  if (!user) throw new NotFoundError('User not found');

  const valid = await user.comparePassword(dto.current_password);
  if (!valid) throw new UnauthorizedError('INVALID_PASSWORD', 'Current password is incorrect');

  user.password_hash = dto.new_password;
  await user.save();
}

export async function updateFcmToken(userId: string, dto: UpdateFcmTokenDto): Promise<void> {
  const result = await User.findByIdAndUpdate(userId, { fcm_token: dto.fcm_token });
  if (!result) throw new NotFoundError('User not found');
}
