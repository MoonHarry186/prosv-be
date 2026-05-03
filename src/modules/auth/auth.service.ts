import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../../models/User';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../config/jwt';
import { AppError, ConflictError, UnauthorizedError } from '../../shared/errors';
import { RegisterDto, LoginDto, AuthResult, AuthUser, TokenPair, GoogleLoginDto, FacebookLoginDto } from './auth.types';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function toAuthUser(user: InstanceType<typeof User>): AuthUser {
  return {
    _id: String(user._id),
    email: user.email,
    full_name: user.full_name,
    is_verified: user.is_verified,
    created_at: user.created_at,
  };
}

function issueTokens(userId: string, email: string): TokenPair {
  return {
    access_token: signAccessToken({ userId, email }),
    refresh_token: signRefreshToken({ userId, email }),
  };
}

export async function register(dto: RegisterDto): Promise<AuthResult> {
  const existing = await User.findOne({ email: dto.email });
  if (existing) throw new ConflictError('Email already in use');

  const user = await User.create({
    email: dto.email,
    password_hash: dto.password,
    full_name: dto.full_name,
  });

  return { user: toAuthUser(user), tokens: issueTokens(String(user._id), user.email) };
}

export async function login(dto: LoginDto): Promise<AuthResult> {
  const user = await User.findOne({ email: dto.email }).select('+password_hash');
  if (!user) throw new UnauthorizedError('INVALID_CREDENTIALS', 'Invalid email or password');

  const valid = await user.comparePassword(dto.password);
  if (!valid) throw new UnauthorizedError('INVALID_CREDENTIALS', 'Invalid email or password');

  return { user: toAuthUser(user), tokens: issueTokens(String(user._id), user.email) };
}

export async function refresh(refreshToken: string): Promise<TokenPair> {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new UnauthorizedError('INVALID_REFRESH_TOKEN', 'Invalid or expired refresh token');
  }

  const user = await User.findById(payload.userId);
  if (!user) throw new UnauthorizedError('INVALID_REFRESH_TOKEN', 'User not found');

  return issueTokens(String(user._id), user.email);
}

export async function me(userId: string): Promise<AuthUser> {
  const user = await User.findById(userId);
  if (!user) throw new UnauthorizedError('USER_NOT_FOUND', 'User not found');
  return toAuthUser(user);
}

export async function googleLogin(dto: GoogleLoginDto): Promise<AuthResult> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw new AppError(500, 'CONFIG_ERROR', 'Google OAuth is not configured');

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({ idToken: dto.id_token, audience: clientId });
    payload = ticket.getPayload();
  } catch {
    throw new UnauthorizedError('INVALID_GOOGLE_TOKEN', 'Invalid Google id_token');
  }

  if (!payload?.email) throw new UnauthorizedError('INVALID_GOOGLE_TOKEN', 'Google token missing email');

  const user = await User.findOneAndUpdate(
    { $or: [{ google_id: payload.sub }, { email: payload.email }] },
    {
      $set: { google_id: payload.sub, is_verified: true },
      $setOnInsert: { email: payload.email, full_name: payload.name ?? payload.email },
    },
    { upsert: true, new: true },
  );

  return { user: toAuthUser(user), tokens: issueTokens(String(user._id), user.email) };
}

export async function facebookLogin(dto: FacebookLoginDto): Promise<AuthResult> {
  let fbData: { id: string; email?: string; name?: string };
  try {
    const { data } = await axios.get<{ id: string; email?: string; name?: string }>(
      'https://graph.facebook.com/me',
      { params: { fields: 'id,name,email', access_token: dto.access_token } },
    );
    fbData = data;
  } catch {
    throw new UnauthorizedError('INVALID_FACEBOOK_TOKEN', 'Invalid Facebook access_token');
  }

  if (!fbData.email) throw new UnauthorizedError('INVALID_FACEBOOK_TOKEN', 'Facebook account has no email. Please grant email permission.');

  const user = await User.findOneAndUpdate(
    { $or: [{ facebook_id: fbData.id }, { email: fbData.email }] },
    {
      $set: { facebook_id: fbData.id, is_verified: true },
      $setOnInsert: { email: fbData.email, full_name: fbData.name ?? fbData.email },
    },
    { upsert: true, new: true },
  );

  return { user: toAuthUser(user), tokens: issueTokens(String(user._id), user.email) };
}
