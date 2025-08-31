#!/bin/bash

# Quick test for keyword integration fix
echo "🔧 Testing Keyword Integration Fix"
echo "==================================="

SERVER_URL="http://localhost:3000"

# Test with a simple resume and keywords
RESUME_DATA='{
  "personalInfo": {
    "fullName": "Test User",
    "email": "test@example.com",
    "summary": "Software developer with 3 years of experience"
  },
  "skills": ["JavaScript", "React"],
  "workExperience": [
    {
      "company": "Tech Company",
      "position": "Developer",
      "description": "Built web applications",
      "startDate": "2022-01-01",
      "endDate": "2024-01-01",
      "current": false
    }
  ]
}'

SELECTED_KEYWORDS='["TypeScript", "Node.js", "Docker"]'

echo "📋 Testing keyword integration API..."

# Login first (create test user)
USER_EMAIL="keywordfix$(date +%s)@example.com"
curl -s -X POST "$SERVER_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$USER_EMAIL\",\"password\":\"TestPass123!\",\"name\":\"Test User\"}" > /dev/null

curl -s -X POST "$SERVER_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -c test_cookies.txt \
  -d "{\"email\":\"$USER_EMAIL\",\"password\":\"TestPass123!\"}" > /dev/null

# Test the keyword integration
RESPONSE=$(curl -s -X POST "$SERVER_URL/api/ai/integrate-keywords" \
  -H "Content-Type: application/json" \
  -b test_cookies.txt \
  -d "{
    \"resumeData\": $RESUME_DATA,
    \"selectedKeywords\": $SELECTED_KEYWORDS
  }")

echo "Response: $RESPONSE"

if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "✅ Keyword integration working!"
elif echo "$RESPONSE" | grep -q '"keywordPlacements"'; then
    echo "✅ Keyword integration working with fallback!"
else
    echo "❌ Still having issues: $RESPONSE"
fi

# Cleanup
rm -f test_cookies.txt

echo "Done testing!"