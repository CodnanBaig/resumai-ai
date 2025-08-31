#!/bin/bash

# Test keyword visibility after integration
echo "🎯 Testing Keyword Visibility After Integration"
echo "=============================================="

SERVER_URL="http://localhost:3000"

# Create test user and resume
USER_EMAIL="keywordvis$(date +%s)@example.com"
echo "📋 Creating test user: $USER_EMAIL"

# Register and login
curl -s -X POST "$SERVER_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$USER_EMAIL\",\"password\":\"TestPass123!\",\"name\":\"Test User\"}" > /dev/null

curl -s -X POST "$SERVER_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -c test_cookies.txt \
  -d "{\"email\":\"$USER_EMAIL\",\"password\":\"TestPass123!\"}" > /dev/null

# Create a test resume
RESUME_DATA='{
  "title": "Test Resume for Keywords",
  "personalInfo": {
    "fullName": "Jane Developer",
    "email": "jane@example.com",
    "summary": "Experienced software developer with strong problem-solving skills"
  },
  "skills": ["JavaScript", "React", "CSS"],
  "workExperience": [
    {
      "company": "TechCorp",
      "position": "Frontend Developer",
      "description": "Built responsive web applications for clients",
      "startDate": "2022-01-01",
      "endDate": "2024-01-01",
      "current": false
    }
  ]
}'

echo "📄 Creating test resume..."
RESUME_RESPONSE=$(curl -s -X POST "$SERVER_URL/api/resume/create" \
  -H "Content-Type: application/json" \
  -b test_cookies.txt \
  -d "$RESUME_DATA")

RESUME_ID=$(echo "$RESUME_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "Resume created with ID: $RESUME_ID"

# Test keyword integration
echo "🔧 Testing keyword integration..."
SELECTED_KEYWORDS='["TypeScript", "Docker", "GraphQL"]'

INTEGRATION_RESPONSE=$(curl -s -X POST "$SERVER_URL/api/ai/integrate-keywords" \
  -H "Content-Type: application/json" \
  -b test_cookies.txt \
  -d "{
    \"resumeId\": \"$RESUME_ID\",
    \"resumeData\": $RESUME_DATA,
    \"selectedKeywords\": $SELECTED_KEYWORDS
  }")

echo "Integration response: $INTEGRATION_RESPONSE"

if echo "$INTEGRATION_RESPONSE" | grep -q '"success":true'; then
    echo "✅ Keyword integration successful!"
    
    # Check if the resume was actually updated in the database
    echo "📋 Checking if resume was updated in database..."
    UPDATED_RESUME=$(curl -s -X GET "$SERVER_URL/api/resume/$RESUME_ID" \
      -b test_cookies.txt)
    
    echo "Updated resume: $UPDATED_RESUME"
    
    if echo "$UPDATED_RESUME" | grep -q "TypeScript"; then
        echo "✅ Keywords found in updated resume!"
    else
        echo "❌ Keywords not found in database"
    fi
    
    if echo "$INTEGRATION_RESPONSE" | grep -q '"keywordPlacements"'; then
        echo "✅ Keyword placements returned!"
        
        # Extract placement count
        PLACEMENT_COUNT=$(echo "$INTEGRATION_RESPONSE" | grep -o '"keyword"' | wc -l)
        echo "📊 Found $PLACEMENT_COUNT keyword placements"
    else
        echo "❌ No keyword placements found"
    fi
    
else
    echo "❌ Keyword integration failed"
    echo "Response: $INTEGRATION_RESPONSE"
fi

# Cleanup
rm -f test_cookies.txt

echo ""
echo "🎉 Test Complete!"
echo "==============="
echo "✅ Next steps:"
echo "1. Open the resume page in browser: $SERVER_URL/resume/$RESUME_ID"
echo "2. Try the keyword integration feature"
echo "3. Look for highlighted keywords and the overlay notification"
echo "4. Hover over highlighted text to see tooltips"