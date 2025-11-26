import apiClient from '@/services/apiClient';
import { Recruiter } from '@/types';

export interface RecruiterProfileDto {
  userId?: string;
  email?: string;
  mobile?: string;
  firstName?: string;
  lastName?: string;
  isVerified?: boolean;
  contactPersonName?: string;
  designation?: string;
  companyName?: string;
  companyWebsite?: string;
  companyDescription?: string;
  companyLogoUrl?: string;
  industry?: string;
  companySize?: string;
  location?: string;
  isVerifiedCompany?: boolean;
  totalJobsPosted?: number;
  successfulHires?: number;
  chatCredits?: number;
  categoryId?: string;
  categoryName?: string;
}

function mapDtoToRecruiter(dto: RecruiterProfileDto): Recruiter {
  const name = dto.contactPersonName || [dto.firstName, dto.lastName].filter(Boolean).join(' ').trim() || '—';
  const title = dto.designation || '';
  const email = dto.email || '';
  const avatarUrl = dto.companyLogoUrl || '';
  const companyName = dto.companyName || '';
  const companyWebsite = dto.companyWebsite || '';
  const companyBio = dto.companyDescription || '';
  const verificationStatus = dto.isVerified ? 'Verified' : 'Not Verified';

  return {
    name,
    title,
    email,
    avatarUrl,
    companyName,
    companyWebsite,
    companyBio,
    verificationStatus,
    recruiterType: undefined,
  } as Recruiter;
}

export async function getRecruiterProfile(): Promise<Recruiter> {
  const resp = await apiClient.get('/recruiter/dashboard/profile');
  const payload = resp.data;
  const dto: RecruiterProfileDto = payload?.data || payload;
  return mapDtoToRecruiter(dto);
}