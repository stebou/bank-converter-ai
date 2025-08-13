#!/bin/bash

echo "🧪 === TESTS API SIRENE ==="
echo ""

echo "📋 Test 1: NADIA ARAMIS"
echo "-------------------------"
response1=$(curl -s "http://localhost:3000/api/test-sirene?q=NADIA%20ARAMIS" | head -50)
echo "$response1"
echo ""

echo "📋 Test 2: ARAMIS"
echo "-----------------"
response2=$(curl -s "http://localhost:3000/api/test-sirene?q=ARAMIS" | head -50)
echo "$response2"
echo ""

echo "📋 Test 3: LVMH"
echo "---------------"
response3=$(curl -s "http://localhost:3000/api/test-sirene?q=LVMH" | head -50)
echo "$response3"
echo ""

echo "📋 Test 4: Paramètre manquant"
echo "-----------------------------"
response4=$(curl -s "http://localhost:3000/api/test-sirene")
echo "$response4"
echo ""

echo "✅ Tests terminés"
