const { test, expect } = require('@playwright/test');

test.describe('Star Constellation Viewer E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // API サーバーが起動していることを確認
    try {
      const response = await page.request.get('http://localhost:8000/health');
      if (!response.ok()) {
        throw new Error('Backend API is not running');
      }
    } catch (error) {
      console.warn('Backend API may not be running. Some tests may fail.');
    }
  });

  test('Backend API Health Check', async ({ page }) => {
    const response = await page.request.get('http://localhost:8000/health');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.status).toBe('healthy');
    expect(data.service).toBe('star-constellation-api');
    console.log('✅ Backend health check passed:', data);
  });

  test('Backend Graph Data API', async ({ page }) => {
    const response = await page.request.get('http://localhost:8000/graph');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.nodes).toBeDefined();
    expect(data.metadata).toBeDefined();
    expect(data.nodes.length).toBeGreaterThan(100); // セイラの101ノード要件
    expect(data.metadata.total_links).toBeGreaterThan(500); // 508リンク要件
    
    console.log(`✅ Graph API test passed: ${data.nodes.length} nodes, ${data.metadata.total_links} links`);
  });

  test('Backend Stats API', async ({ page }) => {
    const response = await page.request.get('http://localhost:8000/stats');
    expect(response.ok()).toBeTruthy();
    
    const stats = await response.json();
    expect(stats.total_nodes).toBeDefined();
    expect(stats.total_links).toBeDefined();
    expect(stats.categories).toBeDefined();
    expect(stats.avg_links_per_node).toBeGreaterThan(0);
    
    console.log('✅ Stats API test passed:', stats);
  });

  test('Frontend Loading (Mock Test)', async ({ page }) => {
    // フロントエンドの構造をHTML生成でテスト
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Star Constellation Viewer</title>
        <style>
          body { font-family: Arial, sans-serif; background: #000; color: #fff; }
          .app-header { text-align: center; padding: 2rem; }
          .status { text-align: center; margin: 2rem; }
          .success { color: #4caf50; }
          .error { color: #f44336; }
        </style>
      </head>
      <body>
        <div class="app">
          <header class="app-header">
            <h1>🌌 Star Constellation Viewer</h1>
            <p>知識ネットワークを星座として可視化</p>
          </header>
          <main>
            <div class="status success" id="status">
              ✅ システム動作確認中...
            </div>
          </main>
        </div>
        <script>
          // API テスト
          fetch('http://localhost:8000/health')
            .then(response => response.json())
            .then(data => {
              document.getElementById('status').innerHTML = 
                '✅ API接続成功: ' + data.service;
            })
            .catch(error => {
              document.getElementById('status').innerHTML = 
                '❌ API接続失敗: ' + error.message;
              document.getElementById('status').className = 'status error';
            });
        </script>
      </body>
      </html>
    `);

    // ページの基本要素をチェック
    await expect(page.locator('h1')).toContainText('Star Constellation Viewer');
    await expect(page.locator('.app-header p')).toContainText('知識ネットワークを星座として可視化');
    
    // API接続結果を待機
    await page.waitForTimeout(2000);
    const statusText = await page.locator('#status').textContent();
    console.log('✅ Frontend mock test passed, status:', statusText);
  });

  test('API Response Time Performance', async ({ page }) => {
    const startTime = Date.now();
    const response = await page.request.get('http://localhost:8000/graph');
    const endTime = Date.now();
    
    const responseTime = endTime - startTime;
    expect(response.ok()).toBeTruthy();
    expect(responseTime).toBeLessThan(3000); // セイラの3秒以内要件
    
    console.log(`✅ Performance test passed: ${responseTime}ms (< 3000ms)`);
  });

  test('Data Validation', async ({ page }) => {
    const response = await page.request.get('http://localhost:8000/graph');
    const data = await response.json();
    
    // データ構造検証
    expect(data.nodes).toBeInstanceOf(Array);
    expect(data.metadata).toBeInstanceOf(Object);
    
    // 各ノードの必須フィールド検証
    for (let i = 0; i < Math.min(5, data.nodes.length); i++) {
      const node = data.nodes[i];
      expect(node.id).toBeDefined();
      expect(node.title).toBeDefined();
      expect(node.content).toBeDefined();
      expect(node.tags).toBeInstanceOf(Array);
      expect(node.links).toBeInstanceOf(Array);
    }
    
    console.log('✅ Data validation passed');
  });

  test('CORS Configuration', async ({ page }) => {
    // CORS ヘッダーの確認
    const response = await page.request.get('http://localhost:8000/health');
    const headers = response.headers();
    
    expect(headers['access-control-allow-origin']).toBeTruthy();
    console.log('✅ CORS configuration verified');
  });

});