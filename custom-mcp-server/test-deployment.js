#!/usr/bin/env node

// Script simple pour tester le serveur MCP déployé
const HOST = process.env.TEST_HOST || "localhost";
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.RAILWAY_URL || `http://${HOST}:${PORT}`;

async function testServer() {
  console.log(`🧪 Testing MCP Server at: ${BASE_URL}`);

  try {
    // Test 1: Health check
    console.log("\n1️⃣ Testing health endpoint...");
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log("✅ Health check:", healthData);

    // Test 2: Tools list
    console.log("\n2️⃣ Testing tools endpoint...");
    const toolsResponse = await fetch(`${BASE_URL}/tools`);
    const toolsData = await toolsResponse.json();
    console.log("✅ Tools available:", toolsData.tools.length);

    // Test 3: Analyze problem tool
    console.log("\n3️⃣ Testing analyze_problem tool...");
    const testProblem = {
      problem: "Comment optimiser les performances de mon serveur MCP?",
      context: "Serveur déployé sur Railway avec Node.js",
    };

    const analyzeResponse = await fetch(`${BASE_URL}/tools/analyze_problem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testProblem),
    });

    const analyzeData = await analyzeResponse.json();
    console.log(
      "✅ Problem analysis completed, response length:",
      analyzeData.content[0].text.length,
    );

    // Test 4: Creative brainstorm tool
    console.log("\n4️⃣ Testing creative_brainstorm tool...");
    const brainstormRequest = {
      topic: "Améliorer l'expérience utilisateur du serveur MCP",
      quantity: 3,
    };

    const brainstormResponse = await fetch(
      `${BASE_URL}/tools/creative_brainstorm`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(brainstormRequest),
      },
    );

    const brainstormData = await brainstormResponse.json();
    console.log(
      "✅ Brainstorm completed, response length:",
      brainstormData.content[0].text.length,
    );

    console.log("\n🎉 All tests passed! Server is working correctly.");
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    process.exit(1);
  }
}

// Execute tests
testServer();
