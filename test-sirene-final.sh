#!/bin/bash

echo "🎯 === TESTS FINAUX API SIRENE (SYNTAXE OFFICIELLE) ==="
echo ""

echo "📋 Test 1: LVMH (syntaxe corrigée)"
echo "-------------------------------------"
curl -s "http://localhost:3000/api/test-sirene?q=LVMH" | jq '.success, .query, .count' 2>/dev/null || curl -s "http://localhost:3000/api/test-sirene?q=LVMH" | head -10
echo ""

echo "📋 Test 2: NADIA ARAMIS (entrepreneur individuel)"
echo "------------------------------------------------"
curl -s "http://localhost:3000/api/test-sirene?q=NADIA%20ARAMIS" | jq '.success, .query, .count' 2>/dev/null || curl -s "http://localhost:3000/api/test-sirene?q=NADIA%20ARAMIS" | head -10
echo ""

echo "📋 Test 3: RENAULT (entreprise connue)"
echo "--------------------------------------"
curl -s "http://localhost:3000/api/test-sirene?q=RENAULT" | jq '.success, .query, .count' 2>/dev/null || curl -s "http://localhost:3000/api/test-sirene?q=RENAULT" | head -10
echo ""

echo "📋 Test 4: Erreur de paramètre (validation)"
echo "-------------------------------------------"
curl -s "http://localhost:3000/api/test-sirene" | jq '.error' 2>/dev/null || curl -s "http://localhost:3000/api/test-sirene" | head -5
echo ""

echo "✅ Tests terminés avec syntaxe officielle INSEE"
echo "📖 Référence: https://www.sirene.fr/static-resources/documentation/multi_simplifiee_311.html"
