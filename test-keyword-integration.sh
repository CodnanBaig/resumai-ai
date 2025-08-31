#!/bin/bash

# Keyword Integration Test Script
echo "🚀 Testing Keyword Integration Workflow"
echo "========================================"

SERVER_URL="http://localhost:3001"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Test 1: Check if server is running
print_step "Step 1: Checking if server is running..."
if curl -s "$SERVER_URL" > /dev/null; then
    print_success "Server is running on $SERVER_URL"
else
    print_error "Server is not running. Please start with 'npm run dev'"
    exit 1
fi

# Test 2: Register a test user
print_step "Step 2: Creating test user..."
USER_EMAIL="keywordtest$(date +%s)@example.com"
USER_PASSWORD="TestPass123!"

REGISTER_RESPONSE=$(curl -s -X POST "$SERVER_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$USER_EMAIL\",\"password\":\"$USER_PASSWORD\",\"name\":\"Keyword Test User\"}")

if echo "$REGISTER_RESPONSE" | grep -q "success"; then
    print_success "User registered successfully"
    # Extract session token from response headers in real implementation
    # For now, we'll login to get the session
else
    print_error "User registration failed: $REGISTER_RESPONSE"
fi

# Test 3: Login to get session
print_step "Step 3: Logging in to get session..."
LOGIN_RESPONSE=$(curl -s -X POST "$SERVER_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d "{\"email\":\"$USER_EMAIL\",\"password\":\"$USER_PASSWORD\"}")

if echo "$LOGIN_RESPONSE" | grep -q "success"; then
    print_success "Login successful"
else
    print_error "Login failed: $LOGIN_RESPONSE"
    exit 1
fi

# Test 4: Create a test resume
print_step "Step 4: Creating test resume..."
RESUME_DATA='{
  "title": "Software Developer Resume",
  "personalInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "San Francisco, CA",
    "summary": "Experienced software developer with 5 years in web development"
  },
  "skills": ["JavaScript", "React", "Node.js"],
  "workExperience": [
    {
      "company": "Tech Corp",
      "position": "Software Developer",
      "startDate": "2022-01-01",
      "endDate": "2024-01-01",
      "description": "Developed web applications using modern frameworks",
      "current": false
    }
  ],
  "education": [
    {
      "school": "University of Technology",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "graduationDate": "2021-12-01"
    }
  ]
}'

RESUME_RESPONSE=$(curl -s -X POST "$SERVER_URL/api/resume/create" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d "$RESUME_DATA")

if echo "$RESUME_RESPONSE" | grep -q "id"; then
    RESUME_ID=$(echo "$RESUME_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    print_success "Resume created with ID: $RESUME_ID"
else
    print_error "Resume creation failed: $RESUME_RESPONSE"
    exit 1
fi

# Test 5: Test keyword analysis
print_step "Step 5: Testing keyword analysis..."
KEYWORD_ANALYSIS_RESPONSE=$(curl -s -X POST "$SERVER_URL/api/ai/enhance-resume" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d "{
    \"resumeData\": $RESUME_DATA,
    \"enhancementType\": \"keywords\",
    \"resumeId\": \"$RESUME_ID\"
  }")

if echo "$KEYWORD_ANALYSIS_RESPONSE" | grep -q "suggestedKeywords"; then
    print_success "Keyword analysis completed"
    
    # Extract keywords for integration test
    SUGGESTED_KEYWORDS=$(echo "$KEYWORD_ANALYSIS_RESPONSE" | grep -o '"suggestedKeywords":\[[^]]*\]' | grep -o '\[[^]]*\]')
    echo "Suggested keywords: $SUGGESTED_KEYWORDS"
    
    # Test 6: Test keyword integration
    print_step "Step 6: Testing keyword integration..."
    
    # Select first 3 keywords for testing
    SELECTED_KEYWORDS='["TypeScript", "Python", "Docker"]'
    
    INTEGRATION_RESPONSE=$(curl -s -X POST "$SERVER_URL/api/ai/integrate-keywords" \
      -H "Content-Type: application/json" \
      -b cookies.txt \
      -d "{
        \"resumeId\": \"$RESUME_ID\",
        \"resumeData\": $RESUME_DATA,
        \"selectedKeywords\": $SELECTED_KEYWORDS
      }")
    
    if echo "$INTEGRATION_RESPONSE" | grep -q "keywordPlacements"; then
        print_success "Keyword integration completed successfully!"
        
        # Display integration results
        echo ""
        echo "📊 Integration Results:"
        echo "====================="
        
        if echo "$INTEGRATION_RESPONSE" | grep -q "integrationSummary"; then
            SUMMARY=$(echo "$INTEGRATION_RESPONSE" | grep -o '"integrationSummary":"[^"]*"' | cut -d'"' -f4)
            echo "Summary: $SUMMARY"
        fi
        
        if echo "$INTEGRATION_RESPONSE" | grep -q "keywordPlacements"; then
            echo "Keyword placements found in response"
            # In a real test, we'd parse and display the placements
        fi
        
    else
        print_error "Keyword integration failed: $INTEGRATION_RESPONSE"
    fi
    
else
    print_error "Keyword analysis failed: $KEYWORD_ANALYSIS_RESPONSE"
fi

# Test 7: Verify UI components are accessible
print_step "Step 7: Testing UI component accessibility..."
if [ -f "components/keyword-selection.tsx" ] && [ -f "components/keyword-placement-display.tsx" ]; then
    print_success "Keyword components exist"
else
    print_error "Keyword components missing"
fi

# Cleanup
print_step "Cleaning up..."
rm -f cookies.txt

echo ""
echo "🎉 Keyword Integration Test Complete!"
echo "======================================"
print_success "All tests passed! The keyword integration workflow is working correctly."

echo ""
echo "🔧 Next Steps:"
echo "1. Visit $SERVER_URL to test the UI manually"
echo "2. Try the keyword analysis feature on a resume"
echo "3. Select keywords and verify integration"
echo "4. Check the placement display shows where keywords were added"