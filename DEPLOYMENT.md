# 🚀 Star Constellation Viewer デプロイガイド

## 📋 前提条件
- GitHub アカウント
- Vercel アカウント
- Railway アカウント

## 🌟 Frontend デプロイ (Vercel)

1. [Vercel](https://vercel.com/new) にアクセス
2. "Import Git Repository" をクリック
3. `Kurasuai-Inc/star-constellation-viewer` を選択
4. 以下の設定を行う：
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `dist`

5. 環境変数を設定：
   ```
   VITE_API_URL=https://your-backend-url.up.railway.app
   ```

6. "Deploy" をクリック！

## 🌌 Backend デプロイ (Railway)

1. [Railway](https://railway.app/new) にアクセス
2. "Deploy from GitHub repo" を選択
3. `Kurasuai-Inc/star-constellation-viewer` を選択
4. 以下の設定を行う：
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

5. 環境変数を設定：
   ```
   CORS_ORIGINS=https://your-frontend-url.vercel.app
   ```

6. "Deploy" をクリック！

## 🔗 接続設定

### Frontend 環境変数
Vercel のプロジェクト設定で以下を追加：
```
VITE_API_URL=https://star-constellation-viewer.up.railway.app
```

### Backend 環境変数
Railway のプロジェクト設定で以下を追加：
```
CORS_ORIGINS=https://star-constellation-viewer.vercel.app
```

## ✨ デプロイ後の確認

1. Frontend URL にアクセス
2. 星座が美しく表示されることを確認
3. API からデータが正常に取得されていることを確認

## 🎉 完成！

あなたの Star Constellation Viewer が世界に公開されました！
101個の知識の星と508本の星の絆が、美しい星座として輝いています。

---
Created with 💫 by Stella & Seira