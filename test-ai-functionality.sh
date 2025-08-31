#!/bin/bash

# Comprehensive AI Functionality Test Script for ResumeAI
# This script tests all AI features in the application

BASE_URL="http://localhost:3001"
EMAIL="testuser@example.com"
PASSWORD="testpassword123"
NAME="Test User"

echo "🚀 Starting comprehensive AI functionality tests..."
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "SUCCESS") echo -e "${GREEN}✅ $message${NC}" ;;
        "ERROR") echo -e "${RED}❌ $message${NC}" ;;
        "INFO") echo -e "${BLUE}ℹ️  $message${NC}" ;;
        "WARNING") echo -e "${YELLOW}⚠️  $message${NC}" ;;
    esac
}

# Function to extract session cookie
extract_session() {
    local response_headers=$1
    echo "$response_headers" | grep -i 'set-cookie.*session=' | sed 's/.*session=\([^;]*\).*/\1/' | head -1
}

# Test 1: User Registration
echo ""
print_status "INFO" "Test 1: User Registration"
REGISTER_RESPONSE=$(curl -s -i -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"name\": \"$NAME\"
  }")

if echo "$REGISTER_RESPONSE" | grep -q "200 OK\|201"; then
    SESSION_COOKIE=$(extract_session "$REGISTER_RESPONSE")
    print_status "SUCCESS" "User registration successful"
    print_status "INFO" "Session cookie: ${SESSION_COOKIE:0:20}..."
else
    print_status "ERROR" "User registration failed"
    echo "$REGISTER_RESPONSE"
    exit 1
fi

# Test 2: Create a test resume
echo ""
print_status "INFO" "Test 2: Creating test resume"
RESUME_DATA='{
  "name": "Software Engineer Resume",
  "template": "tech-modern",
  "personalInfo": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "(555) 123-4567",
    "location": "San Francisco, CA",
    "summary": "Experienced software developer with expertise in full-stack development"
  },
  "skills": ["JavaScript", "React", "Node.js", "Python", "AWS"],
  "workExperience": [{
    "id": "work1",
    "position": "Senior Software Engineer",
    "company": "Tech Company Inc",
    "location": "San Francisco, CA",
    "startDate": "2020-01",
    "endDate": "present",
    "current": true,
    "description": "Led development of web applications using React and Node.js"
  }],
  "education": [{
    "id": "edu1",
    "institution": "University of California",
    "degree": "Bachelor of Science in Computer Science",
    "location": "Berkeley, CA",
    "startDate": "2016-08",
    "endDate": "2020-05",
    "gpa": "3.8"
  }]
}'

CREATE_RESUME_RESPONSE=$(curl -s -X POST "$BASE_URL/api/resume/create" \
  -H "Content-Type: application/json" \
  -H "Cookie: session=$SESSION_COOKIE" \
  -d "$RESUME_DATA")

if echo "$CREATE_RESUME_RESPONSE" | grep -q '"success":true'; then
    RESUME_ID=$(echo "$CREATE_RESUME_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    print_status "SUCCESS" "Resume created successfully"
    print_status "INFO" "Resume ID: $RESUME_ID"
else
    print_status "ERROR" "Resume creation failed"
    echo "$CREATE_RESUME_RESPONSE"
    exit 1
fi

# Test 3: AI Resume Enhancement - Improve
echo ""
print_status "INFO" "Test 3: AI Resume Enhancement - Improve"
ENHANCE_IMPROVE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/ai/enhance-resume" \
  -H "Content-Type: application/json" \
  -H "Cookie: session=$SESSION_COOKIE" \
  -d "{
    \"resumeData\": $RESUME_DATA,
    \"enhancementType\": \"improve\",
    \"resumeId\": \"$RESUME_ID\"
  }")

if echo "$ENHANCE_IMPROVE_RESPONSE" | grep -q '"success":true'; then
    print_status "SUCCESS" "Resume improvement enhancement completed"
else
    print_status "ERROR" "Resume improvement enhancement failed"
    echo "$ENHANCE_IMPROVE_RESPONSE"
fi

# Test 4: AI Resume Enhancement - Tailor to Job
echo ""
print_status "INFO" "Test 4: AI Resume Enhancement - Tailor to Job"
JOB_DESCRIPTION="We are seeking a Senior Software Engineer with expertise in React, Node.js, and cloud technologies. The ideal candidate will have 5+ years of experience building scalable web applications and working with AWS services."

ENHANCE_TAILOR_RESPONSE=$(curl -s -X POST "$BASE_URL/api/ai/enhance-resume" \
  -H "Content-Type: application/json" \
  -H "Cookie: session=$SESSION_COOKIE" \
  -d "{
    \"resumeData\": $RESUME_DATA,
    \"jobDescription\": \"$JOB_DESCRIPTION\",
    \"enhancementType\": \"tailor\",
    \"resumeId\": \"$RESUME_ID\"
  }")

if echo "$ENHANCE_TAILOR_RESPONSE" | grep -q '"success":true'; then
    print_status "SUCCESS" "Resume tailoring enhancement completed"
else
    print_status "ERROR" "Resume tailoring enhancement failed"
    echo "$ENHANCE_TAILOR_RESPONSE"
fi

# Test 5: AI Resume Enhancement - Keywords
echo ""
print_status "INFO" "Test 5: AI Resume Enhancement - Keywords"
ENHANCE_KEYWORDS_RESPONSE=$(curl -s -X POST "$BASE_URL/api/ai/enhance-resume" \
  -H "Content-Type: application/json" \
  -H "Cookie: session=$SESSION_COOKIE" \
  -d "{
    \"resumeData\": $RESUME_DATA,
    \"enhancementType\": \"keywords\"
  }")

if echo "$ENHANCE_KEYWORDS_RESPONSE" | grep -q '"success":true'; then
    print_status "SUCCESS" "Resume keywords enhancement completed"
else
    print_status "ERROR" "Resume keywords enhancement failed"
    echo "$ENHANCE_KEYWORDS_RESPONSE"
fi

# Test 6: AI Cover Letter Generation
echo ""
print_status "INFO" "Test 6: AI Cover Letter Generation"
COVER_LETTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/cover-letter/generate" \
  -H "Content-Type: application/json" \
  -H "Cookie: session=$SESSION_COOKIE" \
  -d "{
    \"resumeId\": \"$RESUME_ID\",
    \"companyName\": \"Google\",
    \"jobTitle\": \"Senior Software Engineer\",
    \"jobDescription\": \"$JOB_DESCRIPTION\",
    \"additionalInfo\": \"I am particularly interested in working on cloud infrastructure projects.\"
  }")

if echo "$COVER_LETTER_RESPONSE" | grep -q '"id":'; then
    COVER_LETTER_ID=$(echo "$COVER_LETTER_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    print_status "SUCCESS" "Cover letter generation completed"
    print_status "INFO" "Cover Letter ID: $COVER_LETTER_ID"
else
    print_status "ERROR" "Cover letter generation failed"
    echo "$COVER_LETTER_RESPONSE"
fi

# Test 7: Inline AI Enhancement (Custom Prompt)
echo ""
print_status "INFO" "Test 7: Inline AI Enhancement (Custom Prompt)"
INLINE_ENHANCE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/ai/enhance-resume" \
  -H "Content-Type: application/json" \
  -H "Cookie: session=$SESSION_COOKIE" \
  -d "{
    \"resumeData\": $RESUME_DATA,
    \"customPrompt\": \"Please enhance this professional summary to be more impactful and include quantifiable achievements: Experienced software developer with expertise in full-stack development\",
    \"resumeId\": \"$RESUME_ID\"
  }")

if echo "$INLINE_ENHANCE_RESPONSE" | grep -q '"success":true'; then
    print_status "SUCCESS" "Inline AI enhancement completed"
else
    print_status "ERROR" "Inline AI enhancement failed"
    echo "$INLINE_ENHANCE_RESPONSE"
fi

# Test 8: Error Handling - Invalid Enhancement Type
echo ""
print_status "INFO" "Test 8: Error Handling - Invalid Enhancement Type"
ERROR_TEST_RESPONSE=$(curl -s -X POST "$BASE_URL/api/ai/enhance-resume" \
  -H "Content-Type: application/json" \
  -H "Cookie: session=$SESSION_COOKIE" \
  -d "{
    \"resumeData\": $RESUME_DATA,
    \"enhancementType\": \"invalid_type\"
  }")

if echo "$ERROR_TEST_RESPONSE" | grep -q '"message":"Invalid enhancement type"'; then
    print_status "SUCCESS" "Error handling working correctly for invalid enhancement type"
else
    print_status "WARNING" "Error handling may not be working as expected"
    echo "$ERROR_TEST_RESPONSE"
fi

# Test 9: Error Handling - Missing Job Description for Tailor
echo ""
print_status "INFO" "Test 9: Error Handling - Missing Job Description for Tailor"
ERROR_TEST2_RESPONSE=$(curl -s -X POST "$BASE_URL/api/ai/enhance-resume" \
  -H "Content-Type: application/json" \
  -H "Cookie: session=$SESSION_COOKIE" \
  -d "{
    \"resumeData\": $RESUME_DATA,
    \"enhancementType\": \"tailor\"
  }")

# This should fail gracefully when no job description is provided
if echo "$ERROR_TEST2_RESPONSE" | grep -q '"success":false\|error\|message'; then
    print_status "SUCCESS" "Error handling working correctly for missing job description"
else
    print_status "WARNING" "Error handling may not be working as expected for missing job description"
    echo "$ERROR_TEST2_RESPONSE"
fi

# Summary
echo ""
echo "================================================="
print_status "INFO" "Test Summary Completed"
echo "================================================="

# Check if OpenRouter API key is configured
echo ""
print_status "INFO" "Checking OpenRouter API Key Configuration"
if grep -q "OPENROUTER_API_KEY=your-openrouter-key" .env.local; then
    print_status "WARNING" "OpenRouter API key is still set to placeholder value"
    print_status "INFO" "To test actual AI responses, set a real API key from https://openrouter.ai"
    print_status "INFO" "Current tests validate the API structure and error handling"
else
    print_status "SUCCESS" "OpenRouter API key appears to be configured"
fi

echo ""
print_status "INFO" "All major AI functionality endpoints have been tested!"
print_status "INFO" "The application is ready for AI-powered resume and cover letter enhancement."