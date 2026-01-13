# 📤 iCastar File Upload System - Complete Documentation

## 🎯 Overview
Complete file upload system for Artist profiles, ID proofs, and audition videos using AWS S3.

---

## 📁 S3 Bucket Folder Structure

```
icastar-uploads/              # Root bucket name
│
├── profiles/                 # Artist profile photos
│   └── {artistId}/
│       ├── photo_{timestamp}.jpg
│       └── cover_{timestamp}.jpg
│
├── documents/                # ID proofs and documents
│   └── {artistId}/
│       └── id-proof_{timestamp}.pdf
│
└── auditions/                # Audition submissions
    └── {artistId}/
        ├── {auditionId}_video_{timestamp}.mp4
        └── {auditionId}_thumbnail_{timestamp}.jpg
```

### Naming Convention:
- **Profile Photo**: `profiles/{artistId}/photo_{timestamp}.{ext}`
- **Cover Photo**: `profiles/{artistId}/cover_{timestamp}.{ext}`
- **ID Proof**: `documents/{artistId}/id-proof_{timestamp}.{ext}`
- **Audition Video**: `auditions/{artistId}/{auditionId}_video_{timestamp}.{ext}`
- **Audition Thumbnail**: `auditions/{artistId}/{auditionId}_thumbnail_{timestamp}.{ext}`

---

## 🔄 Upload Flow

### **Method 1: Pre-Signed URL (Recommended for Large Files)**

```
Frontend                    Backend                     S3
   │                          │                         │
   │  1. Request Pre-signed   │                         │
   │────────────────────────► │                         │
   │     POST /upload/        │                         │
   │     presigned-url        │                         │
   │                          │                         │
   │                          │  2. Generate signed URL │
   │                          │────────────────────────►│
   │                          │                         │
   │  3. Return pre-signed    │                         │
   │◄──────────────────────── │                         │
   │     URL + file path      │                         │
   │                          │                         │
   │  4. Upload directly to S3                          │
   │────────────────────────────────────────────────────►│
   │     PUT {presignedUrl}   │                         │
   │                          │                         │
   │  5. Update profile with  │                         │
   │────────────────────────► │                         │
   │     PUT /artists/profile │                         │
   │     { profilePhoto: url }│                         │
   │                          │                         │
   │  6. Success response     │                         │
   │◄──────────────────────── │                         │
```

**Benefits:**
- ✅ Direct upload to S3 (no backend bandwidth usage)
- ✅ Better for large files (videos)
- ✅ Progress tracking possible
- ✅ Reduced backend load

---

## 🎨 Frontend Components Created

### 1. **ImageUpload** Component
**Location:** `/components/FileUpload/ImageUpload.tsx`

**Features:**
- Profile photo, cover photo upload
- Preview before upload
- Progress bar
- Validation (5MB max, JPEG/PNG/WebP)
- Circle, square, or wide aspect ratios

**Usage:**
```tsx
import { ImageUpload } from '@/components/FileUpload'

<ImageUpload
  currentImageUrl={profile.profilePhoto}
  uploadType="PROFILE_PHOTO"
  label="Profile Photo"
  aspectRatio="circle"
  onUploadSuccess={(fileUrl) => {
    setProfile({ ...profile, profilePhoto: fileUrl })
  }}
/>
```

### 2. **DocumentUpload** Component
**Location:** `/components/FileUpload/DocumentUpload.tsx`

**Features:**
- ID proof, certificates upload
- PDF, JPEG, PNG support
- Progress tracking
- 10MB max size
- File preview with icon

**Usage:**
```tsx
import { DocumentUpload } from '@/components/FileUpload'

<DocumentUpload
  currentDocumentUrl={profile.idProof}
  uploadType="ID_PROOF"
  label="Government ID Proof"
  description="Aadhaar, PAN, Passport, or Driving License"
  onUploadSuccess={(fileUrl) => {
    setProfile({ ...profile, idProof: fileUrl })
  }}
/>
```

### 3. **VideoUpload** Component
**Location:** `/components/FileUpload/VideoUpload.tsx`

**Features:**
- Audition video upload
- Video preview with player
- Progress bar for large files
- 100MB max size
- MP4, MOV, AVI, WebM support

**Usage:**
```tsx
import { VideoUpload } from '@/components/FileUpload'

<VideoUpload
  currentVideoUrl={auditionSubmission.videoUrl}
  uploadType="AUDITION_VIDEO"
  label="Upload Your Audition Video"
  auditionId={auditionId}
  onUploadSuccess={(fileUrl) => {
    setSubmission({ ...submission, videoUrl: fileUrl })
  }}
/>
```

---

## 🛠️ Upload Service
**Location:** `/services/uploadService.ts`

### Key Methods:

#### 1. Get Pre-Signed URL
```typescript
const presignedData = await uploadService.getPresignedUrl({
  fileName: 'photo.jpg',
  fileType: 'image/jpeg',
  uploadType: 'PROFILE_PHOTO'
})
// Returns: { presignedUrl, fileUrl, uploadId, expiresIn }
```

#### 2. Upload to S3
```typescript
await uploadService.uploadToS3(
  presignedUrl,
  file,
  (progress) => console.log(`${progress}%`)
)
```

#### 3. Complete Flow (One-Shot)
```typescript
const fileUrl = await uploadService.uploadFile(
  file,
  'PROFILE_PHOTO',
  (progress) => setProgress(progress)
)
```

#### 4. Validate File
```typescript
const validation = uploadService.validateFile(file, 'image')
if (!validation.valid) {
  toast.error(validation.error)
}
```

---

## 🔐 Backend Requirements

### **1. AWS S3 Configuration**

**Environment Variables:**
```properties
# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET_NAME=icastar-uploads

# S3 Pre-signed URL expiry (in seconds)
AWS_PRESIGNED_URL_EXPIRY=3600
```

**IAM Policy (Minimal Permissions):**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:PutObjectAcl"
      ],
      "Resource": "arn:aws:s3:::icastar-uploads/*"
    }
  ]
}
```

### **2. Required Endpoints**

#### **A. Generate Pre-Signed URL**
**Endpoint:** `POST /api/upload/presigned-url`

**Request Body:**
```json
{
  "fileName": "profile-photo.jpg",
  "fileType": "image/jpeg",
  "uploadType": "PROFILE_PHOTO",
  "auditionId": 123
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "presignedUrl": "https://icastar-uploads.s3.ap-south-1.amazonaws.com/profiles/456/photo_1234567890.jpg?X-Amz-...",
    "fileUrl": "https://icastar-uploads.s3.ap-south-1.amazonaws.com/profiles/456/photo_1234567890.jpg",
    "uploadId": "upload_uuid_here",
    "expiresIn": 3600
  }
}
```

**Java Implementation:**
```java
@PostMapping("/upload/presigned-url")
public ResponseEntity<?> generatePresignedUrl(
    @RequestBody PresignedUrlRequest request,
    @AuthenticationPrincipal UserDetails userDetails
) {
    try {
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Get artist profile ID
        ArtistProfile profile = artistProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Artist profile not found"));

        Long artistId = profile.getArtistProfileId();

        // Build S3 key based on upload type
        String s3Key = buildS3Key(
            artistId,
            request.getUploadType(),
            request.getFileName(),
            request.getAuditionId()
        );

        // Generate pre-signed URL (expires in 1 hour)
        Duration expiration = Duration.ofHours(1);
        URL presignedUrl = s3Client.presignUrl(
            PresignUrlRequest.builder()
                .signatureDuration(expiration)
                .putObjectRequest(PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    .contentType(request.getFileType())
                    .build())
                .build()
        );

        // Build public file URL
        String fileUrl = String.format(
            "https://%s.s3.%s.amazonaws.com/%s",
            bucketName,
            region,
            s3Key
        );

        // Create upload record (optional - for tracking)
        String uploadId = UUID.randomUUID().toString();
        // Save to database if you want to track uploads

        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", Map.of(
                "presignedUrl", presignedUrl.toString(),
                "fileUrl", fileUrl,
                "uploadId", uploadId,
                "expiresIn", expiration.getSeconds()
            )
        ));

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("message", "Failed to generate upload URL"));
    }
}

// Helper method to build S3 key
private String buildS3Key(
    Long artistId,
    String uploadType,
    String fileName,
    Long auditionId
) {
    String timestamp = String.valueOf(System.currentTimeMillis());
    String extension = fileName.substring(fileName.lastIndexOf("."));

    switch (uploadType) {
        case "PROFILE_PHOTO":
            return String.format("profiles/%d/photo_%s%s", artistId, timestamp, extension);

        case "COVER_PHOTO":
            return String.format("profiles/%d/cover_%s%s", artistId, timestamp, extension);

        case "ID_PROOF":
            return String.format("documents/%d/id-proof_%s%s", artistId, timestamp, extension);

        case "AUDITION_VIDEO":
            if (auditionId == null) {
                throw new IllegalArgumentException("auditionId required for audition uploads");
            }
            return String.format("auditions/%d/%d_video_%s%s", artistId, auditionId, timestamp, extension);

        case "AUDITION_THUMBNAIL":
            if (auditionId == null) {
                throw new IllegalArgumentException("auditionId required for audition uploads");
            }
            return String.format("auditions/%d/%d_thumbnail_%s%s", artistId, auditionId, timestamp, extension);

        default:
            throw new IllegalArgumentException("Invalid upload type: " + uploadType);
    }
}
```

#### **B. Update Artist Profile**
**Endpoint:** `PUT /api/artists/profile`

**Request Body:**
```json
{
  "profilePhoto": "https://icastar-uploads.s3.ap-south-1.amazonaws.com/profiles/456/photo_123.jpg",
  "coverPhoto": "https://icastar-uploads.s3.ap-south-1.amazonaws.com/profiles/456/cover_123.jpg",
  "idProof": "https://icastar-uploads.s3.ap-south-1.amazonaws.com/documents/456/id-proof_123.pdf"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ...updatedProfile }
}
```

**Java Implementation:**
```java
@PutMapping("/artists/profile")
public ResponseEntity<?> updateArtistProfile(
    @RequestBody UpdateArtistProfileDto dto,
    @AuthenticationPrincipal UserDetails userDetails
) {
    try {
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ArtistProfile profile = artistProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Artist profile not found"));

        // Update profile fields
        if (dto.getProfilePhoto() != null) {
            profile.setProfilePhoto(dto.getProfilePhoto());
        }
        if (dto.getCoverPhoto() != null) {
            profile.setCoverPhoto(dto.getCoverPhoto());
        }
        if (dto.getIdProof() != null) {
            profile.setIdProof(dto.getIdProof());
            profile.setIdProofVerified(false); // Requires admin verification
        }

        // Save updated profile
        ArtistProfile updated = artistProfileRepository.save(profile);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Profile updated successfully",
            "data", updated
        ));

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("message", "Failed to update profile"));
    }
}
```

### **3. Database Schema Changes**

**Add columns to `artist_profiles` table:**
```sql
ALTER TABLE artist_profiles
ADD COLUMN cover_photo VARCHAR(500),
ADD COLUMN id_proof VARCHAR(500),
ADD COLUMN id_proof_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN id_proof_uploaded_at TIMESTAMP;
```

**Optional: Create upload tracking table:**
```sql
CREATE TABLE file_uploads (
    upload_id VARCHAR(36) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    upload_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size BIGINT,
    content_type VARCHAR(100),
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### **4. S3 CORS Configuration**

Add CORS rules to your S3 bucket:
```json
[
  {
    "AllowedOrigins": ["http://localhost:5173", "https://your-domain.com"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

---

## 🧪 Testing Flow

### **1. Test Profile Photo Upload**
```bash
# Frontend flow:
1. User clicks "Upload Image" button
2. Selects image file (< 5MB, JPEG/PNG)
3. Frontend validates file
4. Frontend calls: POST /api/upload/presigned-url
5. Backend returns pre-signed URL
6. Frontend uploads directly to S3
7. Frontend calls: PUT /api/artists/profile with file URL
8. Backend saves URL to database
9. User sees updated profile photo
```

### **2. Test ID Proof Upload**
```bash
# Same flow as profile photo
# But uploadType = "ID_PROOF"
# Backend sets idProofVerified = false
# Admin can verify later
```

### **3. Test Audition Video Upload**
```bash
# Frontend flow:
1. Artist opens audition application modal
2. Fills form and selects video file (< 100MB)
3. Frontend validates video
4. Frontend calls: POST /api/upload/presigned-url with auditionId
5. Upload to S3 with progress bar
6. Submit audition application with video URL
```

---

## 📝 Complete Example Usage

### Edit Profile Page with All Uploads:

```tsx
import React, { useState, useEffect } from 'react'
import { ImageUpload, DocumentUpload } from '@/components/FileUpload'
import { artistService } from '@/services/artistService'
import { toast } from 'react-toastify'

const EditProfilePage = () => {
  const [profile, setProfile] = useState({
    profilePhoto: '',
    coverPhoto: '',
    idProof: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const data = await artistService.getMyProfile()
    if (data) {
      setProfile({
        profilePhoto: data.profilePhoto || '',
        coverPhoto: data.coverPhoto || '',
        idProof: data.idProof || '',
      })
    }
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      await artistService.updateMyProfile(profile)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Edit Profile</h1>

      {/* Profile Photo */}
      <ImageUpload
        currentImageUrl={profile.profilePhoto}
        uploadType="PROFILE_PHOTO"
        label="Profile Photo"
        aspectRatio="circle"
        onUploadSuccess={(fileUrl) => {
          setProfile({ ...profile, profilePhoto: fileUrl })
        }}
      />

      {/* Cover Photo */}
      <ImageUpload
        currentImageUrl={profile.coverPhoto}
        uploadType="COVER_PHOTO"
        label="Cover Photo"
        aspectRatio="wide"
        onUploadSuccess={(fileUrl) => {
          setProfile({ ...profile, coverPhoto: fileUrl })
        }}
      />

      {/* ID Proof */}
      <DocumentUpload
        currentDocumentUrl={profile.idProof}
        uploadType="ID_PROOF"
        label="Government ID Proof"
        description="Upload Aadhaar, PAN, Passport, or Driving License for verification"
        onUploadSuccess={(fileUrl) => {
          setProfile({ ...profile, idProof: fileUrl })
        }}
      />

      {/* Save Button */}
      <button
        onClick={handleSaveProfile}
        disabled={saving}
        className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 disabled:bg-gray-300"
      >
        {saving ? 'Saving...' : 'Save Profile'}
      </button>
    </div>
  )
}

export default EditProfilePage
```

---

## 🎯 Summary Checklist

### ✅ Frontend (Completed)
- [x] Upload Service (`/services/uploadService.ts`)
- [x] ImageUpload Component
- [x] DocumentUpload Component
- [x] VideoUpload Component
- [x] Updated ArtistProfile interface with new fields
- [x] File validation (size, type)
- [x] Progress tracking
- [x] Preview functionality

### ⚠️ Backend (To Be Implemented)
- [ ] AWS S3 configuration (SDK setup)
- [ ] Generate pre-signed URL endpoint
- [ ] Update profile endpoint to accept new fields
- [ ] Database schema updates (cover_photo, id_proof columns)
- [ ] S3 bucket CORS configuration
- [ ] Optional: Upload tracking table

### 🔑 Key Points
1. **Pre-signed URLs** eliminate backend bandwidth usage
2. **Direct S3 upload** for better performance
3. **Organized folder structure** for easy management
4. **Validation on both frontend and backend**
5. **Progress tracking** for better UX
6. **ID verification workflow** (upload → pending → admin verifies)

---

## 🚀 Next Steps

1. **Setup AWS S3 bucket** with proper permissions
2. **Implement backend endpoints** as documented above
3. **Test upload flow** end-to-end
4. **Add admin panel** for ID verification
5. **Consider CDN** (CloudFront) for faster delivery
6. **Add image optimization** (resize, compress) if needed

---

**Questions?** Refer to code comments or test with the provided components! 🎉
